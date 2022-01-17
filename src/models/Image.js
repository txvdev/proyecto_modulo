const { Schema, model } = require('mongoose');

const imageSchema = new Schema ({
    title: { type: String, required: true },
    description: { type: String, required: true },
    filename: { type: String },
    path: { type: String },
    originalname: { type: String},
    mimetype: { type: String },
    size: { type: Number },
    user: { type: String },
    created_at: { type: Date, default: Date.now() }
});

module.exports = model('Image', imageSchema);