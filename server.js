const express = require('express');
let app = express();

const session = require('express-session');
app.use(session({secret: 'EgiNAjvvFVcbgAz'}));

const mongoose = require('mongoose');

app.set('view engine', 'pug');
app.set("views", "./public/views");
app.use(express.json());
app.use(express.static('public'));

const moviesRouter   = require("./routers/moviesRouter");
const usersRouter    = require("./routers/usersRouter" );
const peopleRouter   = require("./routers/peopleRouter");
const reviewsRouter  = require("./routers/reviewsRouter"); 
const generalsRouter = require("./routers/generalsRouter");

app.use("/", generalsRouter);
app.use("/movies", moviesRouter);
app.use("/users", usersRouter);
app.use("/people", peopleRouter);
app.use("/reviews", reviewsRouter);

mongoose.connect('mongodb://localhost/moviedata', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Server connected to database. Launching server...");
	app.listen(3000);
	console.log("Server listening at http://localhost:3000");
});
