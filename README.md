# Obsidian scrapers

A collection of [Templater](https://github.com/SilentVoid13/Templater) scripts for [Obsidian](https://obsidian.md/) that can be easily integrated into your templates to get information from different sites with a copied link.

https://user-images.githubusercontent.com/71596800/193448137-3a4d4489-cbc6-4108-905c-9eb3165e6ee1.mp4

## Installation

1. [Download](https://github.com/basilioss/obsidian-scrapers/archive/refs/heads/main.zip) and unzip the files/folders.
2. Copy `scripts` and `templates` folder to your vault (notes) folder.
3. Install Templater via the Community Plugins tab within Obsidian. Open Templater options in settings under `Community plugins` section.
4. Set `Template folder location` to downloaded `templates` folder.
5. Set `Script files folder location` to downloaded `scripts` folder.
6. Optionally, add a new hotkey for the `scraper` template that can automatically insert the correct template depending on the link domain.
7. Copy the URL and open insert template modal (by default `Alt + E`). Choose `scraper` or youtube/goodreads/imdb etc., depending on the link.
8. Customize the downloaded templates to your liking. Refer to [Templater documentation](https://silentvoid13.github.io/Templater/) for more info.

## Available functions

### Any website

| Function                                   | Description            |
| ------------------------------------------ | ---------------------- |
| `<% tp.user.website('title', tp) %>`       | Get title              |
| `<% tp.user.website('description', tp) %>` | Get description        |
| `<% tp.user.website('url', tp) %>`         | Get url                |
| `<% tp.user.website('image', tp) %>`       | Get image preview link |

### [YouTube](https://www.youtube.com/)

| Function                                       | Description                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| `<% tp.user.youtube('title', tp) %>`           | Get title                                                                             |
| `<% tp.user.youtube('channel', tp) %>`         | Get channel name                                                                      |
| `<% tp.user.youtube('published', tp) %>`       | Get publish date                                                                      |
| `<% tp.user.youtube('url', tp) %>`             | Get url                                                                               |
| `<% tp.user.youtube('thumbnail', tp) %>`       | Get thumbnail link                                                                    |
| `<% tp.user.youtube('keywords', tp) %>`        | Get keywords (alternative formats: `keywordsList`, `keywordsQuotes`, `keywordsLinks`) |
| `<% tp.user.youtube('duration', tp) %>`        | Get duration                                                                          |
| `<% tp.user.youtube('description', tp) %>`     | Get short description                                                                 |
| `<% tp.user.youtube('descriptionFull', tp) %>` | Get full description                                                                  |
| `<% tp.user.youtube('id', tp) %>`              | Get ID (can be used in embeds)                                                        |

### [Goodreads](https://www.goodreads.com/)

| Function                                     | Description                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| `<% tp.user.goodreads('url', tp) %>`         | Get url                                                                           |
| `<% tp.user.goodreads('title', tp) %>`       | Get title                                                                         |
| `<% tp.user.goodreads('authors', tp) %>`     | Get authors (alternative formats: `authorsList`, `authorsQuotes`, `authorsLinks`) |
| `<% tp.user.goodreads('isbn', tp) %>`        | Get ISBN                                                                          |
| `<% tp.user.goodreads('published', tp) %>`   | Get publish date                                                                  |
| `<% tp.user.goodreads('genres', tp) %>`      | Get genres (alternative formats: `genresList`, `genresQuotes`, `genresLinks`)     |
| `<% tp.user.goodreads('cover', tp) %>`       | Get cover link                                                                    |
| `<% tp.user.goodreads('pageCount', tp) %>`   | Get number of pages                                                               |
| `<% tp.user.goodreads('description', tp) %>` | Get description                                                                   |
| `<% tp.user.goodreads('rating', tp) %>`      | Get rating                                                                        |

### [IMDb](https://www.imdb.com/)

| Function                                  | Description                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `<% tp.user.imdb('title', tp) %>`         | Get title                                                                                 |
| `<% tp.user.imdb('image', tp) %>`         | Get poster link                                                                           |
| `<% tp.user.imdb('published', tp) %>`     | Get publish date                                                                          |
| `<% tp.user.imdb('keywords', tp) %>`      | Get keywords (alternative formats: `keywordsList`, `keywordsQuotes`, `keywordsLinks`)     |
| `<% tp.user.imdb('directors', tp) %>`     | Get directors (alternative formats: `directorsList`, `directorsQuotes`, `directorsLinks`) |
| `<% tp.user.imdb('creators', tp) %>`      | Get creators (alternative formats: `creatorsList`, `creatorsQuotes`, `creatorsLinks`)     |
| `<% tp.user.imdb('duration', tp) %>`      | Get duration                                                                              |
| `<% tp.user.imdb('description', tp) %>`   | Get description                                                                           |
| `<% tp.user.imdb('type', tp) %>`          | Get type (movie/series)                                                                   |
| `<% tp.user.imdb('contentRating', tp) %>` | Get content rating                                                                        |
| `<% tp.user.imdb('genres', tp) %>`        | Get genres (alternative formats: `genresList`, `genresQuotes`, `genresLinks`)             |
| `<% tp.user.imdb('stars', tp) %>`         | Get cast (alternative formats: `starsList`, `starsQuotes`, `starsLinks`)                  |
| `<% tp.user.imdb('imdbRating', tp) %>`    | Get IMDb rating                                                                           |
| `<% tp.user.imdb('countries', tp) %>`     | Get countries (alternative formats: `countriesList`, `countriesQuotes`, `countriesLinks`) |
| `<% tp.user.imdb('url', tp) %>`           | Get url                                                                                   |

### [Letterboxd](https://letterboxd.com/)

| Function                                       | Description                                                                                    |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `<% tp.user.letterboxd('image', tp) %>`        | Get image link                                                                                 |
| `<% tp.user.letterboxd('directors', tp) %>`    | Get directors (alternative formats: `directorsList`, `directorsQuotes`, `directorsLinks`)      |
| `<% tp.user.letterboxd('studios', tp) %>`      | Get studios (alternative formats: `studiosList`, `studiosQuotes`, `studiosLinks`)              |
| `<% tp.user.letterboxd('published', tp) %>`    | Get publish date                                                                               |
| `<% tp.user.letterboxd('url', tp) %>`          | Get url                                                                                        |
| `<% tp.user.letterboxd('cast', tp) %>`         | Get cast (alternative formats: `castList`, `castQuotes`, `castLinks`)                          |
| `<% tp.user.letterboxd('castShort', tp) %>`    | Get cast shortlist (alternative formats: `castShortList`, `castShortQuotes`, `castShortLinks`) |
| `<% tp.user.letterboxd('title', tp) %>`        | Get title                                                                                      |
| `<% tp.user.letterboxd('genres', tp) %>`       | Get genres (alternative formats: `genresList`, `genresQuotes`, `genresLinks`)                  |
| `<% tp.user.letterboxd('countries', tp) %>`    | Get countries (alternative formats: `countriesList`, `countriesQuotes`, `countriesLinks`)      |
| `<% tp.user.letterboxd('rating', tp) %>`       | Get rating                                                                                     |
| `<% tp.user.letterboxd('description', tp) %>`  | Get description                                                                                |
| `<% tp.user.letterboxd('imdbUrl', tp) %>`      | Get IMDb link                                                                                  |
| `<% tp.user.letterboxd('tmdbUrl', tp) %>`      | Get TMDB link                                                                                  |
| `<% tp.user.letterboxd('languages', tp) %>`    | Get languages (alternative formats: `languagesList`, `languagesQuotes`, `languagesLinks`)      |
| `<% tp.user.letterboxd('writers', tp) %>`      | Get writers (alternative formats: `writersList`, `writersQuotes`, `writersLinks`)              |
| `<% tp.user.letterboxd('runtime', tp) %>`      | Get duration                                                                                   |
| `<% tp.user.letterboxd('altTitle', tp) %>`     | Get alternative title                                                                          |
| `<% tp.user.letterboxd('altTitleUTF8', tp) %>` | Get alternative title if it includes UTF8 only (e.g. no Chinese characters)                    |

### [Wikipedia](https://www.wikipedia.org/)

| Function                                  | Description           |
| ----------------------------------------- | --------------------- |
| `<% tp.user.wikipedia('title', tp) %>`    | Get title             |
| `<% tp.user.wikipedia('url', tp) %>`      | Get url               |
| `<% tp.user.wikipedia('image', tp) %>`    | Get image link        |
| `<% tp.user.wikipedia('headline', tp) %>` | Get short description |

### [Odysee](https://odysee.com/)

| Function                                  | Description                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `<% tp.user.odysee('title', tp) %>`       | Get title                                                                             |
| `<% tp.user.odysee('channel', tp) %>`     | Get channel name                                                                      |
| `<% tp.user.odysee('description', tp) %>` | Get description                                                                       |
| `<% tp.user.odysee('published', tp) %>`   | Get publish date                                                                      |
| `<% tp.user.odysee('thumbnail', tp) %>`   | Get thumbnail link                                                                    |
| `<% tp.user.odysee('duration', tp) %>`    | Get duration                                                                          |
| `<% tp.user.odysee('url', tp) %>`         | Get Odysee url                                                                        |
| `<% tp.user.odysee('contentUrl', tp) %>`  | Get direct link to a video                                                            |
| `<% tp.user.odysee('embedUrl', tp) %>`    | Get embed url                                                                         |
| `<% tp.user.odysee('keywords', tp) %>`    | Get keywords (alternative formats: `keywordsList`, `keywordsQuotes`, `keywordsLinks`) |
