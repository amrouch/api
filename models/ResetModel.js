const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        //required: true
    },
    expires: {
        type: Date,
        //required: true
    }
});

const Reset = mongoose.model('ResetPassword', ResetSchema);

module.exports = Reset;
