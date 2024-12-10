// Open the IndexedDB database
const dbName = "MyDatabase";
const dbVersion = 1; // Increment this when upgrading the database
let db;

const models = {
  tags: {
    name: {
      unique: true,
    },
  },
  list: {
    name: {
      unique: true,
    },
    color: {},
    order: {
      unique: true,
    },
    pin: {},
  },
  notes: {
    title: {
      unique: true,
    },
    desc: {},
  },
};

const model_keys = Object.keys(models);

const openDb = () => {
  const request = indexedDB.open(dbName, dbVersion);

  // Create the object store when first creating the DB
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    // if (!db.objectStoreNames.contains('users')) {
    //   const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    //   objectStore.createIndex('name', 'name', { unique: false });
    // }
    schemaLoader(db);
  };

  // Handle success and errors
  request.onsuccess = function (event) {
    db = event.target.result;
    console.info("Database opened successfully");
  };

  request.onerror = function (event) {
    console.error("Database failed to open", event);
  };
};

const schemaLoader = (db) => {
  model_keys.forEach((model) => {
    if (!db.objectStoreNames.contains(model)) {
      console.info(`Creating Model ${model}`);
      const objectStore = db.createObjectStore(model, {
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

// Create or Add new data to the database
const create = async (storeName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
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
const read = async (storeName, id = null) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

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

// Update an existing user's data
const update = (storeName, id, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
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
const deleteByID = (storeName, id) => {
  const transaction = db.transaction([storeName], "readwrite");
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
const closeDb = () => {
  if (db) {
    db.close();
    console.info("Database closed");
  }
};

// Usage
openDb();

// // Example user data
// const user1 = { name: 'John Doe', age: 30, email: 'john@example.com' };

// // Create
// createUser(user1);

// // Read
// readUser(1);

// // Update
// const updatedUser = { age: 31 };
// updateUser(1, updatedUser);

// // Delete
// deleteUser(1);
