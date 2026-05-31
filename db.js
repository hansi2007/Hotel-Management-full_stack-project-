const mysql = require('mysql2');

// ✅ Change these values as per your MySQL setup
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Your MySQL username
    password: 'Pass@123',          // Your MySQL password (leave blank if none)
    database: 'booknest',  // Database name (must match your SQL)
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL Connection Failed:', err.message);
    } else {
        console.log('✅ MySQL Connected Successfully');
        connection.release();
    }
});

module.exports = db.promise();
