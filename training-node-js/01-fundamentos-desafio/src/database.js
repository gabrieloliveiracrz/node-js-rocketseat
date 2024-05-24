import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        const data = this.#database[table] ?? [];

        if (search) {
            const filteredData = data.filter(row => {
                return Object.entries(search).every(([key, value]) => {
                    return row[key] && row[key].includes(value);
                });
            });
            return filteredData;
        }
    
        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        const rowData = this.#database[table].find(row => row.id === id);
        
        if (!rowData) {
            console.error("Task não encontrada");
            return;
        }

        const newData = {
            title: data.title ?? rowData.title,
            description: data.description ?? rowData.description,
            completed_at: data.status ?? rowData.completed_at,
            created_at: rowData.created_at,
            updated_at: data.updated_at ?? rowData.updated_at
        };


        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...newData };
            this.#persist();
        }
    }


    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)


        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }else {
            console.error("Task não encontrada");
        }
    }

}