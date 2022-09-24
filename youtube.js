async function youtube(value, tp, html) {
    if (html === undefined) {
        let url = await tp.system.clipboard()
        // Alternative front-end (invidious.io)
        let altDomain = "yewtu.be"
        if (url.includes(altDomain)) {
            var regex = new RegExp(altDomain, 'g');
            url = url.replace(regex, "youtube.com")
        }
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }

    // Alias for querySelector
    let $ = s => html.querySelector(s)

    switch(value) {
        case "title":
            return $("meta[property='og:title']").content
            break
        case "channel":
            return $("link[itemprop='name']").getAttribute("content")
            break
        case "published":
            return $("meta[itemprop='uploadDate']").content
            break
        case "url":
            return link(html)
            break
        case "thumbnail":
            let thumbnail = link(html)
            return thumbnail.replace(/youtu.be/, "img.youtube.com/vi").concat("/maxresdefault.jpg")
            break
        case "keywords":
            return keywords(html)
            break
        case "keywordsQ":
            let keywordsQ = keywords(html)
            return '"' + keywordsQ.replace(/, /g, '", "') + '"'
            break
        case "keywordsL":
            let keywordsL = keywords(html)
            return '\n- ' + keywordsL.replace(/, /g, '\n- ')
            break
        case "keywordsW":
            let keywordsW = keywords(html)
            return '[[' + keywordsW.replace(/, /g, ']], [[') + ']]'
            break
        case "duration":
            let duration = $("meta[itemprop='duration']").content.slice(2)
            return duration.replace(/M/gi, "m ").replace(/S/gi, "s")
            break
        case "description":
            return $("meta[itemprop='description']").getAttribute("content")
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

function link(html) {
    return html.querySelector("link[rel='shortLinkUrl']").href
}

function keywords(html) {
    return html.querySelector("meta[name='keywords']").content
}

module.exports = youtube
