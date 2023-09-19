async function youtube(value, tp, doc) {
  let url = await tp.system.clipboard();

  if (!isValidHttpUrl(url)) {
    console.error("Invalid URL for " + value);
    return "";
  }

  if (doc === undefined) {
    // Alternative front-end (invidious.io)
    let altDomain = "yewtu.be";
    if (url.includes(altDomain)) {
      var regex = new RegExp(altDomain, "g");
      url = url.replace(regex, "youtube.com");
    }
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }

  // Alias for querySelector
  let $ = (s) => doc.querySelector(s);

  switch (value) {
    case "title":
      let title = $("meta[property='og:title']")?.content || "";
      if (!title) log_parsing_error("title");
      return title.replace(/"/g, "'");
    case "channel":
      let channel = $("link[itemprop='name']")?.getAttribute("content") || "";
      if (!channel) log_parsing_error("channel");
      return channel;
    case "published":
      let published = $("meta[itemprop='uploadDate']")?.content || "";
      if (!published) log_parsing_error("published");
      return published;
    case "url":
      let url = $("link[rel='shortLinkUrl']")?.href || "";
      if (!url) log_parsing_error("url");
      return url;
    case "thumbnail":
      let thumbnail = $("link[rel='shortLinkUrl']")?.href || "";
      if (!thumbnail) {
        log_parsing_error("thumbnail");
        return thumbnail;
      } else {
        return thumbnail
          .replace(/youtu.be/, "img.youtube.com/vi")
          .concat("/maxresdefault.jpg");
      }
    case "keywords":
      let _keywords = keywords(doc);
      if (!_keywords) log_parsing_error("keywords");
      return _keywords;
    case "keywordsQ":
      // Quotes
      let keywordsQ = keywords(doc);
      if (!keywordsQ) log_parsing_error("keywords");
      return keywordsQ ? `"${keywordsQ.replace(/, /g, '", "')}"` : keywordsQ;
    case "keywordsL":
      // List
      let keywordsL = keywords(doc);
      if (!keywordsL) log_parsing_error("keywords");
      return keywordsL ? "\n- " + keywordsL.replace(/, /g, "\n- ") : keywordsL;
    case "keywordsW":
      // Wiki links
      let keywordsW = keywords(doc);
      if (!keywordsW) log_parsing_error("keywords");
      return keywordsW
        ? `[[${keywordsW.replace(/, /g, "]], [[")}]]`
        : keywordsW;
    case "duration":
      let duration = $("meta[itemprop='duration']")?.content.slice(2) || "";
      if (!duration) log_parsing_error("duration");
      return duration.replace(/M/gi, "m ").replace(/S/gi, "s");
    case "description":
      let description = $("meta[itemprop='description']")?.content || "";
      if (!description) log_parsing_error("description");
      return description.replace(/"/g, "'");
    case "descriptionFull":
      let html = new XMLSerializer().serializeToString(doc);
      let descriptionFull =
        html?.match(/"shortDescription":".*?","isCrawlable":/) || "";
      if (!descriptionFull) {
        log_parsing_error("descriptionFull");
        return descriptionFull;
      } else {
        return descriptionFull
          .toString()
          .replace(/"shortDescription":"/, "")
          .replace(/","isCrawlable":$/, "")
          .replace(/\\u0026/g, "&")
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "")
          .replace(/\\"/g, '"');
      }
    case "id":
      let id = $("meta[itemprop='identifier']")?.content || "";
      if (!id) log_parsing_error("id");
      return id;
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

function log_parsing_error(variable) {
  console.error(
    `Parsing Error: Couldn't get the ${variable}. If it happens consistently, consider opening an issue on GitHub.`,
  );
}

function keywords(doc) {
  return doc.querySelector("meta[name='keywords']")?.content || "";
}

module.exports = youtube;
