console.log("addMoviePage.js is loaded");

let addMovieButton = document.getElementById("addMovieButton");
addMovieButton.addEventListener("click", addMovie);

let genresParam = document.getElementsByClassName("genresParam");
for(x of genresParam) x.addEventListener("blur", validateGenre);

let actorsParam = document.getElementsByClassName("actorsParam");
for(x of actorsParam) x.addEventListener("blur", validatePerson);

let writersParam = document.getElementsByClassName("writersParam");
for(x of writersParam) x.addEventListener("blur", validatePerson);

let directorsParam = document.getElementsByClassName("directorsParam");
for(x of directorsParam) x.addEventListener("blur", validatePerson);

let _genres = [];
let _directors = [];
let _actors = [];
let _writers = [];

function addMovie(){
	console.log("addMovie");
	
	let _title = document.getElementById("nameParam").value.trim();
	let _released = document.getElementById("releaseDateParam").value.trim();
	let _runtime = document.getElementById("runtimeParam").value.trim();
	let _rating = document.getElementById("ratingParam").value.trim();
	let _plot = document.getElementById("plotParam").value.trim();
	let _awards = document.getElementById("awardsParam").value.trim();
	
	let movie = {};
	movie.title = _title;
	movie.rated = _rating;
	movie.released = _released;
	movie.runtime = _runtime;
	movie.directors = _directors;
	movie.actors = _actors;
	movie.writer = _writers;
	movie.genre = _genres;
	movie.plot = _plot;
	movie.awards = _awards;
	
	console.log(movie);
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 500){ 
			alert("Error saving movie. Please fill in all the parameters.");
		}
		
		if (this.readyState == 4 && this.status == 201){ 
			alert("Saved");
			let id = this.response.substring(1, this.response.length - 1);
			window.location.href= "/movies/" + id;
		}
	};

	xhttp.open("post", "/movies", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(movie));
}

function validateGenre(){
	let input = this.value.trim();
	let found = false;
	
	let allGenres = Array.from(document.querySelector("#allGenres").options);
	for (g of allGenres){
		if(g.text == input) {
			let err = pushData(this, g.text);
			if(err){
				alert("Can not add duplicate");
				this.value = "";
				return;
			}
			found = true;
			break;
		}
	}
	
	
	if (!found){
		this.value = '';
		return;
	}
	
	createButton(this);
}

function validatePerson(){
	let input = this.value.trim();
	let found = false;
	
	let allPpl = Array.from(document.querySelector("#allPeople").options);
	for (p of allPpl){
		if(p.text == input) {
			let err = pushData(this, p.id);
			if(err){
				alert("Can not add duplicate");
				this.value = "";
				return;
			}
			found = true;
			break;
		}
	}
	
	if(!found){
		this.value = "";
		return;
	}
	
	createButton(this);
}

function pushData(obj, val){
	if(
	  (obj.className == "directorsParam" && _directors.includes(val)) ||
	  (obj.className == "writersParam" && _writers.includes(val)) ||
	  (obj.className == "actorsParam" && _actors.includes(val)) ||
	  (obj.className == "genresParam" && _genres.includes(val))
	  ) return true;
	
	if(obj.className == "directorsParam") _directors.push(val);
	if(obj.className == "writersParam") _writers.push(val);
	if(obj.className == "actorsParam") _actors.push(val);
	if(obj.className == "genresParam") _genres.push(val);
	return false;
}

function createButton(obj){
	let btn = document.createElement("button");
	btn.setAttribute('class', 'addAnother');
	btn.setAttribute('type', 'button');
	btn.innerHTML = "Add Another";
	btn.addEventListener('click', ()=> addAnother(obj, btn));
	
	let _form = document.getElementById("addItemForm");
	let i = find(_form, obj) + 1;
	_form.insertBefore(btn, _form.childNodes[i]);
}

function find(container, obj){
	let ans = -1;
	let i = 0;
	for(x of container.childNodes){
		if(x == obj) ans=i;
		i++;
	}
	return ans;
}

function addAnother(obj, btn){
	let newObj = document.createElement('input');
	newObj.setAttribute('class', obj.className);
	newObj.setAttribute('type', 'text');
	newObj.setAttribute('placeholder', obj.placeholder);
	newObj.setAttribute('list', obj.list.id);
	if(newObj.className == 'genresParam') newObj.addEventListener('blur', validateGenre);
	else newObj.addEventListener('blur', validatePerson);
	
	let br = document.createElement('br');
	let _form = document.getElementById("addItemForm");
	let i = find(_form, obj) + 1;
	_form.insertBefore(br, _form.childNodes[i]);
	_form.insertBefore(newObj, _form.childNodes[i+1]);
	
	btn.remove();
}

