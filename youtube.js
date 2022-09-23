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
            return thumbnail(html)
            break
        case "keywords":
            return keywords(html)
            break
        case "keywordsQ":
            return keywordsQ(html)
            break
        case "keywordsW":
            return keywordsW(html)
            break
        case "keywordsL":
            return keywordsL(html)
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

function link(html) {
    return html.querySelector("link[rel='shortLinkUrl']").href
}

function thumbnail(html) {
    return link(html).replace(/youtu.be/, "img.youtube.com/vi").concat("/maxresdefault.jpg")
}

function keywords(html) {
    return html.querySelector("meta[name='keywords']").content
}

function keywordsQ(html) {
    let kwords = keywords(html)
    return '"' + kwords.replace(/, /g, '", "') + '"'
}

function keywordsL(html) {
    let kwords = keywords(html)
    return '\n- ' + kwords.replace(/, /g, '\n- ')
}

function keywordsW(html) {
    let kwords = keywords(html)
    return '[[' + kwords.replace(/, /g, ']], [[') + ']]'
}

module.exports = youtube
