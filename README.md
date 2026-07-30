<div align="center">
  
  <img src="https://images.unsplash.com/photo-1593030761757-71fae4630b94?q=80&w=1200&auto=format&fit=crop" alt="Brossoc Banner" width="100%" style="border-radius:12px; margin-bottom: 20px;">

  <h1>👔 BROSSOC</h1>
  <p><strong>A Premium E-Commerce Platform for Men's Tailoring & Sartorial Elegance.</strong></p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Website-brossoc.binsadik.online-4a5225?style=for-the-badge)](https://brossoc.binsadik.online)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
</div>

<br>

## 📖 About The Project

**Brossoc** is a fully-featured, production-ready e-commerce platform built from the ground up using the robust **MVC (Model-View-Controller)** architecture. Designed with a bespoke, "Old Money" aesthetic, it offers a seamless and luxurious shopping experience for premium men's clothing, tailoring, knitwear, and accessories.

### 🌟 Live Production
The application is deployed on an **AWS EC2** instance, fully secured with Let's Encrypt SSL, and utilizes Nginx as a reverse proxy. 
👉 **[Visit Brossoc Live](https://brossoc.binsadik.online)**

---

## 📸 Platform Highlights

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Elegant Storefront</b><br><img src="https://res.cloudinary.com/brossoc/image/upload/v1785389021/brossoc-clothing/assets/bs5pwursxwukyormcidl.jpg" width="400"/></td>
      <td align="center"><b>Uncompromising Craftsmanship</b><br><img src="https://res.cloudinary.com/brossoc/image/upload/v1785389023/brossoc-clothing/assets/ybrredgp6vnvz52umglg.jpg" width="400"/></td>
    </tr>
  </table>
</div>

---

## ✨ Core Features

### 🛒 User Experience
*   **Authentication:** Secure Email/Password login (Bcrypt hashing) and one-click **Google OAuth2** integration.
*   **OTP Verification:** Email-based OTP verification using Nodemailer for account creation and password resets.
*   **Dynamic Product Catalog:** Advanced filtering (by category, price) and sorting, with high-resolution image galleries powered by **Cloudinary**.
*   **Shopping Cart & Wishlist:** Persistent cart and wishlist management with stock validation.
*   **Secure Checkout:** Seamless integration with **Razorpay** for Cards/UPI, alongside Cash on Delivery and an integrated **Wallet System**.
*   **Coupons & Offers:** Dynamic application of promotional codes and category-wide offers at checkout.
*   **User Dashboard:** Manage multiple delivery addresses, track order statuses, process returns/cancellations, and view wallet history.

### ⚙️ Admin Control Panel
*   **Comprehensive Dashboard:** Real-time analytics, revenue tracking, and top-selling product statistics.
*   **Inventory Management:** Full CRUD operations for Products, Categories, and image cropping/uploading.
*   **Order Fulfillment:** Track, update, and manage the entire lifecycle of customer orders.
*   **Marketing Tools:** Create and manage customized Coupons and limited-time Category Offers.
*   **Customer Management:** View user bases, manage account statuses (block/unblock).
*   **Sales Reporting:** Generate and download detailed sales reports in **PDF** and **Excel** formats.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, EJS (Embedded JavaScript templates), Vanilla JavaScript, SweetAlert2 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | Passport.js (Local & Google OAuth2), Express-Session |
| **Payments** | Razorpay API |
| **Media Storage** | Cloudinary |
| **Deployment** | AWS EC2 (Ubuntu), Nginx, PM2, Certbot (SSL) |

---

## 🚀 Installation & Local Setup

To run Brossoc locally on your machine, follow these steps:

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (v6.0 or higher running locally)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/risansadik/Brossoc-Clothing-Store.git
cd Brossoc-Clothing-Store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/brossoc-clothing
SESSION_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Application
```bash
# Start in development mode (with Nodemon)
npm run dev

# Start in production mode
npm start
```

---

## 📂 Project Structure

```text
Brossoc-Clothing-Store/
├── config/             # Database connection, Passport, Razorpay config
├── controllers/        # Route controllers (Admin & User)
├── helpers/            # Utility functions (Multer, PDF generation)
├── middlewares/        # Auth guards, Error handling
├── models/             # Mongoose schemas (User, Product, Order, etc.)
├── public/             # Static assets (CSS, JS, Fonts)
├── routes/             # Express route definitions
├── views/              # EJS Templates
│   ├── admin/          # Admin dashboard views
│   ├── user/           # Storefront views
│   └── partials/       # Reusable UI components
└── app.js              # Application entry point
```

---
<div align="center">
  <i>Crafted with precision. Styled for elegance.</i>
</div>
