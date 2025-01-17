const STORES = {};

$(document).ready(() => {
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
  this.DB = setupDatabase()
})

const run = () => {
  const db = new IndexedDB();
  db.onSuccess = async () => {
    const list = new Lists(db);
    const data = await list.get();
    console.log(data)
  }
}


async function setupDatabase() {
  const dbHelper = new IndexedDBHelper("NotesAppDB", 1);

  await dbHelper.openDatabase((db) => {
    for (let model in MODELS) {
      console.info(`Creating Model ${model}`);
      STORES[model] = new MODELS[model](dbHelper);
      console.log(STORES.index)
      if (!db.objectStoreNames.contains(model)) {
        const notesStore = db.createObjectStore(model, { keyPath: "id", autoIncrement: true });
        notesStore.createIndex(STORES[model].index.name, STORES[model].index.column, { unique: false });
      }
    }
  });

  return dbHelper;
}

