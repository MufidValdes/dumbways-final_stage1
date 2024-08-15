// import module
const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const hbs = require("hbs");

const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);

app.set("view engine", "hbs");
app.set("views","src/views")

app.use("/assets", express.static(path.join(__dirname, "src/assets")));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.get("/", home);
app.get("/login", login)
app.get("/register", register)
app.get("/detail_hero", detailHero_page)
app.get("/update_hero", updateHero_page)
app.get("/add_hero", addHero_page)

function home(req, res){
  res.render("index")
}
function login(req, res){
  res.render("login")
}
function register(req, res){
  res.render("register")
}
function detailHero_page(req, res){
  res.render("detail_hero")
}
function updateHero_page(req, res){
  res.render("update_hero")
}
function addHero_page(req, res){
  res.render("add_hero")
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})