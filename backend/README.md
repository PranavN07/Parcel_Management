# Parcel Management System - Backend

Spring Boot REST API for the Parcel Management System with JWT authentication and role-based access control.

## 🚀 Technologies

- **Spring Boot 3.2.1**
- **Spring Security 6** (JWT)
- **Spring Data JPA**
- **MySQL 8.0**
- **Swagger/OpenAPI 3**
- **Maven 3**
- **Java 17**

## 📋 Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+

## 🏃‍♂️ Running the Application

### 1. Database Setup

```sql
CREATE DATABASE parcel_management_db;
CREATE USER 'parcel_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON parcel_management_db.* TO 'parcel_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configuration

Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/parcel_management_db
    username: your_username
    password: your_password
```

### 3. Run Application

```bash
# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run

# Application starts on http://localhost:8080
```

## 📚 API Documentation

Access Swagger UI: `http://localhost:8080/swagger-ui.html`
API Docs JSON: `http://localhost:8080/api-docs`

## 🔑 Authentication

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "admin",
  "password": "admin123"
}
```

### Use JWT Token
```bash
Authorization: Bearer <your-jwt-token>
```

## 🎯 Main Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/all` - Get all users (Admin only)
- `POST /api/users/create` - Create user (Admin only)

### Parcel Management
- `POST /api/parcels/book` - Book new parcel
- `GET /api/parcels/my-parcels` - Get user's parcels
- `GET /api/parcels/sent` - Get sent parcels
- `GET /api/parcels/received` - Get received parcels
- `GET /api/parcels/{id}` - Get parcel by ID
- `PUT /api/parcels/{id}/status` - Update parcel status (Admin/Staff)
- `GET /api/parcels/all` - Get all parcels (Admin/Staff)

### Tracking
- `GET /api/tracking/public/{trackingNumber}` - Public tracking
- `GET /api/tracking/parcel/{parcelId}` - Get tracking history
- `POST /api/tracking/parcel/{parcelId}/update` - Add tracking update (Admin/Staff)

### Invoices
- `POST /api/invoices/generate/{parcelId}` - Generate invoice
- `GET /api/invoices/{invoiceNumber}` - Get invoice by number
- `GET /api/invoices/my-invoices` - Get user's invoices
- `PUT /api/invoices/{invoiceId}/payment` - Update payment status

## 🗄️ Database Schema

### Main Entities

1. **User** - User accounts with roles
2. **Parcel** - Parcel information
3. **Location** - Pickup/delivery addresses
4. **Tracking** - Parcel status history
5. **Invoice** - Billing information

### Relationships

- User (1:N) Parcel (sender/receiver)
- Parcel (1:N) Tracking
- Parcel (1:1) Invoice
- Parcel (N:1) Location (pickup/delivery)

## 🔐 Security Features

- JWT token authentication
- Role-based access control (Admin, Staff, Customer)
- Password encryption (BCrypt)
- CORS configuration
- Request validation
- SQL injection prevention

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

## 📊 Monitoring

- Application health: `http://localhost:8080/actuator/health`
- Application info: `http://localhost:8080/actuator/info`

## 🔧 Configuration

### Key Properties

```yaml
# Server Configuration
server:
  port: 8080

# JWT Configuration
jwt:
  secret: your-secret-key
  expiration: 86400000 # 24 hours

# Database Configuration
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 🐳 Docker Support

```dockerfile
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

```bash
# Build image
docker build -t parcel-management-backend .

# Run container
docker run -p 8080:8080 parcel-management-backend
```

## 📈 Performance

- Connection pooling configured
- Query optimization with JPA
- Lazy loading for entities
- Proper indexing on database

## 🚀 Deployment

### Production Build

```bash
mvn clean package -Pprod
```

### Environment Variables

```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_URL=jdbc:mysql://prod-db:3306/parcel_db
export DB_USERNAME=prod_user
export DB_PASSWORD=prod_password
export JWT_SECRET=production-secret-key
```

## 📝 Logging

- Structured logging with Logback
- Different log levels for different packages
- File and console appenders
- Request/response logging for debugging

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check MySQL service is running
   - Verify credentials in application.yml
   - Ensure database exists

2. **JWT Token Issues**
   - Check token expiration
   - Verify secret key configuration
   - Ensure proper Authorization header format

3. **Permission Denied**
   - Check user roles and permissions
   - Verify endpoint security configuration

## 📞 Support

For backend-specific issues:
- Check application logs
- Review Spring Boot documentation
- Consult API documentation at `/swagger-ui.html`