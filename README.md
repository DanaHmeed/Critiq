# Critiq — Peer Code Review Platform

Critiq is a full-stack web application that streamlines peer code reviews. Developers can submit code for review, collaborate with reviewers through inline comments, track review status, and receive real-time notifications. Built with modern technologies and deployed live at [https://critiq-rho.vercel.app](https://critiq-rho.vercel.app).

---

## Features

- **User Authentication** — Register, login, and JWT-based session management with password reset
- **Code Review Requests** — Submit code snippets, files, or pull requests for peer review
- **Inline Comments** — Add line-specific feedback directly within code blocks
- **Reviewer Assignment** — Assign specific reviewers to review requests
- **Status Tracking** — Track review requests through pending, in-progress, and completed states
- **Notifications** — Real-time alerts for new reviews, comments, and status changes
- **User Profiles** — View reviewer profiles, experience, and review history
- **Admin Dashboard** — Platform statistics, user management, and suspension controls
- **Settings & Preferences** — Customize profile, notification settings, and account security
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices

---

## Tech Stack

### Frontend
- **React 19** — UI framework with hooks and modern React patterns
- **TypeScript** — Type-safe JavaScript development
- **Vite** — Fast build tool and dev server (HMR enabled)
- **React Router 7** — Client-side routing with protected routes
- **Tailwind CSS 4** — Utility-first CSS framework
- **Radix UI** — Accessible, unstyled component primitives (dialog, dropdown, tabs, etc.)
- **Recharts** — Analytics and data visualization (admin stats)
- **Sonner** — Toast notifications for user feedback
- **Lucide React** — Icon library

### Backend
- **Node.js** — JavaScript runtime
- **Express 4** — Web framework and HTTP server
- **PostgreSQL** — Relational database (pg pool client)
- **JWT (jsonwebtoken)** — Stateless authentication
- **bcryptjs** — Password hashing and verification
- **express-validator** — Request validation
- **Helmet** — Security headers
- **CORS** — Cross-origin resource sharing
- **express-rate-limit** — Rate limiting on API endpoints
- **Nodemon** — Dev auto-reload

---

## Project Structure

```
Critiq/
├── frontend/                    # React + TypeScript UI
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx         # Router setup + auth guards
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── context/        # AuthContext for global state
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── pages/          # Page components (Landing, Dashboard, etc.)
│   │   │   └── utils/          # Helper utilities
│   │   ├── api/                # API client functions
│   │   ├── assets/             # Images, logos, etc.
│   │   ├── styles/             # Tailwind CSS, global styles
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # Express + PostgreSQL API
│   ├── src/
│   │   ├── app.js              # Express app setup (middleware, routes)
│   │   ├── config/
│   │   │   ├── db.js           # PostgreSQL pool configuration
│   │   │   └── initDb.js       # Schema initialization
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT authentication guards
│   │   │   ├── errorHandler.js # Global error handling
│   │   │   └── validate.js     # Request validation
│   │   ├── controllers/        # Business logic handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── request.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── notif.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── passwordReset.controller.js
│   │   ├── routes/             # API endpoint definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── request.routes.js
│   │   │   ├── comment.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── notif.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── passwordReset.routes.js
│   │   └── models/             # Database query abstractions
│   ├── server.js               # Express server entry point
│   ├── package.json
│   ├── .env.example            # Environment template
│   └── .env                    # Secrets (git-ignored)
│
└── README.md                   # This file
```

---

## Quick Start

### Prerequisites
- **Node.js** 16+ and npm/yarn
- **PostgreSQL** 12+ (local or remote)
- **Git**

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your PostgreSQL credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=critiq_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

3. **Create the database**
   ```bash
   # In psql or PostgreSQL client:
   CREATE DATABASE critiq_db;
   ```

4. **Initialize the schema**
   ```bash
   node src/config/initDb.js
   ```

5. **Start the server**
   ```bash
   npm run dev     # Development (nodemon auto-restarts on changes)
   npm start       # Production
   ```

   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## API Reference

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

### Authentication — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /register | ✗ | Create account (`name`, `email`, `password`, `role`) |
| POST | /login | ✗ | Get JWT token (`email`, `password`) |
| GET | /me | ✓ | Current user info |

### Password Reset — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /forgot-password | ✗ | Request password reset |
| POST | /reset-password | ✗ | Reset with token (`token`, `newPassword`) |

### Review Requests — `/api/requests`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | / | ✓ | All open requests (for reviewers) |
| GET | /mine | ✓ | My submitted requests |
| GET | /:id | ✓ | Single request + all comments |
| POST | / | ✓ | Submit new request |
| PATCH | /:id/status | ✓ | Update status (pending/in-progress/completed) |
| PATCH | /:id/assign | ✓ | Assign reviewer |
| DELETE | /:id | ✓ | Delete (author or admin only) |

### Comments — `/api/comments`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | ✓ | Add inline comment to a line |
| GET | / | ✓ | Get comments (?request_id=...) |
| DELETE | /:id | ✓ | Delete (author or admin only) |

### Users — `/api/users`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /reviewers | ✓ | List all reviewers |
| GET | /:id | ✓ | Public profile |
| PATCH | /me | ✓ | Update own profile |

### Notifications — `/api/notifs`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | / | ✓ | My notifications (sorted by date) |
| PATCH | /:id/read | ✓ | Mark one as read |
| PATCH | /read-all | ✓ | Mark all as read |

### Admin — `/api/admin` *(admin role only)*
| Method | Path | Description |
|--------|------|-------------|
| GET | /stats | Platform overview (user count, request stats, etc.) |
| GET | /users | All users (paginated, ?page=1&limit=10) |
| PATCH | /users/:id/role | Change user role (admin/reviewer) |
| PATCH | /users/:id/suspend | Suspend or unsuspend user |
| GET | /requests | All requests (paginated) |

---

## Authentication Flow

```
1. User submits login form (email, password)
2. Backend validates credentials and returns JWT token + user data
3. Frontend stores token in localStorage / sessionStorage
4. On each request, frontend adds: Authorization: Bearer <token>
5. Backend verifies token signature and extracts user info
6. Protected routes render only if token is valid
7. On logout, frontend removes token
```

**Token expiry:** Default 7 days. Refresh tokens can be implemented for extended sessions.

---

## Features by Page

### Public Pages
- **Landing** — Hero, feature highlights, CTA to sign up
- **Login** — Email + password authentication
- **Register** — Create account with role selection (reviewer/author)
- **Forgot Password** — Request password reset email
- **Reset Password** — Set new password with reset token

### Protected Pages (Authenticated Users)
- **Dashboard** — Browse open review requests from other users
- **My Requests** — View requests you've submitted
- **Create Request** — Submit new code for review (paste code, upload, or link)
- **Review Details** — View request code with inline comments, assign reviewers
- **Notifications** — Inbox for all platform alerts
- **Profile** — View/edit public profile, experience, reviewer stats
- **Settings** — Account security, notification preferences, language, theme

### Admin Pages
- **Admin Dashboard** — Platform stats (total users, requests, avg review time), user management table, suspend/promote users

---

## Environment Variables

### Backend (.env)
| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| PORT | Yes | 5000 | Express server port |
| NODE_ENV | Yes | development | Environment mode |
| DB_HOST | Yes | localhost | PostgreSQL host |
| DB_PORT | Yes | 5432 | PostgreSQL port |
| DB_NAME | Yes | critiq_db | Database name |
| DB_USER | Yes | postgres | DB username |
| DB_PASSWORD | Yes | secure_password | DB password |
| JWT_SECRET | Yes | long-random-string | Secret for signing JWTs |
| JWT_EXPIRES_IN | No | 7d | Token expiration |
| CLIENT_URL | No | http://localhost:5173 | Frontend origin (CORS) |

### Frontend
The frontend connects to the backend via hardcoded API base URL or environment variable (configurable in `frontend/src/api`).

---

## Database Schema (PostgreSQL)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('reviewer', 'admin') DEFAULT 'reviewer',
  is_suspended BOOLEAN DEFAULT FALSE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Review Requests Table
```sql
CREATE TABLE review_requests (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  reviewer_id INTEGER REFERENCES users(id),
  status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
  code_content TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES review_requests(id),
  author_id INTEGER REFERENCES users(id),
  line_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_request_id INTEGER REFERENCES review_requests(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

*(Exact schema auto-generated by `initDb.js` — see backend/src/config/initDb.js for authoritative schema)*

---

## Development Workflow

### Running Both Services
In two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Adding a New Endpoint
1. Create controller logic in `backend/src/controllers/`
2. Define route in `backend/src/routes/`
3. Mount route in `backend/src/app.js`
4. Test with curl or Postman
5. Call from frontend via `frontend/src/api/` client

### Styling
Frontend uses **Tailwind CSS** with **Radix UI** components. To add custom styles:
- Use Tailwind utility classes in JSX
- Define theme colors in `tailwind.config.js`
- Create reusable components in `frontend/src/app/components/ui/`

---

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel. To redeploy:
```bash
git push origin development  # or main
# Vercel auto-deploys on push
```

### Backend
Deploy to any Node.js hosting:
- **Heroku**, **Railway**, **Fly.io**, **AWS EC2**, **DigitalOcean**, etc.
- Set environment variables in hosting platform
- Run migrations on first deploy
- Example (Fly.io):
  ```bash
  flyctl launch
  flyctl secrets set DB_PASSWORD=... JWT_SECRET=...
  flyctl deploy
  ```

---

## Security Considerations

- **Password Hashing** — Passwords are hashed with bcryptjs (salt rounds: 10)
- **JWT Secrets** — Never commit `.env` file; use strong random secrets
- **CORS** — Configured to accept only `CLIENT_URL` origin
- **Rate Limiting** — 100 requests per 15 minutes per IP on `/api`
- **Helmet** — Adds security headers (XSS protection, CSP, etc.)
- **SQL Injection** — Parameterized queries via `pg` pool
- **Input Validation** — express-validator on all public endpoints
- **HTTPS** — Use in production (handled by Vercel/hosting provider)

---

## Troubleshooting

### Backend won't connect to database
- Ensure PostgreSQL is running locally or remote server is accessible
- Check DB credentials in `.env`
- Verify database `critiq_db` exists: `psql -U postgres -l`
- Run schema init: `node src/config/initDb.js`

### Frontend can't reach backend
- Check backend is running on port 5000
- Verify `CLIENT_URL` in backend `.env` matches frontend origin
- Check browser console for CORS errors
- Test API directly: `curl http://localhost:5000/api/health`

### JWT token expired
- Tokens expire after 7 days (or `JWT_EXPIRES_IN` setting)
- User must log in again to get new token
- Implement refresh token rotation for better UX

### Port already in use
- Backend: Change `PORT` in `.env`, restart
- Frontend: Vite uses port 5173 by default; use `npm run dev -- --port 3000` for custom port

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is open source. Specify your license here (MIT, Apache 2.0, etc.) if applicable.

---

## Support

For issues, questions, or suggestions:
- Open a GitHub issue: [Issues](https://github.com/DanaHmeed/Critiq/issues)
- Email: [contact@critiq-platform.dev]
- Live app: [https://critiq-rho.vercel.app](https://critiq-rho.vercel.app)

---

## Roadmap

- [ ] Real-time notifications via WebSocket
- [ ] Code syntax highlighting with Prism.js
- [ ] Diff view for comparing revisions
- [ ] Bulk review request creation
- [ ] Email notifications for new reviews
- [ ] GitHub integration (auto-import PRs)
- [ ] Dark mode toggle
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance metrics & analytics

---

**Made with ❤️ by Dana Hmeed**
