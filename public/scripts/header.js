console.log("header.js is loaded");

try{
	let signOutButton = document.getElementById("signOut");
	signOutButton.addEventListener("click", signOut);
	console.log("Current user is online.");
}
catch(err){
	console.log("Current user is offline.");
}

function signOut(){	
	console.log("signOut");
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){ 
			window.location.href = "/";
			alert("Successfuly signed out!");
		}
	};

	xhttp.open("post", "/signOut", true);
	xhttp.send();
}
