Final Term Project – Product Requirements Document (PRD)

Course: Backend Engineering with Spring Boot
Project Type: Group / Individual
Technology: Spring Boot (Mandatory)
1. Purpose

The purpose of this project is to evaluate students on:

    Backend system design
    Spring Boot fundamentals & advanced features
    Secure API development
    Database modeling and complex queries
    Real-world integrations
    Code quality and system understanding

This project is designed to simulate real industry backend development.
2. Scope

Students will design and implement a production-grade backend system for a real-world application.

The project must include:

    REST APIs
    Authentication & authorization
    Database integration
    Validation
    Exception handling
    Performance optimization
    External integrations
    Analytics / reporting APIs

3. Group Formation Rules
Rule 	Requirement
Group size 	1 – 5 students
Maximum 	5 (strict)
Solo allowed 	Yes
Responsibility 	Every member must understand the entire system

During viva, any student can be asked any module.
4. Mandatory Technical Stack
Component 	Required
Backend 	Spring Boot
Database 	MongoDB or PostgreSQL/MySQL
Authentication 	JWT
API style 	REST
Validation 	Jakarta Validation
Documentation 	Swagger/OpenAPI
Version Control 	GitHub
5. Mandatory Architecture

Your backend must follow:

controller/
service/
repository/
model/
dto/
config/
exception/
util/

No business logic in controllers.
6. Mandatory Functional Requirements
6.1 User Management

    User registration
    User login
    Role-based access control (Admin/User/etc.)
    JWT token generation & validation

6.2 Core Domain APIs

Depends on project type (rides, orders, bookings, etc.)

Minimum:

    Create
    Update
    Delete
    Fetch by ID
    List with pagination

6.3 Advanced Features (Compulsory)
Feature 	Required
Complex queries 	✅
Pagination & sorting 	✅
Filtering 	✅
Caching 	✅
File upload 	✅
Email notification 	✅
API rate limiting 	✅
Analytics APIs 	✅
Global exception handling 	✅
Input validation 	✅
Swagger documentation 	✅
6.4 Integrations

At least one external integration required:

Examples:

    Payment gateway (Stripe/Razorpay)
    Email SMTP
    SMS (mock allowed)
    Google Maps API
    Currency API
    Weather API

6.5 Bonus (Optional)
Feature 	Bonus
Kafka / event-driven 	⭐
Frontend UI 	⭐
Docker 	⭐
Cloud deployment 	⭐
7. Non-Functional Requirements

    Clean code
    Meaningful naming
    Layered design
    No hardcoded secrets
    Environment-based config
    Modular structure
    Proper error responses
    Secure endpoints

8. Demonstration Requirements
Backend Demo (Mandatory)

A recorded video showing:

    Login & JWT token
    Protected APIs
    Database data
    File upload
    Email sending
    Analytics APIs
    Rate limiting
    External API integration

Duration: 5–10 minutes
Frontend Demo (Optional)

Allowed but not graded.
9. Submission Process

All submissions will be through:

    🔗 Submission Form: (Link will be provided later)

Required fields:

    Group members
    GitHub repository
    Demo video link
    Swagger URL
    Project description

10. Evaluation Criteria
Area 	Weight
API design 	20%
Security 	15%
Database design 	15%
Advanced features 	15%
Code quality 	10%
Demo video 	10%
Source code understanding 	15%
11. Viva & Code Review Expectations

Students must be able to explain:

    Request flow
    JWT flow
    Security configuration
    Database queries
    Validation logic
    Caching strategy
    Exception handling
    Integration flow
    File handling
    Email system
    Annotations used
    Class responsibilities

Random code sections may be asked.
12. Student Focus Areas
Must focus on:

    Architecture
    Data flow
    Security
    Query design
    Performance
    Clean code
    Understanding

Avoid:

    Copying code blindly
    Hardcoding credentials
    Fat controllers
    Poor naming
    Missing validation
    Missing documentation

13. Approved Project Ideas (Choose Any One)

Students must pick one from below:
E-commerce & Finance

    Online Shopping Backend
    Payment Wallet System
    Subscription Management Platform
    Expense Tracker API
    Digital Banking System

Transportation & Logistics

    Ride Sharing Backend (Uber-like)
    Food Delivery System
    Courier Management System
    Parking Slot Booking API
    Fleet Management System

Healthcare & Education

    Hospital Appointment System
    Online Learning Platform Backend
    Student Attendance System
    Doctor Consultation Platform

Social & Productivity

    Social Media Backend
    Task Management System (Trello-like)
    Event Booking Platform
    Job Portal Backend

Enterprise & Utilities

    Inventory Management System
    SaaS Billing Platform

14. Final Notes

This project is your:

    Backend portfolio
    Interview reference
    Industry simulation
    Engineering maturity test

Build it like a real product, not an assignment.