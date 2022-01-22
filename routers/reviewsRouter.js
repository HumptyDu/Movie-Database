const express = require('express');
let router = express.Router();
let Review = require("../models/reviewModel");
let Movie = require("../models/movieModel");
let User = require("../models/userModel");

let reviews = {};
let nextReviewId = 163;

router.get("/:rID", (req, res, next) => {
	loggedIn = validateLogin(req);
	
	res.format({
        "text/html": () => {res.render("reviewPage", {review: exampleReview, loggedIn: loggedIn, username: req.session.username})},
        "application/json": () => {res.json(res.users)}
    });
	
	next();
});

router.post("/", (req, res, next) =>{
	loggedIn = validateLogin(req);
	
	if(!loggedIn){
		res.status(500).send("You're not logged in");
		return;
	}
	
	let review = req.body;
	
	/*Find user first bc user is required for review shema*/
	User.obtain(req.session.username, (err, result) =>{
		if(err){
			res.status(500).send("Internal error");
			return;
		}
		
		let user = result[0];
		review.user = user;

		/*----Adding review to DB----*/
		Review.create(review, (err, result) =>{
			if(err){
				res.status(505).send("Internal error");
				console.log(err);
				return;
			}
			
			review = result;
			user.reviewsMade.push(review._id);
		
			/*----Adding review to movie----*/
			Movie.obtain(review.movie, (err, result) =>{
				if(err){
					res.status(500).send("Internal error");
					return;
				}
				
				let movie = result[0];
				
				movie.reviews.push(review._id);
				/*----Saving the data----*/
				user.save((err, result) =>{
					if(err){
						res.status(500).send("Server error");
						console.log(err);
						return;
					}
					
					movie.save((err, result) =>{
						if(err){
							res.status(500).send("Server error");
							console.log(err);
							return;
						}
						
						res.status(200).send();
					});
					
				});
				
			});
			
		});
		
	});
	
});

function validateLogin(req){
	if(req.session.username) return true;
	return false;
}

function notifyReview(user, movie){
	if(user.usersFollowingThis.length == 0) return;
	for(u of user.usersFollowingThis){
		User.notify(u, user.username, movie, (err, result) => {
			if(err){
				return false;
			}
			return true;
		});
	}
	
}

let exampleReview = {
	"id" : 132,
	"Date" : "March 12 2021 1:12:32",
	"Movie" : {"Name": "Hunger Games : Catching Fire", "id": 12143},
	"User" : "asdfa1231",
	"Score" : 8,
	"Title" : "Immaculatly Immense & Immorally Intertaining",
	"Text" : "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga"
};

module.exports = router;