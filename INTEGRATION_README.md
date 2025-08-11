# Frontend-Backend Integration

This document describes the integration between the Next.js frontend and the Node.js backend API.

## Changes Made

### 1. Removed Mock Data

- Deleted `lib/api_mock_data.ts` - All mock data definitions
- Deleted `data/` directory (except translations) - JSON mock data files
- Deleted `hooks/use-mock-auth.ts` - Mock authentication hook
- Removed all frontend API routes (`app/api/` directory)

### 2. Updated API Configuration

- Updated `lib/api.ts` to use real backend endpoints
- Added proper authentication headers
- Configured API base URL to use environment variable

### 3. Updated Hooks

- `hooks/use-auth.ts` - Real authentication with backend
- `hooks/use-complaints.ts` - Integrated with backend complaint endpoints
- `hooks/use-employees.ts` - Integrated with backend employee endpoints
- `hooks/use-services.ts` - Integrated with backend department endpoints
- `hooks/use-feedback.ts` - Integrated with backend feedback endpoints
- `hooks/use-ratings.ts` - Integrated with backend rating endpoints
- `hooks/use-statistics.ts` - Integrated with backend statistics endpoints

### 4. Updated Components

All dashboard and page components have been updated to use the real API hooks instead of mock data:

- All superadmin components (subcity services, employees, complaints)
- Dashboard components (feedback list, ratings table, ratings chart)
- Page components (feedback page, ratings page)

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:4000/api` by default. You can override this by setting the `NEXT_PUBLIC_API_URL` environment variable.

### Environment Variables

Create a `.env.local` file in the `Customer-Engagement` directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Running the Application

**Important:** Make sure both servers are running:

### 1. Start the Backend API

```bash
cd office-management-systemm-1
npm install  # if not already done
npm start    # runs on port 4000
```

### 2. Start the Frontend

```bash
cd Customer-Engagement
npm install  # if not already done
npm run dev  # runs on port 3000
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

## Available Endpoints

The backend provides the following API endpoints that the frontend now uses:

### Public Endpoints

- `POST /api/public/complaints` - Submit public complaints
- `GET /api/public/complaints` - Get public complaints
- `POST /api/public/feedback` - Submit public feedback
- `GET /api/public/feedback` - Get public feedback
- `POST /api/public/ratings` - Submit public ratings
- `GET /api/public/ratings` - Get public ratings
- `GET /api/public/departments` - Get departments
- `GET /api/public/statistics` - Get public statistics

### Admin Endpoints (Requires Authentication)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/respond` - Respond to complaints
- `GET /api/admin/employees` - Get employees
- `GET /api/admin/feedback` - Get feedback
- `POST /api/admin/feedback/:id/respond` - Respond to feedback
- `GET /api/admin/ratings` - Get ratings
- `GET /api/admin/departments` - Get departments (admin view)
- `GET /api/admin/statistics` - Get admin statistics

## Authentication

The application now uses JWT-based authentication:

- Login through `/login` page
- JWT tokens are stored in Zustand store
- Tokens are automatically included in API requests
- Different access levels for public vs admin endpoints

## Data Flow

1. **Public Users**: Can submit complaints, feedback, and ratings
2. **Admin Users**: Can view all data, respond to complaints/feedback, and manage the system
3. **Real-time Updates**: All data is fetched from the backend database
4. **No More Mock Data**: All components now display live data

## Features Working

✅ **Authentication System**

- Real login with backend validation
- JWT token management
- Role-based access control

✅ **Complaint System**

- Submit and track complaints
- Admin can respond to complaints
- Real-time status updates

✅ **Feedback System**

- Submit feedback with ratings
- Admin can view and respond
- Rating analytics and charts

✅ **Employee Directory**

- Real employee data from backend
- Search and filter functionality

✅ **Statistics Dashboard**

- Live statistics from backend
- Charts and analytics

✅ **Multi-language Support**

- Translation files preserved
- Language switching functionality

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure backend is running on port 4000
   - Check CORS configuration in backend
   - Verify API_BASE_URL in frontend

2. **Authentication Issues**
   - Clear browser localStorage if tokens are corrupted
   - Ensure admin credentials are set up in backend

3. **Database Issues**
   - Ensure MySQL database is running
   - Check database connection in backend

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show API request/response details in the browser console.
