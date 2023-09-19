async function wikipedia(value, tp, doc) {
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

  let json = "";
  try {
    json = JSON.parse(
      doc.querySelector("script[type='application/ld+json']").innerHTML
    );
  } catch (error) {
    new Notice(error);
  }

  switch (value) {
    case "title":
      return json?.name || "";
    case "url":
      return json?.url || "";
    case "image":
      return json?.image || "";
    case "headline":
      // Short description
      return json?.headline || "";
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

module.exports = wikipedia;
