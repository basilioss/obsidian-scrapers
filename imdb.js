async function imdb(value, tp, doc) {
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
    json = JSON.parse(script);
  } catch (err) {
    console.warn("Warning: Failed to parse JSON-LD metadata. Proceeding without JSON data.");
    json = null; // allow fallback functions to run
  }

  switch (value) {
    case "title":
      return safeReturn(getTitle(json), "title");
    case "image":
      return safeReturn(json?.image, "image");
    case "published":
      return safeReturn(getPublished(json, doc), "published");
    case "keywords":
      return safeReturn(getKeywords(json), "keywords");
    case "keywordsQ":
      return formatQuote(getKeywords(json), "keywords");
    case "keywordsL":
      return formatList(getKeywords(json), "keywords");
    case "keywordsW":
      return formatLink(getKeywords(json), "keywords");
    case "directors":
      return safeReturn(getDirectors(json), "directors");
    case "directorsQ":
      return formatQuote(getDirectors(json), "directors");
    case "directorsL":
      return formatList(getDirectors(json), "directors");
    case "directorsW":
      return formatLink(getDirectors(json), "directors");
    case "creators":
      return safeReturn(getCreators(json), "creators");
    case "creatorsQ":
      return formatQuote(getCreators(json), "creators");
    case "creatorsL":
      return formatList(getCreators(json), "creators");
    case "creatorsW":
      return formatLink(getCreators(json), "creators");
    case "duration":
      return safeReturn(getDuration(json), "duration");
    case "description":
      return safeReturn(getDescription(doc), "description");
    case "type":
      return safeReturn(getType(json), "type");
    case "contentRating":
      return safeReturn(json?.contentRating, "contentRating");
    case "genres":
      return safeReturn(getGenres(json), "genres");
    case "genresQ":
      return formatQuote(getGenres(json), "genres");
    case "genresL":
      return formatList(getGenres(json), "genres");
    case "genresW":
      return formatLink(getGenres(json), "genres");
    case "stars":
      return safeReturn(getStars(json), "stars");
    case "starsQ":
      return formatQuote(getStars(json), "stars");
    case "starsL":
      return formatList(getStars(json), "stars");
    case "starsW":
      return formatLink(getStars(json), "stars");
    case "imdbRating":
      return safeReturn(json?.aggregateRating?.ratingValue, "imdbRating")
    case "countries":
      return safeReturn(getCountries(doc), "countries");
    case "countriesQ":
      return formatQuote(getCountries(doc), "countries");
    case "countriesL":
      return formatList(getCountries(doc), "countries");
    case "countriesW":
      return formatLink(getCountries(doc), "countries");
    case "url":
      return safeReturn(getUrl(json), "url");
    default:
      new Notice("Incorrect parameter: " + value, 5000);
      return "";
  }
}

// --- Data extractors ---

function getTitle(json) {
  let title = json?.alternateName ?? json?.name ?? "";
  return title.replace(/&apos;/g, "'");
}

function getPublished(json, doc) {
  if (json?.datePublished) {
    return json.datePublished.substring(0, 4);
  }
  return doc.querySelector("a[href*='releaseinfo']")?.innerText || "";
}

function getKeywords(json) {
  if (!json?.keywords) return "";
  return json.keywords.toLowerCase().replace(/,/g, ", ");
}

function getDirectors(json) {
  if (!json?.director) return "";
  return json.director.map((d) => d.name).filter(Boolean).join(", ");
}

function getCreators(json) {
  if (!json?.creator) return "";
  return json.creator.map((c) => c.name).filter(Boolean).join(", ");
}

function getDuration(json) {
  let duration = "";
  if (json?.duration != null) {
    duration = JSON.stringify(json.duration).toLowerCase();
    duration = duration
      .replace(/"pt/, "")
      .replace(/h/, "h ")
      .replace(/m"/, "m");
  }
  return duration;
}

function getType(json) {
  return json?.["@type"]?.toLowerCase().replace(/tv/i, "") || "";
}

function getGenres(json) {
  if (!json?.genre) return "";
  return JSON.stringify(json.genre)
    .toLowerCase()
    .replace(/","/g, ", ")
    .replace(/\["/g, "")
    .replace(/\"]/, "");
}

function getStars(json) {
  if (!json?.actor) return "";
  return json.actor.map((a) => a.name).join(", ");
}

function getCountries(doc) {
  let countries = doc.querySelectorAll("a[href*='country_of_origin']");
  return Array.from(countries, (countries) => countries.textContent).join(", ");
}

function getDescription(doc) {
  return doc.querySelector("span[data-testid='plot-xl']")?.innerText || "";
}

function getUrl(json) {
  if (!json?.url) return "";
  return json.url.startsWith("http") ? json.url : "https://www.imdb.com" + json.url;
}

// --- Helpers ---

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

function logParsingError(name) {
  console.error(`Parsing Error: Couldn't get ${name}. If it happens consistently, consider opening an issue.`);
}

function isValidHttpUrl(string) {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

module.exports = imdb;
