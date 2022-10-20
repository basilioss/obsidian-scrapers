# Obsidian scrapers

A collection of [Templater](https://github.com/SilentVoid13/Templater) scripts for [Obsidian](https://obsidian.md/) that can be easily integrated into your templates to get information from different sites with a copied link.

https://user-images.githubusercontent.com/71596800/193448137-3a4d4489-cbc6-4108-905c-9eb3165e6ee1.mp4

## Installation

1. Install Templater via the Community Plugins tab within Obsidian.
2. Make sure you have configured templates and scripts folder location in Templater settings. Open settings > Open `Templater` tab in `Community plugins` > Set `Template folder location` > Set `Script files folder location`.
3. Clone/download this repository to your scripts folder.

## Usage

Syntax: `<% tp.user.<website>('<field>', tp) %>`

Example of a template for YouTube:

```
---
url: "<% tp.user.youtube('url', tp) %>"
aliases: ["<% tp.user.youtube('title', tp) %>"]
channel: "<% tp.user.youtube('channel', tp) %>"
published: <% tp.user.youtube('published', tp) %>
thumbnail: "<% tp.user.youtube('thumbnail', tp) %>"
keywords: [<% tp.user.youtube('keywordsQ', tp) %>]
duration: <% tp.user.youtube('duration', tp) %>
---

# <% tp.user.youtube('title', tp) %>

<% tp.user.youtube('description', tp) %>
```

Put it in your templates folder. After this you can simply copy a link to a video and run Templater to insert the template into a note.

[See](https://github.com/SilentVoid13/Templater/discussions/846) also Goodreads template example and how to create a meta-template to automatically insert the right template depending on the link domain.

## How to speed up execution time

Requesting a web page for each function may take a little too much time with some templates but it's possible to request it only once and pass the same `doc` parameter to each function.

Here's what you need to do for the YouTube template:

```
---
<%*
// Request a web page
let url = await tp.system.clipboard()
let page = await tp.obsidian.request({url})
let p = new DOMParser()
let doc = p.parseFromString(page, "text/html")
-%>
url: "<% tp.user.youtube('url', tp, doc) %>"
aliases: ["<% tp.user.youtube('title', tp, doc) %>"]
channel: "<% tp.user.youtube('channel', tp, doc) %>"
published: <% tp.user.youtube('published', tp, doc) %>
thumbnail: "<% tp.user.youtube('thumbnail', tp, doc) %>"
keywords: [<% tp.user.youtube('keywordsQ', tp, doc) %>]
duration: <% tp.user.youtube('duration', tp, doc) %>
---

# <% tp.user.youtube('title', tp, doc) %>

<% tp.user.youtube('description', tp, doc) %>
```

The same can be applied to any template. Just put this somewhere before a function:

```
<%*
let url = await tp.system.clipboard()
let page = await tp.obsidian.request({url})
let p = new DOMParser()
let doc = p.parseFromString(page, "text/html")
-%>
```

## Available functions

### Any website

| Function                                   | Description            |
| ------------------------------------------ | ---------------------- |
| `<% tp.user.website('title', tp) %>`       | Get title              |
| `<% tp.user.website('description', tp) %>` | Get description        |
| `<% tp.user.website('url', tp) %>`         | Get url                |
| `<% tp.user.website('image', tp) %>`       | Get image preview link |

### [YouTube](https://www.youtube.com/)

| Function                                   | Description                         |
| ------------------------------------------ | ----------------------------------- |
| `<% tp.user.youtube('title', tp) %>`       | Get title                           |
| `<% tp.user.youtube('channel', tp) %>`     | Get channel name                    |
| `<% tp.user.youtube('published', tp) %>`   | Get publish date                    |
| `<% tp.user.youtube('thumbnail', tp) %>`   | Get thumbnail link                  |
| `<% tp.user.youtube('url', tp) %>`         | Get url                             |
| `<% tp.user.youtube('duration', tp) %>`    | Get duration                        |
| `<% tp.user.youtube('description', tp) %>` | Get description                     |
| `<% tp.user.youtube('id', tp) %>`          | Get ID (can be used in embeds)      |
| `<% tp.user.youtube('keywords', tp) %>`    | Get string of keywords              |
| `<% tp.user.youtube('keywordsL', tp) %>`   | Get list of keywords                |
| `<% tp.user.youtube('keywordsQ', tp) %>`   | Get keywords enclosed in quotes     |
| `<% tp.user.youtube('keywordsW', tp) %>`   | Get keywords formatted as wikilinks |

[Invidious](https://invidious.io/) instance [yewtu.be](https://yewtu.be/) is also supported if you don't pass optional `doc` parameter as described [above](https://github.com/basilioss/obsidian-scrapers/#how-to-speed-up-execution-time). If you use another alternative YouTube front-end or instance, you can specify it in the `altDomain` variable in the `youtube.js` file.

### [Goodreads](https://www.goodreads.com/)

| Function                                     | Description                        |
| -------------------------------------------- | ---------------------------------- |
| `<% tp.user.goodreads('title', tp) %>`       | Get title                          |
| `<% tp.user.goodreads('url', tp) %>`         | Get url                            |
| `<% tp.user.goodreads('authors', tp) %>`     | Get string of authors              |
| `<% tp.user.goodreads('authorsL', tp) %>`    | Get list of authors                |
| `<% tp.user.goodreads('authorsQ', tp) %>`    | Get authors enclosed in quotes     |
| `<% tp.user.goodreads('authorsW', tp) %>`    | Get authors formatted as wikilinks |
| `<% tp.user.goodreads('isbn', tp) %>`        | Get ISBN                           |
| `<% tp.user.goodreads('published', tp) %>`   | Get publish date                   |
| `<% tp.user.goodreads('genres', tp) %>`      | Get string of genres               |
| `<% tp.user.goodreads('genresL', tp) %>`     | Get list of genres                 |
| `<% tp.user.goodreads('genresQ', tp) %>`     | Get genres enclosed in quotes      |
| `<% tp.user.goodreads('genresW', tp) %>`     | Get genres formatted as wikilinks  |
| `<% tp.user.goodreads('cover', tp) %>`       | Get cover link                     |
| `<% tp.user.goodreads('pageCount', tp) %>`   | Get number of pages                |
| `<% tp.user.goodreads('description', tp) %>` | Get description                    |

### [IMDb](https://www.imdb.com/)

| Function                                | Description                          |
| --------------------------------------- | ------------------------------------ |
| `<% tp.user.imdb('title', tp) %>`       | Get title                            |
| `<% tp.user.imdb('image', tp) %>`       | Get poster link                      |
| `<% tp.user.imdb('published', tp) %>`   | Get publish date                     |
| `<% tp.user.imdb('keywords', tp) %>`    | Get string of keywords               |
| `<% tp.user.imdb('keywordsL', tp) %>`   | Get list of keywords                 |
| `<% tp.user.imdb('keywordsQ', tp) %>`   | Get keywords enclosed in quotes      |
| `<% tp.user.imdb('keywordsW', tp) %>`   | Get keywords formatted as wikilinks  |
| `<% tp.user.imdb('directors', tp) %>`   | Get string of directors              |
| `<% tp.user.imdb('directorsL', tp) %>`  | Get list of directors                |
| `<% tp.user.imdb('directorsQ', tp) %>`  | Get directors enclosed in quotes     |
| `<% tp.user.imdb('directorsW', tp) %>`  | Get directors formatted as wikilinks |
| `<% tp.user.imdb('creators', tp) %>`    | Get string of creators               |
| `<% tp.user.imdb('creatorsL', tp) %>`   | Get list of creators                 |
| `<% tp.user.imdb('creatorsQ', tp) %>`   | Get creators enclosed in quotes      |
| `<% tp.user.imdb('creatorsW', tp) %>`   | Get creators enclosed in wikilinks   |
| `<% tp.user.imdb('duration', tp) %>`    | Get duration                         |
| `<% tp.user.imdb('description', tp) %>` | Get description                      |
| `<% tp.user.imdb('type', tp) %>`        | Get type (movie/series)              |
| `<% tp.user.imdb('genres', tp) %>`      | Get string of genres                 |
| `<% tp.user.imdb('genresL', tp) %>`     | Get list of genres                   |
| `<% tp.user.imdb('genresQ', tp) %>`     | Get genres enclosed in quotes        |
| `<% tp.user.imdb('genresW', tp) %>`     | Get genres formatted as wikilinks    |
| `<% tp.user.imdb('stars', tp) %>`       | Get string of stars                  |
| `<% tp.user.imdb('starsL', tp) %>`      | Get list of stars                    |
| `<% tp.user.imdb('starsQ', tp) %>`      | Get stars enclosed in quotes         |
| `<% tp.user.imdb('starsW', tp) %>`      | Get stars formatted as wikilinks     |
| `<% tp.user.imdb('imdbRating', tp) %>`  | Get IMDb rating                      |
| `<% tp.user.imdb('contentRating', tp) %>` | Get content rating                 |
| `<% tp.user.imdb('countries', tp) %>`   | Get string of countries              |
| `<% tp.user.imdb('countriesL', tp) %>`  | Get list of countries                |
| `<% tp.user.imdb('countriesQ', tp) %>`  | Get countries enclosed in quotes     |
| `<% tp.user.imdb('countriesW', tp) %>`  | Get countries formatted as wikilinks |
| `<% tp.user.imdb('url', tp) %>`         | Get url                              |

### [Letterboxd](https://letterboxd.com/)

| Function                                      | Description                          |
| --------------------------------------------- | ------------------------------------ |
| `<% tp.user.letterboxd('image', tp) %>`       | Get image link                       |
| `<% tp.user.letterboxd('directors', tp) %>`   | Get string of directors              |
| `<% tp.user.letterboxd('directorsL', tp) %>`  | Get list of directors                |
| `<% tp.user.letterboxd('directorsQ', tp) %>`  | Get directors enclosed in quotes     |
| `<% tp.user.letterboxd('directorsW', tp) %>`  | Get directors formatted as wikilinks |
| `<% tp.user.letterboxd('studios', tp) %>`     | Get string of studios                |
| `<% tp.user.letterboxd('studiosL', tp) %>`    | Get list of studios                  |
| `<% tp.user.letterboxd('studiosQ', tp) %>`    | Get studios enclosed in quotes       |
| `<% tp.user.letterboxd('studiosW', tp) %>`    | Get studios formatted as wikilnks    |
| `<% tp.user.letterboxd('published', tp) %>`   | Get publish date                     |
| `<% tp.user.letterboxd('url', tp) %>`         | Get url                              |
| `<% tp.user.letterboxd('cast', tp) %>`        | Get string of cast                   |
| `<% tp.user.letterboxd('castL', tp) %>`       | Get list of cast                     |
| `<% tp.user.letterboxd('castQ', tp) %>`       | Get cast enclosed in quotes          |
| `<% tp.user.letterboxd('castW', tp) %>`       | Get cast formatted as wikilinks      |
| `<% tp.user.letterboxd('title', tp) %>`       | Get title                            |
| `<% tp.user.letterboxd('genres', tp) %>`      | Get string of genres                 |
| `<% tp.user.letterboxd('genresL', tp) %>`     | Get list of genres                   |
| `<% tp.user.letterboxd('genresQ', tp) %>`     | Get genres enclosed in quotes        |
| `<% tp.user.letterboxd('genresW', tp) %>`     | Get genres formatted as wikilinks    |
| `<% tp.user.letterboxd('countries', tp) %>`   | Get string of countries              |
| `<% tp.user.letterboxd('countriesL', tp) %>`  | Get list of countries                |
| `<% tp.user.letterboxd('countriesQ', tp) %>`  | Get countries enclosed in quotes     |
| `<% tp.user.letterboxd('countriesW', tp) %>`  | Get countries formatted as wikilinks |
| `<% tp.user.letterboxd('rating', tp) %>`      | Get rating                           |
| `<% tp.user.letterboxd('description', tp) %>` | Get description                      |
| `<% tp.user.letterboxd('imdbUrl', tp) %>`     | Get IMDb link                        |
| `<% tp.user.letterboxd('tmdbUrl', tp) %>`     | Get TMDB link                        |
| `<% tp.user.letterboxd('languages', tp) %>`   | Get string of languages              |
| `<% tp.user.letterboxd('languagesL', tp) %>`  | Get list of languages                |
| `<% tp.user.letterboxd('languagesQ', tp) %>`  | Get languages enclosed in quotes     |
| `<% tp.user.letterboxd('languagesW', tp) %>`  | Get languages formatted as wikilinks |
| `<% tp.user.letterboxd('writers', tp) %>`     | Get string of writers                |
| `<% tp.user.letterboxd('writersL', tp) %>`    | Get list of writers                  |
| `<% tp.user.letterboxd('writersQ', tp) %>`    | Get writers enclosed in quotes       |
| `<% tp.user.letterboxd('writersW', tp) %>`    | Get writers formatted as wikilinks   |
| `<% tp.user.letterboxd('runtime', tp) %>`     | Get duration                         |
| `<% tp.user.letterboxd('altTitle', tp) %>`    | Get alternative title                |

### [Wikipedia](https://www.wikipedia.org/)

| Function                                  | Description           |
| ----------------------------------------- | --------------------- |
| `<% tp.user.wikipedia('title', tp) %>`    | Get title             |
| `<% tp.user.wikipedia('url', tp) %>`      | Get url               |
| `<% tp.user.wikipedia('image', tp) %>`    | Get image link        |
| `<% tp.user.wikipedia('headline', tp) %>` | Get short description |

### [Odysee](https://odysee.com/)

| Function                                  | Description                         |
| ----------------------------------------- | ----------------------------------- |
| `<% tp.user.odysee('title', tp) %>`       | Get title                           |
| `<% tp.user.odysee('channel', tp) %>`     | Get channel name                    |
| `<% tp.user.odysee('description', tp) %>` | Get description                     |
| `<% tp.user.odysee('published', tp) %>`   | Get publish date                    |
| `<% tp.user.odysee('thumbnail', tp) %>`   | Get thumbnail link                  |
| `<% tp.user.odysee('duration', tp) %>`    | Get duration                        |
| `<% tp.user.odysee('url', tp) %>`         | Get Odysee url                      |
| `<% tp.user.odysee('contentUrl', tp) %>`  | Get direct link to a video          |
| `<% tp.user.odysee('embedUrl', tp) %>`    | Get embed url                       |
| `<% tp.user.odysee('keywords', tp) %>`    | Get string of keywords              |
| `<% tp.user.odysee('keywordsL', tp) %>`   | Get list of keywords                |
| `<% tp.user.odysee('keywordsQ', tp) %>`   | Get keywords enclosed in quotes     |
| `<% tp.user.odysee('keywordsW', tp) %>`   | Get keywords formatted as wikilinks |

