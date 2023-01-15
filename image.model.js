const mongoose = require("mongoose");

const ImageSchema = {
    location: String,
    area: String,
    rating: Number,
    description: String,
    img: {
        data: Buffer,
        contentType: String
    }
};

module.exports = ImageModel = mongoose.model('imageModel', ImageSchema)