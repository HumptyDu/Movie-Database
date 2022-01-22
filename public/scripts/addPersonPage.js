console.log("addPersonPage.js is loaded");

let addPersonButton = document.getElementById("addPersonButton");
addPersonButton.addEventListener("click", addPerson);

function addPerson(){
	let name = document.getElementById("nameParam").value.trim();
	if(name==""){
		alert("Can not add an empty person!");
		document.getElementById("nameParam").value = "";
		return;
	}
	
	let person = {"name": name};
	
	/*--Sends request to server--*/
	let xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){ 
			let id = this.response.substring(1, this.response.length - 1);
			window.location.href = "/people/" + id;
		}
		
		if (this.readyState == 4 && this.status == 409){ 
			alert("Person already exists! ");
			document.getElementById("nameParam").value = "";
		}
	};

	xhttp.open("post", "/people", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(person));
}