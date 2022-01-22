const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
	title: {type: String, required: true},
	year: {type: Number},
	rated: {type: String},
	released: {type: String},
	runtime: {type: String, required: true},
	genre: {type: [String], required: true},
	directors: [{type: Schema.Types.ObjectId, ref: 'Person'}], 
	writers: [{type: Schema.Types.ObjectId, ref: 'Person'}], 
	actors: [{type: Schema.Types.ObjectId, ref: 'Person'}], 
	plot: {type: String, required: true},
	awards: {type: String},
	poster: {type: String},
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}], 
	similarMovies: [{type: Schema.Types.ObjectId, ref: 'Movie'}]
});

movieSchema.statics.obtain = function(id, cb){
	this.find({_id: id}, cb);
}

movieSchema.statics.filterByTitle = function(title, cb){
	this.find({title: {$regex: title, $options: 'i'}}, cb);
}

movieSchema.statics.filterByGenre = function(genre, cb){
	this.find({genre: genre}, cb);
}

movieSchema.statics.findTrending = function(cb){
	//console.log("find trending");
	
	this.aggregate([
		{$unwind:"$reviews"}, 
		{$group: {_id: '$_id', poster: {$first: '$poster'}, rc: {$sum:1}}}, 
		{$sort : { rc: -1}}
	]).
	exec((err, result) =>{
		//console.log("ASDFASDFASD");
		if(err){
			console.log(err);
			cb(true);
		}
		
		//console.log("result : ");
		//console.log(result);
		
		if(result.length!=0){
			cb(false, result);
			return;
		}
		
		//console.log("first time");
		this.find().limit(5).exec(cb);
	});
	
	/*console.log("in find trending: " + filtered.length);
	console.log("in find trending: " + filtered.length);
	
	if(filtered.length == undefined){
		this.find().limit(5).exec(cb);
		return;
	}
	
	filtered.exec(cb);*/
}

movieSchema.statics.findSimilar = function(title, genre, cb){
	this.find({genre: genre}).
	where("title").ne(title).
	limit(5).
	select('title').
	exec(cb);
}

movieSchema.statics.search = function(t, g, a, p, l, length, cb){
	console.log("Inside search: " + l);
	console.log("Is a number: " + !isNaN(l));
	
	//required to get .limit to work (I have no idea why p works though)
	let lim = parseInt(l);
	
	let filtered = this.where("title").equals(new RegExp(t, "i"))
	.where("genre").equals(new RegExp(g, "i")) 
	.populate({path: 'actors', match: {'name': new RegExp(a, "i")}});
	
	console.log("Inside statics: " + length);
	console.log(filtered);
	length = filtered.length;
	
	filtered
	.limit(lim)
	.skip((p-1)*lim)
	.exec(cb);
}  

module.exports = mongoose.model("Movie", movieSchema);