let listStore = null;

$(document).ready(async () => {
  // const quill = new Quill("#editor", {
  //   modules: {
  //     toolbar: "#toolbar",
  //   },
  //   theme: "snow",
  // });
  // const quill = new Quill('#editor', {
  //   modules: {
  //     toolbar: [
  //       [{ header: [1, 2, false] }],
  //       ['bold', 'italic', 'underline'],
  //       ['image', 'code-block'],
  //     ],
  //   },
  //   placeholder: 'Compose an epic...',
  //   theme: 'snow', // or 'bubble'
  // });
  const elements = $('.project-marker-img');
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    $(element).html(project_marker);
  }
  // run()
  setupDatabase()

})


async function setupDatabase() {
  const dbHelper = new IndexedDBHelper("NotesAppDB", 1);

  listStore = new Lists(dbHelper)

  await dbHelper.openDatabase((db) => {
    for (let model in MODELS) {
      console.info(`Creating Model ${model}`);
      const temp_store = new MODELS[model](dbHelper);
      console.log(STORES)
      if (!db.objectStoreNames.contains(model)) {
        const notesStore = db.createObjectStore(model, { keyPath: "id", autoIncrement: true });
        notesStore.createIndex(temp_store.index.name, temp_store.index.column, { unique: false });
      }
    }
  });

  return dbHelper;
}


const submitList = async (e) => {
  // e.preventDefault();
  const list_name = $('#list-name').val();
  const list_color = $('#list-color').val();
  const data = listStore.format(list_name, list_color);
  const result = await listStore.add(data)
  MODAL.hide('#list-add-model')

}

