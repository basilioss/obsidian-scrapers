<%* 
let clipboard = await tp.system.clipboard();
clipboard = clipboard.trim(); // remove whitespace from both ends
let urlExpression = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gmi;
let urlRegex = new RegExp(urlExpression);

if (clipboard.includes("/www.youtube.com/")) {
  // Insert YouTube template
  tR += await tp.file.include("[[youtube]]");
} else if (clipboard.includes("/youtu.be/")) {
  tR += await tp.file.include("[[youtube]]");
} else if (clipboard.includes("/yewtu.be/")) {
  // Alternative YouTube front-end (invidious.io)
  tR += await tp.file.include("[[youtube]]");
} else if (clipboard.includes("/www.goodreads.com/")) {
  tR += await tp.file.include("[[goodreads]]");
} else if (clipboard.includes("/www.imdb.com/")) {
  tR += await tp.file.include("[[imdb]]");
} else if (clipboard.includes("/letterboxd.com/")) {
  tR += await tp.file.include("[[letterboxd]]");
} else if (clipboard.includes("wikipedia.org/")) {
  tR += await tp.file.include("[[wikipedia]]");
} else if (clipboard.includes("/odysee.com/")) {
  tR += await tp.file.include("[[odysee]]");
} else if (clipboard.match(urlRegex)) {
  tR += await tp.file.include("[[website]]");
} else {
  new Notice("No link in the clipboard");
}
%>
