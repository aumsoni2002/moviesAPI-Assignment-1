/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Aum Amitkumar Soni Student ID: 150628204 Date: 15 January, 2023
 *  Cyclic Link: _______________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (request, response) {
    response.json({ message: "API Listening" });
});

// POST /api/movies
app.post("/api/movies", function (req, res) {
    db.addNewMovie(req.body)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch(() => {
            res.status(500).send("Sorry, It seems you are unable to add Movie.");
        });
});

// GET /api/movies -- User requesting all movies as per page, perPage and title
app.get("/api/movies/", function (req, res) {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((allMovies) => {
            res.status(200).json(allMovies);
        })
        .catch(() => {
            res
                .status(204)
                .send(
                    "Due to some technical glitch, we are not able to show all movies at this moment, Please try again later."
                );
        });
});

// GET /api/movies -- user requesting the movie as per id.
app.get("/api/movies/:_id", function (req, res) {
    db.getMovieById(req.params._id)
        .then((movieById) => {
            res.status(200).json(movieById);
        })
        .catch(() => {
            res
                .status(204)
                .send(
                    "Due to some technical glitch, we are not able to show the movie you are looking for, Please try again later."
                );
        });
});

// PUT /api/movie
app.put("/api/movie/:_id", function (req, res) {
    db.updateMovieById(req.body, req.params._id)
        .then(() => {
            res
                .status(200)
                .send("Congratulations, The Movie has been updated Successfully.");
        })
        .catch(() => {
            res
                .status(500)
                .send(
                    "Due to some technical glitch, we are not able to update the movie."
                );
        });
});

// DELETE /api/movies
app.delete("/api/movies/:_id", function (req, res) {
    db.deleteMovieById(req.params._id)
        .then(() => {
            res
                .status(200)
                .send("Congratulations, The Movie has been deleted Successfully.");
        })
        .catch(() => {
            res
                .status(500)
                .send(
                    "Due to some technical glitch, we are not able to delete the movie."
                );
        });
});

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
