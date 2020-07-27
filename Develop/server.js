const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;

const User = require("./model/userModel");
//const workout = require("./public/workout");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", { useNewUrlParser: true});
//Creating html routes
  app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
  });
  app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
  });
  //creating api routes

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
  app.put("/api/workouts/:id",function(req,res) {
      console.log(req.body);
      console.log(req.params.id);
      User.findByIdAndUpdate(req.params.id,{ $push: { exercise: req.body } }, function(err, post) {
        if (err) return next(err);
        res.json(post);
       });
  });    
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
