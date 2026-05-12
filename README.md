E-Learning Platform (Learnifya)

Learnifya is a full-stack Learning Management System (LMS) built with Next.js, TypeScript, Prisma, and PostgreSQL.

The platform provides separate dashboards for students and instructors with authentication, course management, enrollment, and lesson progress tracking.

---

## 🚀 Features

### Authentication & Authorization
- Role-based authentication (Student / Instructor)
- Secure user registration & login
- Protected routes
- Change name & password settings

### Student Features
- Browse available courses
- Enroll in courses
- Access enrolled courses only
- Track lesson completion progress
- Mark lessons as completed
- Personal dashboard

### Instructor Features
- Create new courses
- Edit courses & lessons
- Add lessons with YouTube video URLs
- Instructor dashboard
- Manage course content

### Course System
- Course enrollment system
- Lesson ordering & positioning
- Protected lesson access
- Progress tracking

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js Server Actions / API Routes
- Prisma ORM
- PostgreSQL

### Authentication
- NextAuth.js / JWT Authentication

---

## 🗄️ Database Design

The database includes:
- Users
- Courses
- Lessons
- Enrollments
- Lesson Completion Tracking

Built using Prisma ORM with PostgreSQL relational schema.

## ⚙️ Installation

```bash
git clone https://github.com/your-username/educore.git

cd educore

npm install
```

Create `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

---

## 🌐 Live Demo
https://learning-platform-nxsi.vercel.app/
---

## 📚 What I Learned

- Relational database design with Prisma
- Authentication & authorization
- Role-based access control
- Full-stack architecture with Next.js
- Building scalable dashboard systems
- Managing protected content & progress tracking
