class Lists {
    
    store = 'list';
    schema = {
      name: {
        unique: true,
      },
      color: {},
      order: {
        unique: true,
      },
      pin: {},
    };
    db = null;

    constructor(db) {
        this.db = db;
        this.db.schemaLoader(this.store, this.schema);
    }

    async get({where = null, orderBy = null} = {}) {
        var resolve,reject;
        const promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        })
        try {
            var results;
            if (!where && !orderBy) { 
                results = await this.db.read(this.store, null);;
                resolve(results)
                return promise;
            }

            if (where) {

            }

        } catch (error) {
            reject(error);
        }
        return promise;
    }

}