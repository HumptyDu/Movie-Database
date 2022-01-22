console.log("SEARCHPAGE.JS");

searchButton = document.getElementById("search");
searchButton.addEventListener("click", search);

function search(){
	title = document.getElementById("titleParam").value.trim();
	genre = document.getElementById("genreParam").value.trim();
	actor = document.getElementById("actorParam").value.trim();
	
	let path = "/searchresults?"// + title + "&genre=" + genre + "&actor=" + actor+"&page=1";
	if(title!="") path += "title=" + title + "&";
	if(genre!="") path += "genre=" + genre + "&";
	if(actor!="") path += "actor=" + actor + "&";
	path += "page=1&limit=10"; 
	window.location.href = path;
};
