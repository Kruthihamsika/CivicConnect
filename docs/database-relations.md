How Tables Interact (Relationship Explanations)
Complaints to Users (Citizens): 1-to-Many. One citizen can create many complaints.
Complaints to Categories: Many-to-1. Hundreds of complaints can fall under the "Water Leak" category.
Complaints to Images: 1-to-Many. A single grievance can have multiple photos uploaded to Cloudinary.
Complaints to Users (Upvotes): Many-to-Many. Resolved through the complaint_upvotes junction table.
Complaints to Workers (Assignments): 1-to-Many. A complaint can be assigned to a worker, rejected, and assigned to another (tracked via assignments table).