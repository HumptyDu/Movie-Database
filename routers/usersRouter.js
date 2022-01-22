const express = require('express');
let router = express.Router();
let User = require("../models/userModel");
let Movie = require("../models/movieModel");
let Person = require("../models/personModel");

router.get("/:uID", (req, res, next) => {
	loggedIn = validateLogin(req);
	
	User.obtain(req.params.uID, (err, result) =>{
		if(err){
			console.log(err);
			res.status(500).send("Error obtaining username")
			return;
		}
		
		if(result.length != 1) { //!=1 is used instead of 0 in the weird case that more than one user is found
			res.status(404).send("Username not found");
			return;
		}
		
		let user = result[0];
		let isSelf = (req.session.username == req.params.uID);	

		user.populate({path: 'moviesWatched recommendedMovies reviewsMade pplFollowing pplFollowingThis usersFollowing usersFollowingThis', select: 'title user movie score title _text date name genre username'}, (err, result) =>{	
			user.getRecommended((err, result) =>{
				if(err){
					res.status(500).send("Internal server error");
					return;
				}
				
				user.recommendedMovies = result;
				
				User.obtain(req.session.username, (err,result) => {
					if(err){
						console.log(err);
						res.status(500).send("Internal server error");
						return;
					}

					if(result.length != 1) { //!=1 is used instead of 0 in the weird case that more than one user is found
						res.status(404).send("Username not found");
						return;
					}

					let followed = false;
					for(u of user.usersFollowingThis) {
						if(u._id.equals(result[0]._id)) followed = true;
						break;
					}
					
					res.format({
						"text/html": () => {res.render("userPage", {user: user, loggedIn: loggedIn, followed: followed, isSelf: isSelf, username: req.session.username})},
						"application/json": () => {res.json(res.users)}
					});

				});
			});
		});		
	});
});

router.post("/", (req, res, next) => {
	User.exists({username: req.body.username}, (err, result) => {
		//result now holds a boolean that represents whether or not the inputted username already exists
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}
		if(result) res.status(500).send();
		//we now know the username isn't already taken. Now we create a user and add to db:
		else{
			let newUser = new User();
			newUser.username = req.body.username;
			newUser.password = req.body.password;
			newUser.save((err, result) =>{
				req.session.username = req.body.username;
				res.status(201).send();
			});
		}
		
	});
});

router.put("/togglePersonFollowing", (req, res, next) => {
	//console.log(req.body.id);

	if(!req.session.username) {
		res.status(500).send("You are not signed in.");
		return;
	}
	
	User.obtain(req.session.username, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send("Error obtaining username from server");
			return;
		}
		
		if(result.length != 1){
			console.log("Error: 0 / 2+ results found in /toggleFollowing");
			console.log(result);
			res.status(500).send("Error: 0 / 2+ results found in /toggleFollowing");
			return;
		}
		
		let user = result[0];
		
		if(!user.pplFollowing.includes(req.body.id)) {
			user.pplFollowing.push(req.body.id);
		}

		else {
			let newPplFollowing = [];
			for (p of user.pplFollowing){
				if(p != req.body.id) newPplFollowing.push(p);
			}
			user.pplFollowing = newPplFollowing;
		}

		user.save((err, result) => {
			if(err){
				res.status(500).send("Internal server error");
				return;
			}
			res.status(200).send();
		});
	});
});

router.put("/toggleUserFollowing", (req, res, next) => {
	if(!req.session.username) {
		res.status(500).send("You are not signed in.");
		return;
	}

	User.obtain(req.session.username, (err, result) => {
		if(err){
			console.log(err);
			res.status(500).send("Error obtaining username from server");
			return;
		}

		if(result.length != 1){
			console.log("Error: 0 / 2+ results found in /toggleFollowing (line 142)");
			console.log(result);
			res.status(500).send("Error: 0 / 2+ results found in /toggleFollowing");
			return;
		}
		
		let user = result[0];

		if (!user.usersFollowing.includes(req.body._id)) user.usersFollowing.push(req.body._id);
		else{			
			let nuf = [];
			for(u of user.usersFollowing){
				if(u != req.body._id) nuf.push(u);
			}
			user.usersFollowing = nuf;
		}

		user.save((err, result) => {
			if(err){
				console.log("error saving user data");
				res.status(500).send("Error saving data");
				return;
			}
		});

		User.obtain(req.body.username, (err, result) =>{
			if(err){
				console.log("error obtaining viewed data");
				res.status(500).send("Error obtaining viwed username");
				return;
			}

			if(result.length != 1){
				console.log("Error: 0 / 2+ results found in /toggleFollowing (line 174)");
				console.log(result);
				res.status(500).send("Error: 0 / 2+ results found in /toggleFollowing");
				return;
			}
			
			let viewed = result[0];

			if (!viewed.usersFollowingThis.includes(user._id)) viewed.usersFollowingThis.push(user._id);
			else{
				viewed.usersFollowingThis = viewed.usersFollowingThis.filter(u => !u.equals(user._id));
			}

			viewed.save((err, result) =>{
				if(err){
					console.log("error saving viewed data");
					res.status(500).send("Error saving viewed data");
					return;
				}
				res.status(200).send();
			})
		});
	});
});

router.put("/toggleContributor", (req, res, next) =>{
	let loggedIn = validateLogin;
	if(!loggedIn){
		res.status(500).send("Not logged in");
		return;
	}
	
	User.obtain(req.session.username, (err, result) =>{
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
		
		//inverses the user.contributing value
		user.contributing ? user.contributing = false : user.contributing = true;

		req.session.contributing = user.contributing;
		
		user.save((err, result) => {
			if(err){
				res.status(500).send("Internal server error");
				return;
			}
			res.status(200).send();
		});
		
	});
	
});

router.put("/toggleWatched", (req, res, next) => {
	if(!req.session.username){
		res.status(500).send("You're not logged in");
		return;
	}
	
	User.obtain(req.session.username, (err, result) =>{
		if(err){
			res.status(500).send("Internal server error");
			return;
		}
		
		if(result.length !== 1){
			res.status(500).send("Internal server error");
			return;
		}
		
		let user = result[0];

		console.log(user.moviesWatched);

		if(user.moviesWatched.includes(req.body.id)) {
			user.moviesWatched = user.moviesWatched.filter(m => m != req.body.id);
		}
		else{
			user.moviesWatched.push(req.body.id);
		}

		console.log(user.moviesWatched);

		user.save((err, result) => {
			if(err){
				res.status(500).send("Internal server error");
			}
			res.status(200).send();
		});
		
	});
	
});

router.put("/test", (req, res, next) =>{
	let user = req.session.username;
	User.obtain(user, (err, result) =>{
		result[0].usersFollowing = [];
		result[0].save((err, result)=>{
			res.status(200).send();
		});
	});
});


function validateLogin(req){
	if(req.session.username) return true;
	return false;
}

let exampleUser = {
	"Username" : "HumptyDump",
	"Contributing" : true,
	"UsersFollowing" : ["user1", "someUser", "imOutOfUsernameIdeas", "iThinkThePointIsClearNow"],
	"UsersFollowingThis" : ["user1", "someUser", "proGramer12yearOld", "okNowImDone"],
	"RecommendedMovies" : ["The Lord of the Rings", "The Outsiders", "Hunger Games : Catching Fire", "Spongebob the Movie", "Harry Potter and the Really Long Titles I Always Forget"],
	"ReviewsMade" : [{"id" : 1231, "movie" : "Life of Pi", "score" : 4, "title" : "boring", "text" : "This was simply the most boring movie sinse ever."}],
	"PeopleFollowing" : ["John Cena", "Robin Williams", "Justin Bieber", "Steven Spielberg"],
	"PeopleFollowingThis" : [],
	"MoviesWatched" : [{"Title":"Life of Pi", "id":221}, {"Title":"Home Alone", "id":223}, {"Title": "Ratatouille", "id": 223}], 
	"Password" : "password",
	"Online" : true,
	"Notifications" : ["something", "WWE is staged", "Cats sleep 16 to 18 hours per day", "The Neanderthal's brain was bigger than yours is", "Falling coconuts kill 150 people every year – 10 times the number of people killed by sharks."]
}; 

module.exports = router;