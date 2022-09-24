async function wikipedia(value, tp, html) {
    if (html === undefined) {
        let url = await tp.system.clipboard()
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }
    let json = JSON.parse(html.querySelector("script[type='application/ld+json']").innerHTML)

    switch(value) {
        case "title":
            return json?.name || ""
            break
        case "url":
            return json?.url || ""
            break
        case "image":
            return json?.image || ""
            break
        case "headline":
            // Short description
            return json?.headline || ""
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

module.exports = wikipedia
