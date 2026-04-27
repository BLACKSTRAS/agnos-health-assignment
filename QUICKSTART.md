# Quick Start Guide

Welcome to the **Agnos Health - Intelligent Patient Management** project. Follow these instructions to set up and run the application locally.

## Prerequisites

Ensure you have the following installed on your system:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (comes with Node.js) or **yarn** / **pnpm**
* **Git** installed on your machine
* A **Supabase** account for database and real-time WebSockets

---

## Installation Steps

### 1. Clone the repository
Open your terminal and clone the project to your local machine:
```bash
git clone <repository-url>
cd agnos-health
```

### 2. Configure environment variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Alternatively, copy the sample file and update values:
```bash
copy .env.local.example .env.local
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```

### 5. Open the app
Open your browser and visit:
```text
http://localhost:3000
```

### 6. Navigate
* Home: `http://localhost:3000/`
* Patient registration: `http://localhost:3000/patient`
* Staff dashboard: `http://localhost:3000/staff`

## Notes

* The staff dashboard uses Supabase real-time updates and requires valid environment variables.
* The patient registration page saves form state through `PatientContext` and updates Supabase automatically.
* If you do not have Supabase configured, the app will still render but the staff dashboard may not show live updates.
