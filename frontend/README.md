# Parcel Management System - Frontend

Modern Angular 17+ frontend application for the Parcel Management System with responsive design and role-based dashboards.

## 🚀 Technologies

- **Angular 17+**
- **TypeScript 5**
- **Bootstrap 5**
- **Bootstrap Icons**
- **Reactive Forms**
- **HTTP Client**
- **RxJS**

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17+

## 🏃‍♂️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 3. Run Development Server

```bash
npm start
# or
ng serve

# Application runs on http://localhost:4200
```

## 🎨 Features

### Authentication
- User login/registration
- JWT token management
- Auto-logout on token expiration
- Role-based route protection

### Dashboard
- Role-specific dashboards (Admin, Staff, Customer)
- Real-time statistics
- Recent parcel overview
- Quick action buttons

### Parcel Management
- Comprehensive booking form
- Parcel listing with filters
- Status tracking
- Detailed parcel views

### Public Features
- Parcel tracking without login
- Responsive design
- Modern UI/UX

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication components
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/            # Dashboard components
│   │   ├── dashboard.component.ts
│   │   ├── admin-dashboard/
│   │   └── staff-dashboard/
│   ├── parcel/              # Parcel management
│   │   ├── book-parcel/
│   │   ├── parcel-list/
│   │   └── parcel-detail/
│   ├── shared/              # Shared components
│   │   ├── components/
│   │   └── interceptors/
│   ├── models/              # TypeScript models
│   ├── services/            # Angular services
│   ├── guards/              # Route guards
│   └── app.routes.ts        # Routing configuration
├── environments/            # Environment configs
├── assets/                  # Static assets
└── styles.scss             # Global styles
```

## 🔐 Security

### Route Guards
- `authGuard` - Protects authenticated routes
- `adminGuard` - Admin-only routes
- `staffGuard` - Staff-level access

### HTTP Interceptors
- JWT token attachment
- Error handling
- Request/response logging

## 🎯 Components Overview

### Authentication Components

**LoginComponent**
- Reactive form validation
- JWT token handling
- Return URL support
- Error display

**RegisterComponent**
- User registration form
- Field validation
- Success/error feedback

### Dashboard Components

**DashboardComponent**
- Role-based sidebar navigation
- Statistics cards
- Recent parcels table
- Quick actions

### Parcel Components

**BookParcelComponent**
- Multi-step form
- Address validation
- Priority selection
- Cost calculation

**ParcelListComponent**
- Tabbed interface (All/Sent/Received)
- Search and filters
- Status indicators
- Action buttons

**PublicTrackingComponent**
- Public parcel tracking
- Timeline visualization
- No authentication required

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Features
- Mobile-first approach
- Flexible grid system
- Touch-friendly interactions
- Optimized navigation

## 🎨 Styling

### CSS Framework
- Bootstrap 5 for layout
- Custom SCSS variables
- Component-specific styles
- Utility classes

### Theme
```scss
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
}
```

## 🔧 Services

### AuthService
```typescript
// Key methods
login(credentials): Observable<LoginResponse>
logout(): Observable<any>
isAuthenticated(): boolean
getCurrentUser(): User | null
hasRole(roles: UserRole[]): boolean
```

### ParcelService
```typescript
// Key methods
bookParcel(data): Observable<Parcel>
getUserParcels(): Observable<Parcel[]>
trackParcel(trackingNumber): Observable<any>
updateParcelStatus(id, status): Observable<Parcel>
```

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
ng test
```

### E2E Tests
```bash
npm run e2e
# or
ng e2e
```

### Test Coverage
```bash
ng test --code-coverage
```

## 🏗️ Build

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

### Build Optimization
- Tree shaking
- Minification
- Gzip compression
- Bundle splitting

## 🚀 Deployment

### Static Hosting
```bash
# Build for production
ng build --configuration production

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - AWS S3
# - GitHub Pages
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html/
EXPOSE 80
```

## 📊 Performance

### Optimization Techniques
- Lazy loading modules
- OnPush change detection
- Virtual scrolling for large lists
- Image optimization
- Service worker caching

### Bundle Analysis
```bash
npm run analyze
```

## 🔍 Development Tools

### Useful Commands
```bash
# Generate component
ng generate component feature/component-name

# Generate service
ng generate service services/service-name

# Generate guard
ng generate guard guards/guard-name

# Run linting
ng lint

# Format code
npm run format
```

### VS Code Extensions
- Angular Language Service
- Angular Snippets
- TypeScript Hero
- Prettier
- ESLint

## 🌐 Internationalization

### Setup i18n
```bash
ng add @angular/localize
ng extract-i18n
```

### Multi-language Support
- English (default)
- Spanish
- French
- German

## 📱 PWA Support

### Add PWA
```bash
ng add @angular/pwa
```

### Features
- Offline support
- App manifest
- Service worker
- Push notifications

## 🐛 Debugging

### Browser DevTools
- Angular DevTools extension
- Redux DevTools for state
- Network tab for API calls
- Console for errors

### Common Issues
1. **CORS Errors**
   - Configure backend CORS
   - Use proxy.conf.json for development

2. **Authentication Issues**
   - Check token expiration
   - Verify API endpoints
   - Inspect network requests

3. **Routing Problems**
   - Check route configuration
   - Verify guard implementations
   - Test navigation flow

## 📞 Support

For frontend-specific issues:
- Check browser console
- Review Angular documentation
- Use Angular DevTools
- Inspect network requests

## 🤝 Contributing

1. Follow Angular style guide
2. Write unit tests for components
3. Use TypeScript strictly
4. Follow naming conventions
5. Update documentation