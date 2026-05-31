const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'booknest_super_secret_key';

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// ============ AUTH MIDDLEWARE ============
function authRequired(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin only access' });
}

// ================= AUTH =================
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email exists' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'customer')",
      [name, email, hash]
    );

    const user = { id: result.insertId, name, email, role: 'customer' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid login' });

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid login' });

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ================= HOTELS (FIXED) =================

// ✅ This now GUARANTEES it uses the correct table
app.get('/api/hotels', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        hotel_id,
        name,
        city,
        address,
        star_rating,
        rating,
        price_per_night,
        image_url
      FROM hotels
    `);

    res.json(rows);
  } catch (err) {
    console.error("HOTEL FETCH ERROR:", err);
    res.status(500).json({ message: 'Failed to fetch hotels' });
  }
});

// ✅ Fixed hotel room fetch
app.get('/api/hotels/:id/rooms', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM rooms WHERE hotel_id = ? AND is_available = 1',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("ROOM FETCH ERROR:", err);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});

// ================= BOOKINGS =================
function calculateNights(check_in, check_out) {
  return (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24);
}

app.post('/api/bookings', authRequired, async (req, res) => {
  const { room_id, check_in, check_out } = req.body;

  try {
    const [roomRows] = await db.query('SELECT * FROM rooms WHERE id=?', [room_id]);
    if (!roomRows.length) return res.status(404).json({ message: 'Room not found' });

    const nights = calculateNights(check_in, check_out);
    const price = roomRows[0].price_per_night * nights;

    const [result] = await db.query(
      "INSERT INTO bookings (user_id,room_id,check_in,check_out,total_price,status) VALUES (?,?,?,?,?,'confirmed')",
      [req.user.id, room_id, check_in, check_out, price]
    );

    res.json({ message: 'Booking confirmed', booking_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

app.get('/api/bookings/my', authRequired, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.*, 
        r.room_type,
        r.room_number,
        h.name AS hotel_name,
        h.city
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.hotel_id
      WHERE b.user_id = ?
      ORDER BY b.id DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load bookings' });
  }
});

// ================= ADMIN =================

app.post('/api/admin/hotels', authRequired, adminOnly, async (req, res) => {
  const { name, city, address, star_rating, rating, price_per_night, image_url } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO hotels (name, city, address, star_rating, rating, price_per_night, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, city, address, star_rating, rating, price_per_night, image_url]
    );
    res.json({ message: 'Hotel added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hotel add failed' });
  }
});

app.post('/api/admin/rooms', authRequired, adminOnly, async (req, res) => {
  const { hotel_id, room_type, price_per_night, room_number } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO rooms (hotel_id, room_type, room_number, price_per_night, max_guests, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [hotel_id, room_type, room_number || null, price_per_night, 2, 1]
    );
    res.json({ message: 'Room added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Room add failed' });
  }
});

// ================= AUTO ADMIN =================
async function createDefaultAdmin() {
  const email = 'admin@hotel.com';
  const password = 'Admin123';

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (rows.length) return;

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name,email,password_hash,role) VALUES ('Admin User',?,?, 'admin')",
      [email, hash]
    );
    console.log('✅ Default admin created');
  } catch (err) {
    console.error(err);
  }
}

// ================= START SERVER =================
app.listen(PORT, async () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  await createDefaultAdmin();
});
