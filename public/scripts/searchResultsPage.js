console.log("searchResultsPage.js loaded");
try{
	let prevButton = document.getElementById("prevPage");
	prevButton.addEventListener('click', loadPrevPage);
}
catch{}

try{
	let nextButton = document.getElementById("nextPage");
	nextButton.addEventListener('click', loadNextPage);
}
catch{}

function loadNextPage(){
	console.log("nextPage");
	window.location.href= getDestURL("next");
}

function loadPrevPage(){
	console.log("prevPage");
	window.location.href = getDestURL("prev");
}

function getDestURL(dest){
	let path = new URLSearchParams(window.location.search);
	let page = path.get('page');
	
	if(dest == "next") page++;
	if(dest == "prev") page--;
	path.set('page', page);
	
	let strpath = path.toString();
	console.log(strpath);
	return "/searchresults?" + strpath;
}