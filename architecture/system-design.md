

Here is the architectural blueprint for your system.

1. Complete Scalable Folder Structure

We will use a Monorepo approach (e.g., using Turborepo or just logically
separated folders) to keep the entire system in one repository while maintaining
strict boundaries.

civic-platform-monorepo/
├── apps/
│   ├── mobile-app/              # React Native Expo (Citizens & Field Workers)
│   ├── admin-dashboard/         # Next.js (Admins)
│   └── backend-api/             # FastAPI (Core Logic & AI)
├── packages/                    # Shared configurations (optional for future)
│   ├── eslint-config/
│   └── ts-config/
└── README.md

#### A. Mobile App (Expo) & Admin Dashboard (Next.js) - Feature-Based
src/
├── app/                         # Routing (Next.js App Router or Expo Router)
├── assets/                      # Fonts, images, icons
├── core/                        # Global configs, theme, constants
├── features/                    # Feature-Sliced Design (Domain Logic)
│   ├── auth/                    # Login, OTP, Profiles
│   ├── complaints/              # Reporting, tracking, maps
│   └── workers/                 # Task assignments, status updates
├── shared/                      # Reusable cross-feature code
│   ├── components/              # Buttons, inputs, cards (Atomic Design)
│   ├── hooks/                   # Custom React hooks (e.g., useLocation)
│   ├── services/                # API clients, Cloudinary upload logic
│   └── utils/                   # Helpers (date formatting, validation)
└── store/                       # Global state management (Zustand/Redux)

#### B. Backend API (FastAPI) - Domain-Driven Design
app/
├── api/                         # API Routers (Controllers)
│   ├── v1/
│   │   ├── auth.py
│   │   ├── complaints.py
│   │   └── ai.py
├── core/                        # App config, security, database setup
├── models/                      # SQLAlchemy Database Models (Tables)
├── schemas/                     # Pydantic Models (Data Validation)
├── services/                    # Business Logic & AI Integration
│   ├── ai_service.py            # AI categorization, priority, duplicates
│   ├── complaint_service.py     # Complaint CRUD logic
│   └── storage_service.py       # Cloudinary interactions
├── repositories/                # Database interaction layer
├── workers/                     # Background tasks (Celery/Redis for AI)
└── main.py                      # FastAPI application entry point

2. Modular Architecture

We will use Domain-Driven Design (DDD) for the backend and Feature-Sliced Design
(FSD) for the frontends.

  - Beginner Explanation: Instead of grouping files by type (e.g., putting all
    UI components in one folder, all API calls in another), we group them by
    feature (e.g., everything related to "Complaints" lives together).
  - Why it's Enterprise-Grade: If you want to remove, scale, or update the
    "Complaints" feature, you only touch one isolated module. It prevents the
    "spaghetti code" nightmare as the project grows.

3. Naming Conventions

To maintain a clean codebase across different languages, we will use strict
naming conventions:

  - React/Next.js (Frontend):
      - Files/Folders: kebab-case (e.g., user-profile.tsx, auth-service.ts).
      - Components/Interfaces: PascalCase (e.g., SubmitButton, UserProfile).
      - Functions/Variables: camelCase (e.g., fetchComplaints, isLoading).
  - FastAPI/Python (Backend):
      - Files/Folders/Variables/Functions: snake_case (e.g.,
        complaint_service.py, calculate_priority()).
      - Classes (Models/Schemas): PascalCase (e.g., ComplaintModel,
        CreateComplaintSchema).
  - Database:
      - Tables and Columns: snake_case (e.g., civic_complaints,
        assigned_worker_id).

4. Frontend-Backend Communication Flow

Because this app relies heavily on AI logic upon submission, all writes must go
through the FastAPI backend, not directly to Supabase from the client.

1.  Image Upload (Client-Side): User attaches an image. The mobile app requests
    a secure presigned signature from FastAPI, then uploads the image directly
    to Cloudinary (saves backend bandwidth). Cloudinary returns an Image URL.
2.  Submission: Mobile app sends the Complaint JSON (including GPS coords and
    Image URL) to FastAPI.
3.  Processing: FastAPI triggers background AI tasks (duplicate check,
    auto-categorize, priority score) and saves the final data to the Supabase
    PostgreSQL database.
4.  Realtime Updates: Supabase Realtime listens to database changes. The mobile
    app and admin dashboard are subscribed to these channels and instantly
    update the UI (e.g., "Status changed to Resolved") without needing to
    constantly refresh.

5. Database Interaction Flow

  - Supabase Auth: Handles all user authentication (Citizens, Admins, Workers).
    It issues JWT tokens.
  - FastAPI to PostgreSQL: FastAPI uses an ORM (like SQLAlchemy or SQLModel) to
    read/write to the Supabase PostgreSQL database securely using the Supabase
    connection string.
  - Repository Pattern: FastAPI will not write raw SQL in the API routes. API
    routes call a Service (business logic), which calls a Repository (database
    queries). This makes the database easy to mock during testing.

6. API Architecture

We will use a RESTful API architecture with standard HTTP methods.

  - Versioning: All endpoints prefixed with /api/v1/.
  - Authentication: FastAPI validates the Supabase JWT token passed in the
    Authorization: Bearer <token> header via dependency injection.
  - Domain Endpoints:
      - POST /api/v1/complaints: Create grievance (Triggers AI).
      - GET /api/v1/complaints: Fetch list (with pagination, filters).
      - PATCH /api/v1/complaints/{id}/status: Update status (Admin/Worker).
      - GET /api/v1/workers/nearby: Fetch workers using PostGIS geospatial
        queries.

7. Environment Variable Structure

Environment variables must be strictly separated to prevent leaking backend
secrets to the mobile app.

Mobile App (.env) / Admin Dashboard (.env.local)

  - EXPO_PUBLIC_API_URL / NEXT_PUBLIC_API_URL (FastAPI Base URL)
  - EXPO_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
  - EXPO_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY
  - EXPO_PUBLIC_MAPS_API_KEY (Google Maps / Mapbox)
  - EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME

FastAPI Backend (.env)

  - DATABASE_URL (Supabase PostgreSQL connection string)
  - SUPABASE_JWT_SECRET (To verify auth tokens)
  - CLOUDINARY_API_KEY & CLOUDINARY_API_SECRET
  - OPENAI_API_KEY (or HuggingFace/custom AI endpoint keys)
  - REDIS_URL (For background task queues)

8. Reusable Component Strategy

  - Atomic Design System:
      - Atoms: Basic UI elements (Buttons, Text Inputs, Badges).
      - Molecules: Groups of atoms (Form Fields with labels and error messages).
      - Organisms: Complex UI blocks (Complaint Card, Map View, Navigation Bar).
  - Headless UI: Business logic (hooks) will be separated from UI presentation.
    For example, a useComplaintSubmission() hook handles the logic, while
    ComplaintForm just handles the rendering.
  - Styling: Use Tailwind CSS for Next.js and NativeWind for React Native Expo
    to ensure a unified styling syntax across both codebases.

9. Scalable Mobile App Architecture

  - State Management:
      - Server State: React Query (@tanstack/react-query) to handle API
        fetching, caching, and loading/error states.
      - Client State: Zustand for lightweight global state (e.g., current
        language preference, theme, user session).
  - Offline-First Strategy: Citizens might report issues in areas with poor
    internet.
      - Store complaints locally using AsyncStorage or SQLite if the network
        fails.
      - Implement a background sync queue that uploads the data to FastAPI once
        the device reconnects.
  - Localization (i18n): Use i18next to handle multilingual support dynamically
    without rebuilding the app.

10. Scalable FastAPI Backend Architecture

  - Layered Architecture:
      - Controller (API) -> Service (Business/AI Logic) -> Repository (DB Data)
  - Asynchronous AI Processing: AI tasks (like processing images for duplicates
    or analyzing text for priority) can be slow.
      - Instead of making the user wait 10 seconds for a response, FastAPI will
        accept the complaint, immediately return a 201 Created (Status: Pending
        Analysis), and pass the AI job to a Background Task Queue (using Celery
        + Redis, or FastAPI's native BackgroundTasks for MVP).
      - Once AI finishes processing, it updates the database, triggering
        Supabase Realtime to update the user's mobile app instantly.
  - Geospatial Scalability: Because you have GPS geo-tagging and maps, the
    database models will utilize PostGIS (supported natively by Supabase) for
    high-performance radius queries (e.g., "find all duplicate complaints
    within 50 meters" or "find nearest field worker").
