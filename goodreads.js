async function goodreads(value, tp, doc) {
  let url = await tp.system.clipboard();

  if (!isValidHttpUrl(url)) {
    console.error("Invalid URL for " + value);
    return "";
  }

  if (!doc) {
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }

  function extractData(doc) {
    let scriptTag = doc.querySelector('script[type="application/ld+json"]');
    return scriptTag ? JSON.parse(scriptTag.textContent) : {};
  }

  let data = extractData(doc);
  let $ = (s) => doc.querySelector(s);

  switch (value) {
    case "url":
      return $("link[rel='canonical']")?.href || "";
    case "title":
      let title = $('.BookPageTitleSection .Text__title1')?.innerText || ""
      return title.trim().replace(/&amp;/g, "&");
    case "authors":
      return extractAuthors(data);
    case "authorsQ":
      let authorsQ = extractAuthors(data);
      return !authorsQ ? "" : `"${authorsQ.replace(/, /g, '", "')}"`;
    case "authorsL":
      let authorsL = extractAuthors(data);
      return !authorsL ? "" : `\n- ${authorsL.replace(/, /g, "\n- ")}`;
    case "authorsW":
      let authorsW = extractAuthors(data);
      return !authorsW ? "" : `[[${authorsW.replace(/, /g, "]], [[")}]]`;
    case "isbn":
      return data?.isbn || "";
    case "published":
      return extractPubDate(doc);
    case "genres":
      return extractGenres(doc);
    case "genresQ":
      let genresQ = extractGenres(doc);
      return !genresQ ? "" : `"${genresQ.replace(/, /g, '", "')}"`;
    case "genresL":
      let genresL = extractGenres(doc);
      return !genresL ? "" : `\n- ${genresL.replace(/, /g, "\n- ")}`;
    case "genresW":
      let genresW = extractGenres(doc);
      return !genresW ? "" : `[[${genresW.replace(/, /g, "]], [[")}]]`;
    case "cover":
     return (data?.image || "").replace(/\?.*$/g, "");
    case "pageCount":
      return data?.numberOfPages || "";
    case "description":
      return extractBookDescription(doc);
    case "rating":
      return extractRatingValue(data);
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function extractAuthors(data) {
  let authors = data.author;
  return !authors || authors.length === 0 ? "" :
    Array.from(authors, (authors) => authors.name.replace(/ +(?= )/g, "")).join(", ");
}

function extractGenres(doc) {
  let $$ = (s) => doc.querySelectorAll(s);
  let genreElements = $$('.BookPageMetadataSection__genreButton .Button__labelItem');
  if (!genreElements || genreElements.length === 0) return "";

  let genres = Array.from(genreElements, (el) => el.textContent);
  return [...new Set(genres)].join(", ");  // Remove duplicates
}

function extractGenres(doc) {
  let genreElements = doc.querySelectorAll('.BookPageMetadataSection__genreButton .Button__labelItem');
  if (!genreElements || genreElements.length === 0) return "";

  let genres = Array.from(genreElements, (el) => el.textContent);
  return [...new Set(genres)].join(", ");
}

function extractPubDate(doc) {
  let publicationInfo = doc.querySelector('p[data-testid="publicationInfo"]');
  if (!publicationInfo) {
    return '';
  }
  let dateString = publicationInfo.innerHTML.match(/First published\s(.*)/);
  return dateString ? dateString[1] : '';
}

function extractRatingValue(data) {
  let ratingValue = data.aggregateRating && data.aggregateRating.ratingValue;
  return ratingValue || "";
}

function extractBookDescription(doc) {
  let $ = (s) => doc.querySelector(s);
  let descriptionTag = $('.BookPageMetadataSection__description .Formatted');
  if (!descriptionTag) return "";
  return descriptionTag.textContent.trim();
}

module.exports = goodreads;
