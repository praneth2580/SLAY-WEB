// Open the IndexedDB database
const dbName = "MyDatabase";
const dbVersion = 1; // Increment this when upgrading the database
let DB;

const models = {
  tags: {
    name: {
      unique: true,
    },
  },
  notes: {
    title: {
      unique: true,
    },
    desc: {},
  },
};

const model_keys = Object.keys(models);

class IndexedDB {

  DB = null;
  onSuccess = () => {};

  constructor() {
    this.openDb();
  }

  openDb = () => {
    const request = indexedDB.open(dbName, dbVersion);
    const context = this;

    // Create the object store when first creating the DB
    request.onupgradeneeded = function (event) {
      this.DB = event.target.result;
      // this.onStart();
      console.log("ON UPGARAGE DATE")
      // if (!db.objectStoreNames.contains('users')) {
      //   const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      //   objectStore.createIndex('name', 'name', { unique: false });
      // }
      // this.schemaLoaderALL(db);
    };

    // Handle success and errors
    request.onsuccess = function (event) {
      context.DB = event.target.result;
      context.onSuccess();
      console.info("Database opened successfully");
    };

    request.onerror = function (event) {
      console.error("Database failed to open", event);
    };
  };

  schemaLoaderALL = () => {
    model_keys.forEach((model) => {
      if (!this.DB.objectStoreNames.contains(model)) {
        console.info(`Creating Model ${model}`);
        const objectStore = this.DB.createObjectStore(model, {
          keyPath: "id",
          autoIncrement: true,
        });
        const model_attribures = Object.keys(models[model]);
        model_attribures.forEach((column) => {
          objectStore.createIndex(column, column, models[model][column]);
        });
      }
    });
  };

  schemaLoader = (store, schema) => {
    if (!this.DB.objectStoreNames.contains(store)) {
      console.info(`Creating Model ${store}`);
      const objectStore = this.DB.createObjectStore(store, {
        keyPath: "id",
        autoIncrement: true,
      });
      const model_attribures = Object.keys(schema);
      model_attribures.forEach((column) => {
        objectStore.createIndex(column, column, schema[column]);
      });
    }
  };

  // Create or Add new data to the database
  create = async (storeName, data) => {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = function () {
        console.info(`${storeName} added to the database`);
        resolve();
      };

      request.onerror = function (event) {
        console.error(`Error adding ${storeName}`, event);
        reject();
      };
    });
  };

  // Read data from the database
  read = async (storeName, id = null) => {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      var request;
      if (id) {
        request = store.get(id);
      } else {
        request = store.getAll();
      }

      request.onsuccess = function () {
        if (!request.result) {
          console.info(`${storeName} not found`);
          resolve([]);
          return;
        }
        console.info(`${storeName} found:`, request.result);
        resolve(request.result);
      };

      request.onerror = function (event) {
        console.error(`Error adding ${storeName}`, event);
        reject();
      };
    });
  };

  getByCondition(storeName, condition) {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);
  
      const results = [];
      const request = objectStore.openCursor(); // Open a cursor to iterate over all records
  
      request.onsuccess = (event) => {
        const cursor = event.target.result;
  
        if (cursor) {
          // Apply your condition (e.g., age > 20)
          if (condition(cursor.value)) {
            results.push(cursor.value);
          }
          cursor.continue(); // Move to the next record
        } else {
          resolve(results); // Resolve with all matching records
        }
      };
  
      request.onerror = (event) => {
        reject(`Error iterating records: ${event.target.errorCode}`);
      };
    });
  }

  // Update an existing user's data
  update = (storeName, id, data) => {
    return new Promise((resolve, reject) => {
      const transaction = this.DB.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = function () {
        const result = request.result;
        if (result) {
          Object.assign(result, data);
          const updateRequest = store.put(result);
          updateRequest.onsuccess = function () {
            console.info(`${storeName} updated`);
          };
        } else {
          console.info(`${storeName} not found`);
        }
      };

      request.onerror = function (event) {
        console.error(`Error updating ${storeName}`, event);
      };
    });
  };

  // Delete data from the database
  deleteByID = (storeName, id) => {
    const transaction = this.DB.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = function () {
      console.info(`${storeName} deleted`);
    };

    request.onerror = function (event) {
      console.error(`Error deleting ${storeName}`, event);
    };
  };

  // Close the database connection
  closeDb = () => {
    if (this.DB) {
      this.DB.close();
      console.info("Database closed");
    }
  };
}
