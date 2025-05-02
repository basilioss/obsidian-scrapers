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

  const $ = (selector) => doc.querySelector(selector);

  switch (value) {
    case "title":
      return safeReturn(getTitle(doc), "title");
    case "channel":
      return safeReturn(getChannel(doc), "channel");
    case "published":
      return safeReturn(getPublished(doc), "published");
    case "url":
      return safeReturn(getShortUrl(doc), "url");
    case "thumbnail":
      return safeReturn(getThumbnail(doc), "thumbnail");
    case "keywords":
      return safeReturn(getKeywords(doc), "keywords");
    case "keywordsQ":
      return formatQuote(getKeywords(doc), "keywords");
    case "keywordsL":
      return formatList(getKeywords(doc), "keywords");
    case "keywordsW":
      return formatLink(getKeywords(doc), "keywords");
    case "duration":
      return safeReturn(getDuration(doc), "duration");
    case "description":
      return safeReturn(getDescription(doc), "description");
    case "descriptionFull":
      return safeReturn(getDescriptionFull(doc), "descriptionFull");
    case "id":
      return safeReturn(getId(doc), "id");
    default:
      new Notice("Incorrect parameter: " + value, 5000);
      return "";
  }
}

// --- Individual data extractors ---

function getTitle(doc) {
  const title = doc.querySelector("meta[property='og:title']")?.content || "";
  return title.replace(/"/g, "'");
}

function getChannel(doc) {
  return doc.querySelector("link[itemprop='name']")?.getAttribute("content") || "";
}

function getPublished(doc) {
  return doc.querySelector("meta[itemprop='uploadDate']")?.content || "";
}

function getShortUrl(doc) {
  return doc.querySelector("link[rel='shortLinkUrl']")?.href || "";
}

function getThumbnail(doc) {
  const shortUrl = getShortUrl(doc);
  return shortUrl
    ? shortUrl.replace(/youtu\.be/, "img.youtube.com/vi") + "/maxresdefault.jpg"
    : "";
}

function getKeywords(doc) {
  return doc.querySelector("meta[name='keywords']")?.content || "";
}

function getDuration(doc) {
  let duration = doc.querySelector("meta[itemprop='duration']")?.content || "";
  if (duration.startsWith("PT")) duration = duration.slice(2);
  return duration.replace(/M/gi, "m ").replace(/S/gi, "s");
}

function getDescription(doc) {
  const desc = doc.querySelector("meta[itemprop='description']")?.content || "";
  return desc.replace(/"/g, "'");
}

function getDescriptionFull(doc) {
  const html = new XMLSerializer().serializeToString(doc);
  const match = html.match(/"shortDescription":"(.*?)","isCrawlable":/);
  if (!match) return "";
  return match[1]
    .replace(/\\u0026/g, "&")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\"/g, '"');
}

function getId(doc) {
  return doc.querySelector("meta[itemprop='identifier']")?.content || "";
}

// --- Helpers ---

function safeReturn(result, name) {
  if (!result) log_parsing_error(name);
  return result || "";
}

function formatQuote(value, name) {
  if (!value) log_parsing_error(name);
  return value ? `"${value.replace(/, /g, '", "')}"` : "";
}

function formatList(value, name) {
  if (!value) log_parsing_error(name);
  return value ? `\n- ${value.replace(/, /g, "\n- ")}` : "";
}

function formatLink(value, name) {
  if (!value) log_parsing_error(name);
  return value ? `[[${value.replace(/, /g, "]], [[")}]]` : "";
}

function isValidHttpUrl(string) {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function log_parsing_error(variable) {
  console.error(`Parsing Error: Couldn't get ${variable}. If it happens consistently, consider opening an issue on GitHub.`);
}

module.exports = youtube;
