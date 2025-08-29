# 🖥️ PC Part Shop - MERN Stack Application

A full-featured e-commerce web application for PC parts and components built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🚀 Features

-- ✅ Admin dashboard with statistics  
-- ✅ Product management  
-- ✅ Order management  
-- ✅ User management  
-- ✅ User authentication (JWT-based)  
-- ✅ Role-based access control (Admin & Customer)  
-- ✅ Protected routes  
-- ✅ Responsive design (Tailwind CSS)  
-- ✅ Product browsing with categories, brands, and details  
-- ✅ Search and filter functionality  
-- ✅ Shopping cart with persistent storage  
-- ✅ Checkout flow

---

## 📂 Project Structure

```text
PC/
│
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── uploads/
│   │   ├── products/
│   │   └── users/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── uploadMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   └── utils/
│       └── seedData.js
│
├── frontend/ (React + Vite)
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   └── Loader.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── Category.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Dashboard/
│       │   │   ├── Admin/
│       │   │   │   ├── AdminDashboard.jsx
│       │   │   │   ├── OrderDetailModal.jsx
│       │   │   │   ├── OrdersManager.jsx
│       │   │   │   ├── Overview.jsx
│       │   │   │   ├── ProductManager.jsx
│       │   │   │   └── UsersManager.jsx
│       │   │   └── User/
│       │   │       ├── AccountStats.jsx
│       │   │       ├── OrderDetailModal.jsx
│       │   │       ├── OrdersSection.jsx
│       │   │       ├── ProfileSection.jsx
│       │   │       ├── QuickActions.jsx
│       │   │       └── UserDashboard.jsx
│       │   └── Auth/
│       │       ├── Login.jsx
│       │       └── Register.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── hooks/
│       │   └── useFetch.js
│       └── utils/
│           └── api.js
│
└── README.md
⚙️ Installation
1️⃣ Clone the repository
bash
Copy code
git clone https://github.com/Ginsatoru/PC.git
cd PC
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file in the backend/ folder:

ini
Copy code
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pcpartshop
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
Run the backend:

bash
Copy code
npm run dev
3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
🛠 Tech Stack
Frontend
-- ✅ React.js 18 (Vite)
-- ✅ React Router DOM
-- ✅ Tailwind CSS
-- ✅ Axios for API calls
-- ✅ React Hot Toast notifications
-- ✅ Context API for state management

Backend
-- ✅ Node.js with Express.js
-- ✅ MongoDB with Mongoose
-- ✅ JWT authentication & role-based access
-- ✅ Password hashing with bcryptjs
-- ✅ CORS and security middleware
-- ✅ File uploads with Multer

📊 Admin Panel Features
-- ✅ Dashboard with real-time statistics
-- ✅ Manage products (add, update, delete)
-- ✅ Manage users (customers & admins)
-- ✅ Manage orders (view & update status)

📌 Notes
-- ✅ All sensitive environment variables are stored in .env
-- ✅ uploads/ folder stores product & user images
-- ✅ Backend runs on localhost:5000, frontend on localhost:5173
```
