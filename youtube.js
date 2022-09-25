async function youtube(value, tp, doc) {
  let url = await tp.system.clipboard();

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
      return $("meta[property='og:title']").content;
    case "channel":
      return $("link[itemprop='name']").getAttribute("content");
    case "published":
      return $("meta[itemprop='uploadDate']").content;
    case "url":
      return $("link[rel='shortLinkUrl']").href;
    case "thumbnail":
      let thumbnail = $("link[rel='shortLinkUrl']").href;
      return thumbnail
        .replace(/youtu.be/, "img.youtube.com/vi")
        .concat("/maxresdefault.jpg");
    case "keywords":
      return keywords(doc);
    case "keywordsQ":
      // Quotes
      let keywordsQ = keywords(doc);
      return '"' + keywordsQ.replace(/, /g, '", "') + '"';
    case "keywordsL":
      // List
      let keywordsL = keywords(doc);
      return "\n- " + keywordsL.replace(/, /g, "\n- ");
    case "keywordsW":
      // Wiki links
      let keywordsW = keywords(doc);
      return "[[" + keywordsW.replace(/, /g, "]], [[") + "]]";
    case "duration":
      let duration = $("meta[itemprop='duration']").content.slice(2);
      return duration.replace(/M/gi, "m ").replace(/S/gi, "s");
    case "description":
      return $("meta[itemprop='description']").content;
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

function keywords(doc) {
  return doc.querySelector("meta[name='keywords']").content;
}

module.exports = youtube;
