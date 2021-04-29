const Word = require('../models/word')

const response = ({ res, result, text }) => {
    if( result[0].affectedRows === 1 ) {
        res.send({ status: text, id: result[0].insertId })
    } else {
        res.send({ status: `Error. Not ${text}` })
    }
}

const error = ({ res, text }) => {
    res.send({ status: `Error. ${text}` })
}

const wordsController = {
    all: async (req, res) => {
        const result = await Word.all()
        res.json(result[0])
    },
    create: async (req, res) => {
        const { native, foreign } = req.body
        if( !native || !foreign ) return error({ res, text: "Empty data!" })
        await Word.create({ native, foreign }).then(result => response({ res, result, text: "Created"}))
    },
    update: async (req, res) => {
        const { native } = req.body
        const { id } = req.params
        if( !native ) return error({ res, text: "Empty data!" })
        await Word.update({ id, native }).then(result => response({ res, result, text: "Updated"}))
    },
    delete: async (req, res) => {
        const { id } = req.params
        await Word.delete({ id }).then(result => response({ res, result, text: "Deleted"}))
    },
}

module.exports = wordsController;
