---
<%*
// Request a web page to speed up execution time
let page = await tp.obsidian.request(await tp.system.clipboard())
let doc = new DOMParser().parseFromString(page,"text/html")

let title = await tp.user.letterboxd('title', tp, doc)
let altTitle = await tp.user.letterboxd('altTitle', tp, doc)
-%>
aliases: <%* altTitle == "" ? tR += '["' + title + '"]' : tR += '["' + title + '", "' + altTitle + '"]' %>
url: "<% tp.user.letterboxd('url', tp, doc) %>"
imdb-url: <% tp.user.letterboxd('imdbUrl', tp, doc) %>
tmdb-url: <% tp.user.letterboxd('tmdbUrl', tp, doc) %>
rating: <% tp.user.letterboxd('rating', tp, doc) %>
runtime: <% tp.user.letterboxd('runtime', tp, doc) %>
year: <% tp.user.letterboxd('published', tp, doc) %> 
genres: [<% tp.user.letterboxd('genresQuotes', tp, doc) %>]
directors: [<% tp.user.letterboxd('directorsQuotes', tp, doc) %>]
studios: [<% tp.user.letterboxd('studiosQuotes', tp, doc) %>]
countries: [<% tp.user.letterboxd('countriesQuotes', tp, doc) %>]
languages: [<% tp.user.letterboxd('languagesQuotes', tp, doc) %>]
writers: [<% tp.user.letterboxd('writersQuotes', tp, doc) %>]
cast: [<% tp.user.letterboxd('castShortQuotes', tp, doc) %>]
---

# <% tp.user.letterboxd('title', tp, doc) %>

## Image

![](<% tp.user.letterboxd('image', tp, doc) %>)

## Description

<% tp.user.letterboxd('description', tp, doc) %>

## Genres

<% tp.user.letterboxd('genres', tp, doc) %>

Links: <% tp.user.letterboxd('genresLinks', tp, doc) %>

List:
<% tp.user.letterboxd('genresL', tp, doc) %>

## Directors

<% tp.user.letterboxd('directors', tp, doc) %>

Links: <% tp.user.letterboxd('directorsLinks', tp, doc) %>

List:
<% tp.user.letterboxd('directorsList', tp, doc) %>

## Studios

<% tp.user.letterboxd('studios', tp, doc) %>

Links: <% tp.user.letterboxd('studiosLinks', tp, doc) %>

List:
<% tp.user.letterboxd('studiosList', tp, doc) %>

## Countries

<% tp.user.letterboxd('countries', tp, doc) %>

Links: <% tp.user.letterboxd('countriesLinks', tp, doc) %>

List:
<% tp.user.letterboxd('countriesList', tp, doc) %>

## Languages

<% tp.user.letterboxd('languages', tp, doc) %>

Links: <% tp.user.letterboxd('languagesLinks', tp, doc) %>

List:
<% tp.user.letterboxd('languagesList', tp, doc) %>

## Writers

<% tp.user.letterboxd('writers', tp, doc) %>

Links: <% tp.user.letterboxd('writersLinks', tp, doc) %>

List:
<% tp.user.letterboxd('writersList', tp, doc) %>

## Cast (shortlist)

<% tp.user.letterboxd('castShort', tp, doc) %>

Links: <% tp.user.letterboxd('castShortLinks', tp, doc) %>

List:
<% tp.user.letterboxd('castShortList', tp, doc) %>

## Cast

<% tp.user.letterboxd('cast', tp, doc) %>

Links: <% tp.user.letterboxd('castLinks', tp, doc) %>

List:
<% tp.user.letterboxd('castList', tp, doc) %>

<%* 
let filename = title
// Remove prohibited characters
filename = filename.replace(/[/\:*?<>|""]/g, "")
// Rename a note
await tp.file.move(filename)
-%>
