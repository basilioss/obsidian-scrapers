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

  // Alias for querySelector
  let $ = (s) => doc.querySelector(s);
  // Get the text inside the script "application/ld+json"
  let script = $("script[type='application/ld+json']").innerText;
  // Remove multi line comments inside the script
  script = script.replace(/\/\*([\s\S]*?)\*\//g, "");
  // Remove new lines
  script = script.replace(/(\r\n|\n|\r)/gm, "");
  // Get JSON with metadata
  let json = JSON.parse(script);

  switch (value) {
    case "image":
      return image(json);
    case "directors":
      return directors(json);
    case "directorsQ":
      // Quotes
      let directorsQ = directors(json);
      return '"' + directorsQ.replace(/, /g, '", "') + '"';
    case "directorsL":
      // List
      let directorsL = directors(json);
      return "\n- " + directorsL.replace(/, /g, "\n- ");
    case "directorsW":
      // Wiki links
      let directorsW = directors(json);
      return "[[" + directorsW.replace(/, /g, "]], [[") + "]]";
    case "studios":
      return studios(json);
    case "studiosQ":
      let studiosQ = studios(json);
      return '"' + studiosQ.replace(/, /g, '", "') + '"';
    case "studiosL":
      let studiosL = studios(json);
      return "\n- " + studiosL.replace(/, /g, "\n- ");
    case "studiosW":
      let studiosW = studios(json);
      return "[[" + studiosW.replace(/, /g, "]], [[") + "]]";
    case "published":
      return json.releasedEvent[0].startDate;
    case "url":
      return json.url;
    case "cast":
      return cast(json);
    case "castQ":
      let castQ = cast(json);
      return '"' + castQ.replace(/, /g, '", "') + '"';
    case "castL":
      let castL = cast(json);
      return "\n- " + castL.replace(/, /g, "\n- ");
    case "castW":
      let castW = cast(json);
      return "[[" + castW.replace(/, /g, "]], [[") + "]]";
    case "title":
      let title = json.name;
      return title.replace(/"/g, "”");
    case "genres":
      return genres(json);
    case "genresQ":
      let genresQ = genres(json);
      return '"' + genresQ.replace(/, /g, '", "') + '"';
    case "genresL":
      let genresL = genres(json);
      return "\n- " + genresL.replace(/, /g, "\n- ");
    case "genresW":
      let genresW = genres(json);
      return "[[" + genresW.replace(/, /g, "]], [[") + "]]";
    case "countries":
      return countries(json);
    case "countriesQ":
      let countriesQ = countries(json);
      return '"' + countriesQ.replace(/, /g, '", "') + '"';
    case "countriesL":
      let countriesL = countries(json);
      return "\n- " + countriesL.replace(/, /g, "\n- ");
    case "countriesW":
      let countriesW = countries(json);
      return "[[" + countriesW.replace(/, /g, "]], [[") + "]]";
    case "rating":
      return json.aggregateRating?.ratingValue || "";
    case "description":
      return $("meta[name='description']").content || "";
    case "imdbUrl":
      let imdbUrl = $("a[data-track-action='IMDb']")?.href || "";
      return imdbUrl.replace(/\/maindetails/, "");
    case "tmdbUrl":
      return $("a[data-track-action='TMDB']").href || "";
    case "languages":
      return languages(doc);
    case "languagesQ":
      let languagesQ = languages(doc);
      return '"' + languagesQ.replace(/, /g, '", "') + '"';
    case "languagesL":
      let languagesL = languages(doc);
      return "\n- " + languagesL.replace(/, /g, "\n- ");
    case "languagesW":
      let languagesW = languages(doc);
      return "[[" + languagesW.replace(/, /g, "]], [[") + "]]";
    case "writers":
      return writers(doc);
    case "writersQ":
      let writersQ = writers(doc);
      return '"' + writersQ.replace(/, /g, '", "') + '"';
    case "writersL":
      let writersL = writers(doc);
      return "\n- " + writersL.replace(/, /g, "\n- ");
    case "writersW":
      let writersW = writers(doc);
      return "[[" + writersW.replace(/, /g, "]], [[") + "]]";
    case "runtime":
      return runtime(doc);
    case "altTitle":
      let altTitle =
        $("section[id='featured-film-header'] em")?.innerText || "";
      return altTitle.replace(/‘/, "").replace(/’/, "").replace(/"/g, "”");
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function image(json) {
  // Get poster url. If undefined, return empty string
  let img = json?.image || "";
  // Remove unnecessary part
  img = img.replace(/\?.*$/g, "");
  return img;
}

function directors(json) {
  let directors = "";
  if (json.director != null) {
    directors = json.director.map((director) => director.name);
    directors = JSON.stringify(directors)
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/"]/, "");
  }
  return directors;
}

function studios(json) {
  let studios = "";
  if (json.productionCompany != null) {
    studios = json.productionCompany.map(
      (productionCompany) => productionCompany.name
    );
    studios = JSON.stringify(studios)
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/"]/, "");
  }
  return studios;
}

function cast(json) {
  let cast = "";
  if (json.actors != null) {
    cast = json.actors.map((actors) => actors.name);
    cast = JSON.stringify(cast)
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/"]/, "");
  }
  return cast;
}

function genres(json) {
  let genres = JSON.stringify(json?.genre) || "";
  genres = genres.replace(/","/g, ", ").replace(/\["/g, "").replace(/"]/, "");
  return genres.toLowerCase();
}

function countries(json) {
  let countries = "";
  if (json.countryOfOrigin != null) {
    countries = json.countryOfOrigin.map(
      (countryOfOrigin) => countryOfOrigin.name
    );
    countries = JSON.stringify(countries)
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/"]/, "");
  }
  return countries;
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
  let runtime = doc.querySelector("p[class*='text-link']").innerText;
  // Remove new lines
  runtime = runtime.replace(/(\r\n|\n|\r)/gm, "").trim();
  runtime = runtime.substring(0, runtime.indexOf(" ")).replace(/\smins/, "");
  return runtime;
}

module.exports = letterboxd;
