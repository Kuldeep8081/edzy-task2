# Edzy Student Enrollment Portal

A robust, multi-step student enrollment flow built for the Edzy Frontend Hackathon (Task 2). This application features complex form handling, cross-step state persistence, dynamic validation, and a polished UI tailored for Indian students.

## 🚀 Features

- **Multi-Step Wizard:** A guided 4-step process (Student -> Academic -> Address -> Review) with a visual progress indicator.
- **State Persistence:** Form data is persisted to `localStorage` using **Zustand**, ensuring users don't lose progress on refresh.
- **Robust Validation (Zod):** - **Indian Mobile Numbers:** Validates `+91` format and 10 digits.
  - **PIN Code Logic:** Validates 6-digit Indian PIN codes.
  - **Conditional Rules:** Enforces specific subject counts based on Grade (Class 10 vs 12) and requires exam scores only if "Scholarship" is selected.
- **Smart Automation:** - **Mock PIN Lookup:** Automatically fills City and State when a valid PIN (e.g., `110001`, `400001`, `560001`) is entered.
  - **Dynamic Subjects:** The subject list changes automatically based on the selected Class.
- **Route Guards:** Prevents users from jumping to later steps without completing previous ones.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) 
- **Language:** TypeScript
- **Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) 
- **Form Management:** React Hook Form
- **Validation:** Zod 
- **State Management:** Zustand (with persist middleware) 
- **Notifications:** Sonner (Toast)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```
   git clone [https://github.com/your-username/edzy-enrollment.git](https://github.com/your-username/edzy-enrollment.git)
   cd edzy-enrollment
   ```
2. **Install dependencies:**
```
npm install
```
3. **Run the development server:**
   ```
   npm run dev
   ```
