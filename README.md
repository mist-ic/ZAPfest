# ZAPfest Backend

A production-grade food delivery system backend built with Spring Boot 4 and MongoDB.

## Tech Stack (Latest as of Jan 2026)

| Component | Version |
|-----------|---------|
| Java | 21 |
| Spring Boot | 4.0.2 |
| MongoDB | 7.x |
| JJWT | 0.13.0 |
| springdoc-openapi | 3.0.1 |
| Bucket4j | 8.16.0 |
| Razorpay | 1.4.8 |

## Features

- JWT Authentication with role-based access (Admin, Restaurant Owner, Customer, Delivery Partner)
- Restaurant management with search, filter, and image upload
- Menu management with availability toggle
- Order lifecycle with status tracking
- Razorpay payment integration (mock mode available)
- Email notifications for order updates
- Reviews and ratings with aggregation
- Analytics dashboard for admins
- Rate limiting and caching
- Swagger/OpenAPI documentation
- Docker ready

## Quick Start

### With Docker

```bash
docker-compose up --build
```

### Without Docker

1. Ensure Java 21+ is installed
2. Start MongoDB on `localhost:27017`
3. Run:
```bash
mvn spring-boot:run
```

### Deploy to Railway

1. Push code to GitHub
2. Create new project in Railway from GitHub repo
3. Add MongoDB: Click **+ New** → **Database** → **MongoDB**
4. Set environment variables in your app service:
   - `MONGO_URL` = `${{MongoDB.MONGO_URL}}`
   - `JWT_SECRET` = your secure JWT key (min 256 bits)
5. Enable **Public Networking** → Generate Domain
6. Deploy! Railway auto-detects Java and builds with Maven

## API Documentation

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8080 | Server port (Railway sets this) |
| MONGO_URL | mongodb://localhost:27017/zapfest | MongoDB connection |
| JWT_SECRET | (dev secret) | JWT signing key |
| MAIL_HOST | smtp.gmail.com | SMTP host |
| MAIL_USERNAME | - | SMTP username |
| MAIL_PASSWORD | - | SMTP password |
| RAZORPAY_KEY_ID | rzp_test_dummy | Razorpay key |
| RAZORPAY_KEY_SECRET | dummy_secret | Razorpay secret |

## API Endpoints (35 total)

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/me` - Get profile
- `PUT /api/users/me` - Update profile
- `POST /api/users/me/avatar` - Upload avatar
- `GET /api/users` - List all (Admin)
- `PATCH /api/users/{id}/role` - Update role (Admin)

### Restaurants
- `GET /api/restaurants` - List (public)
- `GET /api/restaurants/search?q=` - Search
- `GET /api/restaurants/filter?cuisines=` - Filter
- `GET /api/restaurants/{id}` - Get by ID
- `POST /api/restaurants` - Create (Owner/Admin)
- `PUT /api/restaurants/{id}` - Update
- `POST /api/restaurants/{id}/image` - Upload image

### Menu
- `GET /api/restaurants/{id}/menu` - Get menu
- `POST /api/restaurants/{id}/menu` - Add item
- `PUT /api/restaurants/{id}/menu/{itemId}` - Update item
- `PATCH /api/restaurants/{id}/menu/{itemId}/availability` - Toggle

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - My orders
- `GET /api/orders/{id}` - Get order
- `PATCH /api/orders/{id}/status` - Update status
- `POST /api/orders/{id}/cancel` - Cancel

### Payments
- `POST /api/payments/create/{orderId}` - Create payment
- `POST /api/payments/webhook` - Razorpay webhook
- `POST /api/payments/verify` - Verify signature

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/restaurant/{id}` - Get reviews
- `DELETE /api/reviews/{id}` - Delete review

### Analytics (Admin)
- `GET /api/analytics/dashboard` - Dashboard
- `GET /api/analytics/revenue` - Revenue stats
- `GET /api/analytics/restaurant/{id}` - Restaurant stats

## Files

- `VIDEO_GUIDE.md` - Step-by-step demo recording instructions
- `ZAPfest-API.postman_collection.json` - Postman collection
