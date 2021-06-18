exports.home = async function (req, res){
  res.render("home/index");
}

exports.about = async function (req, res){
  res.render("home/about");
}