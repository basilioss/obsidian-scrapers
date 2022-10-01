async function website(value, tp, doc) {
  let url = await tp.system.clipboard();

  if (doc === undefined) {
    let page = await tp.obsidian.request(url);
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }

  // Alias for querySelector
  let $ = (s) => doc.querySelector(s);

  switch (value) {
    case "url":
      return url.trim();
    case "title":
      return (
        $("meta[property='title']")?.content ||
        $("meta[property='og:title']")?.content ||
        $("meta[name='twitter:title']")?.content ||
        $("title")?.textContent.trim() ||
        ""
      );
    case "description":
      let description =
        $("meta[property='og:description']")?.content ||
        $("meta[name='description']")?.content ||
        $("meta[name='twitter:description']")?.content ||
        "";
      description = description
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'")
        .trim();
      return description
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&nbsp;/g, " ");
    case "image":
      let image =
        $("meta[property='og:image']")?.content ||
        $("meta[name='twitter:image']")?.content ||
        $("meta[name='twitter:image:src']")?.content ||
        "";
      // Remove unnecessary part
      return image.replace(/\?.*$/g, "")
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

module.exports = website;
