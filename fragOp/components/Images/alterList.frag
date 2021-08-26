Fragment Images-alterEnctypeFormat {
    Action: replace
    Priority: high
    FragmentationPoints: enctypeFormat
    PointBracketsLan: html
    Destinations: Todo-views-todo-list
    SourceCode: [ALTERCODE-FRAG]
      <form action="/todos" method="post" enctype="multipart/form-data"> 
    [/ALTERCODE-FRAG]
}

Fragment Images-alterAddFormField {
    Action: add
    Priority: high
    FragmentationPoints: addFormField
    PointBracketsLan: html
    Destinations: Todo-views-todo-list
    SourceCode: [ALTERCODE-FRAG]
        <div class="form-group row">
          <label class="col-sm-4 col-form-label"
            >Task Image (only .jpg supported)</label
          >
          <div class="col-sm-8">
            <input
              id="image"
              type="file"
              name="filetoupload"
              accept="image/*"
            />
          </div>
        </div>
    [/ALTERCODE-FRAG]
}

Fragment Images-alterAddColumnHeader {
    Action: add
    Priority: high
    FragmentationPoints: addColumnHeader, addColumnHeaderClosedSection
    PointBracketsLan: html
    Destinations: Todo-views-todo-list, Todo-views-todo-list
    SourceCode: [ALTERCODE-FRAG]
        <th scope="col">Image</th>
    [/ALTERCODE-FRAG]
}

Fragment Images-alterAddColumnContent {
    Action: add
    Priority: high
    FragmentationPoints: addColumnContent, addColumnContentClosedSection
    PointBracketsLan: html
    Destinations: Todo-views-todo-list, Todo-views-todo-list
    SourceCode: [ALTERCODE-FRAG]
        <td>
            <% if(todos[i].image) { %>
            <img src="/uploads/<%= todos[i].image%>" class="img-thumbnail" />
            <% } %>
        </td>
    [/ALTERCODE-FRAG]
}