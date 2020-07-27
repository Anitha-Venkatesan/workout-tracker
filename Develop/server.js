const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;

const User = require("./model/userModel");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", { useNewUrlParser: true});
//Creating html routes
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });
  app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
  });
  app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
  });

  app.get("/api/workouts/range", (req, res) => {
    User.find({})
        .then(dbUser => {
        res.json(dbUser);
    })
    .catch(err => {
        res.json(err);
    });
  });

  app.get("/api/workouts", (req, res) => {
    User.find({})
      .then(dbUser => {
        res.json(dbUser);
      })
      .catch(err => {
        res.json(err);
    });
  });
  app.post("/api/workouts", ({ body }, res) => {
    const user = new User(body);
        User.create(user)
            .then(dbUser => {
            res.json(dbUser);
        })
          .catch(err => {
            res.json(err);
          });
  }); 

  app.put("/api/workouts/:id",(req,res,next) => {
      console.log(req.body);
      console.log(req.params.id);
      User.findByIdAndUpdate(req.params.id,{ $push: { exercises: req.body } }, function(err, post) {
        if (err) return next(err);
        res.json(post);
       });
  });   
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
