const express = require('express');
let router = express.Router();
let Movie = require("../models/movieModel");
let User = require("../models/userModel");

let nextMovieId  = 689;

router.get("/:mID", (req, res, next) => {
	loggedIn = validateLogin(req);
	
	Movie.obtain(req.params.mID, (err, result) =>{
		if(err){
			res.status(500).send("Internal server error");
			return;
		}
		
		if(result.length != 1){
			res.status(500).send("Internal server error");
			return;
		}
		
		let movie = result[0];
		
		movie.populate({path: 'actors writers directors reviews', select: 'name user movie score title _text date'}, (err, result) =>{
			if(!loggedIn){
				Movie.findSimilar(movie.title, movie.genre[0], (err, result) =>{
					if(err){
						res.status(500).send("Internal server error");
						return;
					}
					
					movie.similarMovies = result;
					
					res.format({
						"text/html": () => {res.render("moviePage", {movie: movie, loggedIn: loggedIn, username: req.session.username})},
						"application/json": () => {res.json(res.users)}
					});
				})
				
				/*res.format({
					"text/html": () => {res.render("moviePage", {movie: movie, loggedIn: loggedIn, username: req.session.username})},
					"application/json": () => {res.json(res.users)}
				});*/
				return;
			}
			
			User.obtain(req.session.username, (err, result) => {
				if(err){
					res.status(500).send("Internal server error");
					return;
				}
				
				let watched;
				result[0].moviesWatched.includes(movie._id) ? watched = true : watched = false;
				
				let reviewed;
				
				Movie.findSimilar(movie.title, movie.genre[0], (err, result) =>{
					if(err){
						res.status(500).send("Internal server error");
						return;
					}
					
					movie.similarMovies = result;
					
					res.format({
						"text/html": () => {res.render("moviePage", {movie: movie, loggedIn: loggedIn, username: req.session.username, watched: watched})},
						"application/json": () => {res.json(res.users)}
					});
				})
				
				/*res.format({
					"text/html": () => {res.render("moviePage", {movie: movie, loggedIn: loggedIn, username: req.session.username, watched: watched})},
					"application/json": () => {res.json(res.users)}
				});*/
				
			});
		});
	});
});

router.post("/", (req, res, next) => {
	let newMovie = new Movie();
	
	newMovie.title = req.body.title;
	newMovie.rated = req.body.rated;
	newMovie.released = req.body.released;
	newMovie.runtime = req.body.runtime;
	newMovie.genre = req.body.genre;
	newMovie.directors = req.body.directors;
	newMovie.writers = req.body.writers;
	newMovie.actors = req.body.actors;
	newMovie.plot = req.body.plot;
	newMovie.awards = req.body.awards;
	
	newMovie.save((err, result) => {
		if(err){
			res.status(500).send("Internal error server");
			return;
		}
		
		res.status(201).send(result._id);
	});
});

function validateLogin(req){
	if(req.session.username) return true;
	return false;
}

let exampleMovie = {
	"id" : 688,
    "Title": "House of Games",
    "Year": "1987",
    "Rated": "R",
    "Released": "14 Oct 1987",
    "Runtime": "102 min",
    "Genre": [
      "Crime",
      "Thriller"
    ],
    "Director": [
      "David Mamet"
    ],
    "Writer": [
      "David Mamet",
      "Jonathan Katz"
    ],
    "Actors": [
      "Lindsay Crouse",
      "Joe Mantegna",
      "Mike Nussbaum",
      "Lilia Skala"
    ],
    "Plot": "A psychiatrist comes to the aid of a compulsive gambler and is led by a smooth-talking grifter into the shadowy but compelling world of stings, scams, and con men.",
    "Awards": "Nominated for 1 Golden Globe. Another 6 wins & 3 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BZTNkYmIwYjAtMDcyNy00MGYwLWJkYTAtODAyNDJjZTdmNGYxXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
	"Reviews" : [
		{"Movie": {"Name": "House of Games", "id": 688},"id" : 1, "Date": "March 12 2021 16:32:32", "User": "someUser1", "Score": 1, "Title": "wow"},
		{"Movie": {"Name": "House of Games", "id": 688},"id" : 2, "Date": "March 13 2021 16:32:32", "User": "someUser2", "Score": 2, "Title": "omg"},
		{"Movie": {"Name": "House of Games", "id": 688},"id" : 3, "Date": "March 14 2021 16:32:32", "User": "someUser3", "Score": 3, "Title": "woeful"},
		{"Movie": {"Name": "House of Games", "id": 688},"id" : 4, "Date": "March 15 2021 16:32:32", "User": "someUser4", "Score": 4, "Title": "yummy"},
		{"Movie": {"Name": "House of Games", "id": 688},"id" : 5, "Date": "March 16 2021 16:32:32", "User": "someUser5", "Score": 5, "Title": "ilove2406"}
	],
	"SimilarMovies" : [
		{"Name": "Bees", "id" : 111},
		{"Name": "Shrek", "id" : 112},
		{"Name": "Cars", "id" : 113},
		{"Name": "Frozen", "id" : 114}
	]
};

module.exports = router;