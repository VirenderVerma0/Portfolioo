# Project Definition

## Languages/Technologies Used
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS 4, JavaScript (JSX)
- **Backend**: Next.js API Routes, Node.js, Mongoose (MongoDB ODM)
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **Email Service**: Nodemailer (Gmail integration)
- **File Uploads**: Cloudinary
- **Animations & 3D**: GSAP, Framer Motion, Three.js (@react-three/fiber, drei)
- **UI Components**: shadcn/ui (Radix UI), Heroicons
- **Validation**: Zod
- **Other**: Express (hybrid setup possible)

## Main Functionalities
- Portfolio showcase: Display and manage projects, skills, experience
- User authentication: Registration, login, OTP verification, forgot/reset password
- Admin dashboard: CRUD operations for projects, skills, experience, profile management
- Contact form: With email verification using Nodemailer
- File handling: Profile photos and project images via Cloudinary
- Interactive 3D models and animations using Three.js and GSAP
- Responsive design and modern UI with Tailwind CSS
- API-driven architecture with MongoDB persistence

# Profile Photo Persistence Fix

## Completed Tasks
- [x] Analyzed the codebase to understand profile photo storage mechanism
- [x] Identified that login API response was missing profilePhoto field
- [x] Updated userController.js login method to include profilePhoto in response

## Next Steps
- [ ] Test login functionality to confirm profilePhoto persists after login
- [ ] Verify that profile photo is displayed correctly in the UI after login

## Progress
- [x] Added project definition TODO section

