# 🧩 Advanced Web Applications REST API (Users, Posts & Comments)

👨🏻‍🏫 **מרצה**
`אליאב מנשה`

👾 **סטודנטים**
`שירן לוי (ת״ז: 324127315)` & `לירון דבח (ת״ז: 322439027)`

---
פרויקט **REST API** לניהול **משתמשים**, **פוסטים** ו-**תגובות** במסגרת קורס _פיתוח אפליקציות אינטרנטיות_.  
נבנה עם **Node.js**, **Express**, **TypeScript** ו-**MongoDB**, כולל שכבת Controllers גנרית, בדיקות עם **Jest + Supertest**, תיעוד מלא עם **Swagger**, ואימות JWT עם מנגנון Refresh Tokens.

---

## ⚙️ Tech Stack

| Layer        | Technologies                           |
| :----------- | :------------------------------------- |
| 💻 Backend   | Node.js, Express.js, TypeScript        |
| 🧠 Database  | MongoDB, Mongoose                      |
| 🔐 Auth      | JWT + Refresh Tokens                   |
| 🧪 Testing   | Jest, Supertest                        |
| 📚 Docs      | Swagger                                |

---

## 🚀 הוראות התקנה והרצה

1. Run in the TERMINAL: `npm i`
2. Create `.env.dev` and set:
   - `PORT=3000`
   - `DATABASE_URL=<your_mongo_connection_string>`
   - `JWT_SECRET=<your_secret>`
   - `REFRESH_TOKEN_SECRET=<your_refresh_secret>`
3. Run in the TERMINAL:
   - Development: `npm run dev`
   - Production build: `npm start`

---

## 🗂️ מבנה הפרויקט

```
Advanced-Web-Applications-Rest-API/
├── src/
│   ├── controllers/     # לוגיקה עסקית וגישה ל-CRUD
│   ├── routes/          # Routes לפוסטים ותגובות
│   ├── models/          # סכמות Mongoose
│   ├── middleware/      # אימות JWT
│   ├── tests/           # בדיקות Jest + Supertest
│   ├── index.ts         # אתחול Express + חיבור ל-DB
│   └── server.ts        # הרצת השרת
├── dist/                # קבצי build
├── request.rest         # דוגמאות ל-REST calls
├── package.json
└── README.md
```

---

## 🧭 פונקציונליות מרכזיות

- **CRUD למשתמשים** - יצירה, שליפה, עדכון ומחיקה של פרופילי משתמשים (username, email ועוד שדות פרופיל נדרשים).
- **CRUD לפוסטים** - יצירה, שליפה, עדכון ומחיקה דרך `/post` ו-`/post/:id` (`src/routes/postsRoute.ts`, `src/controllers/postsController.ts`).
- **CRUD לתגובות** - יצירה, שליפה, עדכון ומחיקה דרך `/comment` ו-`/comment/:id` (`src/routes/commentsRoute.ts`, `src/controllers/commentsController.ts`).
- **קשרים בין ישויות** - משתמשים יוצרים פוסטים ומוסיפים תגובות לפוסטים ספציפיים.
- **אימות משתמשים** - הרשמה, התחברות והתנתקות עם JWT + Refresh Tokens לניהול חידוש סשן.
- **סינון לפי Query** - לדוגמה: `/post?senderID=...` או `/comment?postID=...` (`src/controllers/baseController.ts`).
- **בדיקות אוטומטיות** - כיסוי יחידות לכל endpoint עם Jest להבטחת פונקציונליות.
- **תיעוד API מלא** - Swagger (OpenAPI) עם פירוט endpoints ודוגמאות שימוש.

---

## 📌 Endpoints (בקצרה)

- `GET /post` | `GET /post/:id` | `POST /post` | `PUT /post/:id` | `DELETE /post/:id`
- `GET /comment` | `GET /comment/:id` | `POST /comment` | `PUT /comment/:id` | `DELETE /comment/:id`
- `GET /users` | `GET /users/:id` | `POST /users` | `PUT /users/:id` | `DELETE /users/:id`
- `POST /auth/register` | `POST /auth/login` | `POST /auth/logout` | `POST /auth/refresh`

דוגמאות נוספות נמצאות בקובץ: `request.rest`
