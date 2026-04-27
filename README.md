# Agnos Health - Intelligent Patient Management

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://agnos-health-assignment-teal.vercel.app/)

** Live Demo:** [https://agnos-health-assignment-teal.vercel.app/](https://agnos-health-assignment-teal.vercel.app/)

---

## Project Overview
A Next-generation healthcare infrastructure designed for the Agnos Candidate Assignment. It provides a seamless, real-time synchronization between patient data intake and clinical monitoring.

This project consists of two main interfaces:
1. **Registration Portal (`/patient`):** A mobile-optimized, multi-step form for patients to submit their details with an auto-save feature.
2. **Staff Dashboard (`/staff`):** A real-time command center for clinical staff to monitor incoming patient data instantly.

## Key Features
* **Real-time Synchronization:** Sub-second data updates powered by Supabase WebSockets.
* **Smart Debouncing:** Optimizes database writes by saving data only when the user pauses typing (1.5s delay).
* **Bilingual UI:** Full support for Thai and English for maximum accessibility.
* **Modern UI/UX:** Built with TailwindCSS, featuring custom modals, adaptive layouts (Split-pane for desktop, Sliding-panel for mobile), and glassmorphism elements.

## Documentation
For detailed information about the project, please refer to the following documents:
*  [**Quick Start Guide**](QUICKSTART.md) - Instructions to run the project locally.
*  [**Development Planning**](DEVELOPMENT.md) - Architecture and design decisions.
*  [**Technical Implementation**](IMPLEMENTATION.md) - Database schema and core logic details.

## Configuration
This project uses Supabase for real-time synchronization. Create a `.env.local` file in the repository root with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack
* **Framework:** Next.js 15 (App Router), React 19
* **Styling:** TailwindCSS 4.0, Lucide React (Icons)
* **Backend & DB:** Supabase (PostgreSQL + Real-time WebSockets)
* **Deployment:** Vercel