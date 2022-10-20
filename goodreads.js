async function goodreads(value, tp, doc) {
  if (doc === undefined) {
    let url = await tp.system.clipboard();
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }
  // Alias for querySelector
  let $ = (s) => doc.querySelector(s);

  switch (value) {
    case "url":
      return $("link[rel='canonical']").href;
    case "title":
      let title = $("h1[id='bookTitle']").innerHTML ?? "";
      return title.trim().replace(/&amp;/g, "&");
    case "authors":
      return authors(doc);
    case "authorsQ":
      // Quotes
      let authorsQ = authors(doc);
      return '"' + authorsQ.replace(/, /g, '", "') + '"';
    case "authorsL":
      // List
      let authorsL = authors(doc);
      return "\n- " + authorsL.replace(/, /g, "\n- ");
    case "authorsW":
      // Wiki links
      let authorsW = authors(doc);
      return "[[" + authorsW.replace(/, /g, "]], [[") + "]]";
    case "isbn":
      return $("meta[property='books:isbn']").content ?? "";
    case "published":
      return published(doc);
    case "genres":
      return genres(doc);
    case "genresQ":
      let genresQ = genres(doc);
      return '"' + genresQ.replace(/, /g, '", "') + '"';
    case "genresL":
      let genresL = genres(doc);
      return "\n- " + genresL.replace(/, /g, "\n- ");
    case "genresW":
      let genresW = genres(doc);
      return "[[" + genresW.replace(/, /g, "]], [[") + "]]";
    case "cover":
      return $("img[id='coverImage']").src ?? "";
    case "pageCount":
      return $("meta[property*='page_count']").content ?? "";
    case "description":
      return $("meta[property='og:description']").content.trim() ?? "";
    case "rating":
      return $("span[itemprop='ratingValue']").innerText.trim() ?? "";
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

function authors(doc) {
  let authors = doc.querySelectorAll("span[itemprop=name]");
  // Create an array. Replace multiple spaces with single space
  authors = Array.from(authors, (authors) =>
    authors.textContent.replace(/ +(?= )/g, "")
  );
  return authors.join(", ");
}

function published(doc) {
  var pubDate = "";
  let nobr = doc.querySelector("nobr[class='greyText']");
  if (nobr) {
    pubDate = nobr.innerHTML;
  } else {
    let details = doc.querySelectorAll("div[id='details'] div.row");
    pubDate = details[details.length - 1].innerHTML;
  }
  const regex = /\d{4}/;
  let match = regex.exec(pubDate);
  if (match) {
    return match[0];
  }
}

function genres(doc) {
  let genres = doc.querySelectorAll(
    "a[class='actionLinkLite bookPageGenreLink']"
  );
  genres = Array.from(genres, (genres) => genres.textContent.toLowerCase());
  genres = [...new Set(genres)]; // Remove duplicates
  return genres.join(", ");
}

module.exports = goodreads;
