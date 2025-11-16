🚀 Task Manager — SvelteKit + Supabase

A modern task management web application built with SvelteKit, Supabase, TailwindCSS, and shadcn-svelte.
Authenticated users can create, organize, filter, and manage tasks with priorities, due dates, and statuses — all synced to their account.

Designed for individuals who want a fast, lightweight, and clean task dashboard without unnecessary complexity.

📸 Screenshots

<img width="1365" height="651" alt="image" src="https://github.com/user-attachments/assets/77730087-5625-464f-b298-6faff913ad4a" />
<img width="683" height="528" alt="image" src="https://github.com/user-attachments/assets/aef872dd-cd12-4469-96d0-40a71c98e410" />
<img width="694" height="539" alt="image" src="https://github.com/user-attachments/assets/b6c53746-bc12-473b-b2d3-09bcaae38cf9" />

Dashboard	Login Page

	
✨ Features
🔐 Authentication

Email-based register / login using Supabase Auth

“Remember me” cookie

Redirect guards for authenticated-only pages

Logout endpoint (/logout)

Password reset UI (not yet wired to Supabase)

📝 Task Management

Create tasks with:

Title

Description

Priority (Low / Medium / High)

Due date

Status (Pending / In Progress / Completed)

Inline edit support

Delete tasks with confirmation

Quick status toggles (complete/in-progress/pending)

Toast alerts for CRUD feedback

🔎 Filtering & Sorting

Search bar

Filter by status

Filter by priority

Sort by due date, priority, or created date

Empty state messages

🎨 UI & UX

Light/dark theme toggle (persisted in localStorage)

shadcn-svelte based UI components

Responsive layout

Clean accessible design

🛠️ Tech Stack
Category	Tool
Framework	SvelteKit 2
Auth & DB	Supabase
Styling	TailwindCSS, Tailwind Variants, shadcn-svelte
Icons	lucide-svelte
Validation	Zod
Build Tool	Vite
Deployment	Vercel
📂 Project Structure
src/
│── lib/
│   ├── supabaseClient.js            # Supabase browser client
│   ├── validation/
│   │     ├── auth.js                # Zod schemas for auth
│   │     └── task.js                # Zod schemas for tasks
│   ├── components/
│   │     ├── ui/*                   # shadcn-svelte UI primitives
│   │     └── task/TaskCard.svelte   # Task display + inline editing
│
│── routes/
│   ├── +layout.svelte               # Application shell & theme handling
│   ├── +layout.server.js            # Session loader
│   │
│   ├── (auth)/
│   │     ├── login/+page.svelte
│   │     ├── register/+page.svelte
│   │     └── reset/+page.svelte     # Password reset UI placeholder
│   │
│   ├── (app)/
│   │     ├── +page.svelte           # Dashboard
│   │     └── +page.server.js        # CRUD handlers (actions)
│   │
│   └── logout/+server.js            # Logout handler
│
├── svelte.config.js
├── tailwind.config.js
└── vite.config.js

🔧 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo>.git
cd <repo>

2️⃣ Install Dependencies
npm install


If peer dependency errors appear:

npm install --legacy-peer-deps

3️⃣ Configure Environment Variables

Create a .env file in the root:

PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=


Both values come from Supabase → Project Settings → API.

4️⃣ Start the Development Server
npm run dev -- --open


Your application will be available at:
👉 http://localhost:5173

🔐 Environment Variables
Variable	Required	Description
PUBLIC_SUPABASE_URL	✅ Yes	Supabase project API URL
PUBLIC_SUPABASE_ANON_KEY	✅ Yes	Public anon key for auth & CRUD
🌍 Deployment (Vercel)

This project is configured using @sveltejs/adapter-vercel.

Vercel Build Settings
Setting	Value
Framework Preset	SvelteKit
Root Directory	./
Build Command	(toggle OFF — Vercel detects automatically)
Output Directory	(toggle OFF)
Install Command	npm install --legacy-peer-deps
Environment Variables	Add your Supabase keys

Once connected to GitHub, Vercel will auto-deploy on every push.

🧠 Design Decisions & Trade-Offs
Supabase (Auth + Storage)

Quick to set up, avoids building custom backend

Email/password fits the project

Vendor lock-in is a trade-off

SvelteKit Framework

SSR-ready

Built-in routing + form actions

Lightweight compared to React

Smaller ecosystem than React

TailwindCSS + shadcn-svelte

Rapid styling

Consistent and accessible UI

Must manage class bloat

Light/Dark Theme

Stored in localStorage

Fast client-side toggle

Not synced across devices

Auth Guards

Implemented via SvelteKit layouts

Central control for redirects

Reduces chance of unprotected routes

Form Actions + Zod

Automatic validation

Clean API

Redirects used to avoid 500 errors on success

✔️ Assumptions

Users authenticate via email/password

Tasks are private per user account

Browser supports localStorage

Vercel is used as the deployment target

Password reset will be implemented later

📌 Future Improvements

Full password reset integration

Drag-and-drop sortable tasks

Task categories/tags

User profile settings

OAuth providers (Google, GitHub)

Email notifications

PWA support (offline mode)

🏁 Conclusion

This Task Manager provides a simple, fast, and modern experience for organizing personal tasks.
With Supabase authentication, clean UI components, SvelteKit routing, and easy deployment via Vercel, the project offers a strong foundation for further expansion.
