
# Course-Pilot
<div align="center">
  <br />
    <a href="#" target="_blank">
      <img src="https://github.com/user-attachments/assets/1c0131c7-9f2d-4e3b-b47c-9679e76d8f9a" alt="Project Banner">
    </a>
  <br />
  
  <div>
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/-Vapi-white?style=for-the-badge&color=5dfeca" alt="vapi" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logoColor=white&logo=firebase&color=DD2C00" alt="firebase" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
  </div>

  <h3 align="center">Course-Pilot: Personalized Learning Platform with AI-Powered Interview Assessments</h3>

   <div align="center">
     A comprehensive learning management system that combines personalized course creation, progress tracking, and AI-driven interview assessments for skill validation.
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🎯 [User Journey](#user-journey)
5. 🤸 [Quick Start](#quick-start)
6. 🔧 [Environment Variables](#environment-variables)
7. 📱 [Screenshots](#screenshots)
8. 🚀 [Deployment](#deployment)
9. 🤝 [Contributing](#contributing)

## <a name="introduction">🤖 Introduction</a>

Course-Pilot is a revolutionary learning platform that empowers users to create personalized learning paths, track their progress, and validate their skills through AI-powered interviews. Built with React, Firebase, and Vapi's advanced voice AI technology, the platform offers a seamless learning experience from course creation to certification.

The platform bridges the gap between self-paced learning and professional skill validation by providing:
- **Personalized Course Creation**: Generate custom courses tailored to individual learning goals
- **Comprehensive Resource Integration**: Access curated content from YouTube, MDN, Dev.to, and other trusted sources  
- **Progress Tracking**: Monitor learning journey with detailed analytics and milestones
- **AI Interview Assessment**: Validate skills through realistic AI-conducted interviews
- **Certification System**: Earn shareable certificates upon successful completion
- **Social Learning**: Discover courses created by other learners in the community

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Authentication with custom session management
- **Database**: Firebase Firestore
- **Voice AI**: Vapi AI for interview conducting
- **Icons**: Lucide React
- **Charts**: Recharts for progress visualization
- **State Management**: Zustand stores with persistence
- **Date Handling**: date-fns
- **Form Validation**: React Hook Form with Zod
- **HTTP Client**: Axios with interceptors

## <a name="features">🔋 Features</a>

### 🔐 **Advanced Authentication System**
- **Secure Registration & Login**: Email/password authentication via Firebase
- **Session Management**: Custom session cookies with automatic refresh
- **Token-Based Security**: Firebase ID tokens with backend validation
- **Automatic Session Refresh**: Activity-based session renewal (1-hour window)
- **Session Expiration Handling**: 
  - Automatic logout after 2 days of inactivity
  - 5-minute warning before session expires
  - Background session validation
- **HTTP Request Interceptors**: Automatic token refresh on 401 responses
- **Persistent Authentication**: Zustand persistence with automatic state hydration
- **Multi-Tab Synchronization**: Firebase Auth state synchronization across tabs
- **Secure Cookie Management**: HttpOnly cookies with proper security flags

### 📚 **Personalized Course Creation**
- AI-assisted course generation based on learning objectives
- Custom curriculum building with flexible module structure
- Integration with external learning resources (YouTube, MDN, Dev.to)
- Course categorization and tagging system

### 📈 **Progress Tracking & Analytics**
- Real-time progress monitoring with visual indicators
- Detailed completion statistics and time tracking
- Learning streak counters and achievement badges
- Progress reports and learning insights

### 🎤 **AI-Powered Interview System**
- Voice-based interviews conducted by Vapi AI agents
- Realistic interview scenarios tailored to course content
- Real-time speech recognition and natural conversation flow
- Comprehensive interview transcripts and recordings

### 📊 **Advanced Feedback & Assessment**
- Detailed performance breakdowns across multiple categories:
  - Technical Knowledge
  - Communication Skills
  - Problem-Solving Abilities
  - Confidence Assessment
  - Cultural Fit Evaluation
- Personalized improvement recommendations
- Strength identification and skill gap analysis

### 🔄 **Retake & Improvement System**
- Up to 3 interview attempts per course
- 7-day cooldown period between retakes
- Progress comparison across attempts
- Targeted improvement suggestions

### 🏆 **Certification & Sharing**
- Digital certificates upon successful course completion
- Social media integration for achievement sharing
- Downloadable certificate PDFs
- Professional credential verification

### 🌐 **Community & Discovery**
- Browse courses created by other users
- Course rating and review system
- Trending and recommended courses
- Learning community engagement

### 📱 **Responsive Design**
- Fully responsive across all device sizes
- Mobile-optimized interview interface
- Touch-friendly navigation and controls
- Progressive Web App capabilities

## <a name="user-journey">🎯 User Journey</a>

### 1. **Authentication & Onboarding**
- User signs up with email/password
- Secure session creation with Firebase Authentication
- Profile setup with learning preferences
- Introduction to platform features

### 2. **Course Creation**
- Define learning objectives and goals
- AI generates personalized course structure
- Customize modules and add preferred resources
- Set learning timeline and milestones

### 3. **Learning Phase**
- Access curated content from multiple sources
- Track progress through modules and lessons
- Complete interactive exercises and assignments
- Monitor learning analytics and insights

### 4. **Interview Preparation**
- Course completion triggers interview eligibility
- Review interview format and expectations
- Practice with sample questions and scenarios

### 5. **AI Interview Assessment**
- Conduct live voice interview with AI agent
- Real-time conversation and question responses
- Comprehensive skill evaluation across categories
- Immediate interview completion confirmation

### 6. **Results & Feedback**
- Detailed performance analysis and scoring
- Strengths identification and improvement areas
- Comparison with industry standards
- Personalized learning recommendations

### 7. **Certification or Retake**
- **Success Path**: Receive digital certificate and share achievements
- **Improvement Path**: Plan retake strategy with targeted preparation (7-day minimum wait)

### 8. **Community Engagement**
- Share completed courses and achievements
- Discover new learning opportunities
- Connect with other learners and mentors

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

**Cloning the Repository**

```bash
git clone https://github.com/your-username/course-pilot.git
cd course-pilot
```

**Installation**

Install the project dependencies:

```bash
npm install
# or
yarn install
```

**Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Vapi Configuration
VITE_VAPI_WEB_TOKEN=your_vapi_web_token
VITE_VAPI_INTERVIEWER_ID=your_vapi_interviewer_id

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Application Configuration
VITE_APP_URL=http://localhost:5173
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Running the Project**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

## <a name="environment-variables">🔧 Environment Variables</a>

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_VAPI_WEB_TOKEN` | Vapi API token for voice AI integration | ✅ |
| `VITE_VAPI_INTERVIEWER_ID` | Vapi interviewer agent ID | ✅ |
| `VITE_FIREBASE_API_KEY` | Firebase project API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket URL | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase application ID | ✅ |
| `VITE_APP_URL` | Application base URL | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ |

## Authentication Architecture

### Frontend Authentication Flow

```typescript
// 1. User Login Process
Firebase Auth → Get ID Token → Backend Session Creation → Local State Update

// 2. Session Management
Activity Detection → Token Refresh → Session Cookie Update → State Synchronization

// 3. Request Authentication
API Request → Check Token Validity → Auto-refresh if needed → Retry Request
```

### Key Authentication Features

- **Dual-Layer Security**: Firebase Authentication + Custom Session Cookies
- **Automatic Token Refresh**: Background refresh based on user activity
- **Session Persistence**: Zustand store with localStorage persistence
- **Request Interceptors**: Automatic retry with refreshed tokens
- **Multi-Tab Support**: Firebase Auth state synchronization
- **Secure Logout**: Proper cleanup of all auth artifacts

## <a name="screenshots">📱 Screenshots</a>

### Dashboard
*User dashboard showing course progress, upcoming interviews, and achievements*

### Course Creation
*AI-assisted course generation interface with customization options*

### Learning Interface
*Interactive learning environment with progress tracking*

### Interview Conduct
*Live AI interview interface with real-time voice interaction*

### Feedback Analysis
*Comprehensive feedback dashboard with performance metrics*

### Certificate Generation
*Digital certificate with social sharing capabilities*

## <a name="deployment">🚀 Deployment</a>

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

## <a name="contributing">🤝 Contributing</a>

We welcome contributions to Course-Pilot! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add some feature'`
5. **Push to the branch**: `git push origin feature/your-feature-name`
6. **Submit a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add proper error handling
- Write clean, documented code
- Test your changes thoroughly

### Reporting Issues

If you encounter any bugs or have feature requests:

1. Check existing issues first
2. Create a detailed issue report
3. Include steps to reproduce
4. Add relevant screenshots/logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vapi AI](https://vapi.ai) for voice AI technology
- [Firebase](https://firebase.google.com) for backend services
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Lucide](https://lucide.dev) for beautiful icons
- The open-source community for inspiration and resources

---

<div align="center">
  <p>Develop By Jawad Jisan</p>
  <p>
    <a href="#table">Back to Top</a>
  </p>
</div>
