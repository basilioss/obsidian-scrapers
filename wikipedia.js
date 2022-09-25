async function wikipedia(value, tp, doc) {
  if (doc === undefined) {
    let url = await tp.system.clipboard();
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

module.exports = wikipedia;
