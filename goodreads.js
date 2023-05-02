async function goodreads(value, tp, doc) {
  if (doc === undefined) {
    let url = await tp.system.clipboard();
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }

  let json = JSON.parse(
    doc.querySelector("script[type='application/json']").innerHTML
  );

  json = json.props.pageProps.apolloState;
  let bookId = Object.keys(json).find(key => key.match(/^Book:/));
  let workId = Object.keys(json).find(key => key.match(/^Work:/));

  // Alias for querySelector
  let $ = (s) => doc.querySelector(s);

  // TODO: authors, genres
  switch (value) {
    case "url":
      return json[bookId]?.webUrl ?? "";
    case "title":
      return json[bookId]?.title ?? "";
    case "authors":
      return authors(json);
    case "authorsQ":
      // Quotes
      let authorsQ = authors(json);
      return '"' + authorsQ.replace(/, /g, '", "') + '"';
    case "authorsL":
      // List
      let authorsL = authors(json);
      return "\n- " + authorsL.replace(/, /g, "\n- ");
    case "authorsW":
      // Wiki links
      let authorsW = authors(json);
      return "[[" + authorsW.replace(/, /g, "]], [[") + "]]";
    case "isbn":
      return json[bookId]?.details?.isbn13 ?? "";
    case "published":
      return getPubDate(doc) ?? "";
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
      return json[bookId]?.imageUrl ?? "";
    case "pageCount":
      return json[bookId]?.details?.numPages ?? "";
    case "description":
      return $("meta[property='og:description']")?.content.trim() ?? "";
    case "descriptionFull":
      let desc = json[bookId]?.description ?? "";
      // Strip html
      desc = desc.replace(/<[^>]*>?/gm, '');
      return desc;
    case "rating":
      return json[workId]?.stats?.averageRating ?? "";
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

function authors(json) {
  let authors = "";
  if (json.author != null) {
    authors = json.author.map((author) => author.name);
    authors = JSON.stringify(authors)
      .replace(/null,?/g, "")
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/\"]/, "");
  }
  return authors;
}

function getPubDate(doc) {
  let publicationInfo = doc.querySelector('p[data-testid="publicationInfo"]');
  if (!publicationInfo) {
    return '';
  }
  let dateString = publicationInfo.innerHTML.match(/First published\s(.*)/);
  return dateString ? dateString[1] : '';
}

function genres(doc) {
  let genreElements = doc.querySelectorAll('.BookPageMetadataSection__genreButton .Button__labelItem');
  if (!genreElements || genreElements.length === 0) return "";

  let genres = Array.from(genreElements, (el) => el.textContent);
  return [...new Set(genres)].join(", ");
}

module.exports = goodreads;
