Fragment Images-alterAddAddMethodInstructions {
    Action: add
    Priority: high
    FragmentationPoints: addAddMethodInstructions
    PointBracketsLan: java
    Destinations: Todo-todoController
    SourceCode: [ALTERCODE-FRAG]
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
        }
    [/ALTERCODE-FRAG]
}

Fragment Images-alterControllerImage {
    Action: add
    Priority: high
    FragmentationPoints: addDeleteMethodInstructions
    PointBracketsLan: java
    Destinations: Todo-todoController
    SourceCode: [ALTERCODE-FRAG]
     const imagePath = path.join(__dirname.replace('controllers', ''), '/public/uploads/');
    newpath = imagePath + id + ".jpg";
    try {
        fs.unlinkSync(newpath) //file removed
    } catch (err) {
        //nothing
    }

    [/ALTERCODE-FRAG]
}

Fragment Images-alterAddFields {
    Action: add
    Priority: high
    FragmentationPoints: addFields
    PointBracketsLan: java
    Destinations: Todo-todoController
    SourceCode: [ALTERCODE-FRAG]
    image: ""
    [/ALTERCODE-FRAG]
}