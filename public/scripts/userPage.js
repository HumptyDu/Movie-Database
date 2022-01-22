console.log("selfPage.js is loaded");

try{
	let toggleContributorButton = document.getElementById("toggleContributorButton");
	toggleContributorButton.addEventListener("click", toggleContributor);
}
catch(err){}

try{
	let toggleFollowButton = document.getElementById("toggleUserFollowing");
	toggleFollowButton.addEventListener('click', toggleFollow);
}
catch(err){}

try{
	let unfollowUserButton = document.getElementsByClassName("unfollowUserButton");
	for(x of unfollowUserButton)x.addEventListener("click", toggleFollow);
}
catch(err){}

try{
	let unfollowPersonButton = document.getElementsByClassName("unfollowPersonButton");
	for(x of unfollowPersonButton)x.addEventListener("click", unfollowPerson);
}
catch(err){}

try{
	let dismissButton = document.getElementsByClassName("dismissButton");
	for(x of dismissButton) x.addEventListener("click", dismiss);
}
catch(err){}

function toggleContributor(){
	console.log("toggleContributor");
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			location.reload();
		}
	};

	xhttp.open("PUT", "/users/toggleContributor", true);
	xhttp.send();
}

function unfollowUser(){
	console.log("unfollowUser");
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			alert("recieved server input");
			location.reload();
		}
	};

	xhttp.open("PUT", "/users/toggleUserFollowing", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({username: this.getAttribute("id")}));
}

function unfollowPerson(){
	console.log("unfollowPerson");
	
	let person = {id: this.id};
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			location.reload();
		}
	};

	xhttp.open("PUT", "/users/togglePersonFollowing", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(person));
}

function toggleFollow(){
	console.log("toggleFollow");
	let id;
	let un;
	let self;

	document.getElementById("toggleUserFollowing") != null ? self = false : self = true;

	if(!self){
		id = document.getElementById("username").getAttribute("_id");
		un = document.getElementById("username").getAttribute("username");
	}
	else{
		id = this.getAttribute("_id");
		un = this.getAttribute("username");
	}

	let user = {_id: id, username: un};
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			console.log("something");
			location.reload();
		}
	};

	xhttp.open("PUT", "/users/toggleUserFollowing", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(user));
}

function dismiss(){
	console.log("dismiss");
	
	let noti = {"text": this.id};
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 204){
			location.reload();
		}
	};

	xhttp.open("delete", "/notification/", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(noti));
	
}

function filterName(url){
	let s = url.slice("http://localhost:3000/users/".length); // s = user param
	s = s.replace(/%20/g, " "); //removes all '%20' replacing with " "
	return s;
}

function inverse(elem){
	if(elem.innerHTML == "Follow") elem.innerHTML = "Unfollow";
	else elem.innerHTML = "Follow";
}