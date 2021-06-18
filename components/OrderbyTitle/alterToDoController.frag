Fragment OrderByTitle-alterToDoController {
    Action: add
    Priority: high
    FragmentationPoints: addMethods
    PointBracketsLan: java
    Destinations: Todo-todoController
    SourceCode: [ALTERCODE-FRAG]
    exports.listOrdered = async function (req, res) {
    const todos = await TodoModel.findAll({ order: [['message', 'ASC'],], });
    res.render("todo/list", { todos: todos });
  }
    [/ALTERCODE-FRAG]
}