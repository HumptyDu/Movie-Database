# Movie-Database
This is a movie database website that allows users to sign-in, search for movies in a database, and perform many operations regarding movies and other users. See more in the features section of this file.

### Features
- User login / sign up
- Users can search through over 5,000 movies
- Users can add movies to a list of movies they've watched
- Users can leave reviews on movies 
- Users can follow actors / directors (get updates on latest movies) and other users (notifications on movies they've watched and such)
- Users can toggle a "contribute" mode that allows them to add movies and actors / directors


### How to run
1. Ensure MongoDB, Node, and NPM are installed on computer
2. Make sure server.js can run all of its libraries
3. Run create-database.js on Node (this should create a directory called "data" on the current directory)
4. Open cmd 
5. CD to where MongoDB binaries are (C:\Program Files\MongoDB\Server\4.4\bin)
6. Run ```mongod --dbpath="C:\Users\<>\Movie-Database\data"``` (or wherever the path to the "data" directory is, created in step 3)
7. Leave the current shell running in the background
8. Run server.js on a separate shell
9. Explore the website through localhost:3000

### Future features
* Implement notifications
* Clean up nested code 
    - For instance, the reviws router is incredibly difficult to work through as it contains too many nested queries. I should look into writing a dynamic function that, for instance, takes a list of functions and executes them as nested mongoose queries 
* Frequent collaborators
* Implement notifications
* prevent same user from making multiple reviews to the same movie
* userPage - add movie title to reviews
* prevent user from going to like page 13423123 in page results (redirect to highest page)
* multiple search parameters (search by multiple genres, actors, etc)
* paginate user page data
* paginate reviews in movies
* debug addMovies page
* scale images in index
* Split up css for each page
* Implement a "change password" in the Users page
* Change username in Users
* Register / login by e*mail as well
* Add a poster parameter and a poster img that loads when user inserts posterURL (addMoviePage)
* Add imgs to people
* Add like/dislike to reviews
* Edit review
* Add clickCount on movies (for trending)
* Add watchCount on movies (for trending)
* Refine trending and reccommended algorithm
* Search people / users

### Known / Potential Bugs
- Recommended for you section is not displaying as it should
