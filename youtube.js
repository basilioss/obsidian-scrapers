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

    switch(value) {
        case "url":
            return link(html)
            break
        case "title":
            return title(html)
            break
        case "channel":
            return channel(html)
            break
        case "published":
            return published(html)
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

function title(html) {
    return html.querySelector("meta[property='og:title']").content
}

function channel(html) {
    return html.querySelector("link[itemprop='name']").getAttribute("content")
}

function published(html) {
    return html.querySelector("meta[itemprop='uploadDate']").content
}

function thumbnail(html) {
    return link(html).replace(/youtu.be/, "img.youtube.com/vi").concat("/maxresdefault.jpg")
}

function keywords(html) {
    return html.querySelector("meta[name='keywords']").content
}

function keywordsQ(html) {
    let kwords = keywords(html)
    kwords = '"' + kwords.replace(/, /g, '", "') + '"'
    return kwords
}

function keywordsL(html) {
    let kwords = keywords(html)
    kwords = '\n- ' + kwords.replace(/, /g, '\n- ')
    return kwords
}

function keywordsW(html) {
    let kwords = keywords(html)
    kwords = '[[' + kwords.replace(/, /g, ']], [[') + ']]'
    return kwords
}

module.exports = youtube
