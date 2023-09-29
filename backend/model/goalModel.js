const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    },
    text: {
        type: String, 
        required: [true, 'add text value']
    }
}, { 
    timestamps: true
}
)

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal