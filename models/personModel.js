const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
	name: {type: String, required: true},
	freqCollabs: [{type: Schema.Types.ObjectId, ref: 'Person'}], //not sure about this specific one tbh lol
	director: [{type: Schema.Types.ObjectId, ref: 'Movie'}], 
	actor: [{type: Schema.Types.ObjectId, ref: 'Movie'}], 
	writer: [{type: Schema.Types.ObjectId, ref: 'Movie'}] 
});

personSchema.statics.obtainByName = function(n, cb){
	this.findOne({
		name: {$regex: n, $options: 'i'},
	}, cb);
}

personSchema.statics.obtain = function (id, cb){
	this.find({_id: id}).
	populate({
		path: 'director actor writer',
		select: '_id title'
	}).
	exec(cb);
}

personSchema.statics.findExact = function(n, cb){
	n ='^'+n+"$";
	this.findOne({
		name: {$regex: n, $options: 'i'},
	}, cb);
}

module.exports = mongoose.model("Person", personSchema);