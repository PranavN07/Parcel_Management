# Parcel Management System

A comprehensive full-stack parcel management system built with **Spring Boot** (backend) and **Angular 17+** (frontend). This system provides role-based access control for managing parcel bookings, tracking, and administration.

## 🚀 Features

### ✅ Backend (Spring Boot)
- **User Management**: Registration, login with JWT authentication
- **Role-based Access Control**: Admin, Staff, Customer roles
- **Parcel Management**: Book, track, and manage parcels
- **Tracking System**: Real-time parcel status updates
- **Invoice Generation**: Automatic billing for parcels
- **RESTful APIs**: Complete CRUD operations
- **Security**: JWT-based authentication and authorization
- **Database**: MySQL with JPA/Hibernate
- **API Documentation**: Swagger/OpenAPI integration

### 🎨 Frontend (Angular 17+)
- **Modern UI**: Beautiful, responsive design with Bootstrap 5
- **Role-based Dashboards**: Different interfaces for Admin, Staff, and Customer
- **Parcel Booking**: Comprehensive form with validation
- **Real-time Tracking**: Public tracking without login required
- **User Management**: Registration, login, profile management
- **Responsive Design**: Mobile-friendly interface
- **TypeScript**: Type-safe development

## 🏗️ Architecture

```
├── backend/                 # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/parcelmanagement/
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST Controllers
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── entity/      # JPA Entities
│   │       ├── repository/  # Data Repositories
│   │       ├── security/    # Security Configuration
│   │       └── service/     # Business Logic
│   └── src/main/resources/
│       └── application.yml  # Application Configuration
├── frontend/                # Angular Application
│   ├── src/app/
│   │   ├── auth/           # Authentication Components
│   │   ├── dashboard/      # Dashboard Components
│   │   ├── parcel/         # Parcel Management
│   │   ├── shared/         # Shared Components
│   │   ├── models/         # TypeScript Models
│   │   ├── services/       # Angular Services
│   │   └── guards/         # Route Guards
│   └── src/environments/   # Environment Configuration
```

## 📋 Prerequisites

- **Java 17+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Maven 3.6+**
- **Angular CLI 17+**

## 🚀 Quick Start

### 1. Database Setup

```sql
CREATE DATABASE parcel_management_db;
CREATE USER 'parcel_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON parcel_management_db.* TO 'parcel_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run

# The backend will start on http://localhost:8080
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# The frontend will start on http://localhost:4200
```

## 📚 API Documentation

Once the backend is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## 🔑 Default Accounts

The system automatically creates default accounts for testing:

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Admin | admin | admin@parcel.com | admin123 |
| Staff | staff | staff@parcel.com | staff123 |
| Customer | customer | customer@parcel.com | customer123 |

## 🎯 Key Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Parcel Management
- `POST /api/parcels/book` - Book a new parcel
- `GET /api/parcels/my-parcels` - Get user's parcels
- `PUT /api/parcels/{id}/status` - Update parcel status (Admin/Staff)
- `GET /api/parcels/all` - Get all parcels (Admin/Staff)

### Tracking
- `GET /api/tracking/public/{trackingNumber}` - Public tracking (no auth)
- `POST /api/tracking/parcel/{parcelId}/update` - Add tracking update (Admin/Staff)
- `GET /api/tracking/parcel/{parcelId}` - Get tracking history

### Invoices
- `POST /api/invoices/generate/{parcelId}` - Generate invoice
- `GET /api/invoices/my-invoices` - Get user's invoices
- `PUT /api/invoices/{invoiceId}/payment` - Update payment status

## 🔐 Role-based Features

### Customer
- Book parcels
- View own parcels (sent/received)
- Track parcels
- View invoices
- Update profile

### Staff
- All customer features
- View all parcels
- Update parcel status
- Add tracking updates
- Manage customer parcels

### Admin
- All staff features
- User management
- System administration
- View reports and analytics
- Manage all system data

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.1**
- **Spring Security 6** (JWT Authentication)
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**
- **Swagger/OpenAPI 3**

### Frontend
- **Angular 17+**
- **TypeScript 5**
- **Bootstrap 5**
- **Bootstrap Icons**
- **Reactive Forms**
- **HTTP Client**

## 📱 Features Overview

### Parcel Booking
- Complete parcel information form
- Pickup and delivery location details
- Receiver information
- Priority selection (Standard, Express, Overnight)
- Automatic shipping cost calculation
- Special delivery instructions

### Tracking System
- Real-time status updates
- Public tracking (no login required)
- Detailed tracking history
- Location-based updates
- Status change notifications

### Dashboard Features
- Role-specific dashboards
- Statistics and analytics
- Recent parcel overview
- Quick action buttons
- Status summaries

### Security Features
- JWT-based authentication
- Role-based access control
- Protected routes
- CORS configuration
- Input validation

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Build the JAR file: `mvn clean package`
2. Deploy to server: `java -jar target/parcel-management-backend-0.0.1-SNAPSHOT.jar`

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy the `dist/` folder to web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@parcelmanagement.com
- 📋 Issues: GitHub Issues
- 📖 Documentation: `/docs` folder

## 🎉 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the modern frontend framework
- Bootstrap team for the responsive CSS framework
- All contributors and testers

---

Built with ❤️ using Spring Boot and Angular