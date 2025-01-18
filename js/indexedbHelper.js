class IndexedDBHelper {
    constructor(databaseName, version) {
        this.databaseName = databaseName;
        this.version = version;
        this.db = null;
    }

    async openDatabase(setupCallback) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.databaseName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (setupCallback) {
                    setupCallback(db); // Pass control to set up all object stores
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject(`Error opening database: ${event.target.errorCode}`);
            };
        });
    }

    transaction(storeName, mode = "readonly") {
        if (!this.db) {
            throw new Error("Database is not opened. Call openDatabase first.");
        }
        return this.db.transaction(storeName, mode).objectStore(storeName);
    }

    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const store = this.transaction(storeName, "readwrite");
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const store = this.transaction(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const store = this.transaction(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async put(storeName, data) {
        return new Promise((resolve, reject) => {
            const store = this.transaction(storeName, "readwrite");
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const store = this.transaction(storeName, "readwrite");
            const request = store.delete(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
}