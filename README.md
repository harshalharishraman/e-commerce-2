# E-Commerce Backend API

## Overview

This project is a production-oriented e-commerce backend built using Node.js, Express.js, PostgreSQL, and Knex.js. It follows a layered architecture that separates routing, business logic, and database operations, enabling maintainability, scalability, and clean code practices. The application exposes RESTful APIs designed to support modern e-commerce workflows and future feature expansion.

The platform provides dedicated customer and administrator modules secured through JWT-based authentication and role-based access control. Customers can browse products, manage carts, and place orders, while administrators can manage categories, subcategories, products, inventory, and platform data. Secure password hashing and transactional operations help maintain application security and data integrity.

To support cloud-native deployments, product images are stored in AWS S3 using
Multer-S3 integration, eliminating dependence on local storage. PostgreSQL
transactions ensure consistency during inventory and checkout operations.
Redis supports OTP storage and BullMQ job coordination, while a dedicated
worker processes scheduled abandoned-cart cleanup and inventory restoration.
The system is designed with reliability, performance, and scalability as core
architectural priorities.

---

# Key Highlights

* JWT Authentication with Refresh Tokens
* Role-Based Access (Admin/User)
* PostgreSQL + Knex Query Builder
* Redis-Based OTP Storage and Request Limiting
* AWS S3 Product Image Storage
* Transaction-Based Database Operations
* Cart & Checkout System
* BullMQ-Based Background Job Processing
* Automated Cart Cleanup and Inventory Restoration
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
* Redis

### Authentication

* JWT Access Tokens
* JWT Refresh Tokens
* bcrypt Password Hashing

### File Storage

* AWS S3
* Multer
* Multer-S3

### Background Jobs

* BullMQ
* Redis

### Email and OTP

* Resend
* otp-generator
* Redis

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

Background processing follows a queue-based flow:

```text
Application Startup
    |
BullMQ Scheduler
    |
Redis Cart Queue
    |
Dedicated Cart Worker
    |
Cart Cleanup Transaction
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

### Background Processing Components

```text
src/
|-- queue.js       BullMQ queue and Redis connection configuration
|-- scheduler.js   Recurring cart-cleanup schedule registration
`-- worker.js      Dedicated cart queue worker

jobs/
`-- cart_cleanup.js   Transactional cart-cleanup job
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

### Email OTP Verification

Customer email verification uses a Redis-backed, single-use OTP flow.

The flow:

* Validates the customer email before generating an OTP
* Generates a four-digit numeric OTP
* Stores only the bcrypt-hashed OTP under `otp:<email>`
* Applies a five-minute expiration
* Enforces a 30-second cooldown between requests
* Limits generation to three attempts during the active key lifetime
* Sends the OTP through Resend
* Verifies the submitted value against the stored hash
* Deletes the Redis key after successful verification

Removing the key after verification prevents OTP replay. Expired, missing, and
incorrect OTP values are rejected.

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

### View Products by Category and Subcategory

Returns products associated with the selected category and subcategory IDs.

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

# Middleware and Request Processing

The application uses reusable middleware and service helpers to secure routes,
process multipart requests, manage cloud-hosted product images, and support OTP
delivery.

## JWT Authentication Middleware

Protected customer, administrator, and product routes pass through the shared
access-token verification middleware.

Responsibilities include:

* Requiring an `Authorization` request header
* Enforcing the `Bearer <token>` authentication format
* Verifying access-token signatures and expiration
* Selecting separate JWT secret keys for customers and administrators
* Attaching the decoded token payload to `req.user`
* Rejecting missing, malformed, invalid, or expired tokens

Public registration, login, refresh-token, and OTP routes are registered before
the customer authentication middleware and remain accessible without an access
token.

---

## Product Image Upload Middleware

Product create and update routes use Multer with Multer-S3 to process multipart
image uploads and stream files directly to AWS S3.

Upload behavior:

* Accepts images from the `images` multipart field
* Supports multiple product images per request
* Limits each uploaded file to 5 MB
* Automatically preserves the uploaded file content type
* Generates timestamp-based object names
* Stores objects under the `sub-categories-images/` S3 prefix
* Uses environment-based AWS region, credentials, and bucket configuration

Product deletion operations use the shared S3 deletion helper to remove image
objects from the configured bucket. Delete requests use `upload.none()` to
parse multipart form fields without accepting files.

---

## OTP Generation and Email Helper

The OTP helper in `middlewares/otp.js` supports the customer verification flow.
Although it is consumed as a service helper rather than route middleware, it is
kept in the middleware module directory.

Responsibilities include:

* Generating four-digit numeric OTP values
* Excluding alphabetic and special characters
* Sending OTP messages through Resend
* Providing an HTML email template
* Communicating the five-minute OTP validity period
* Propagating delivery errors to the customer model for centralized handling

OTP hashing, Redis storage, request limiting, expiration, and verification are
handled by the customer model.

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

# Redis Usage

Redis supports two independent application concerns:

## OTP Records

The reusable CommonJS client in `redis_config.js` connects through `REDIS_URL`,
uses RESP3, and centrally reports Redis connection and runtime errors. OTP data
is stored in email-specific hashes containing the bcrypt hash,
generation-attempt count, and latest delivery timestamp. Records expire after
five minutes and are removed immediately after successful verification.

## BullMQ Queue

BullMQ uses Redis to coordinate the recurring cart-cleanup scheduler and the
dedicated cart worker. Queue jobs retry up to three times with exponential
backoff beginning at five seconds. Completed and failed job history is bounded
to prevent unlimited Redis growth.

The current BullMQ connection targets `localhost:6379` in `src/queue.js`.
Deployments using a remote Redis service must update this queue connection
configuration in addition to setting `REDIS_URL` for OTP storage.

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

Cart cleanup is implemented as a BullMQ recurring job rather than an in-process
cron callback.

Processing flow:

* Application startup registers the recurring scheduler
* The `cart` queue stores scheduled cleanup jobs in Redis
* A separately started worker consumes `cart-cleanup` jobs
* Worker concurrency is limited to one job at a time
* Failed jobs retry up to three times with exponential backoff
* Worker completion and failure events are logged

The schedule uses the cron pattern `0 * * * *`, which queues a cleanup job at
the start of every hour.

Responsibilities:

* Detect active carts unchanged for more than two hours
* Restore reserved stock using grouped, set-based updates
* Mark matching carts as abandoned within the same transaction
* Report abandoned cart and restored product counts
* Report total cleanup execution time

The cleanup uses a single PostgreSQL Common Table Expression transaction for
bulk cart selection, grouped inventory restoration, and atomic cart status
updates. Errors are rethrown to BullMQ so its retry policy can handle transient
failures.

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

RESEND_API_KEY=

REDIS_URL=
```

`REDIS_URL` configures the shared OTP Redis client. The BullMQ queue currently
uses `localhost:6379` from `src/queue.js`.

---

# Running the Application

Install dependencies:

```bash
npm install
```

Start the API server and register the recurring cart-cleanup schedule:

```bash
npm start
```

Start the cart worker in a separate process:

```bash
npm run worker:cart
```

The API startup waits for successful scheduler registration before opening the
HTTP port. If registration fails, startup exits with an error instead of
running without the scheduled cleanup process.

---

# API Route Summary

## Customer Routes

```http
POST   /cus/signup
POST   /cus/login
POST   /cus/refresh
POST   /cus/otp/send
GET    /cus/otp/verify

POST   /cus/cart/add
DELETE /cus/cart/del
POST   /cus/cart/check_out
```

---

## Product Routes

```http
GET /cus/categories/get_all
GET /cus/categories/all_sub/:id
GET /cus/categories/:cid/sub/:sid/products
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


