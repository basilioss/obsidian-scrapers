---
<%*
// Request a web page to speed up execution time
let page = await tp.obsidian.request(await tp.system.clipboard())
let doc = new DOMParser().parseFromString(page,"text/html")

let title = await tp.user.odysee('title', tp, doc)
-%>
channel: "<% tp.user.odysee('channel', tp, doc) %>"
published: <% tp.user.odysee('published', tp, doc) %>
url: "<% tp.user.odysee('url', tp, doc) %>"
content-url: "<% tp.user.odysee('contentUrl', tp, doc) %>"
duration: <% tp.user.odysee('duration', tp, doc) %>
keywords: [<% tp.user.odysee('keywordsQ', tp, doc) %>]
---

# <% title %>

## Thumbnail

![](<% tp.user.odysee('thumbnail', tp, doc) %>)

## Keywords

<% tp.user.odysee('keywords', tp, doc) %>

Links: <% tp.user.odysee('keywordsW', tp, doc) %>

List:
<% tp.user.odysee('keywordsL', tp, doc) %>

## Description

<% tp.user.odysee('description', tp, doc) %>

<%* 
let filename = title
// Remove prohibited characters
filename = filename.replace(/[/\:*?<>|""]/g, "")
// Rename a note
await tp.file.move(filename)
-%>
