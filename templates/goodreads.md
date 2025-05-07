---
<%*
// Request a web page to speed up execution time
let page = await tp.obsidian.request(await tp.system.clipboard())
let doc = new DOMParser().parseFromString(page,"text/html")

let title = await tp.user.goodreads('title', tp, doc)
-%>
url: "<% tp.user.goodreads('url', tp, doc) %>"
isbn: <% tp.user.goodreads('isbn', tp, doc) %>
published: <% tp.user.goodreads('published', tp, doc) %>
pages: <% tp.user.goodreads('pageCount', tp, doc) %>
ratings: <% tp.user.goodreads('rating', tp, doc) %>
authors: [<% tp.user.goodreads('authorsQuotes', tp) %>]
genres: [<% tp.user.goodreads('genresQuotes', tp, doc) %>]
---

# <% title %>

![](<% tp.user.goodreads('cover', tp, doc) %>)

## Description

<% tp.user.goodreads('description', tp, doc) %>

## Authors

<% tp.user.goodreads('authors', tp) %>

Links: <% tp.user.goodreads('authorsLinks', tp) %>

List:
<% tp.user.goodreads('authorsList', tp) %>

## Genres

<% tp.user.goodreads('genres', tp) %>

Links: <% tp.user.goodreads('genresLinks', tp) %>

List:
<% tp.user.goodreads('genresList', tp) %>

<%* 
let filename = title
// Remove prohibited characters
filename = filename.replace(/[/\:*?<>|""]/g, "")
// Rename a note
await tp.file.move(filename)
-%>
