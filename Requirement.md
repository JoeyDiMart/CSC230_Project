# CIRT Publishing Management System Requirements Document

## 1. Overview of the System

### Name
CIRT Publishing Management System

### Purpose
- Provide a centralized online repository for graduate student research posters.
- Provide an academic journal for publishing faculty and graduate students' criminology research papers.
- Provide a platform to connect with practitioners (local law enforcement and federal agencies) and share criminology-related resources.

### Scope
The system will include, but is not limited to:
1. **Poster Repository**: For storing, displaying, and searching graduate student research posters.
2. **Online Academic Journal**: Featuring submission, peer review, and publication workflows.

Additional features such as discussion forums and data hosting may be developed if time and scope allow.

### Intended Users
- **Graduate Students**: Authors of posters and journal submissions.
- **Faculty and Staff**: Editors, reviewers, and instructors.
- **External Practitioners/Agencies**: Potential readers, possible co-authors, and community partners.
- **General Public**: Readers to view and download published materials (if open access is granted).

---

## 2. Poster Repository Requirements

### Upload & Storage
- Graduate students (or designated faculty/staff) can upload PDF versions of research or exhibition posters.
- Metadata stored with each poster includes:
  - Title of poster
  - Author(s)
  - Semester/Year presented
  - Keywords or tags (e.g., "juvenile justice," "domestic violence").

### Cataloging & Organization
- Posters organized by:
  - Semester/Year (e.g., Fall 2024, Spring 2025).
  - Topic or research theme.
- Administrators or designated users can edit/add poster metadata.

### Search & Browse
- Publicly accessible gallery or list view of posters.
- Keyword search capability for titles, authors, abstracts (if provided), and tags.
- Filters for narrowing search results:
  - Year
  - Keywords
  - Author

### Access Control
- Final, published posters are viewable without login if open access is granted.
- Poster uploads are restricted to authenticated users (students or staff).

### Download & Preview
- Viewers can download PDFs of posters.
- In-line PDF previews or thumbnail images are provided where feasible.

---

## 3. Online Academic Journal Requirements

### 3.1 Journal Structure & Publication

#### Journal Overview Page
- Space for the "CIRT Academic Journal" with:
  - Description of journal focus.
  - Submission and reviewer guidelines.
  - Editorial board/contact information.

#### Issue-Based Publishing
- Journal issues published as:
  - Vol 1, Issue 1, Spring 2025 (example).
- Each issue lists:
  - Article title
  - Author(s)
  - Abstract
  - Link to full PDF
  - DOI/unique identifier (optional).

#### Open Access vs. Restricted Access
- Published articles are open access as per editorial policy.
- Pre-publication access limited to designated users (authors, reviewers, editors).

### 3.2 Submission and Author Requirements

#### Submission Portal
- Authors can upload manuscripts via a submission form.
- Metadata captured includes:
  - Article title
  - Abstract
  - List of authors (with affiliations)
  - Contact information for corresponding author
  - Keywords or tags
  - Manuscript file (Word or PDF)
  - Supplemental files/data (if any)

#### Author Registration/Login
- Authors must register/login before submitting.
- Authors can track submission status:
  - Received, Under Review, Revisions Needed, Accepted, Published.

#### Revisions & Resubmission
- Authors can upload revised manuscripts upon request.
- All versions (original and revisions) are tracked.

### 3.3 Review Process Requirements

#### Reviewer Roles and Login
- Reviewers must have accounts with reviewer permissions.
- Editors can assign/remove reviewers for submissions.

#### Blind Peer Review
- Author identities are masked for reviewers.
- Reviewer identities are masked for authors.
- Editors can view both authors and reviewers.

#### Review Workflow
- Reviewers access manuscript title, abstract, and full text (with masking as needed).
- Two types of feedback:
  - Confidential to Editor
  - Comments to Author
- Decision recommendations:
  - Accept, Minor Revisions, Major Revisions, Reject.

#### Notifications & Communication
- Dashboard notifications for:
  - New papers assigned to reviewers.
  - Editor notified when reviews are submitted.
  - Authors notified of decisions/revisions.

### 3.4 Editorial Management Requirements

#### Editor Role
- Editors have full administrative rights for:
  - Assigning submissions to reviewers.
  - Viewing all comments (public and confidential).
  - Making final decisions: Accept, Revision, Reject.

#### Editorial Dashboard
- Dashboard lists active submissions with statuses.
- Shows reviewer assignments, completion status, and due dates.
- Allows sending reminders to reviewers/authors.

#### Publishing Workflow
- Editors move accepted articles to "Ready for Publication."
- Collate articles into journal issues and specify publication dates.
- System generates final published versions and summaries.

#### Versioning & Archiving
- Editors can access previous manuscript versions.
- Archives maintain metadata and published articles for reference.

---

## 4. User Roles and Access Control

### Guest / Public User
- View published posters and journal articles.
- Perform searches and filter results.

### Author
- Must register/login.
- Submit manuscripts and track status.
- Upload revisions and edit profile/submission metadata.

### Reviewer
- Must register/login with reviewer permissions.
- View assigned manuscripts in blind review format.
- Submit comments and recommendations.

### Editor / Admin
- Full rights on submissions, reviews, and user assignments.
- Publish final articles and manage journal issues.
- Manage poster repository items and metadata.
- Manage user accounts, roles, and permissions.



# UI/UX Requirements
#### UI/UX Functional Requirements
- Design of all pages 
- Set the bones of the website by writing the HTML
- Use React.js to make the buttons, input boxes, etc. reactive and dynamic
- Must support: Login page, visible publications, different view, mobile and laptop functionality

#### UI/UX Non-Functional Requirements
- CSS to style the website 
- adding animation and pop to the website
- Scroll bar for extra photos from CIRT events, etc.
- Place for events/networking things etc.


# Backend/Database


## Security functionality 

### Must have 
- Passwords will be stored as Hashes
- Contact information should be visible only if user makes it public
- Password reset

### Should have 
- Double authentification
- One time passwords


### Nice to have
- Touch id and Face id

## Networking

### Must have 
- Research on the repository, if checked there would be contact information of authors 
- Find person (public accoutns)

### Should have 



### Nice to have
- Ability to send a dm to private accounts

## Journal and Reviewer functionality 

### Must have 
- Several roles (student, Editor, and blind reviewer)
- Comments for changes
-  Submission and Downloads 

### Should have 
- To do edits list to the student


### Nice to have
- Built in editor


## Archive and sort of archive

### Must have 
- Categorization by general topic of research
- Sorting by Author, Age, Keyword, Most recent (search tab)

### Should have 
- Comment section


### Nice to have


## Settings / Web Manager 

### Must have 
- Per page change text, image capabilities
- Ban users by username
- Allow external organization account creation
- Ability to send external invite links

### Should have 



### Nice to have





