🍬 Sweet Shop Management System
A full-stack inventory management system built with Test-Driven Development (TDD) principles, following craftsmanship standards similar to Incubyte's evaluation criteria.

🚀 Live Demo
Frontend: https://sweet-shop-management-system.vercel.app

Backend API: Runs locally on http://localhost:3000 (see Local Setup below)

Note: Backend deployment encountered TypeScript compilation issues in Render's environment. The backend is fully functional when run locally. This demonstrates the working application while being transparent about deployment challenges.

🛠️ Tech Stack
Backend (Mandatory Stack)
Node.js + TypeScript + Express

SQLite with Prisma ORM (file-based, persistent database)

JWT-based authentication

Jest + Supertest for testing

Role-based authorization (USER/ADMIN)

Frontend
React + TypeScript (Functional SPA)

React Router for navigation

Custom CSS with responsive design

Axios for API communication




📁 Project Structure
text
sweet-shop-tdd/
├── backend/                    # Node.js + TypeScript API
│   ├── src/
│   │   ├── auth/              # Authentication logic
│   │   ├── sweets/            # Sweets CRUD operations
│   │   ├── inventory/         # Inventory management
│   │   ├── middleware/        # JWT & role middleware
│   │   └── app.ts             # Express app setup
│   ├── tests/                 # Comprehensive test suite
│   ├── prisma/                # Database schema & migrations
│   └── package.json           # Backend dependencies
│
└── frontend/                  # React + TypeScript SPA
    ├── src/
    │   ├── api/               # API client services
    │   ├── components/        # Reusable UI components
    │   ├── contexts/          # React context (Auth)
    │   ├── pages/             # Page components
    │   ├── types/             # TypeScript definitions
    │   └── App.tsx            # Main application
    └── package.json           # Frontend dependencies


🚀 Quick Start
Prerequisites
Node.js (v16 or higher)

npm or yarn

Git

1. Clone and Setup
bash
git clone <your-repository-url>
cd sweet-shop-tdd
2. Backend Setup
bash
cd backend
npm install

# Configure environment
cp .env.example .env  # Edit with your settings

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Run tests (TDD verification)
npm test

# Start development server
npm run dev
3. Frontend Setup
bash
cd ../frontend
npm install
npm run dev
4. Access Application
Frontend: http://localhost:5173

Backend API: http://localhost:3000/api

API Health Check: http://localhost:3000/health

🧪 Testing (TDD Compliance)
The backend follows strict Test-Driven Development:

bash
cd backend
npm test                    # Run all tests
npm test -- --coverage     # Test coverage report
npm test -- auth.test.ts   # Run specific test suite
Test Coverage Includes:
✅ Authentication (Register/Login)

✅ Sweets CRUD operations

✅ Inventory logic (Purchase/Restock)

✅ Authorization middleware

✅ Error handling

📡 API Documentation
Authentication
POST /api/auth/register - Register new user

POST /api/auth/login - Login user (returns JWT)

Sweets Management
GET /api/sweets - Get all sweets

GET /api/sweets/:id - Get specific sweet

GET /api/sweets/search?q=... - Search sweets

POST /api/sweets - Create sweet (Admin only)

PUT /api/sweets/:id - Update sweet (Admin only)

DELETE /api/sweets/:id - Delete sweet (Admin only)

Inventory Management
POST /api/inventory/purchase - Purchase sweets

POST /api/inventory/restock - Restock sweets (Admin only)

GET /api/inventory/low-stock - Get low stock items (Admin only)

👥 User Roles & Test Accounts
Available Test Users:
Email	Password	Role	Purpose
test@example.com	password123	USER	Regular user testing
admin@example.com	admin123	ADMIN	Admin functionality
Role Permissions:
USER: Browse sweets, purchase items, view profile

ADMIN: All user permissions + CRUD sweets, restock inventory, view low stock

🎨 Features
✅ Completed Requirements:
Backend (TDD Implemented)
JWT-based authentication (Register/Login)

Role-based authorization middleware

Sweets CRUD with proper validation

Inventory logic (purchase with stock validation)

Search functionality with filters

Comprehensive test suite (Jest)

SQLite database with Prisma migrations

Frontend (Functional SPA)
User authentication (Login/Register pages)

Sweets catalog with real-time search

Purchase functionality

Admin dashboard (Add/Edit/Delete sweets, Restock)

Protected routes based on user role

Responsive design

Development Practices
Small, frequent commits with clear messages

Clean, readable, maintainable code

SOLID principles application

Honest AI usage documentation

🤖 My AI Usage Disclosure
AI Assistance Summary
This project was developed with AI mentorship assistance following TDD and craftsmanship principles. All AI-generated code was reviewed, understood, and integrated by the human developer.

AI Contributions:
TDD Mentorship: Guidance on Red-Green-Refactor cycle implementation

Architecture Design: Project structure and separation of concerns

Code Review: Suggestions for clean code and best practices

Troubleshooting: Debugging assistance for technical issues

Documentation: README structure and content guidance

Commit Co-authorship Convention:
bash
git commit -m "feat: add user authentication
- Implement JWT-based auth system  
- Add login/register endpoints
- Write comprehensive tests

Co-authored-by: AI Assistant <ai-assistant@example.com>"
Key Learning Outcomes:
Understanding of TDD workflow (Red → Green → Refactor)

Backend architecture with Express and TypeScript

Database design with Prisma ORM

API design and REST principles

Frontend-backend integration patterns

Error handling and validation strategies

🎯 Assessment Requirements Met
Mandatory Requirements Checklist:
Backend REST API with Node.js + TypeScript + Express

Persistent database (SQLite with Prisma, NOT in-memory)

JWT-based authentication with proper security

Role-based authorization (USER/ADMIN roles implemented)

Inventory logic (purchase with stock validation, restock)

Frontend SPA (React implementation with routing)

Proper README with setup instructions and AI disclosure

Craftsmanship Principles Applied:
Test-Driven Development (Red → Green → Refactor cycle)

Clean, readable, maintainable code

Small, frequent commits with descriptive messages

SOLID principles application in architecture

Honest and transparent AI usage documentation

Craftsmanship mindset over feature bloat

🔧 Known Issues & Trade-offs
Deployment Challenge:
Issue: Backend deployment to Render.com fails due to TypeScript compilation errors with @types/node in their environment

Workaround: Backend runs perfectly locally; frontend deployed to Vercel

Demonstration: Full functionality available via local setup

Scope Decisions (Time-constrained):
Password reset functionality omitted for MVP

Email verification not implemented

Advanced pagination simplified

UI uses custom CSS instead of full Bootstrap

📸 Application Screenshots
(Add your screenshots here)

Home Page - Welcome screen with feature overview

Login Page - Authentication interface

Sweets Catalog - Product listing with search

Admin Dashboard - Management interface with CRUD operations

Test Results - Jest test suite passing

🚀 Future Enhancements
Complete Deployment - Fix backend deployment issues

Enhanced UI - Add animations, better styling

Additional Features:

Order history and receipts

User profile management

Sweet categories and tags

Advanced analytics dashboard

Production Ready:

Docker containerization

CI/CD pipeline

API documentation (Swagger/OpenAPI)

Monitoring and logging

📄 License
MIT License - See LICENSE file for details.

🙏 Acknowledgments
Incubyte for the assessment opportunity

AI Mentor for TDD guidance and code review

Open Source Community for amazing tools and libraries

