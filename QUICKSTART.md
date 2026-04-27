# Agnos Health - Quick Start Guide

## 🎯 What Is This Project?

This is a **real-time patient input form and staff monitoring system** built according to the Agnos Candidate Assignment specifications.

**Two Main Interfaces**:
1. **Patient Form** - Where patients enter their information
2. **Staff Dashboard** - Where staff monitor patient data in real-time

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd c:\Users\black\agnos-health
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Open [http://localhost:3000](http://localhost:3000)

**You should see**: Home page with "Patient Form" and "Staff Dashboard" buttons

## 🧪 Quick Demo

### Demo in Split Screen (Best Experience)

1. **Open Two Browser Windows Side-by-Side**:
   - Left Window: http://localhost:3000/patient
   - Right Window: http://localhost:3000/staff

2. **In Left Window (Patient Form)**:
   - Fill in your name, date of birth, and other details
   - Watch the "Staff Dashboard" update in real-time in the right window
   - See the form completion percentage increase as you type

3. **In Right Window (Staff Dashboard)**:
   - See "Actively Filling" status with yellow indicator
   - Watch the completion percentage bar grow
   - See all patient data appear as patient types
   - See "Last Updated" timestamp change

### Demo in Single Window

1. Go to http://localhost:3000 (home page)
2. Click "Patient Form" - fill out some fields
3. Click "Staff Dashboard" - see your data displayed
4. Go back to "Patient Form" - continue typing
5. Go back to "Staff Dashboard" - data updated!

## 📋 What Each Page Does

### Home Page (`/`)
- Overview of the system
- Navigation buttons to Patient Form and Staff Dashboard

### Patient Form (`/patient`)
**For patients to enter their information**
- Personal details (name, DOB, gender)
- Contact information (phone, email)
- Location details (address, nationality)
- Language preference
- Optional emergency contact

**Features**:
- Form validation (required fields, email format, phone format)
- Error messages for invalid data
- Status indicator showing "Filling..." or "Submitted"
- Submit button to complete form

### Staff Dashboard (`/staff`)
**For staff to monitor patient data entry**
- Real-time patient information display
- Form completion percentage (0-100%)
- Status indicator (Submitted, Actively Filling, Inactive)
- Last update timestamp
- All patient details organized by section

**Features**:
- Shows "Waiting for patient..." until patient starts filling
- Updates instantly as patient types
- Color-coded status indicators
- Form completeness progress bar

## ✅ Form Fields

### Required (Must Fill)
- ✅ First Name
- ✅ Last Name
- ✅ Date of Birth
- ✅ Gender
- ✅ Address
- ✅ Nationality
- ✅ Preferred Language

### Optional (Nice to Have)
- 📝 Middle Name
- 📝 Phone Number
- 📝 Email
- 📝 Religion
- 📝 Emergency Contact (name & relationship)

## 🧪 Testing Scenarios

### Test 1: Form Validation
1. Go to `/patient`
2. Try clicking "Submit Form" without filling anything
3. See red errors appear
4. Fill in all required fields (marked with *)
5. Submit successfully

### Test 2: Real-Time Sync
1. Open `/patient` and `/staff` side-by-side
2. Start typing in patient form
3. Watch staff dashboard update instantly
4. See completion percentage increase
5. See "Actively Filling" status

### Test 3: Mobile Responsive
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select iPhone 12 from dropdown
4. Test form on mobile
5. Test staff dashboard on mobile
6. Everything should work!

### Test 4: Complete Flow
1. Fill entire patient form
2. Submit form
3. Check staff dashboard shows "Submitted" status
4. Verify all data is displayed correctly

## 🎨 What You'll See

### Patient Form Interface
- Clean, modern form layout
- Light gray background
- Blue buttons and accents
- Red error messages
- Responsive grid (1 column on mobile, 2 on desktop)

### Staff Dashboard Interface
- Three status cards at top (status, completion %, last update)
- Main data display card
- Shows "Waiting for patient..." initially
- Updates to show all patient data when filling
- Animated progress bar

### Status Indicators
- 🟢 **Green pulse**: Form submitted
- 🟡 **Yellow pulse**: Actively filling
- ⚪ **Gray circle**: Inactive/waiting

## 📱 Responsive Design

- **Mobile** (320px): Single column, stacked layout, touch-friendly
- **Tablet** (768px): Two-column grid, adjusted spacing
- **Desktop** (1024px+): Full layout with all optimizations

**Test it**: Resize your browser window or use DevTools responsive mode

## ⚙️ Tech Stack Used

- **Next.js 16**: React framework with routing
- **React 19**: UI library with hooks
- **TypeScript**: Type-safe code
- **TailwindCSS 4**: Responsive styling
- **Context API**: State management (no Redux needed!)

## 🚀 How It Works (Behind the Scenes)

1. **Patient enters data** in form
2. **Context API stores state** in memory
3. **Staff page reads same context** automatically
4. **Both pages show same data** in real-time
5. **When patient submits**, status changes to "Submitted"

**No server needed** for basic demo - uses React Context for in-browser sync!

## 🔄 File Structure

```
Key Files:
├── src/components/PatientForm.tsx      ← Patient form UI
├── src/components/StaffView.tsx        ← Staff dashboard UI
├── src/store/PatientContext.tsx        ← Shared data store
├── src/app/patient/page.tsx            ← Patient page route
├── src/app/staff/page.tsx              ← Staff page route
└── src/app/layout.tsx                  ← Navigation header
```

## 🐛 Troubleshooting

### "Command not found: npm"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### "Port 3000 already in use"
- Kill existing server: `npx kill-port 3000`
- Or use different port: `npm run dev -- -p 3001`

### "Module not found" errors
- Delete `node_modules` folder
- Run `npm install` again

### Styles not showing
- Wait for Tailwind to compile (first load takes time)
- Refresh page with hard refresh (Ctrl+Shift+R)

### Real-time sync not working
- Make sure both pages are wrapped with `<PatientProvider>`
- Check that you're using `usePatient()` hook
- Look at browser console for errors (F12)

## 📚 File Documentation

**README.md** - Complete project documentation
**DEVELOPMENT.md** - Architecture and development notes
**IMPLEMENTATION.md** - What was built and how
**This file** - Quick start guide

## 💡 Tips & Tricks

1. **Split Screen Demo**:
   - Press F12 to open DevTools
   - Press Ctrl+Shift+M for responsive mode
   - Or use two browser windows side-by-side

2. **Watch Real-Time Updates**:
   - Open both pages
   - Fill form slowly and watch dashboard update instantly
   - Great for demos!

3. **Test Validation**:
   - Try invalid email: `test@` (will show error)
   - Try invalid phone: `abc` (will show error)
   - Try empty required fields (will show error)

4. **Reset Everything**:
   - Refresh page with F5
   - All data clears
   - Form goes back to "Idle" state

## ❓ Common Questions

**Q: Where is the data saved?**
A: In browser memory only. Refresh clears it. (Add database for persistence)

**Q: Does it work on mobile?**
A: Yes! Fully responsive with mobile, tablet, and desktop layouts

**Q: Can I use this with multiple users?**
A: On same browser, yes. For different browsers, need WebSockets (future)

**Q: How do I deploy this?**
A: `npm run build` then deploy to Vercel, Netlify, AWS, etc.

**Q: What's missing?**
A: Backend persistence, authentication, multi-browser WebSocket sync

## 🎓 Learning Value

This project demonstrates:
- ✅ React hooks and Context API
- ✅ Form validation and error handling
- ✅ Responsive design with Tailwind
- ✅ TypeScript type safety
- ✅ Next.js routing and components
- ✅ Real-time UI updates
- ✅ Component composition

## 🎉 You're Ready!

1. Run `npm run dev`
2. Open http://localhost:3000
3. Try the Patient Form
4. Check the Staff Dashboard
5. Enjoy the real-time sync!

**Enjoy exploring the system!** 🚀

---

**Questions?** Check README.md or DEVELOPMENT.md for more details.
