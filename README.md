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

## ERD

| **Entity**     | **Attributes**                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **User**       | UserID (PK), Name, Email, Password, Role (User/Doctor)                                                                          |
| **Doctor**     | DoctorID (PK), Name, Specialization, Email, Password                                                                            |
| **Request**    | RequestID (PK), Title, DetailedComment, SummaryComment, Date, Status (Pending, Accepted, Completed), UserID (FK), DoctorID (FK) |
| **Review**     | ReviewID (PK), Rating (1-5), Comment, UserID (FK), DoctorID (FK), RequestID (FK)                                                |
| **Attachment** | AttachmentID (PK), FileURL, RequestID (FK)                                                                                      |

## Relations

| **From Entity** | **To Entity**  | **Cardinality** |
| --------------- | -------------- | --------------- |
| **User**        | **Request**    | 1\:M            |
| **Doctor**      | **Request**    | M:1             |
| **Request**     | **Attachment** | 1\:M            |
| **User**        | **Review**     | M:1             |
| **Doctor**      | **Review**     | M:1             |

