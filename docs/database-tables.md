3. Database Schema (Tables & Columns)
A. Users & Roles Management
Note: Supabase handles authentication in a hidden auth.users schema. We create a public users table linked to it.
Table: users
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK, FK (auth.users) | Matches Supabase Auth UID |
| role | user_role_enum | NOT NULL | Role of the user |
| full_name | VARCHAR(100) | NOT NULL | User's display name |
| phone_number| VARCHAR(20) | UNIQUE | Contact number |
| locale | VARCHAR(10) | DEFAULT 'en' | User's language preference (e.g., 'en', 'es', 'hi') |
| is_active | BOOLEAN | DEFAULT TRUE | Soft delete toggle |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
B. Classification & Reference
Table: categories
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| name_en | VARCHAR(100) | NOT NULL, UNIQUE | Base category name (e.g., "Pothole") |
| name_locales| JSONB | | Multilingual map: {"es": "Bache", "hi": "गड्ढा"} |
| sla_hours | INT | DEFAULT 48 | Time before automatic escalation |
| is_active | BOOLEAN | DEFAULT TRUE | Soft delete |
C. Core Operations (Complaints & PostGIS)
Table: complaints
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| citizen_id | UUID | FK (users.id) | Who reported it |
| category_id | UUID | FK (categories.id) | Nullable initially (filled by AI) |
| title | VARCHAR(200)| NOT NULL | Brief summary |
| description | TEXT | | Detailed explanation |
| location_geom | GEOGRAPHY(Point, 4326) | NOT NULL | PostGIS GPS Coordinates |
| location_address| TEXT | | Reverse-geocoded human address |
| status | complaint_status_enum | DEFAULT 'pending_ai' | Current state of grievance |
| priority_level| priority_level_enum | | Set by AI or Admin |
| ai_priority_score| FLOAT | | AI calculated severity (0.0 - 100.0) |
| ai_confidence | FLOAT | | AI category prediction confidence |
| parent_id | UUID | FK (complaints.id) | Links duplicate to original complaint |
| upvote_count | INT | DEFAULT 0 | Gamification / Citizen support |
| is_escalated | BOOLEAN | DEFAULT FALSE | SLA breached flag |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete tracking |
Table: complaint_images
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| complaint_id| UUID | FK (complaints.id) | Associated complaint |
| image_url | VARCHAR(255)| NOT NULL | Cloudinary CDN link |
| ai_vision_tags| JSONB | | AI object detection labels |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
D. Community & Interactions
Table: complaint_upvotes
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| complaint_id| UUID | FK (complaints.id) | Associated complaint |
| user_id | UUID | FK (users.id) | Citizen who upvoted |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
(Composite Unique Constraint on complaint_id and user_id to prevent double-voting)
E. Field Operations & Tracking
Table: assignments
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| complaint_id| UUID | FK (complaints.id) | Grievance to fix |
| worker_id | UUID | FK (users.id) | Assigned Field Worker |
| assigned_by | UUID | FK (users.id) | Admin ID (NULL if auto-assigned) |
| status | assignment_status_enum| DEFAULT 'pending'| Worker's acceptance status |
| completion_notes| TEXT | | Worker's final report |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
| completed_at| TIMESTAMPTZ | NULL | When the work was finished |
Table: complaint_history (Audit Trail)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| complaint_id| UUID | FK (complaints.id) | Tracked complaint |
| changed_by | UUID | FK (users.id) | Who made the change (Admin/Worker/AI) |
| old_status | complaint_status_enum | | Previous state |
| new_status | complaint_status_enum | | New state |
| remarks | TEXT | | Explanation of change |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
F. System & Escalations
Table: escalations
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| complaint_id| UUID | FK (complaints.id) | Breached complaint |
| escalated_to| UUID | FK (users.id) | Senior Admin handling it |
| reason | TEXT | NOT NULL | E.g., "SLA breached by 24h" |
| resolved_at | TIMESTAMPTZ | NULL | When the escalation was cleared |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |
Table: notifications
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK (users.id) | Target user |
| title | VARCHAR(150)| NOT NULL | Notification header |
| message | TEXT | NOT NULL | Notification body |
| action_data | JSONB | | App deep-link payload |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Audit timestamp |