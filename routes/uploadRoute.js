const express = require("express")

const uploadController = require("../Controller/uploadController");


const router = express.Router()

router.route("/")
    .post(uploadController.uploadUserFile ,uploadController.fileUploader)


module.exports = router