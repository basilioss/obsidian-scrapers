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
            // Quotes
            let keywordsQ = keywords(json)
            return '"' + keywordsQ.replace(/, /g, '", "') + '"'
            break
        case "keywordsL":
            // List
            let keywordsL = keywords(json)
            return "\n- " + keywordsL.replace(/, /g, '\n- ')
            break
        case "keywordsW":
            // Wiki links
            let keywordsW = keywords(json)
            return "[[" + keywordsW.replace(/, /g, ']], [[') + "]]"
            break
        case "directors":
            return directors(json)
            break
        case "directorsQ":
            let directorsQ = directors(json)
            return '"' + directorsQ.replace(/, /g, '", "') + '"'
            break
        case "directorsL":
            let directorsL = directors(json)
            return "\n- " + directorsL.replace(/, /g, '\n- ')
            break
        case "directorsW":
            let directorsW = directors(json)
            return "[[" + directorsW.replace(/, /g, ']], [[') + "]]"
            break
        case "creators":
            return creators(json)
            break
        case "creatorsQ":
            let creatorsQ = creators(json)
            return '"' + creatorsQ.replace(/, /g, '", "') + '"'
            break
        case "creatorsL":
            let creatorsL = creators(json)
            return "\n- " + creatorsL.replace(/, /g, '\n- ')
            break
        case "creatorsW":
            let creatorsW = creators(json)
            return "[[" + creatorsW.replace(/, /g, ']], [[') + "]]"
            break
        case "duration":
            return duration(json)
            break
        case "description":
            return html.querySelector("span[data-testid='plot-xl']").innerText
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
            let genresQ = genres(json)
            return '"' + genresQ.replace(/, /g, '", "') + '"'
            break
        case "genresL":
            let genresL = genres(json)
            return "\n- " + genresL.replace(/, /g, '\n- ')
            break
        case "genresW":
            let genresW = genres(json)
            return "[[" + genresW.replace(/, /g, ']], [[') + "]]"
            break
        case "stars":
            return stars(json)
            break
        case "starsQ":
            let starsQ = stars(json)
            return '"' + starsQ.replace(/, /g, '", "') + '"'
            break
        case "starsL":
            let starsL = stars(json)
            return "\n- " + starsL.replace(/, /g, '\n- ')
            break
        case "starsW":
            let starsW = stars(json)
            return "[[" + starsW.replace(/, /g, ']], [[') + "]]"
            break
        case "imdbRating":
            return json.aggregateRating.ratingValue
            break
        case "countries":
            return countries(html)
            break
        case "countriesQ":
            let countriesQ = countries(html)
            return '"' + countriesQ.replace(/, /g, '", "') + '"'
            break
        case "countriesL":
            let countriesL = countries(html)
            return "\n- " + countriesL.replace(/, /g, '\n- ')
            break
        case "countriesW":
            let countriesW = countries(html)
            return "[[" + countriesW.replace(/, /g, ']], [[') + "]]"
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
    let keywords = ""
    if (json.keywords != null) {
        keywords = JSON.stringify(json.keywords)
        keywords = keywords.toLowerCase().replace(/,/g, ", ").replace(/"/g, "")
    }
    return keywords
}

function directors(json) {
    let directors = ""
    if (json.director != null) {
        directors = json.director.map((director) => director.name)
        directors = JSON.stringify(directors).replace(/null,?/g, "").replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
    }
    return directors
}

function creators(json) {
    let creators = ""
    if (json.creator != null) {
        creators = json.creator.map((creator) => creator.name)
        creators = JSON.stringify(creators).replace(/null,?/g, "").replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
    }
    return creators
}

function duration(json) {
    let duration = ""
    if (json.duration != null) {
        duration = JSON.stringify(json.duration).toLowerCase()
        duration = duration.replace(/"pt/, "").replace(/h/, "h ").replace(/m"/, "m")
    }
    return duration
}

function type(json) {
    type = JSON.stringify(json['@type']).replace(/TV/, "").replace(/"/g, "").toLowerCase()
    return type
}

function genres(json) {
    return JSON.stringify(json.genre).toLowerCase().replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
}

function stars(json) {
    return JSON.stringify(json.actor.map((actor) => actor.name)).replace(/","/g, ", ").replace(/\["/g, "").replace(/\"]/, "")
}

function countries(html) {
    let countries = html.querySelectorAll("a[href*='country_of_origin']")
    countries = Array.from(countries, countries => countries.textContent).join(', ')
    return countries
}

module.exports = imdb
