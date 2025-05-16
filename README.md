# YaqeenMed

## User Story:
- User can post a request to be reviewed by a doctor
- User can attach a document to the request
- User can write a summarised comment to be seen in the doctor request page
- User can write a detailed comment to be seen by the accepted doctor
- User can edit and delete the request before a doctor accepts it
- User can rate the doctor out of 5 and add a review comment after the doctor review
- User can see his/her request in the Request dashboard page
- Doctor can either accept or decline the requests
- Ones the doctor accept a request he is commited to review the request before accepting any other

## Entity Relationship Diagram (ERD)

### Entities and Attributes

| Entity      | Attributes                                                       | Description                                         |
|-------------|-----------------------------------------------------------------|-----------------------------------------------------|
| **User**    | UserID (PK), Name, Email, Password, Role (user, doctor, admin) | All users, including regular users, doctors, and admins |
| **Doctor**  | DoctorID (PK), UserID (FK), Specialization, SCFHS_Certificate_ID, Status (Pending, Approved, Declined) | Doctor-specific data linked to User account         |
| **Request** | RequestID (PK), Title, DetailedComment, SummaryComment, DatePosted, Status (Pending, Accepted, Done), UserID (FK), DoctorID (FK, nullable) | Review requests posted by users                      |
| **Review**  | ReviewID (PK), Rating (1-5), Comment, UserID (FK), DoctorID (FK), RequestID (FK, unique) | User ratings and comments for doctors after request completion |
| **Attachment** | AttachmentID (PK), FileURL, RequestID (FK)                  | Files attached to requests                           |

### Relationships

| From Entity | To Entity | Relationship Type             | Description                                                    |
|-------------|-----------|------------------------------|----------------------------------------------------------------|
| User        | Request   | One-to-Many                  | A user can post many requests                                  |
| User        | Review    | One-to-Many (one review per request) | A user can submit one review per completed request            |
| Doctor      | User      | One-to-One                   | Each doctor is linked to exactly one user account             |
| Doctor      | Request   | One-to-Many                  | A doctor can accept multiple requests (one at a time)         |
| Request     | Doctor    | Many-to-One (nullable)       | A request may be unassigned or assigned to one doctor         |
| Request     | Attachment| One-to-Many                  | A request can have multiple attachments                        |
| Doctor      | Review    | One-to-Many                  | A doctor can receive multiple reviews                          |

### Business Rules

| Rule                                                  | Explanation                                                               |
|-------------------------------------------------------|---------------------------------------------------------------------------|
| Admin must approve doctor registration before active use | New doctor registrations are pending admin approval                      |
| A doctor can only accept one request at a time        | A Doctor must complete the current request before accepting another            |
| A user can review a doctor only once per completed request | Duplicate reviews per request are not allowed                            |


