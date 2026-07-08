const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(
  __dirname,
  "../data/users.json"
);


function getUsers() {
  const data = fs.readFileSync(usersFile, "utf-8");
  return JSON.parse(data);
}


// GET all users
router.get("/users", (req, res) => {
  const users = getUsers();

  res.json(users);
});


// GET single user
router.get("/users/:id", (req, res) => {

  const users = getUsers();

  const user = users.find(
    u => u.id === Number(req.params.id)
  );


  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }


  res.json(user);
});


module.exports = router;