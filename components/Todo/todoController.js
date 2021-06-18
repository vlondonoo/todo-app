const { TodoModel } = require('../db/sequelize');
const fs = require('fs');
const path = require('path');

exports.list = async function (req, res) {
  const todos = await TodoModel.findAll();
  res.render("todo/list", { todos: todos });
}

/*B-addMethods*/

exports.add = async (req, res) => {
  const newTodo = await TodoModel.create({
    message: req.body.message,
    state: "OPEN",
    /*B-addFields*/
  });

  /*B-addAddMethodInstructions*/
  return res.redirect("/todos");
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await TodoModel.destroy({ where: { id: id } });

  /*B-addDeleteMethodInstructions*/

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
