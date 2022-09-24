async function odysee(value, tp, html) {
    if (html === undefined) {
        let url = await tp.system.clipboard()
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }
    let json = JSON.parse(html.querySelector("script[type='application/ld+json']").innerHTML)

    switch(value) {
        case "title":
            // Get title from JSON. If undefined, return empty string
            let title = json?.name || ""
            return title.replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '”')
            break
        case "description":
            let description = json?.description || ""
            return description.replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '”')
            break
        case "thumbnail":
            return json?.thumbnailUrl || ""
            break
        case "published":
            let published = json?.uploadDate || ""
            return published.substring(0,10)
        case "duration":
            let duration = json?.duration || ""
            return duration.replace(/PT/, "").replace(/H/, "h ").replace(/M/, "m ").replace(/S/, "s")
            break
        case "url":
            return json?.url || ""
            break
        case "contentUrl":
            return json?.contentUrl || ""
            break
        case "embedUrl":
            return json?.embedUrl || ""
            break
        case "channel":
            return json.author?.name || ""
            break
        case "keywords":
            let keywords = json?.keywords || ""
            return keywords.replace(/,/g, ", ")
            break
        case "keywordsQ":
            // Quotes
            let keywordsQ = json?.keywords || ""
            return '"' + keywordsQ.replace(/,/g, '", "') + '"'
            break
        case "keywordsL":
            // List
            let keywordsL = json?.keywords || ""
            return '\n- ' + keywordsL.replace(/,/g, '\n- ')
            break
        case "keywordsW":
            // Wiki links
            let keywordsW = json?.keywords || ""
            return '[[' + keywordsW.replace(/,/g, ']], [[') + ']]'
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

module.exports = odysee
