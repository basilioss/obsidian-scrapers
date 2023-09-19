async function odysee(value, tp, doc) {
  let url = await tp.system.clipboard();

  if (!isValidHttpUrl(url)) {
    console.error("Invalid URL for " + value);
    return "";
  }

  if (doc === undefined) {
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }

  let json = JSON.parse(
    doc.querySelector("script[type='application/ld+json']").innerHTML
  );

  switch (value) {
    case "title":
      // Get title from JSON. If undefined, return empty string
      let title = json?.name || "";
      return title
        .replace(/&amp;/g, "&")
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, "”");
    case "description":
      let description = json?.description || "";
      return description
        .replace(/&amp;/g, "&")
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, "”");
    case "thumbnail":
      return json?.thumbnailUrl || "";
    case "published":
      let published = json?.uploadDate || "";
      return published.substring(0, 10);
    case "duration":
      let duration = json?.duration || "";
      return duration
        .replace(/PT/, "")
        .replace(/H/, "h ")
        .replace(/M/, "m ")
        .replace(/S/, "s");
    case "url":
      return json?.url || "";
    case "contentUrl":
      return json?.contentUrl || "";
    case "embedUrl":
      return json?.embedUrl || "";
    case "channel":
      return json.author?.name || "";
    case "keywords":
      let keywords = json?.keywords || "";
      return keywords.replace(/,/g, ", ");
    case "keywordsQ":
      // Quotes
      let keywordsQ = json?.keywords || "";
      return '"' + keywordsQ.replace(/,/g, '", "') + '"';
    case "keywordsL":
      // List
      let keywordsL = json?.keywords || "";
      return "\n- " + keywordsL.replace(/,/g, "\n- ");
    case "keywordsW":
      // Wiki links
      let keywordsW = json?.keywords || "";
      return "[[" + keywordsW.replace(/,/g, "]], [[") + "]]";
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

module.exports = odysee;
