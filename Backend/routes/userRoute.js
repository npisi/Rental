const express = require('express')
const {getUser , updateUser , deleteUser} = require('../controllers/userController')
const {verifyUserAuth} = require('../middlewares/userAuth')

const router = express.Router()

router.get('/get-user' , verifyUserAuth, getUser)
router.delete('/delete-user', verifyUserAuth,deleteUser)
router.patch('/update-user' ,verifyUserAuth,  updateUser)

module.exports = router