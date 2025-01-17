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
    index = {
        name: 'nameIndex',
        column: 'name'
    }

    constructor(dbHelper) {
        this.dbHelper = dbHelper;
    }

    async add(list) {
        return this.dbHelper.add(this.store, list);
    }

    async getById(id) {
        return this.dbHelper.get(this.store, id);
    }

    async getAll() {
        return this.dbHelper.getAll(this.store);
    }

    async update(list) {
        return this.dbHelper.put(this.store, list);
    }

    async delete(id) {
        return this.dbHelper.delete(this.store, id);
    }

}