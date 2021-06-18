Fragment Images-alterAddRoutes {
    Action: add
    Priority: high
    FragmentationPoints: addUses
    PointBracketsLan: java
    Destinations: BasicStructure-index
    SourceCode: [ALTERCODE-FRAG]
    app.use(multer({ dest: '/public/uploads/' }).any());
    [/ALTERCODE-FRAG]
}

Fragment Images-alterAddImports {
    Action: add
    Priority: high
    FragmentationPoints: addImports
    PointBracketsLan: java
    Destinations: BasicStructure-index
    SourceCode: [ALTERCODE-FRAG]
    const multer = require('multer');
    [/ALTERCODE-FRAG]
}
