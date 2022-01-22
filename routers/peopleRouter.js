const express = require('express');
let app = express();
let router = express.Router();

let User = require("../models/userModel");
let Person = require("../models/personModel");

router.get("/:pID", (req, res, next) => {
	/*res.format({
		//"text/html": () => {res.render("personPage", {person: result[0], loggedIn: loggedIn, username: req.session.username})},
		"application/json": () => {res.json(res.users)}
	});*/
	
	loggedIn = validateLogin(req);
	

	if(!loggedIn){
	
		Person.obtain(req.params.pID, (err, result) => {
			if(err){
				res.status(500).send("Internal server error");
				return;
			}
			
			if (result.length !== 1){
				console.log("invalid size");
				res.status(500).send("Internal server error");
				return;
			}
			
			res.format({
				"text/html": () => {res.render("personPage", {person: result[0], loggedIn: loggedIn, username: req.session.username})},
				"application/json": () => {res.json(res.users)}
			});
		
		});
	}
	
	//Current user is searched to load following functionality
	else{
		User.obtain(req.session.username, (err, result) => {
			if(err){
				console.log(err);
				res.status(500).send("Internal server error");
				return;
			}
			
			if(result.length !== 1){
				res.status(500).send("Internal server error");
				return;
			}
			
			let user = result[0];
			let followed;
			if(user.pplFollowing.includes(req.params.pID)) followed = true;
			else followed = false;

			Person.obtain(req.params.pID, (err, result) => {
				if(err){
					res.status(500).send("Internal server error");
					return;
				}
				if (result.length !== 1){
					console.log("invalid size");
					res.status(500).send("Internal server error");
					return;
				}
				res.format({
					"text/html": () => {res.render("personPage", {person: result[0], loggedIn: loggedIn, username: req.session.username, followed: followed})},
					"application/json": () => {res.json(res.users)}
				});
			});
			/*res.format({
				"text/html": () => {res.render("personPage", {person: examplePerson, followed: followed, loggedIn: loggedIn, username: req.session.username})},
				"application/json": () => {res.json(res.users)}
			});*/
		});
	}
	
});

router.post("/", (req, res, next) => {
	loggedIn = validateLogin(req);
	
	let person = new Person();
	person.name = req.body.name;
	
	Person.findExact(req.body.name, (err, result) => {
		if(err){
			res.status(500).send("Internal server error");
			return;
		}
		
		if(result !== null){
			res.status(409).send("Person already exists");
			return;
		}
		
		//console.log(result);
		person.save((err, result) => {
			if(err){
				res.status(500).send("Internal server error");
				return;
			}
			
			res.status(200).send(result._id);
		});
		
		return;
	})
	
});

function validateLogin(req){
	if(req.session.username) return true;
	return false;
}

let examplePerson = {
	"Name" : "Robin Williams",
	"FrequentCollaborators" : ["George Roy Hill", "Barry Levinson", "Mark Johnson", "Tony Thomas"],
	"WorkHistory" : {"Actor" : [{name: "Popeye", id: 34}, {name: "The World According to Garp", id: 69}, {name: "Moscow on the Hudson", id: 73}, {name: "Good Mornng, Vietnam", id : 1231}, {name: "Good Will Hunting", id: 1231}]},
};

module.exports = router;