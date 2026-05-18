Here is the complete, production-grade PostgreSQL database schema designed
specifically for Supabase. This architecture is normalized, optimized with
proper indexing, uses PostGIS for spatial data, and is structured to seamlessly
support background AI processes.

1. Global Strategies & Conventions

  - Naming Convention: snake_case for all tables, columns, and enums. Plural
    names for tables (e.g., users, complaints).
  - Audit Timestamps: Every table includes created_at (immutable) and updated_at
    (updated via Postgres trigger).
  - Soft Delete Strategy:
      - Reference tables (users, categories) use an is_active BOOLEAN flag.
      - Transactional tables (complaints) use a deleted_at TIMESTAMP NULL
        column. This preserves historical data and avoids breaking foreign key
        constraints.
  - PostGIS: We use the GEOGRAPHY(Point, 4326) data type. It is optimized for
    calculating accurate real-world distances (meters/kilometers) directly on
    the database level.

2. ENUM Definitions (Custom Data Types)

Enums enforce strict data validation at the database level.

  - user_role_enum: 'citizen', 'admin', 'field_worker'
  - complaint_status_enum: 'pending_ai', 'open', 'assigned', 'in_progress',
    'resolved', 'closed', 'rejected'
  - priority_level_enum: 'low', 'medium', 'high', 'critical'
  - assignment_status_enum: 'pending', 'accepted', 'completed', 'failed'

3. Database Schema (Tables & Columns)

A. Users & Roles Management

Note: Supabase handles authentication in a hidden auth.users schema. We create a
public users table linked to it.

Table: users | Column | Type | Constraints | Description | | :--- | :--- | :---
| :--- | | id | UUID | PK, FK (auth.users) | Matches Supabase Auth UID | | role
| user_role_enum | NOT NULL | Role of the user | | full_name | VARCHAR(100) |
NOT NULL | User's display name | | phone_number| VARCHAR(20) | UNIQUE | Contact
number | | locale | VARCHAR(10) | DEFAULT 'en' | User's language preference
(e.g., 'en', 'es', 'hi') | | is_active | BOOLEAN | DEFAULT TRUE | Soft delete
toggle | | created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp | |
updated_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |

B. Classification & Reference

Table: categories | Column | Type | Constraints | Description | | :--- | :--- |
:--- | :--- | | id | UUID | PK | Unique identifier | | name_en | VARCHAR(100) |
NOT NULL, UNIQUE | Base category name (e.g., "Pothole") | | name_locales| JSONB
| | Multilingual map: {"es": "Bache", "hi": "गड्ढा"} | | sla_hours | INT |
DEFAULT 48 | Time before automatic escalation | | is_active | BOOLEAN | DEFAULT
TRUE | Soft delete |

C. Core Operations (Complaints & PostGIS)

Table: complaints | Column | Type | Constraints | Description | | :--- | :--- |
:--- | :--- | | id | UUID | PK | Unique identifier | | citizen_id | UUID | FK
(users.id) | Who reported it | | category_id | UUID | FK (categories.id) |
Nullable initially (filled by AI) | | title | VARCHAR(200)| NOT NULL | Brief
summary | | description | TEXT | | Detailed explanation | | location_geom |
GEOGRAPHY(Point, 4326) | NOT NULL | PostGIS GPS Coordinates | |
location_address| TEXT | | Reverse-geocoded human address | | status |
complaint_status_enum | DEFAULT 'pending_ai' | Current state of grievance | |
priority_level| priority_level_enum | | Set by AI or Admin | |
ai_priority_score| FLOAT | | AI calculated severity (0.0 - 100.0) | |
ai_confidence | FLOAT | | AI category prediction confidence | | parent_id | UUID
| FK (complaints.id) | Links duplicate to original complaint | | upvote_count |
INT | DEFAULT 0 | Gamification / Citizen support | | is_escalated | BOOLEAN |
DEFAULT FALSE | SLA breached flag | | created_at | TIMESTAMPTZ | DEFAULT NOW() |
Audit timestamp | | updated_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete tracking |

Table: complaint_images | Column | Type | Constraints | Description | | :--- |
:--- | :--- | :--- | | id | UUID | PK | Unique identifier | | complaint_id| UUID
| FK (complaints.id) | Associated complaint | | image_url | VARCHAR(255)| NOT
NULL | Cloudinary CDN link | | ai_vision_tags| JSONB | | AI object detection
labels | | created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |

D. Community & Interactions

Table: complaint_upvotes | Column | Type | Constraints | Description | | :--- |
:--- | :--- | :--- | | id | UUID | PK | Unique identifier | | complaint_id| UUID
| FK (complaints.id) | Associated complaint | | user_id | UUID | FK (users.id) |
Citizen who upvoted | | created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit
timestamp | (Composite Unique Constraint on complaint_id and user_id to prevent
double-voting)

E. Field Operations & Tracking

Table: assignments | Column | Type | Constraints | Description | | :--- | :--- |
:--- | :--- | | id | UUID | PK | Unique identifier | | complaint_id| UUID | FK
(complaints.id) | Grievance to fix | | worker_id | UUID | FK (users.id) |
Assigned Field Worker | | assigned_by | UUID | FK (users.id) | Admin ID (NULL if
auto-assigned) | | status | assignment_status_enum| DEFAULT 'pending'| Worker's
acceptance status | | completion_notes| TEXT | | Worker's final report | |
created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp | | completed_at|
TIMESTAMPTZ | NULL | When the work was finished |

Table: complaint_history (Audit Trail) | Column | Type | Constraints |
Description | | :--- | :--- | :--- | :--- | | id | UUID | PK | Unique identifier
| | complaint_id| UUID | FK (complaints.id) | Tracked complaint | | changed_by |
UUID | FK (users.id) | Who made the change (Admin/Worker/AI) | | old_status |
complaint_status_enum | | Previous state | | new_status | complaint_status_enum
| | New state | | remarks | TEXT | | Explanation of change | | created_at |
TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |

F. System & Escalations

Table: escalations | Column | Type | Constraints | Description | | :--- | :--- |
:--- | :--- | | id | UUID | PK | Unique identifier | | complaint_id| UUID | FK
(complaints.id) | Breached complaint | | escalated_to| UUID | FK (users.id) |
Senior Admin handling it | | reason | TEXT | NOT NULL | E.g., "SLA breached
by 24h" | | resolved_at | TIMESTAMPTZ | NULL | When the escalation was cleared |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |

Table: notifications | Column | Type | Constraints | Description | | :--- | :---
| :--- | :--- | | id | UUID | PK | Unique identifier | | user_id | UUID | FK
(users.id) | Target user | | title | VARCHAR(150)| NOT NULL | Notification
header | | message | TEXT | NOT NULL | Notification body | | action_data | JSONB
| | App deep-link payload | | is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |

4. Database Indexing Strategy

To ensure fast reads as the database scales to millions of records, we need
targeted indexes.

1.  PostGIS Spatial Index:
      - CREATE INDEX idx_complaints_location ON complaints USING GIST
        (location_geom);
      - Why: Allows instant mapping queries like "Find all potholes within a 2km
        radius of this coordinate."
2.  Foreign Key Indexes:
      - B-Tree indexes on complaints.citizen_id, complaints.category_id, and
        assignments.worker_id for fast JOIN operations.
3.  Filter Indexes:
      - B-Tree index on complaints.status and complaints.deleted_at because the
        Admin Dashboard will constantly query "Show me all Open and Active
        complaints."
4.  AI Duplicate Index:
      - B-Tree index on complaints.parent_id. When users view a complaint, the
        system can quickly fetch all "children" (duplicate) complaints.

5. How Tables Interact (Relationship Explanations)

  - Complaints to Users (Citizens): 1-to-Many. One citizen can create many
    complaints.
  - Complaints to Categories: Many-to-1. Hundreds of complaints can fall under
    the "Water Leak" category.
  - Complaints to Images: 1-to-Many. A single grievance can have multiple photos
    uploaded to Cloudinary.
  - Complaints to Users (Upvotes): Many-to-Many. Resolved through the
    complaint_upvotes junction table.
  - Complaints to Workers (Assignments): 1-to-Many. A complaint can be assigned
    to a worker, rejected, and assigned to another (tracked via assignments
    table).

6. How the Schema Supports AI Features

1.  AI Auto-Categorization: When a citizen submits a complaint, category_id is
    left NULL. FastAPI's AI service reads the description and image_url,
    determines it's a pothole, updates category_id, and sets ai_confidence to
    0.92.
2.  AI Priority Scoring: The AI analyzes the language (e.g., "massive sinkhole,
    cars are crashing"). It writes a score of 95.5 to ai_priority_score and sets
    priority_level to 'critical'.
3.  AI Duplicate Detection: Upon submission, FastAPI queries the database using
    PostGIS (location_geom) for nearby complaints. If the AI determines it's a
    duplicate, it sets the new complaint's parent_id to the original complaint's
    ID and updates the original's upvote_count by +1.
4.  Multilingual Support: The categories.name_locales (JSONB) table allows the
    mobile app to request name_locales->>'es' so a Spanish-speaking user sees
    "Bache" instead of "Pothole" without duplicating rows.
