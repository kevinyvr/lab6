/*
 Authors:
 Your name and student #:
 Your Partner's Name and student #:
 (Make sure you also specify on the Google Doc)
*/
const fs = require("fs");
const express = require("express");

let app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", (req, res) => res.render("pages/index"));

app.get("/myForm", (req, res) => res.render("pages/myForm"));

app.post("/myForm", (req, res) => {
  // Add your implementation here 
  let formData = req.body;
  let movies = formData.movies.split(",");
  res.render("pages/index", {
    movies: movies
  });
});

app.get("/myListQueryString", (req, res) => {
  // Add your implementation here
  let movie1 = req.query.movie1;
  let movie2 = req.query.movie2;
  res.render("pages/index", {
    movies: [movie1, movie2]
  });
});

// check if movie exists
const movieExist = (movieName) => {
  return new Promise((res, rej) => {
    fs.readFile("movieDescriptions.txt", "utf-8", (err, data) => {
      if (err) {
        rej("movieDescriptions.txt read file error");
      } else {
        const movieNames = [];
        const movieDescriptions = [];

        let movies = data.split("\n");

        // name and descriptions are delimited by :
        movies.forEach(movie => {
          const eachMovie = movie.split(":");
          movieNames.push(eachMovie[0]);
          movieDescriptions.push(eachMovie[1]);
        });

        // find location of the username where -1 = not found
        let movieLocation = movieNames.findIndex((name) => name == movieName);
        if (movieLocation >= 0) {
          let movieResult = {
            name: movieNames[movieLocation],
            desc: movieDescriptions[movieLocation]
          }
          res(movieResult);
        } else {
          res();
        }
      }
    })
  });
}

app.get("/search/:movieName", (req, res) => {
  // Add your implementation here
  let movieName = req.params.movieName;

  movieExist(movieName)
    .then((movieResult) => {
      res.render("pages/searchResult", {
        movie: movieResult
      });
    })
    .catch((err) => console.log(err))
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});