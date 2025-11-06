const express = require('express');
const Announcement = require('../models/Announcement');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ publishDate: -1 })
      .lean();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, adminOnly, async (req, res) => {
  const { title, body, publishDate } = req.body;
  if (!title || !body) return res.status(400).json({ message: 'Missing fields' });

  try {
    const announcement = new Announcement({
      title,
      body,
      publishDate: publishDate || Date.now(),
      author: {
        id: req.user.id,
        username: req.user.username || 'admin'
      }
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { title, body, publishDate } = req.body;

  try {
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: 'Not found' });

    ann.title = title ?? ann.title;
    ann.body = body ?? ann.body;
    ann.publishDate = publishDate ?? ann.publishDate;
    ann.updatedAt = Date.now();
    await ann.save();
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: 'Not found' });

    await ann.remove();
    res.json({ message: 'Deleted', id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
