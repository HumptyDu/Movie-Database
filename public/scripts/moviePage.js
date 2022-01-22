console.log("moviePage.js loaded");
try{
	let addToWatchedButton = document.getElementById("addToWatchedButton");
	addToWatchedButton.addEventListener('click', addToWatched);
}
catch{}

try{
	let prevButton = document.getElementById("prevButton");
	prevButton.addEventListener('click', prev);
	let nextButton = document.getElementById("nextButton");
	nextButton.addEventListener('click', next);
}
catch{}

try{
	let submitReviewButton = document.getElementById("submitReview");
	submitReviewButton.addEventListener('click', submitReview);
}
catch{}

function addToWatched(){
	console.log("Add to watched");
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			inverse(addToWatchedButton);
		}
	};

	xhttp.open("PUT", "/users/toggleWatched", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({id: filter(location.href)}));
}

function prev(){
	console.log("prev");
}

function next(){
	console.log("next");
}

function submitReview(){
	console.log("Submit review");
	/*----Extrating review data from page----*/
	let review = {};
	review.title = document.getElementById("nameText").value.trim();
	review.score = Number(document.getElementById("userRating").value);
	review._text = document.getElementById("reviewText").value.trim();
	review.movie = filter(location.href);
	review.date  = Date();
	console.log(review);
	/*---------------------------------------*/
	
	
	/*----Sending request with review----*/
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 505){
			alert("Invalid review");
		}
		
		if (this.readyState == 4 && this.status == 200){
			location.reload();
		}
	};

	xhttp.open("POST", "/reviews/", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(review));
}

function filter(url){
	let s = url.slice("http://localhost:3000/movies/".length); // s = movie id
	s = s.replace(/%20/g, " "); //removes all '%20' replacing with " "
	return s;
}

function inverse(elem){
	console.log("Inner htmtl: " + elem.innerHTML);
	
	elem.innerHTML == "Add to watched" ? elem.innerHTML = "Unwatch": elem.innerHTML = "Add to watched";
}