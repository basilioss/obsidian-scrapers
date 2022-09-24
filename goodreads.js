async function goodreads(value, tp, html) {
    if (html === undefined) {
        let url = await tp.system.clipboard()
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }
    // Alias for querySelector
    let $ = s => html.querySelector(s)

    switch(value) {
        case "url":
            return $("link[rel='canonical']").href
            break
        case "title":
            return $("h1[id='bookTitle']").innerHTML.trim() || ""
            break
        case "authors":
            return authors(html)
            break
        case "authorsQ":
            // Quotes
            let authorsQ = authors(html)
            return '"' + authorsQ.replace(/, /g, '", "') + '"'
            break
        case "authorsL":
            // List
            let authorsL = authors(html)
            return "\n- " + authorsL.replace(/, /g, '\n- ')
            break
        case "authorsW":
            // Wiki links
            let authorsW = authors(html)
            return "[[" + authorsW.replace(/, /g, ']], [[') + "]]"
            break
        case "isbn":
            return $("meta[property='books:isbn']").content || ""
            break
        case "published":
            return published(html)
            break
        case "genres":
            return genres(html)
            break
        case "genresQ":
            let genresQ = genres(html)
            return '"' + genresQ.replace(/, /g, '", "') + '"'
            break
        case "genresL":
            let genresL = genres(html)
            return "\n- " + genresL.replace(/, /g, '\n- ')
            break
        case "genresW":
            let genresW = genres(html)
            return "[[" + genresW.replace(/, /g, ']], [[') + "]]"
            break
        case "cover":
            return $("img[id='coverImage']").src || ""
            break
        case "pageCount":
            return $("meta[property*='page_count']").content ?? ""
            break
        case "description":
            return $("meta[property='og:description']").content ?? ""
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

function authors(html) {
    let authors = html.querySelectorAll("span[itemprop=name]")
    authors = Array.from(authors, authors => authors.textContent)
    return authors.join(', ')
}

function published(html) {
    var pubDate = ""
    let nobr = html.querySelector("nobr[class='greyText']")
    if (nobr) {
        pubDate = nobr.innerHTML
    } else {
        let details = html.querySelectorAll("div[id='details'] div.row")
        pubDate = details[details.length -1].innerHTML
    }
    const regex = /\d{4}/
    let match = regex.exec(pubDate)
    if (match) {
        return match[0]
    }
}

function genres(html) {
    let genres = html.querySelectorAll("a[class='actionLinkLite bookPageGenreLink']")
    genres = Array.from(genres, genres => genres.textContent.toLowerCase())
    genres = [...new Set(genres)] // Remove duplicates
    return genres.join(', ')
}

module.exports = goodreads
