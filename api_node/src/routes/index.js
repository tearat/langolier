const express = require('express')
const router = express.Router()
const wordsController = require('../controllers/words')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.get('/', (req, res) => res.send({ status: "API ready" }))

router.get('/words', async (req, res) => wordsController.all(req, res))
router.post('/words', async (req, res) => wordsController.create(req, res))
router.put('/words/:id', async (req, res) => wordsController.update(req, res))
router.delete('/words/:id', async (req, res) => wordsController.delete(req, res))

module.exports = router;
