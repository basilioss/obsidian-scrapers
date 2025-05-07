---
<%*
// Request a web page to speed up execution time
let page = await tp.obsidian.request(await tp.system.clipboard())
let doc = new DOMParser().parseFromString(page,"text/html")

let title = await tp.user.imdb('title', tp, doc)
-%>
url: "<% tp.user.imdb('url', tp, doc) %>"
imdb-rating: <% tp.user.imdb('imdbRating', tp, doc) %>
content-rating: <% tp.user.imdb('contentRating', tp, doc) %>
duration: <% tp.user.imdb('duration', tp, doc) %>
year: <% tp.user.imdb('published', tp, doc) %> 
type: <% tp.user.imdb('type', tp, doc) %>
genres: [<% tp.user.imdb('genresQuotes', tp, doc) %>]
keywords: [<% tp.user.imdb('keywordsQuotes', tp, doc) %>]
directors: [<% tp.user.imdb('directorsQuotes', tp, doc) %>]
creators: [<% tp.user.imdb('creatorsQuotes', tp, doc) %>]
cast: [<% tp.user.imdb('starsQuotes', tp, doc) %>]
countries: [<% tp.user.imdb('countriesQuotes', tp, doc) %>]
---

# <% title %>

## Image

![](<% tp.user.imdb('image', tp, doc) %>)

## Description

<% tp.user.imdb('description', tp, doc) %>

## Genres

- <% tp.user.imdb('genres', tp, doc) %>
- Links: <% tp.user.imdb('genresLinks', tp, doc) %>

List:
<% tp.user.imdb('genresList', tp, doc) %>

## Keywords

- <% tp.user.imdb('keywords', tp, doc) %>
- Links: <% tp.user.imdb('keywordsLinks', tp, doc) %>

List:
<% tp.user.imdb('keywordsList', tp, doc) %>

## Directors

- <% tp.user.imdb('directors', tp, doc) %>
- Links: <% tp.user.imdb('directorsLinks', tp, doc) %>

List:
<% tp.user.imdb('directorsList', tp, doc) %>

## Creators

- <% tp.user.imdb('creators', tp, doc) %>
- Links: <% tp.user.imdb('creatorsLinks', tp, doc) %>

List:
<% tp.user.imdb('creatorsList', tp, doc) %>

## Countries

- <% tp.user.imdb('countries', tp, doc) %>
- Links: <% tp.user.imdb('countriesLinks', tp, doc) %>

List:
<% tp.user.imdb('countriesList', tp, doc) %>

## Cast

- <% tp.user.imdb('stars', tp, doc) %>
- Links: <% tp.user.imdb('starsLinks', tp, doc) %>

List:
<% tp.user.imdb('starsList', tp, doc) %>

<%* 
let filename = title
// Remove prohibited characters
filename = filename.replace(/[/\:*?<>|""]/g, "")
// Rename a note
await tp.file.move(filename)
-%>
