const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String},
    email: { type: String, required: true, unique: true },
    favoriteGenre: { type: String, default: "General" },
    storiesCreated: { type: Number, default: 0 },
    totalWritingTime: { type: String, default: "0 hours" },
    memberSince: { type: String, default: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
    achievements: { type: [String], default: [] }
});
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    genre: { type: String, required: true },
    title: { type: String, required: true },
    //plot: { type: String, required: true },
    generatedStory: { type: String, required: true },
    images: { type: [String], required: false },
    createdAt: { type: Date, default: Date.now },
    liked:{type:Boolean,default: false },

});


const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true }, // Email field added
    feedback: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }, // Optional: Rating 1-5
    createdAt: { type: Date, default: Date.now },
  });

const Story = mongoose.model('Story', storySchema);

const User = mongoose.model('User', userSchema);

const Feedback=mongoose.model('Feedback',feedbackSchema);


module.exports = { User,Story,Feedback };