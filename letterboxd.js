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
      return safeReturn(image(json), "image");
    case "directors":
      return safeReturn(directors(json), "directors");
    case "directorsQ":
      return formatQuote(directors(json), "directors");
    case "directorsL":
      return formatList(directors(json), "directors");
    case "directorsW":
      return formatLink(directors(json), "directors");
    case "studios":
      return safeReturn(studios(json), "studios");
    case "studiosQ":
      return formatQuote(studios(json), "studios");
    case "studiosL":
      return formatList(studios(json), "studios");
    case "studiosW":
      return formatLink(studios(json), "studios");
    case "published":
      return safeReturn(json?.releasedEvent?.[0]?.startDate, "published");
    case "url":
      return safeReturn(json?.url, "url");
    case "cast":
      return safeReturn(cast(json), "cast");
    case "castQ":
      return formatQuote(cast(json), "cast");
    case "castL":
      return formatList(cast(json), "cast");
    case "castW":
      return formatLink(cast(json), "cast");
    case "title":
      return safeReturn(json?.name?.replace(/"/g, "”"), "title");
    case "genres":
      return safeReturn(genres(json), "genres");
    case "genresQ":
      return formatQuote(genres(json), "genres");
    case "genresL":
      return formatList(genres(json), "genres");
    case "genresW":
      return formatLink(genres(json), "genres");
    case "countries":
      return safeReturn(countries(json), "countries");
    case "countriesQ":
      return formatQuote(countries(json), "countries");
    case "countriesL":
      return formatList(countries(json), "countries");
    case "countriesW":
      return formatLink(countries(json), "countries");
    case "rating":
      return safeReturn(json?.aggregateRating?.ratingValue, "rating");
    case "description":
      return safeReturn($("meta[name='description']")?.content, "description");
    case "imdbUrl":
      let imdb = $("a[data-track-action='IMDb']")?.href;
      imdb = imdb ? imdb.replace(/\/maindetails/, "") : "";
      return safeReturn(imdb, "imdbUrl");
    case "tmdbUrl":
      return safeReturn($("a[data-track-action='TMDB']")?.href, "tmdbUrl");
    case "languages":
      return safeReturn(languages(doc), "languages");
    case "languagesQ":
      return formatQuote(languages(doc), "languages");
    case "languagesL":
      return formatList(languages(doc), "languages");
    case "languagesW":
      return formatLink(languages(doc), "languages");
    case "writers":
      return safeReturn(writers(doc), "writers");
    case "writersQ":
      return formatQuote(writers(doc), "writers");
    case "writersL":
      return formatList(writers(doc), "writers");
    case "writersW":
      return formatLink(writers(doc), "writers");
    case "runtime":
      return safeReturn(runtime(doc), "runtime");
    case "altTitle":
      let alt = $("section[id='featured-film-header'] em")?.innerText || "";
      alt = alt.replace(/[‘’]/g, "").replace(/"/g, "”");
      return safeReturn(alt, "altTitle");
    default:
      new Notice("Incorrect parameter: " + value, 5000);
      return "";
  }
}

function isValidHttpUrl(string) {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function log_parsing_error(variable) {
  console.error(`Parsing Error: Couldn't get ${variable}. If it happens consistently, consider opening an issue on GitHub.`);
}

function safeReturn(result, name) {
  if (!result) log_parsing_error(name);
  return result || "";
}

function formatQuote(value, name) {
  if (!value) log_parsing_error(name);
  return value ? `"${value.replace(/, /g, '", "')}"` : "";
}

function formatList(value, name) {
  if (!value) log_parsing_error(name);
  return value ? `\n- ${value.replace(/, /g, "\n- ")}` : "";
}

function formatLink(value, name) {
  if (!value) log_parsing_error(name);
  return value ? `[[${value.replace(/, /g, "]], [[")}]]` : "";
}

function image(json) {
  return (json?.image || "").replace(/\?.*$/, "");
}

function directors(json) {
  if (json?.director) {
    return json.director.map((d) => d.name).join(", ");
  }
  return "";
}

function studios(json) {
  if (json?.productionCompany) {
    return json.productionCompany.map((s) => s.name).join(", ");
  }
  return "";
}

function cast(json) {
  if (json?.actors) {
    return json.actors.map((a) => a.name).join(", ");
  }
  return "";
}

function genres(json) {
  return Array.isArray(json?.genre) ? json.genre.join(", ").toLowerCase() : (json?.genre || "").toLowerCase();
}

function countries(json) {
  if (json?.countryOfOrigin) {
    return json.countryOfOrigin.map((c) => c.name).join(", ");
  }
  return "";
}

function languages(doc) {
  let languages = doc.querySelectorAll("a[href^='/films/language/']");
  languages = Array.from(languages, (languages) => languages.textContent);
  languages = [...new Set(languages)]; // Remove duplicates
  return languages.join(", ");
}

function writers(doc) {
  let writers = doc.querySelectorAll("a[href^='/writer/']");
  writers = Array.from(writers, (writers) => writers.textContent);
  return writers.join(", ");
}

function runtime(doc) {
  let runtime = doc.querySelector("p[class*='text-link']")?.innerText || "";
  // Remove new lines
  runtime = runtime.replace(/(\r\n|\n|\r)/gm, "").trim();
  runtime = runtime.substring(0, runtime.indexOf(" ")).replace(/\smins/, "");
  return runtime;
}

module.exports = letterboxd;
