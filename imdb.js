async function imdb(value, tp, html) {
    if (html === undefined) {
        let url = await tp.system.clipboard()
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }
    let json = JSON.parse(html.querySelector("script[type='application/ld+json']").innerHTML)

    switch(value) {
        case "title":
            return title(json)
            break
        case "image":
            return image(json)
            break
        case "published":
            return published(json)
            break
        case "keywords":
            return keywords(json)
            break
        case "keywordsQ":
            return keywordsQ(json)
            break
        case "keywordsL":
            return keywordsL(json)
            break
        case "keywordsW":
            return keywordsW(json)
            break
        case "directors":
            return directors(json)
            break
        case "directorsQ":
            return directorsQ(json)
            break
        case "directorsL":
            return directorsL(json)
            break
        case "directorsW":
            return directorsW(json)
            break
        case "creators":
            return creators(json)
            break
        case "creatorsQ":
            return creatorsQ(json)
            break
        case "creatorsL":
            return creatorsL(json)
            break
        case "creatorsW":
            return creatorsW(json)
            break
        case "duration":
            return duration(json)
            break
        case "description":
            return description(html)
            break
        case "type":
            return type(json)
            break
        case "contentRating":
            return json.contentRating
            break
        case "genres":
            return genres(json)
            break
        case "genresQ":
            return genresQ(json)
            break
        case "genresL":
            return genresL(json)
            break
        case "genresW":
            return genresW(json)
            break
        case "stars":
            return stars(json)
            break
        case "starsQ":
            return starsQ(json)
            break
        case "starsL":
            return starsL(json)
            break
        case "starsW":
            return starsW(json)
            break
        case "imdbRating":
            return json.aggregateRating.ratingValue
            break
        case "countries":
            return countries(html)
            break
        case "countriesQ":
            return countriesQ(html)
            break
        case "countriesL":
            return countriesL(html)
            break
        case "countriesW":
            return countriesW(html)
            break
        case "url":
            return "https://www.imdb.com" + json.url
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

function title(json) {
    let title = ""
    if (json.alternateName != null) {
        title  = json.alternateName.replace(/&apos;/g, "'")
    } else {
        title = json.name.replace(/&apos;/g, "'")
    }
    return title
}

function image(json) {
    let image = ""
    if(json.image != null) {
        image = json.image
    }
    return image
}

function published(json) {
    let datePublished = ""
    if (json.datePublished != null) {
        datePublished = JSON.stringify(json.datePublished).substring(1,5)
    }
    return datePublished
}

function keywords(json) {
    let kwords = ""
    if (json.keywords != null) {
        kwords = JSON.stringify(json.keywords)
        kwords = kwords.toLowerCase().replace(/,/g, ', ').replace(/"/g, "")
    }
    return kwords
}

function keywordsQ(json) {
    let kwords = ""
    if (json.keywords != null) {
        kwords = JSON.stringify(json.keywords).toLowerCase().replace(/,/g, '", "')
    }
    return kwords
}

function keywordsL(json) {
    let kwords = ""
    if (json.keywords != null) {
        kwords = JSON.stringify(json.keywords).toLowerCase().replace(/"/g, "")
        kwords = "\n- " + kwords.replace(/,/g, '\n- ')
    }
    return kwords
}

function keywordsW(json) {
    let kwords = ""
    if (json.keywords != null) {
        kwords = JSON.stringify(json.keywords)
        kwords = kwords.toLowerCase().replace(/"/g, "")
        kwords = "[[" + kwords.replace(/,/g, ']], [[') + "]]"
    }
    return kwords
}

function directors(json) {
    let directors = ""
    if (json.director != null) {
        directors = json.director.map((director) => director.name)
        directors = JSON.stringify(directors).replace(/null,?/g, "").replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
    }
    return directors
}

function directorsQ(json) {
    let directorsQ = directors(json)
    directorsQ = '"' + directorsQ.replace(/, /g, '", "') + '"'
    return directorsQ
}

function directorsL(json) {
    let directorsL = directors(json)
    directorsL = "\n- " + directorsL.replace(/, /g, '\n- ')
    return directorsL
}

function directorsW(json) {
    let directorsW = directors(json)
    directorsW = "[[" + directorsW.replace(/, /g, ']], [[') + "]]"
    return directorsW
}

function creators(json) {
    let creators = ""
    if (json.creator != null) {
        creators = json.creator.map((creator) => creator.name)
        creators = JSON.stringify(creators).replace(/null,?/g, "").replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
    }
    return creators
}

function creatorsQ(json) {
    let creatorsQ = creators(json)
    creatorsQ = '"' + creatorsQ.replace(/, /g, '", "') + '"'
    return creatorsQ
}

function creatorsL(json) {
    let creatorsL = creators(json)
    creatorsL = "\n- " + creatorsL.replace(/, /g, '\n- ')
    return creatorsL
}

function creatorsW(json) {
    let creatorsW = creators(json)
    creatorsW = "[[" + creatorsW.replace(/, /g, ']], [[') + "]]"
    return creatorsW
}

function duration(json) {
    let duration = ""
    if (json.duration != null) {
        duration = JSON.stringify(json.duration).toLowerCase()
        duration = duration.replace(/"pt/, "").replace(/h/, "h ").replace(/m"/, "m")
    }
    return duration
}

function description(html) {
    return html.querySelector("span[data-testid='plot-xl']").innerText
}

function type(json) {
    type = JSON.stringify(json['@type']).replace(/TV/, "").replace(/"/g, "").toLowerCase()
    return type
}

function genres(json) {
    return JSON.stringify(json.genre).toLowerCase().replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
}

function genresQ(json) {
    let genresQ = genres(json)
    genresQ = '"' + genresQ.replace(/, /g, '", "') + '"'
    return genresQ
}

function genresL(json) {
    let genresL = genres(json)
    genresL = '\n- ' + genresL.replace(/, /g, '\n- ')
    return genresL
}

function genresW(json) {
    let genresW = genres(json)
    genresW = '[[' + genresW.replace(/, /g, ']], [[') + ']]'
    return genresW
}

function stars(json) {
    return JSON.stringify(json.actor.map((actor) => actor.name)).replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
}

function starsQ(json) {
    let starsQ = stars(json)
    starsQ = '"' + starsQ.replace(/, /g, '", "') + '"'
    return starsQ
}

function starsL(json) {
    let starsL = stars(json)
    starsL = '\n- ' + starsL.replace(/, /g, '\n- ')
    return starsL
}

function starsW(json) {
    let starsW = stars(json)
    starsW = '[[' + starsW.replace(/, /g, ']], [[') + ']]'
    return starsW
}

function countries(html) {
    let countries = html.querySelectorAll("a[href*='country_of_origin']")
    countries = Array.from(countries, countries => countries.textContent).join(', ')
    return countries
}

function countriesQ(html) {
    let countries = html.querySelectorAll("a[href*='country_of_origin']")
    countries = Array.from(countries, countries => countries.textContent).join('", "')
    return '"' + countries + '"'
}

function countriesL(html) {
    let countries = html.querySelectorAll("a[href*='country_of_origin']")
    countries = Array.from(countries, countries => countries.textContent).join('\n- ')
    return '\n- ' + countries
}

function countriesW(html) {
    let countries = html.querySelectorAll("a[href*='country_of_origin']")
    countries = Array.from(countries, countries => countries.textContent).join(']], [[')
    return '[[' + countries + ']]'
}

module.exports = imdb
