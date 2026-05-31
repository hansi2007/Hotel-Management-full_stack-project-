# 🏨 Hotel Management System

A full-stack Hotel Management System developed using **Python**, **Node.js**, and **MySQL** to streamline hotel operations such as room booking, customer management, reservations, check-in/check-out, and billing.

---

## 📌 Project Overview

The Hotel Management System is designed to automate and manage hotel-related activities efficiently. It helps hotel staff maintain customer records, manage room availability, process reservations, and generate billing information through a centralized platform.

---

## 🎯 Objectives

* Automate hotel management operations.
* Reduce manual record keeping.
* Improve booking and reservation management.
* Provide a user-friendly interface for administrators.
* Maintain customer and room information securely.

---

## ✨ Features

### 👤 Customer Management

* Add new customers
* View customer details
* Update customer information
* Delete customer records

### 🛏️ Room Management

* Add rooms
* Update room details
* Track room availability
* Manage room status

### 📅 Reservation Management

* Book rooms
* Modify reservations
* Cancel bookings
* View booking history

### 🔑 Check-In / Check-Out

* Customer check-in
* Customer check-out
* Automatic room status updates

### 💳 Billing System

* Generate bills
* Calculate room charges
* Display payment details

---

## 🛠️ Technology Stack

| Component       | Technology            |
| --------------- | --------------------- |
| Frontend        | HTML, CSS, JavaScript |
| Backend         | Node.js, Express.js   |
| Server Logic    | Python                |
| Database        | MySQL                 |
| Version Control | Git & GitHub          |
| API Testing     | Postman               |

---

## 🏗️ System Architecture

```text
Client/User
     │
     ▼
Frontend (HTML, CSS, JavaScript)
     │
     ▼
Node.js + Express Server
     │
     ▼
Python Processing Layer
     │
     ▼
MySQL Database
```

---

## 📂 Project Structure

```text
hotel-management-system/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   └── controllers/
│
├── python-server/
│   ├── app.py
│   └── services/
│
├── database/
│   └── hotel_db.sql
│
├── package.json
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/hotel-management-system.git
cd hotel-management-system
```

### 2️⃣ Install Node.js Dependencies

```bash
npm install
```

### 3️⃣ Install Python Dependencies

```bash
pip install flask mysql-connector-python
```

### 4️⃣ Configure MySQL Database

* Create a database named `hotel_db`
* Import the SQL file
* Update database credentials in the project configuration

### 5️⃣ Run the Node.js Server

```bash
node server.js
```

### 6️⃣ Run the Python Server

```bash
python app.py
```

---

## 📊 Database Modules

* Customer Table
* Room Table
* Reservation Table
* Billing Table
* Staff Table

---

## 🚀 Future Enhancements

* Online Payment Integration
* Email Notifications
* SMS Alerts
* QR Code-Based Check-In
* Admin Dashboard Analytics
* AI-Based Room Recommendations

---

## 📚 Learning Outcomes

* Full Stack Web Development
* REST API Development
* Database Design and Management
* Python Backend Integration
* Node.js Server Development
* GitHub Version Control

---

## 👨‍💻 Developed By

**Hansika**
B.Tech Data Science Student

---

## 📄 License

This project is developed for educational and academic purposes.
