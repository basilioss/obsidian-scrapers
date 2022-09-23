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
            return $("h1[id='bookTitle']").innerHTML.trim()
            break
        case "authors":
            return authors(html)
            break
        case "authorsQ":
            return authorsQ(html)
            break
        case "authorsL":
            return authorsL(html)
            break
        case "authorsW":
            return authorsW(html)
            break
        case "isbn":
            return $("meta[property='books:isbn']").content
            break
        case "published":
            return published(html)
            break
        case "genres":
            return genres(html)
            break
        case "genresQ":
            return genresQ(html)
            break
        case "genresL":
            return genresL(html)
            break
        case "genresW":
            return genresW(html)
            break
        case "cover":
            return $("img[id='coverImage']").src
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

function authors(html) {
    let authors = html.querySelectorAll("span[itemprop=name]")
    authors = Array.from(authors, authors => authors.textContent)
    return authors.join(', ')
}

function authorsQ(html) {
    let authors = html.querySelectorAll("span[itemprop=name]")
    authors = Array.from(authors, authors => authors.textContent)
    return '"' + authors.join('", "') + '"'
}

function authorsL(html) {
    let authors = html.querySelectorAll("span[itemprop=name]")
    authors = Array.from(authors, authors => authors.textContent)
    return "\n- " + authors.join('\n- ')
}

function authorsW(html) {
    let authors = html.querySelectorAll("span[itemprop=name]")
    authors = Array.from(authors, authors => authors.textContent)
    return "[[" + authors.join(']], [[') + "]]"
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

function genresQ(html) {
    let genres = html.querySelectorAll("a[class='actionLinkLite bookPageGenreLink']")
    genres = Array.from(genres, genres => genres.textContent.toLowerCase())
    genres = [...new Set(genres)]
    return '"' + genres.join('", "') + '"'
}

function genresL(html) {
    let genres = html.querySelectorAll("a[class='actionLinkLite bookPageGenreLink']")
    genres = Array.from(genres, genres => genres.textContent.toLowerCase())
    genres = [...new Set(genres)]
    return '\n- ' + genres.join('\n- ')
}

function genresW(html) {
    let genres = html.querySelectorAll("a[class='actionLinkLite bookPageGenreLink']")
    genres = Array.from(genres, genres => genres.textContent.toLowerCase())
    genres = [...new Set(genres)]
    return '[[' + genres.join(']], [[') + ']]'
}

module.exports = goodreads
