# Skill-Swap: Local Development & Running Guide

This guide walks you through running the entire **Skill-Swap** platform locally on your machine, connecting the **React Frontend**, **Django Backend**, **Socket.io Service**, and **MongoDB**.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18 or higher (v24.x tested)
- **Python**: v3.10 or higher (v3.14 tested)
- **MongoDB**: A running local MongoDB instance on `mongodb://localhost:27017` **OR** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

---

## 2. Environment Configuration (`.env`)

A default `.env` file has been created in your project root with working local development defaults. 

If you want to customize your credentials (such as real Gmail OTP or ZegoCloud Video keys), open `.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=skill_swap

# Django & Auth
DJANGO_SECRET_KEY=dev-secret-key-for-local-skillswap-testing-only-12345
DJANGO_DEBUG=true
JWT_SECRET=dev-secret-key-for-local-skillswap-testing-only-12345

# Email OTP (Optional: Use real Gmail App Password if testing real email delivery)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

# ZegoCloud (Video Calls)
ZEGO_APP_ID=1234567890
ZEGO_SERVER_SECRET=0123456789abcdef0123456789abcdef

# Service Ports & URLs
PORT=4100
VITE_API_BASE_URL=http://localhost:8000/api/v1
SOCKET_SERVICE_URL=http://localhost:4100
```

---

## 3. Running the Project (3 Terminals)

To run the complete system, open 3 terminal windows in VS Code:

### Terminal 1: Django Backend API (Port 8000)
```powershell
cd django_backend
python manage.py runserver 127.0.0.1:8000
```
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- API Root: [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/)

---

### Terminal 2: Socket.io Real-Time Service (Port 4100)
```powershell
cd socket_service
npm start
```
- Health Check: [http://127.0.0.1:4100/health](http://127.0.0.1:4100/health)
- Output: `Socket service listening on port 4100`

---

### Terminal 3: React Frontend (Port 5173 or 3000)
```powershell
# In the project root directory:
npm run dev:client
# Or: npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 4. Running the Test Suites

All tests across backend, socket service, and frontend are verified and passing:

1. **Django API & Provider Tests (27/27 tests passing)**:
   ```powershell
   cd django_backend
   python -m unittest discover -s api
   ```

2. **Socket.io Real-Time Tests (13/13 tests passing)**:
   ```powershell
   cd socket_service
   npm test
   ```

3. **Frontend & Domain Core Tests (10/10 tests passing)**:
   ```powershell
   npm test
   ```

4. **TypeScript Strict Type Check (0 errors)**:
   ```powershell
   npm run check
   ```

5. **Production Build Verification**:
   ```powershell
   npm run build
   ```
