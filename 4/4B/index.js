// import module
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const port = 3000;

const path = require("path");
const UserSession = require("express-session");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);
const multer = require("multer");

const upload = multer({ dest: "./src/uploads" });
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static(path.join(__dirname, "src/assets")));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use(
  UserSession({
    name: "hero-session",
    secret: "SupraBapak",
    resave: false,
    saveUninitialized: true,

    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/login", login_render);
app.get("/register", register_render);
app.get("/logout", logout);
app.get("/", home_render);
app.get("/add_hero", addHero_render);
app.get("/detail_hero", detailHero_render);
app.get("/detail_hero/:id", detailHerobyId);
app.get("/delete_hero/:id", deleteHerobyId);
app.get("/add_type", addtype_render);
app.get("/delete_type/:typeid", deletetype_byid);
app.get("/edit_type/:typeid", edittype_render);

app.post("/login", loginbyEmail);
app.post("/register", registerbyUser);
app.post("/add_hero", upload.single("photo"), addHerobyId);
app.post("/add_type", addtype_byId);
app.post("/edit_type/:typeid", edittype_byId);

app.get("/edit_hero/:id", editHero_render);
app.post("/edit_hero/:id",upload.single("photo"), editHerobyId);





async function deletetype_byid(req, res) {
  const id = req.params.typeid;

  const query = `DELETE FROM type_tbs WHERE id='${id}'`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect('/add_type'); 
}
function type_render(req, res) {
  res.render('/edit_type') 
}
async function edittype_render(req, res) {
  const id = req.params.typeid;
  
  const query = `SELECT * FROM type_tbs WHERE id='${id}'`;
  const typeheroes =await sequelize.query(query, { type: QueryTypes.UPDATE });

  res.render('edit_type', {data: typeheroes[0]}); 
}
async function edittype_byId(req, res) {
  const id = req.params.typeid;
  const { nametype } = req.body;

  const query = `UPDATE type_tbs SET name = '${nametype}' WHERE id='${id}' `;
  await sequelize.query(query, { type: QueryTypes.UPDATE });

  res.redirect('/add_type'); 
}

async function addtype_byId(req, res) {
  const { typename } = req.body;

  const query = `INSERT INTO type_tbs (name,  "createdAt", 
    "updatedAt") VALUES ('${typename}', NOW(),
     NOW()) `;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect('/add_type'); 
}

async function addtype_render(req, res) {
  const { isLogin } = req.session;

  const query = `SELECT * FROM type_tbs`;
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  isLogin ? res.render("add_type", {
    data: result,
    isLogin,
  }): res.redirect('/login'); 
}


async function home_render(req, res) {
  const { isLogin } = req.session;

  const query = `SELECT * FROM heroes_tbs ORDER BY id ASC `;
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  res.render("index", {
    data: result,
    isLogin,
  });
}
function login_render(req, res) {
  res.render("login");
}
function register_render(req, res) {
  res.render("register");
}
function logout(req, res) {
  req.session.destroy(function (err) {
    if (err) return console.error("Logout failed!");

    console.log("Logout success!");
    res.redirect("/");
  });
}

async function loginbyEmail(req, res) {
  const { email, password } = req.body;

  const query = `SELECT * FROM users_tbs WHERE email = '${email}'`;
  const userlogin = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!userlogin.length) {
    console.log("Email tidak ditemukan");
    return res.redirect("/login");
  }
  bcrypt.compare(password, userlogin[0].password, function (err, result) {
    if (!result) {
      console.log("Password tidak sesuai!");
      return res.redirect("/login");
    } else {
      req.session.isLogin = true;
      req.session.user = userlogin[0].name;
      req.session.idUser = userlogin[0].id;

      console.log("Login Berhasil!");
      return res.redirect("/");
    }
  });
}
async function registerbyUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users_tbs( 
    email, 
    username, 
    password ,
    "createdAt", 
    "updatedAt"
    ) 
    VALUES (
    '${email}',
    '${username}',
    '${hashedPassword}',
     NOW(),
     NOW())`;

    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
}

function detailHero_render(req, res) {
  const { isLogin, user } = req.session;

  isLogin
    ? res.render("detail_hero", {
        isLogin,
        user,
      })
    : res.redirect("/login");
}
async function detailHerobyId(req, res) {
  const { id } = req.params;
  const { isLogin, user } = req.session;
  
  const query = `SELECT * FROM heroes_tbs WHERE id=${id}`;
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });
  
  res.render("detail_hero", {
    data: result[0],
    isLogin,
    user,
  });
}
async function deleteHerobyId(req, res) {
  const { id } = req.params;
  
  const query = `DELETE FROM heroes_tbs WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });
  
  res.redirect("/");
}
async function editHerobyId(req, res) {
  const { id } = req.params;

  const { name} = req.body;
  
  const photo = req.file ? req.file.filename : null;
  const query = `
  UPDATE heroes_tbs SET
  name = '${name}, 
  type_id = '${null}, 
  photo = '${photo}, 
  WHERE
  id=${id}`;
  const data = await sequelize.query(query, { type: QueryTypes.UPDATE });

  isLogin
    ? res.render("edit_hero", { data, isLogin, user })
    : res.redirect("/login");
}


async function editHero_render(req, res) {
  const { isLogin, user} = req.session;
  const {id} = req.params;
  const typequery = `SELECT * FROM heroes_tbs WHERE id='${id}'`;
  const typehero = await sequelize.query(typequery, { type: QueryTypes.SELECT });

  isLogin ? 
  res.render('edit-hero', { 
    data: typehero[0] ,
    isLogin, 
    user, 
  }) : res.redirect('/login') ;
}

async function addHero_render(req, res) {
  const { isLogin, user } = req.session;
  const query = `SELECT * FROM type_tbs`;
  const typehero = await sequelize.query(query, { type: QueryTypes.SELECT });

  isLogin
    ? res.render("add_hero", { data: typehero, isLogin, user })
    : res.redirect("/login");
}
async function addHerobyId(req, res) {
  const { name, typehero } = req.body;

  const photo = req.file ? req.file.filename : null;
  const id = req.session.idUser;
  const query = `INSERT INTO heroes_tbs (
  name, 
  type_id, 
  photo, 
  user_id,
  "createdAt", 
  "updatedAt"
  )
  VALUES ('${name}','${typehero}','${photo}','${id}',NOW(),NOW())`;

  const result = await sequelize.query(query, { type: QueryTypes.INSERT });
  console.log(result);
  res.redirect("/");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
