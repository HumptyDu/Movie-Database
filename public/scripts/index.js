console.log("index.js loaded");

let prevButton = document.getElementById("prev");
prevButton.addEventListener('click', prev);
let nextButton = document.getElementById("next");
nextButton.addEventListener('click', next);

function prev(){
	console.log("prev");
	move(-1);
}

function next(){
	console.log("next");
	move(1);
}

function move(n){
	let url = document.getElementById("link");
	let poster = document.getElementById("poster");
	
	let article = document.querySelector('#trendingData');
	let trending = JSON.parse(article.dataset.trending);
	let i = parseInt(article.dataset.index);
	
	let x = (i+n)%trending.length;
	if(x==-1) x=trending.length-1;
	
	url.href = "/movies/" + trending[x]._id;
	poster.src = trending[x].poster;
	
	article.dataset.index = x;
}