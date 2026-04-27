# Agnos Health - Patient Input Form & Staff View System

A real-time, responsive patient information system built with **Next.js**, **React**, and **TailwindCSS** that synchronizes patient form input with a staff monitoring dashboard in real-time.

## 📋 Project Overview

This is a front-end developer candidate assignment for Agnos Health. The system consists of:

- **Patient Form**: A comprehensive form where patients can enter their personal details
- **Staff View**: A real-time monitoring dashboard for staff members to track patient information input
- **Real-time Synchronization**: Instant data sync between patient and staff views using React Context API

## ✨ Features

### Patient Form
- ✅ Personal information collection (name, DOB, contact details)
- ✅ Address and demographic information
- ✅ Language and nationality selection
- ✅ Emergency contact information
- ✅ Form validation with error messaging
- ✅ Real-time status indicators (idle, filling, submitted)
- ✅ Responsive design for mobile and desktop
- ✅ Clean, modern UI with TailwindCSS

### Staff View
- ✅ Real-time patient data monitoring
- ✅ Form completion percentage tracker
- ✅ Status indicators (submitted, actively filling, inactive)
- ✅ Last update timestamp
- ✅ Responsive layout for various screen sizes
- ✅ Organized information display

### Technical Features
- ✅ State management with React Context API
- ✅ Type-safe TypeScript implementation
- ✅ Client-side form validation
- ✅ Responsive design (mobile-first approach)
- ✅ Modern React 19 and Next.js 16 practices

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.2.4
- **UI Library**: [React](https://react.dev/) 19.2.4
- **Styling**: [TailwindCSS](https://tailwindcss.com/) 4
- **Type System**: [TypeScript](https://www.typescriptlang.org/) 5
- **Icons**: [@heroicons/react](https://heroicons.com/) 2.2.0
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── patient/
│   │   └── page.tsx            # Patient form page
│   ├── staff/
│   │   └── page.tsx            # Staff dashboard page
│   └── api/
│       └── sync/               # Future WebSocket API route
├── components/
│   ├── PatientForm.tsx         # Patient form component
│   └── StaffView.tsx           # Staff monitoring component
└── store/
    └── PatientContext.tsx      # Global state management
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agnos-health
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Usage

### For Patients
1. Navigate to the **Patient Form** page
2. Fill in your personal information
3. Complete all required fields (marked with *)
4. Click **Submit Form** when ready
5. Your data is instantly visible to staff members

### For Staff Members
1. Navigate to the **Staff Dashboard** page
2. Monitor patient form completion in real-time
3. View form status indicators:
   - 🟢 **Submitted**: Patient has completed and submitted the form
   - 🟡 **Actively Filling**: Patient is currently filling the form
   - ⚪ **Inactive**: Waiting for patient to start
4. See form completion percentage
5. Track last update time

## 🔄 Real-Time Synchronization

Currently, synchronization is implemented using **React Context API** with local state management. This ensures instant UI updates across components on the same page.

### Future Enhancements
- WebSockets for multi-client real-time updates
- Server-side data persistence
- Multi-browser synchronization using Socket.io or Pusher
- Database integration for persistent storage

## ✅ Form Fields

### Required Fields (*)
- First Name
- Last Name
- Date of Birth
- Gender
- Address
- Preferred Language
- Nationality

### Optional Fields
- Middle Name
- Phone Number
- Email
- Religion
- Emergency Contact (Name & Relationship)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1024px and up)

All components use TailwindCSS's responsive design utilities for optimal viewing on any screen size.

## 🎨 Design Principles

- **User-Centric**: Simple, intuitive interface for patients to fill forms
- **Real-Time Feedback**: Instant visual feedback for data entry
- **Accessibility**: Clear labels, error messages, and status indicators
- **Performance**: Optimized components with proper state management
- **Responsiveness**: Mobile-first design approach

## 🔒 Validation Rules

- **Email**: Valid email format required
- **Phone Number**: 7-15 digits accepted
- **Required Fields**: All marked fields must be filled
- **Date of Birth**: Valid date format required

## 📦 Build & Deployment

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Deploy on Vercel
```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to Vercel for automatic deployments.

## 📝 Development Notes

### State Management Flow
1. `PatientContext` stores all patient data
2. `usePatient()` hook provides access to state and update functions
3. Components subscribe to context and re-render on updates
4. Both `PatientForm` and `StaffView` use the same context for synchronization

### Validation Strategy
- Form validates on submit
- Real-time field validation for improved UX
- Clear error messages for each field
- Visual feedback for invalid fields

## 🚀 Future Enhancements

- [ ] WebSocket integration for multi-client sync
- [ ] API routes for data persistence
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File uploads for documents
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Audit logs for staff actions
- [ ] Export patient data to PDF
- [ ] Patient history tracking
- [ ] Multi-language support

## 📄 License

This project is part of the Agnos Health Candidate Assignment.

## 👨‍💼 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using Next.js, React, and TailwindCSS**

