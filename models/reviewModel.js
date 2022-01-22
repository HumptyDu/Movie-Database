const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	movie: {type: Schema.Types.ObjectId, ref: 'Movie', required: true},
	score: {type: Number, required: true, validate:{validator: checkScore, message: "Invalid score"}},
	title: {type: String, required: true},
	_text: {type: String}, //named _text because 'text' seems to be a JS keyword
	date: {type: String, required: true}
});

reviewSchema.statics.obtain = function(id, cb){
	this.find({_id: id}, cb);
}

function checkScore(){
	let score = this.score;
	
	if(isNaN(score)) return false;
    if(score < 0 || score > 10) return false;
	
	return true;
}

function checkTitle(){
	let title = this.title;
	//if(title.length < 5 || title.length > 25) return false;
	return true;
}

function checkText(){
	let txt = this._text;
	//if(txt.length < 20 || title.length > 500) return false;
	return true;
}

module.exports = mongoose.model("Review", reviewSchema);