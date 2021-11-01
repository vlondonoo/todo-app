const { TodoModel } = require('../db/sequelize');
const fs = require('fs');
const path = require('path');

exports.list = async function (req, res) {
  const todos = await TodoModel.findAll();
  res.render("todo/list", { todos: todos });
}

/*%if (feature.orderByTitle){ %*/ exports.listOrdered = async function (req, res) {
  const todos = await TodoModel.findAll({ order: [['message', 'ASC'],], });
  res.render("todo/list", { todos: todos });
}/*% } %*/

exports.add = async (req, res) => {
  const newTodo = await TodoModel.create({
    message: req.body.message,
    state: "OPEN",
    /*%if (feature.images){ %*/image: "",/*% } %*/
  });
  /*%if (feature.images) { %*/
  const fileToUpload = req.files[0];

  if (fileToUpload) {
    const oldpath = fileToUpload.path;
    const dirPath = path.join(__dirname.replace('controllers', ''), '/public/uploads/');
    newpath = dirPath + newTodo.id + ".jpg";
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
    newTodo.image = newTodo.id + ".jpg";
    await newTodo.save({ fields: ['image'] });
  }/*% } %*/

  return res.redirect("/todos");
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await TodoModel.destroy({ where: { id: id } });
  /*%if (feature.images){ %*/ const imagePath = path.join(__dirname.replace('controllers', ''), '/public/uploads/');
  newpath = imagePath + id + ".jpg";
  try {
    fs.unlinkSync(newpath) //file removed
  } catch (err) {
    //nothing
  }/*% } %*/

  res.redirect("/todos");
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const state = req.params.state;
  const updatedTodo = {
    state
  };

  await TodoModel.update(updatedTodo, { where: { id: id } });
  res.redirect("/todos");
};
