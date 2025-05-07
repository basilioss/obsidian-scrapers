---
<%*
// Request a web page to speed up execution time
let page = await tp.obsidian.request(await tp.system.clipboard())
let doc = new DOMParser().parseFromString(page,"text/html")

let title = await tp.user.youtube('title', tp, doc)
-%>
channel: "<% tp.user.youtube('channel', tp, doc) %>"
published: <% tp.user.youtube('published', tp, doc) %>
url: "<% tp.user.youtube('url', tp, doc) %>"
duration: <% tp.user.youtube('duration', tp, doc) %>
id: <% tp.user.youtube('id', tp, doc) %>
keywords: [<% tp.user.youtube('keywordsQuotes', tp, doc) %>]
---

# <% title %>

## Thumbnail

![](<% tp.user.youtube('thumbnail', tp, doc) %>)

## Keywords

<% tp.user.youtube('keywords', tp, doc) %>

Links: <% tp.user.youtube('keywordsLinks', tp, doc) %>

List:
<% tp.user.youtube('keywordsList', tp, doc) %>

## Description

<% tp.user.youtube('description', tp, doc) %>

## Full description

<% tp.user.youtube('descriptionFull', tp, doc) %>

<%* 
let filename = title
// Remove prohibited characters
filename = filename.replace(/[/\:*?<>|""]/g, "")
// Rename a note
await tp.file.move(filename)
-%>
