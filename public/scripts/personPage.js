console.log("personPage.js loaded");

let followButton = document.getElementById("toggleFollowButton");
followButton.addEventListener('click', follow);

function follow(){
	console.log("follow");
	
	let person = {id: filterName()};
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){ 
			inverse(followButton);
		}
	};

	xhttp.open("put", "/users/togglePersonFollowing", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(person));
}

function filterName(){
	let url = location.href;
	let s = url.slice("http://localhost:3000/people/".length); // s = person param
	s = s.replace(/%20/g, " "); //removes all '%20' replacing with " "
	return s;
}

function inverse(){
	if(followButton.innerHTML == "Follow") followButton.innerHTML = "Unfollow";
	else followButton.innerHTML = "Follow";
}