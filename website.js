async function website(value, tp, html) {
    let url = await tp.system.clipboard()

    if (html === undefined) {
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }

    // Alias for querySelector
    let $ = s => html.querySelector(s)

    switch(value) {
        case "url":
            return url
            break
        case "title":
            return $("title")?.textContent.trim() || $("meta[property='title']")?.content
            break
        case "description":
            let description = $("meta[name='description']")?.content || $("meta[property='og:description']")?.content || ""
            return description.replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '"')
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

module.exports = website
