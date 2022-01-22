const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	contributing: {type: Boolean, default: false},
	usersFollowing: [{type: Schema.Types.ObjectId, ref: "User"}],
	usersFollowingThis: [{type: Schema.Types.ObjectId, ref: "User"}],
	recommendedMovies: [{type: Schema.Types.ObjectId, ref: "Movie"}], 
	reviewsMade: [{type: Schema.Types.ObjectId, ref: "Review"}], 
	pplFollowing: [{type: Schema.Types.ObjectId, ref: "Person"}],
	pplFollowingThis: [{type: Schema.Types.ObjectId, ref: "Person"}],
	moviesWatched: [{type: Schema.Types.ObjectId, ref: "Movie"}], 
	notifications: [String]
});

userSchema.statics.obtain = function(un, cb){
	this.find({username: un}, cb);
}

userSchema.methods.getRecommended = function(cb){
	if(this.moviesWatched.length == 0){
		cb(false, []);
		return;
	}
	let genre = this.moviesWatched[0].genre[0];
	let genres = {};
	let ids = [];
	
	for(m of this.moviesWatched){
		ids.push(m._id);
		for(g of m.genre){
			if(genres.hasOwnProperty(g)) genres[g] += 1;
			else genres[g] = 1;
		}
	}
	
	for(g in genres){
		if(genres[g] > genres[genre]) genre = g; 
	}
	
	this.model("Movie").find({genre:genre}).
	where("_id").nin(ids).
	limit(5).
	select('title').
	exec(cb);
}

userSchema.statics.notify = function(toNotify, notifier, movie, cb){
	this.findOne({
		username: toNotify,
	}).
	exec(function(err, result){
		if(err){
			cb(true, "");
		}
		result.notifications.push(notifier + " wrote a review on "+movie);
		console.log("notification added!");
		result.save((err, result) =>{
			if(err){
				cb(true, "");
			}
			cb(false, "");
		})
	});
}

userSchema.statics.deleteNotification = function(username, txt, cb){
	this.findOne({"username": username}).
	exec((err, result) => {
		if(err) cb(true);
		let i = result.notifications.indexOf(txt);
		result.notifications.splice(i, 1);
		result.save((err, result) => {
			if(err) cb(true);
			cb(false);
		});
	});
	
}

module.exports = mongoose.model("User", userSchema);