# ⚡ ZAPfest - Modern Food Delivery System

<div align="center">

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)
[![Netlify](https://img.shields.io/badge/Frontend_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)

<br />

> **A production-grade, event-driven food delivery platform built with Spring Boot and React.**

<br />

[![Live Demo](https://img.shields.io/badge/🚀_Live_Frontend-zapfest.netlify.app-FF5722?style=for-the-badge)](https://zapfest.netlify.app)
[![API Docs](https://img.shields.io/badge/📄_API_Documentation-Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://zapfest-production.up.railway.app/swagger-ui.html)

</div>

---

## 📋 Project Overview

**ZAPfest** is a robust backend system designed to simulate real-world industry requirements for a food delivery product. It features a layered architecture, secure JWT authentication, complex database querying, and external integrations.

### 🌟 Key Highlights
-   **Security First**: Role-Based Access Control (RBAC) with stateless JWT authentication.
-   **Performance**: Redis-ready caching architecture (Caffeine implemented) and API rate limiting.
-   **Scalability**: Dockerized and ready for cloud deployment (Live on Railway).
-   **Event-Driven**: Apache Kafka integration for real-time order processing events.
-   **Modern UI**: Sleek frontend built with React, Tailwind v4, and shadcn/ui.

---

## 🏗️ Architecture

This project follows a strict **Layered Architecture** to ensure separation of concerns and maintainability.

```mermaid
graph TD
    User[Client (Web/Mobile)] -->|HTTPS| Netlify[Frontend (React)]
    Netlify -->|REST API| Railway[Backend (Spring Boot)]
    
    subgraph "Backend Ecosystem"
        Railway -->|Auth/Logic| Controller
        Controller -->|DTO| Service
        Service -->|Data| Repository
        Repository -->|Query| DB[(MongoDB)]
        
        Service -->|Events| Kafka{Apache Kafka}
        Service -->|Payment| Razorpay[Payment Gateway]
    end
```

---

## 🛠️ Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Backend** | `Spring Boot 3.x` | Core application framework |
| **Language** | `Java 21` | Modern Java features |
| **Database** | `MongoDB` | NoSQL data store for flexible schema |
| **Frontend** | `React + Vite` | Single Page Application (SPA) |
| **Styling** | `Tailwind CSS v4` | Utility-first styling |
| **UI Lib** | `shadcn/ui` | Accessible component library |
| **Security** | `Spring Security + JWT` | Authentication & Authorization |
| **Docs** | `SpringDoc OpenAPI` | Automated Swagger Documentation |
| **DevOps** | `Docker + Railway` | Containerization & Cloud Hosting |

---

## ✅ Features Implementation Status

Aligned with the **Product Requirements Document (PRD)**.

| Feature Module | Requirement | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **User Management** | Register, Login, RBAC, JWT | ✅ | `BCrypt` hashing, `JJCWT` Library, Custom Security Filter |
| **Core Domain** | CRUD (Restaurants, Menu, Orders) | ✅ | Full REST API with Pagination & Sorting |
| **Advanced Query** | Complex Filtering, Search | ✅ | `MongoTemplate` regex search for Cuisines & Names |
| **Security** | Rate Limiting, Input Validation | ✅ | `Bucket4j` for API throttling, `Jakarta Validation` |
| **Integrations** | Payment / Email | ✅ | **Razorpay** Mock Integration + **JavaMailSender** |
| **Analytics** | Dashboard APIs | ✅ | Aggregation pipelines for Revenue & Order stats |
| **Bonus** | Frontend UI | ⭐ | Premium React Dashboard with Dark/Light modes |
| **Bonus** | Cloud Deployment | ⭐ | **Railway** (Backend) + **Netlify** (Frontend) |
| **Bonus** | Event-Driven | ⭐ | **Kafka** Producer/Consumer for Order updates |

---

## 🚀 Getting Started

### ☁️ Cloud Access (Recommended)
Simply visit the live links above to test the application without any installation.
-   **Admin Creds**: `admin@zapfest.com` / `admin123`
-   **User Creds**: `customer@test.com` / `password123`

### 💻 Local Development

**Prerequisites:**
-   Java 21+
-   Node.js 18+
-   Docker (optional, for DB/Kafka)

#### 1. Backend Setup
```bash
# Clone the repo
git clone https://github.com/mist-ic/ZAPfest.git

# Start MongoDB & Kafka (using Docker)
docker-compose up -d

# Run the Application
mvn spring-boot:run
```

#### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Dev Server
npm run dev
```

---

## 📂 Project Structure

```text
ZAPfest/
├── src/main/java/com/fooddelivery    # Backend Source
│   ├── controller/      # REST Endpoints
│   ├── service/         # Business Logic
│   ├── repository/      # DB Access
│   ├── model/           # MongoDB Entities
│   ├── security/        # JWT Auth Config
│   └── exception/       # Global Error Handling
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI (Button, Card, Input)
│   │   ├── pages/       # Route Views (Home, Cart, Orders)
│   │   └── lib/         # Utilities
│   └── netlify.toml     # Deployment Config
├── docker-compose.yaml  # Infrastructure (Mongo, Kafka, Zookeeper)
└── README.md            # Project Documentation
```

---

<div align="center">
  <sub>Built with ❤️ by mist-ic for the Final Term Project</sub>
</div>
