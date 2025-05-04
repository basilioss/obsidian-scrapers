async function letterboxd(value, tp, doc) {
  let url = await tp.system.clipboard();

  if (!isValidHttpUrl(url)) {
    console.error("Invalid URL for " + value);
    return "";
  }

  if (doc === undefined) {
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }

  const $ = (selector) => doc.querySelector(selector);

  let json;
  try {
    let script = $("script[type='application/ld+json']")?.innerText ?? "";
      // Remove multi line comments inside the script
    script = script.replace(/\/\*([\s\S]*?)\*\//g, "");
    // Remove new lines
    script = script.replace(/(\r\n|\n|\r)/gm, "");
    json = JSON.parse(script);
  } catch (err) {
    console.warn("Warning: Failed to parse JSON-LD metadata. Proceeding without JSON data.");
    json = null; // allow fallback functions to run
  }

  switch (value) {
    case "image":
      return safeReturn(getImage(json), "image");
    case "directors":
      return safeReturn(getDirectors(json), "directors");
    case "directorsQ":
    case "directorsQuotes":
      return formatQuote(getDirectors(json), "directors");
    case "directorsL":
    case "directorsList":
      return formatList(getDirectors(json), "directors");
    case "directorsW":
    case "directorsLinks":
      return formatLink(getDirectors(json), "directors");
    case "studios":
      return safeReturn(getStudios(json), "studios");
    case "studiosQ":
    case "studiosQuotes":
      return formatQuote(getStudios(json), "studios");
    case "studiosL":
    case "studiosList":
      return formatList(getStudios(json), "studios");
    case "studiosW":
    case "studiosLinks":
      return formatLink(getStudios(json), "studios");
    case "published":
      return safeReturn(json?.releasedEvent?.[0]?.startDate, "published");
    case "url":
      return safeReturn(json?.url, "url");
    case "cast":
      return safeReturn(getCast(json), "cast");
    case "castQ":
    case "castQuotes":
      return formatQuote(getCast(json), "cast");
    case "castL":
    case "castList":
      return formatList(getCast(json), "cast");
    case "castW":
    case "castLinks":
      return formatLink(getCast(json), "cast");
    case "castShort":
      return safeReturn(getCastShort(json), "castShort");
    case "castShortQ":
    case "castShortQuotes":
      return formatQuote(getCastShort(json), "castShort");
    case "castShortL":
    case "castShortList":
      return formatList(getCastShort(json), "castShort");
    case "castShortW":
    case "castShortLinks":
      return formatLink(getCastShort(json), "castShort");
    case "title":
      return safeReturn(json?.name?.replace(/"/g, "”"), "title");
    case "genres":
      return safeReturn(getGenres(json), "genres");
    case "genresQ":
    case "genresQuotes":
      return formatQuote(getGenres(json), "genres");
    case "genresL":
    case "genresList":
      return formatList(getGenres(json), "genres");
    case "genresW":
    case "genresLinks":
      return formatLink(getGenres(json), "genres");
    case "countries":
      return safeReturn(getCountries(json), "countries");
    case "countriesQ":
    case "countriesQuotes":
      return formatQuote(getCountries(json), "countries");
    case "countriesL":
    case "countriesList":
      return formatList(getCountries(json), "countries");
    case "countriesW":
    case "countriesLinks":
      return formatLink(getCountries(json), "countries");
    case "rating":
      return safeReturn(json?.aggregateRating?.ratingValue, "rating");
    case "description":
      return safeReturn($("meta[name='description']")?.content, "description");
    case "imdbUrl":
      return safeReturn(getImdbUrl(doc), "imdbUrl");
    case "tmdbUrl":
      return safeReturn($("a[data-track-action='TMDB']")?.href, "tmdbUrl");
    case "languages":
      return safeReturn(getLanguages(doc), "languages");
    case "languagesQ":
    case "languagesQuotes":
      return formatQuote(getLanguages(doc), "languages");
    case "languagesL":
    case "languagesList":
      return formatList(getLanguages(doc), "languages");
    case "languagesW":
    case "languagesLinks":
      return formatLink(getLanguages(doc), "languages");
    case "writers":
      return safeReturn(getWriters(doc), "writers");
    case "writersQ":
    case "writersQuotes":
      return formatQuote(getWriters(doc), "writers");
    case "writersL":
    case "writersList":
      return formatList(getWriters(doc), "writers");
    case "writersW":
    case "writersLinks":
      return formatLink(getWriters(doc), "writers");
    case "runtime":
      return safeReturn(getRuntime(doc), "runtime");
    case "altTitle":
      return safeReturn(getAltTitle(doc), "altTitle");
    case "altTitleUTF8":
      return safeReturn(getAltTitleUTF8(doc), "altTitle");
    default:
      new Notice("Incorrect parameter: " + value, 5000);
      return "";
  }
}

// --- Data Extractors ---

function getImage(json) {
  return (json?.image || "").replace(/\?.*$/, "");
}

function getDirectors(json) {
  if (json?.director) {
    return json.director.map((d) => d.name).join(", ");
  }
  return "";

}

function getStudios(json) {
  if (json?.productionCompany) {
    return json.productionCompany.map((s) => s.name).join(", ");
  }
  return "";
}

function getCast(json) {
  if (json?.actors) {
    return json.actors.map((a) => a.name).join(", ");
  }
  return "";
}

function getCastShort(json, n = 5) {
  let _cast = getCast(json);
  if (!_cast) return "";
  return _cast.split(", ").slice(0, n).join(", ");
}

function getGenres(json) {
  return Array.isArray(json?.genre) ? json.genre.join(", ").toLowerCase() : (json?.genre || "").toLowerCase();
}

function getCountries(json) {
  if (json?.countryOfOrigin) {
    return json.countryOfOrigin.map((c) => c.name).join(", ");
  }
  return "";
}

function getLanguages(doc) {
  let languages = doc.querySelectorAll("a[href^='/films/language/']");
  languages = Array.from(languages, (languages) => languages.textContent);
  languages = [...new Set(languages)]; // Remove duplicates
  return languages.join(", ");
}

function getWriters(doc) {
  let writers = doc.querySelectorAll("a[href^='/writer/']");
  return Array.from(writers, (writers) => writers.textContent).join(", ");
}

function getRuntime(doc) {
  let runtime = doc.querySelector("p[class*='text-link']")?.innerText || "";
  // Remove new lines
  runtime = runtime.replace(/(\r\n|\n|\r)/gm, "").trim();
  runtime = runtime.substring(0, runtime.indexOf(" ")).replace(/\smins/, "");
  return runtime;
}

function getImdbUrl(doc) {
  let imdb = doc.querySelector("a[data-track-action='IMDb']")?.href;
  return imdb ? imdb.replace(/\/maindetails/, "") : "";
}

function getAltTitle(doc) {
  // let alt = doc.querySelector("section[id='featured-film-header'] em")?.innerText || "";
  let altTitle = doc.querySelector("h2.originalname em")?.innerText || "";
  return altTitle.replace(/[‘’]/g, "").replace(/"/g, "”");
}

function isUTF8(input) {
  for (var i = 0; i < input.length; i++) {
    var temp = input.charCodeAt(i)
    if (temp > 0xFF) {
      return false
    }
  }
  return true
}

function getAltTitleUTF8(doc) {
  altTitle = getAltTitle(doc);
  if (!isUTF8(altTitle)) {
    return "";
  } else {
    return altTitle;
  }
}

// --- Helpers ---

function isValidHttpUrl(string) {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function logParsingError(variable) {
  console.error(`Parsing Error: Couldn't get ${variable}. If it happens consistently, consider opening an issue.`);
}

function safeReturn(result, name) {
  if (!result) logParsingError(name);
  return result || "";
}

function formatQuote(value, name) {
  if (!value) logParsingError(name);
  return value ? `"${value.replace(/, /g, '", "')}"` : "";
}

function formatList(value, name) {
  if (!value) logParsingError(name);
  return value ? `\n- ${value.replace(/, /g, "\n- ")}` : "";
}

function formatLink(value, name) {
  if (!value) logParsingError(name);
  return value ? `[[${value.replace(/, /g, "]], [[")}]]` : "";
}

module.exports = letterboxd;
