async function imdb(value, tp, doc) {
  if (doc === undefined) {
    let url = await tp.system.clipboard();
    let page = await tp.obsidian.request({ url });
    let p = new DOMParser();
    doc = p.parseFromString(page, "text/html");
  }
  
  let json = JSON.parse(
    doc.querySelector("script[type='application/ld+json']").innerHTML
  );

  switch (value) {
    case "title":
      return title(json);
    case "image":
      return image(json);
    case "published":
      return published(json);
    case "keywords":
      return keywords(json);
    case "keywordsQ":
      // Quotes
      let keywordsQ = keywords(json);
      return '"' + keywordsQ.replace(/, /g, '", "') + '"';
    case "keywordsL":
      // List
      let keywordsL = keywords(json);
      return "\n- " + keywordsL.replace(/, /g, "\n- ");
    case "keywordsW":
      // Wiki links
      let keywordsW = keywords(json);
      return "[[" + keywordsW.replace(/, /g, "]], [[") + "]]";
    case "directors":
      return directors(json);
    case "directorsQ":
      let directorsQ = directors(json);
      return '"' + directorsQ.replace(/, /g, '", "') + '"';
    case "directorsL":
      let directorsL = directors(json);
      return "\n- " + directorsL.replace(/, /g, "\n- ");
    case "directorsW":
      let directorsW = directors(json);
      return "[[" + directorsW.replace(/, /g, "]], [[") + "]]";
    case "creators":
      return creators(json);
    case "creatorsQ":
      let creatorsQ = creators(json);
      return '"' + creatorsQ.replace(/, /g, '", "') + '"';
    case "creatorsL":
      let creatorsL = creators(json);
      return "\n- " + creatorsL.replace(/, /g, "\n- ");
    case "creatorsW":
      let creatorsW = creators(json);
      return "[[" + creatorsW.replace(/, /g, "]], [[") + "]]";
    case "duration":
      return duration(json);
    case "description":
      return doc.querySelector("span[data-testid='plot-xl']").innerText;
    case "type":
      return type(json);
    case "contentRating":
      return json.contentRating;
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
    case "stars":
      return stars(json);
    case "starsQ":
      let starsQ = stars(json);
      return '"' + starsQ.replace(/, /g, '", "') + '"';
    case "starsL":
      let starsL = stars(json);
      return "\n- " + starsL.replace(/, /g, "\n- ");
    case "starsW":
      let starsW = stars(json);
      return "[[" + starsW.replace(/, /g, "]], [[") + "]]";
    case "imdbRating":
      return json.aggregateRating.ratingValue;
    case "countries":
      return countries(doc);
    case "countriesQ":
      let countriesQ = countries(doc);
      return '"' + countriesQ.replace(/, /g, '", "') + '"';
    case "countriesL":
      let countriesL = countries(doc);
      return "\n- " + countriesL.replace(/, /g, "\n- ");
    case "countriesW":
      let countriesW = countries(doc);
      return "[[" + countriesW.replace(/, /g, "]], [[") + "]]";
    case "url":
      return "https://www.imdb.com" + json.url;
    default:
      new Notice("Incorrect parameter: " + value, 5000);
  }
}

function title(json) {
  let title = "";
  if (json.alternateName != null) {
    title = json.alternateName.replace(/&apos;/g, "'");
  } else {
    title = json.name.replace(/&apos;/g, "'");
  }
  return title;
}

function image(json) {
  let image = "";
  if (json.image != null) {
    image = json.image;
  }
  return image;
}

function published(json) {
  let datePublished = "";
  if (json.datePublished != null) {
    datePublished = JSON.stringify(json.datePublished).substring(1, 5);
  }
  return datePublished;
}

function keywords(json) {
  let keywords = "";
  if (json.keywords != null) {
    keywords = JSON.stringify(json.keywords);
    keywords = keywords.toLowerCase().replace(/,/g, ", ").replace(/"/g, "");
  }
  return keywords;
}

function directors(json) {
  let directors = "";
  if (json.director != null) {
    directors = json.director.map((director) => director.name);
    directors = JSON.stringify(directors)
      .replace(/null,?/g, "")
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/\"]/, "");
  }
  return directors;
}

function creators(json) {
  let creators = "";
  if (json.creator != null) {
    creators = json.creator.map((creator) => creator.name);
    creators = JSON.stringify(creators)
      .replace(/null,?/g, "")
      .replace(/","/g, ", ")
      .replace(/\["/g, "")
      .replace(/\"]/, "");
  }
  return creators;
}

function duration(json) {
  let duration = "";
  if (json.duration != null) {
    duration = JSON.stringify(json.duration).toLowerCase();
    duration = duration
      .replace(/"pt/, "")
      .replace(/h/, "h ")
      .replace(/m"/, "m");
  }
  return duration;
}

function type(json) {
  type = JSON.stringify(json["@type"])
    .replace(/TV/, "")
    .replace(/"/g, "")
    .toLowerCase();
  return type;
}

function genres(json) {
  return JSON.stringify(json.genre)
    .toLowerCase()
    .replace(/","/g, ", ")
    .replace(/\["/g, "")
    .replace(/\"]/, "");
}

function stars(json) {
  return JSON.stringify(json.actor.map((actor) => actor.name))
    .replace(/","/g, ", ")
    .replace(/\["/g, "")
    .replace(/\"]/, "");
}

function countries(doc) {
  let countries = doc.querySelectorAll("a[href*='country_of_origin']");
  countries = Array.from(countries, (countries) => countries.textContent).join(
    ", "
  );
  return countries;
}

module.exports = imdb;
