const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
/*B-addImports*/

/* include controllers */
const homeController = require("./controllers/homeController");
const todoController = require("./controllers/todoController");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*B-addUses*/

/* Routes */
app.get('/', homeController.home);
app.get('/about', homeController.about);
app.get('/todos', todoController.list);
app.post('/todos', todoController.add);
app.get('/todos/delete/:id', todoController.delete);
app.get('/todos/update/:id/:state', todoController.update);
/*B-addRoutes*/

app.use(express.static("public"));
app.listen(3000);
