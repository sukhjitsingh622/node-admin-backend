const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        avatar: {
            type: String,
            default: ''
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true //createdAt updatedAt
    }
);

//for save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
    // next();
});

//for login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//for update
userSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();

    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    if (update.$set && update.$set.password) {
        update.$set.password = await bcrypt.hash(update.$set.password, 10);
    }

});


module.exports = mongoose.model('User', userSchema);