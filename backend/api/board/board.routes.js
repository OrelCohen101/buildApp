const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoard, addBoard, updateBoard, deleteBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router

router.get('/', log, getBoards)
router.get('/:id', log, getBoard)
router.post('/', log, addBoard)
router.put('/:id', log, updateBoard)
router.delete('/:id', log, deleteBoard)

module.exports = router