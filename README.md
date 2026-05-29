# E-Commerce Backend API

## Overview

This project is a production-oriented e-commerce backend built using Node.js, Express.js, PostgreSQL, and Knex.js. It follows a layered architecture that separates routing, business logic, and database operations, enabling maintainability, scalability, and clean code practices. The application exposes RESTful APIs designed to support modern e-commerce workflows and future feature expansion.

The platform provides dedicated customer and administrator modules secured through JWT-based authentication and role-based access control. Customers can browse products, manage carts, and place orders, while administrators can manage categories, subcategories, products, inventory, and platform data. Secure password hashing and transactional operations help maintain application security and data integrity.

To support cloud-native deployments, product images are stored in AWS S3 using Multer-S3 integration, eliminating dependence on local storage. PostgreSQL transactions ensure consistency during inventory and checkout operations, while cron-based background jobs automate abandoned cart cleanup and inventory restoration. The system is designed with reliability, performance, and scalability as core architectural priorities.

---

# Key Highlights

* JWT Authentication with Refresh Tokens
* Role-Based Access (Admin/User)
* PostgreSQL + Knex Query Builder
* AWS S3 Product Image Storage
* Transaction-Based Database Operations
* Cart & Checkout System
* Automated Cart Cleanup Job
* Modular MVC Architecture
* Production Deployment Ready
* Scalable Cloud-Native Design

# Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (AWS RDS)
* Knex.js Query Builder

### Authentication

* JWT Access Tokens
* JWT Refresh Tokens
* bcrypt Password Hashing

### File Storage

* AWS S3
* Multer
* Multer-S3

### Background Jobs

* node-cron

### Deployment Ready

* AWS EC2
* AWS RDS
* AWS S3

---

# Project Architecture

The project follows a layered architecture:

```text
Routes
   ↓
Controllers
   ↓
Models
   ↓
PostgreSQL Database
```

### Folder Structure

```text
e-commerce-2/

├── control/
│   ├── controller_admin.js
│   ├── controller_cus.js
│   └── controller_item.js
│
├── model/
│   ├── models_admin.js
│   ├── models_cus.js
│   └── models_item.js
│
├── view/
│   ├── router_admin.js
│   ├── router_cus.js
│   └── router_items.js
│
├── middlewares/
│   └── upload.js
│
├── token/
│   └── token_cus.js
│
├── jobs/
│   └── cart_cleanup.js
│
├── mig/
│   └── database migrations
│
├── images/
│
├── knexfile.js
├── index.js
└── .env
```

---

# Core Features

## Customer Module

### Customer Registration

Allows users to create accounts with:

* Name
* Email
* Password
* Main Address
* Secondary Address
* Date of Birth

Passwords are securely hashed using bcrypt before being stored.

---

### Customer Login

Customers can log in using:

* Name
* Email
* Password

Successful login generates:

* Access Token (30 minutes)
* Refresh Token (7 days)

---

### Shopping Cart Management

Customers can:

* Add products to cart
* Remove products from cart
* Checkout cart

When a product is added:

* Product stock is reduced immediately
* Cart is automatically created if one does not exist

---

### Checkout System

During checkout:

* Cart is converted into an order
* GST is calculated
* Shipping charges are calculated
* Final payable amount is generated
* Order record is stored

Generated checkout response contains:

* Order ID
* Shipping Address
* Product List
* Product Cost
* GST Amount
* Shipping Cost
* Final Cost

---

# Admin Module

## Admin Registration

Administrators can register using:

* Name
* Email
* Password
* Employee ID

Credentials are encrypted before storage.

---

## Admin Login

Admins receive:

* Access Token
* Refresh Token

Admin routes are protected using JWT authentication.

---

## Category Management

Admins can:

### Create Categories

Example:

```text
Electronics
Fashion
Books
Sports
```

Features:

* Automatic slug generation
* Duplicate prevention
* Transaction-based inserts

---

### Update Categories

Admins can rename existing categories.

Slug values are automatically updated.

---

### Delete Categories

Multiple categories can be deleted in a single request.

---

## Subcategory Management

Admins can:

### Add Subcategories

Examples:

```text
Mobiles
Laptops
Shoes
Watches
```

Each subcategory belongs to a category.

---

### Update Subcategories

Rename existing subcategories.

---

### Delete Subcategories

Bulk deletion supported.

---

## Product Management

Admins can:

### Create Products

Product information includes:

* Name
* Description
* Brand
* Price
* Stock
* Category
* Subcategory
* Product Images

---

### Product Image Uploads

Images are uploaded directly to AWS S3.

Stored using:

```text
Multer
Multer-S3
AWS SDK v3
```

Benefits:

* No local storage dependency
* Cloud-hosted images
* Scalable image management

---

### Update Products

Modify:

* Product details
* Stock
* Price
* Brand
* Description

---

### Delete Products

Products can be removed from inventory.

---

# Product Browsing APIs

Authenticated users can:

### View All Categories

Returns complete category list.

### View Subcategories

Returns subcategories under a selected category.

---

# Authentication System

Implemented using JWT.

## Access Token

Used for:

```text
Protected API Access
```

Expiration:

```text
30 Minutes
```

---

## Refresh Token

Used for:

```text
Generating New Access Tokens
```

Expiration:

```text
7 Days
```

---

## Protected Routes

Authentication middleware validates:

```http
Authorization: Bearer <token>
```

Admin and customer tokens use separate secret keys.

---

# Database Design

Main tables:

### Customers

```text
ecom2_cus_tb
```

Stores:

* Customer Details
* Addresses
* Credentials

---

### Admins

```text
admin_tb
```

Stores:

* Admin Details
* Employee IDs
* Login Activity

---

### Categories

```text
categories
```

Stores:

* Category Name
* Slug

---

### Subcategories

```text
subcategories_tb
```

Stores:

* Category Relationship
* Slug

---

### Products

```text
product_tb
```

Stores:

* Product Information
* Pricing
* Stock
* Images

---

### Cart

```text
cart_tb
```

Stores:

* Customer Cart
* Cart Status

Statuses:

```text
active
converted_to_order
abandoned
```

---

### Cart Items

```text
cart_items_tb
```

Stores:

* Product References
* Quantity
* Price Snapshot

---

### Orders

```text
orders_tb
```

Stores:

* Order Details
* Final Amount

---

# Transaction Management

Critical operations use PostgreSQL transactions:

* Product Creation
* Category Operations
* Subcategory Operations
* Cart Operations
* Checkout Operations

Benefits:

* Atomicity
* Data Consistency
* Rollback Support

---

# Background Jobs

## Cart Cleanup Job

Implemented using:

```text
node-cron
```

Runs every hour.

Responsibilities:

* Detect abandoned carts
* Restore reserved stock
* Mark carts as abandoned

This prevents inventory from being locked indefinitely.

---

# Environment Variables

Required:

```env
Port=

aws_rds_host=
aws_rds_user=
aws_rds_prd=
aws_rds_db=

access_sec_k=
refresh_sec_k=

admin_access_sec_k=
admin_refresh_sec_k=

AWS_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
```

---

# API Route Summary

## Customer Routes

```http
POST   /cus/signup
POST   /cus/login
POST   /cus/refresh

POST   /cus/cart/add
DELETE /cus/cart/del
POST   /cus/cart/check_out
```

---

## Product Routes

```http
GET /cus/categories/get_all
GET /cus/categories/all_sub/:id
```

---

## Admin Routes

```http
POST /admin/signup
POST /admin/login
POST /admin/refresh
```

### Categories

```http
POST   /admin/add_categories
DELETE /admin/delete_categories
PUT    /admin/update_categories
```

### Subcategories

```http
POST   /admin/categories/add_subs
DELETE /admin/categories/del_subs
PUT    /admin/categories/upd_subs
```

### Products

```http
POST   /admin/categories/:cid/sub/:sid/add
DELETE /admin/categories/:cid/sub/:sid/del
PUT    /admin/categories/:cid/sub/:sid/upd
```

---


