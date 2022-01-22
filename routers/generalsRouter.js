const express = require('express');
let router = express.Router();
let User = require("../models/userModel");
let Movie = require("../models/movieModel");
let Person = require("../models/personModel");

router.get("/", (req, res, next) => {
	loggedIn = validateLogin(req);
	Movie.findTrending((err, result) => {
		if(err){
			res.status(500).send("Internal server error");
			console.log(err);
			return;
		}

		let trending = result;

		User.obtain(req.session.username, (err2, result2) => {
			console.log("Finding user...");
			if(err2){
				res.status(500).send("Internal server error");
				console.log(err);
				return;
			}

			let curUser = result2;
			console.log(curUser);
			console.log(curUser.recommendedMovies);
		})
		
		res.render("index", {loggedIn, username: req.session.username, trending});
		next();
	});
});

router.get("/login", (req, res, next) => {
	loggedIn = validateLogin(req);
	res.render("login", {loggedIn: loggedIn, username: req.session.username}); 
	next();
});

router.post("/signOut", (req, res, next) => {
	req.session.destroy();
	res.status(200).send();
	next();
});

router.post("/login", (req, res, next) => {
	User.find({username: req.body.username}, (err, result) => {
		if(err) {
			res.status(500).send("Error processing request");
			return;
		}
		if(result.length !== 1){ //either no username matches or more than 1 users share the same username (oops)
			res.status(404).send("No user found (or somehow more than 1 user are found)");
			return;
		}
		if(result[0].password != req.body.password){ //username found but passwords don't match
			res.status(303).send("Invalid password");
			return;
		}
		req.session.username = req.body.username;
		req.session.contributing = result[0].contributing;
		res.status(200).send();
	});
	
});

router.get("/search", (req, res, next) => {
	loggedIn = validateLogin(req);
	res.render("searchPage", {loggedIn: loggedIn, username: req.session.username}); 
	next();
});

router.get("/searchresults", (req, res, next) => {
	loggedIn = validateLogin(req);
	
	let length;
	Movie.search(req.query.title,req.query.genre, req.query.actor, req.query.page, req.query.limit, length, (err, result) =>{
		if(err){
			console.log(err);
			res.status(500).send("Internal server error");
			return;
		}
		
		result = result.filter(movie => movie.actors.length > 0);
		
		res.format({
			"text/html": () => {res.render("searchResultPage", {results: result, loggedIn: loggedIn, username: req.session.username, page: req.query.page, limit: req.query.limit})},
			"application/json": () => {res.json(res.users)}
		});
		
		
	});
	
});

router.get("/contribute", (req, res, next) => {
	loggedIn = validateLogin(req);
	if(!loggedIn){
		res.render("pleaseLogInPage", {message: "Please login / register", username: req.session.username});
		return;
	}
	
	if(req.session.contributing == false){
		res.render("pleaseLogInPage", {message: "You must be a contributor to access this page", username: req.session.username});
		return;
	}
	res.render("contributePage", {loggedIn: loggedIn, username: req.session.username}); 
	next();
});

router.get("/addmovie", (req, res, next) => {
	loggedIn = validateLogin(req);
	if(!loggedIn){
		res.render("pleaseLogInPage", {loggedIn: loggedIn, username: req.session.username});
		return;
	}
	
	if(req.session.contributing == false){
		res.status(401).send("You must be a contributor to access this page");
		return;
	}
	
	Person.find((err, result) =>{
		if(err){
			res.status(500).send("Error obtaining people");
			return;
		}
		
		let people = result;
		
		Movie.distinct('genre', (err, result) => {
			if(err){
				res.status(500).send("Error obtaining movies");
			}
			
			let genres = result;
			
			res.render("addMoviePage", {loggedIn: loggedIn, username: req.session.username, genres: genres, people: people}); 
		});
	});
	
});

router.get("/addperson", (req, res, next) => {
	loggedIn = validateLogin(req);
	
	if(!loggedIn){
		res.render("pleaseLogInPage", {loggedIn: loggedIn, username: req.session.username});
		return;
	}
	
	if(req.session.contributing == false){
		res.status(401).send("You must be a contributor to access this page");
		return;
	}
	
	Person.find((err, result) =>{
		if(err){
			res.status(500).send("Error obtaining people");
			return;
		}
		
		let people = result;
		
		Movie.find((err, result) => {
			if(err){
				res.status(500).send("Error obtaining movies");
			}
			
			let movies = result;
			
			res.render("addPersonPage", {loggedIn: loggedIn, username: req.session.username, movies: movies, people: people}); 
		});
	});
	
});

router.delete("/notification/", (req, res, next) => {
	User.deleteNotification(req.session.username, req.body.text, (err, result) =>{
		if(err){
			res.status(500).send("Internal server error");
			return;
		}
		
		res.status(204).send();
	})
});

function validateLogin(req){
	if(req.session.username) return true;
	return false;
}

module.exports = router;