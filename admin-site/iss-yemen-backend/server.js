require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

async function createDefaultAdmin() {
  const existingAdmin = await User.findOne({ username: 'admin' });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    username: 'admin',
    password: hashedPassword,
    role: 'admin'
  });

  console.log('✅ Default admin created: username=admin, password=admin123');
}

createDefaultAdmin();

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('ISS Yemen API running ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
