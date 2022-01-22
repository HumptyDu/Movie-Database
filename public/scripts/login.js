console.log("login.js loaded");

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", login);
let registerButton = document.getElementById("registerButton");
registerButton.addEventListener("click", register);

function login(){
	console.log('login');
	
	//extracting username and password to send to server
	
	let username = document.getElementById("usernameInput").value;
	let password  = document.getElementById("passwordInput").value;
	
	if(username.trim() === "" || password.trim() === "") {
		alert("You must insert a username & password!");
		document.getElementById("usernameInput").value = "";
		document.getElementById("passwordInput").value = "";
		return;
	}
	
	let user = {"username": username, "password": password};
	
	//sending a POST /login request to login
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			window.location.href = "/users/" + username;
			alert("Successfuly signed in!");
		}
		if (this.readyState == 4 && this.status == 404){
			alert("No such username exists.");
			document.getElementById("usernameInput").value = "";
			document.getElementById("passwordInput").value = "";
		}
		if (this.readyState == 4 && this.status == 303){
			alert("Incorrect password.");
			document.getElementById("usernameInput").value = "";
			document.getElementById("passwordInput").value = "";
		}
		
	};

	xhttp.open("POST", "/login", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(user));
	
	
};

function register(){
	console.log("register");
	
	
	
	//extracting data and sending user
	
	let username = document.getElementById("usernameInput").value;
	let password  = document.getElementById("passwordInput").value;
	
	if(username.trim() === "" || password.trim() === "") {
		alert("You must insert a username & password!");
		document.getElementById("usernameInput").value = "";
		document.getElementById("passwordInput").value = "";
		return;
	}
	
	let user = {"username": username, "password": password};
	
	//sending a POST /users request to create a user
	
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 201){ 
			window.location.href = "/users/" + username;
			alert("Successfuly registed!");
		}
		if (this.readyState == 4 && this.status == 500){
			alert("Username already exists!");
			document.getElementById("usernameInput").value = "";
			document.getElementById("passwordInput").value = "";
		}
	};

	xhttp.open("POST", "/users", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(user));
	
	
};