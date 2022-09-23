async function letterboxd(value, tp, html) {
    if (html === undefined) {
        let url = await tp.system.clipboard()
        let page = await tp.obsidian.request({url})
        let p = new DOMParser()
        html = p.parseFromString(page, "text/html")
    }

    // Alias for querySelector
    let $ = s => html.querySelector(s)
    // Get the text inside the script "application/ld+json"
    let script = $("script[type='application/ld+json']").innerText
    // Remove multi line comments inside the script
    script = script.replace(/\/\*([\s\S]*?)\*\//g, "")
    // Remove new lines
    script = script.replace(/(\r\n|\n|\r)/gm, "")
    // Get JSON with metadata
    let json = JSON.parse(script)

    switch(value) {
        case "image":
            return image(json)
            break
        case "directors":
            return directors(json)
            break
        case "directorsQ":
            // Quotes
            let directorsQ = directors(json)
            return '"' + directorsQ.replace(/, /g, '", "') + '"'
            break
        case "directorsL":
            // List
            let directorsL = directors(json)
            return "\n- " + directorsL.replace(/, /g, '\n- ')
            break
        case "directorsW":
            // Wiki links
            let directorsW = directors(json)
            return "[[" + directorsW.replace(/, /g, ']], [[') + "]]"
            break
        case "studios":
            return studios(json)
            break
        case "studiosQ":
            let studiosQ = studios(json)
            return '"' + studiosQ.replace(/, /g, '", "') + '"'
            break
        case "studiosL":
            let studiosL = studios(json)
            return "\n- " + studiosL.replace(/, /g, '\n- ')
            break
        case "studiosW":
            let studiosW = studios(json)
            return "[[" + studiosW.replace(/, /g, ']], [[') + "]]"
            break
        case "published":
            return json.releasedEvent[0].startDate
            break
        case "url":
            return json.url
            break
        case "cast":
            return cast(json)
            break
        case "castQ":
            let castQ = cast(json)
            return '"' + castQ.replace(/, /g, '", "') + '"'
            break
        case "castL":
            let castL = cast(json)
            return "\n- " + castL.replace(/, /g, '\n- ')
            break
        case "castW":
            let castW = cast(json)
            return "[[" + castW.replace(/, /g, ']], [[') + "]]"
            break
        case "title":
            let title = json.name
            return title.replace(/"/g, '”')
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
        case "countries":
            return countries(json)
            break
        case "countriesQ":
            let countriesQ = countries(json)
            return '"' + countriesQ.replace(/, /g, '", "') + '"'
            break
        case "countriesL":
            let countriesL = countries(json)
            return "\n- " + countriesL.replace(/, /g, '\n- ')
            break
        case "countriesW":
            let countriesW = countries(json)
            return "[[" + countriesW.replace(/, /g, ']], [[') + "]]"
            break
        case "rating":
            return json.aggregateRating?.ratingValue || ""
            break
        case "description":
            return $("meta[name='description']").content || ""
            break
        case "imdbUrl":
            let imdbUrl = $("a[data-track-action='IMDb']")?.href || ""
            return imdbUrl.replace(/\/maindetails/, "")
            break
        case "tmdbUrl":
            return $("a[data-track-action='TMDb']").href || ""
            break
        case "languages":
            return languages(html)
            break
        case "languagesQ":
            let languagesQ = languages(html)
            return '"' + languagesQ.replace(/, /g, '", "') + '"'
            break
        case "languagesL":
            let languagesL = languages(html)
            return "\n- " + languagesL.replace(/, /g, '\n- ')
            break
        case "languagesW":
            let languagesW = languages(html)
            return "[[" + languagesW.replace(/, /g, ']], [[') + "]]"
            break
        case "writers":
            return writers(html)
            break
        case "writersQ":
            let writersQ = writers(html)
            return '"' + writersQ.replace(/, /g, '", "') + '"'
            break
        case "writersL":
            let writersL = writers(html)
            return "\n- " + writersL.replace(/, /g, '\n- ')
            break
        case "writersW":
            let writersW = writers(html)
            return "[[" + writersW.replace(/, /g, ']], [[') + "]]"
            break
        case "runtime":
            return runtime(html)
            break
        case "altTitle":
            let altTitle = $("section[id='featured-film-header'] em")?.innerText || ""
            return altTitle.replace(/‘/, "").replace(/’/, "").replace(/"/g, '”')
            break
        default:
            new Notice("Incorrect parameter: " + value, 5000)
    }
}

function image(json) {
    // Get poster url. If undefined, return empty string
    let img = json?.image || ""
    // Remove unnecessary part
    img = img.replace(/\?.*$/g, "")
    return img
}

function directors(json) {
    let directors = ""
    if (json.director != null) {
        directors = json.director.map((director) => director.name)
        directors = JSON.stringify(directors).replace(/","/g, ", ").replace(/\["/g, "").replace(/"]/, "")
    }
    return directors
}

function studios(json) {
    let studios = ""
    if (json.productionCompany != null) {
        studios = json.productionCompany.map((productionCompany) => productionCompany.name)
        studios = JSON.stringify(studios).replace(/","/g, ", ").replace(/\["/g, "").replace(/"]/, "")
    }
    return studios
}

function cast(json) {
    let cast = ""
    if (json.actors != null) {
        cast = json.actors.map((actors) => actors.name)
        cast = JSON.stringify(cast).replace(/","/g, ", ").replace(/\["/g, "").replace(/"]/, "")
    }
    return cast
}

function genres(json) {
    let genres = JSON.stringify(json?.genre) || ""
    genres = genres.replace(/","/g, ", ").replace(/\["/g, "").replace(/"]/, "")
    return genres.toLowerCase()
}

function countries(json) {
    let countries = ""
    if (json.countryOfOrigin != null) {
        countries = json.countryOfOrigin.map((countryOfOrigin) => countryOfOrigin.name)
        countries = JSON.stringify(countries).replace(/","/g, ", ").replace(/\["/g, "").replace(/"]/, "")
    }
    return countries
}

function languages(html) {
    let languages = html.querySelectorAll("a[href^='/films/language/']")
    languages = Array.from(languages, languages => languages.textContent)
    languages = [...new Set(languages)] // Remove duplicates
    return languages.join(', ')
}

function writers(html) {
    let writers = html.querySelectorAll("a[href^='/writer/']")
    writers = Array.from(writers, writers => writers.textContent)
    return writers.join(', ')
}

function runtime(html) {
    let runtime = html.querySelector("p[class*='text-link']").innerText
    // Remove new lines
    runtime = runtime.replace(/(\r\n|\n|\r)/gm, "").trim()
    runtime = runtime.substring(0, runtime.indexOf(' ')).replace(/\smins/, "")
    return runtime
}

module.exports = letterboxd
