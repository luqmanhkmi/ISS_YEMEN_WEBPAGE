const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  publishDate: { type: Date, required: true, default: Date.now },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

announcementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Announcement', announcementSchema);
