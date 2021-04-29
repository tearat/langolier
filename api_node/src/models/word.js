// const database = require('../database/database')
const connection = require('../database/database')

const Word = {
    all: async () => {
        const sql = `select * from words;`
        return connection.promise().query(sql)
    },
    create: async ({ foreign, native }) => {
        const sql = `insert into words (\`foreign\`, native) values ('${foreign}', '${native}');`
        return connection.promise().query(sql)
    },
    update: async ({ id, native }) => {
        const sql = `update words set native = '${native}' where id = ${id};`
        return connection.promise().query(sql)
    },
    delete: async ({ id }) => {
        const sql = `delete from words where id = ${id};`
        return connection.promise().query(sql)
    },
}

module.exports = Word
