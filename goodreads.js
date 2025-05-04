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

  const data = extractData(doc);
  const $ = (selector) => doc.querySelector(selector);

  switch (value) {
    case "url":
      return safeReturn(getUrl(doc), "url");
    case "title":
      return safeReturn(getTitle(doc), "title");
    case "authors":
      return safeReturn(getAuthors(data), "authors");
    case "authorsQ":
    case "authorsQuotes":
      return formatQuote(getAuthors(data), "authors");
    case "authorsL":
    case "authorsList":
      return formatList(getAuthors(data), "authors");
    case "authorsW":
    case "authorsLinks":
      return formatLink(getAuthors(data), "authors");
    case "isbn":
      return safeReturn(data?.isbn, "isbn");
    case "published":
      return safeReturn(getPublished(doc), "published");
    case "genres":
      return safeReturn(getGenres(doc), "genres");
    case "genresQ":
    case "genresQuotes":
      return formatQuote(getGenres(doc), "genres");
    case "genresL":
    case "genresList":
      return formatList(getGenres(doc), "genres");
    case "genresW":
    case "genresLinks":
      return formatLink(getGenres(doc), "genres");
    case "cover":
      return safeReturn(getCover(data), "cover");
    case "pageCount":
      return safeReturn(data?.numberOfPages, "pageCount");
    case "description":
      return safeReturn(getDescription(doc), "description");
    case "rating":
      return safeReturn(data?.aggregateRating?.ratingValue, "rating");
    default:
      new Notice("Incorrect parameter: " + value, 5000);
      return "";
  }
}

// --- Data extractors ---

function extractData(doc) {
  const scriptTag = doc.querySelector('script[type="application/ld+json"]');
  return scriptTag ? JSON.parse(scriptTag.textContent) : {};
}

function getUrl(doc) {
  return doc.querySelector("link[rel='canonical']")?.href || "";
}

function getTitle(doc) {
  const title = doc.querySelector(".BookPageTitleSection .Text__title1")?.innerText || "";
  return title.trim().replace(/&amp;/g, "&");
}

function getAuthors(data) {
  const authors = data.author;
  return !authors || authors.length === 0
    ? ""
    : Array.from(authors, (a) => a.name.trim().replace(/ +(?= )/g, "")).join(", ");
}

function getPublished(doc) {
  const pubInfo = doc.querySelector('p[data-testid="publicationInfo"]');
  if (!pubInfo) return "";
  const match = pubInfo.innerHTML.match(/First published\s(.*)/);
  return match ? match[1].trim() : "";
}

function getGenres(doc) {
  const genreElements = doc.querySelectorAll('.BookPageMetadataSection__genreButton .Button__labelItem');
  if (!genreElements || genreElements.length === 0) return "";
  const genres = Array.from(genreElements, (el) => el.textContent.trim());
  return [...new Set(genres)].join(", ");
}

function getCover(data) {
  return (data?.image || "").replace(/\?.*$/g, "");
}

function getDescription(doc) {
  const desc = doc.querySelector('.BookPageMetadataSection__description .Formatted');
  return desc ? desc.textContent.trim() : "";
}

// --- Helpers ---

function safeReturn(result, name) {
  if (!result) logParsingError(name);
  return result || "";
}

function formatQuote(value, name) {
  if (!value) logParsingError(name);
  return value ? `"${value.replace(/, /g, '", "')}"` : "";
}

function formatList(value, name) {
  if (!value) logParsingError(name);
  return value ? `\n- ${value.replace(/, /g, "\n- ")}` : "";
}

function formatLink(value, name) {
  if (!value) logParsingError(name);
  return value ? `[[${value.replace(/, /g, "]], [[")}]]` : "";
}

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function logParsingError(variable) {
  console.error(`Parsing Error: Couldn't get ${variable}. If it happens consistently, consider opening an issue on GitHub.`);
}

module.exports = goodreads;
