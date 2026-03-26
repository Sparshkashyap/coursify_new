export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  instructorId: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  students: number;
  image: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  isFree: boolean;
  isPremium: boolean;
  curriculum: CurriculumModule[];
}

export interface CurriculumModule {
  title: string;
  lessons: { title: string; duration: string; isPreview: boolean }[];
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  students: number;
  courses: number;
  bio: string;
}

export interface Review {
  id: string;
  courseId: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface EnrolledCourse {
  courseId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  certificate: boolean;
}

export const categories = [
  "All", "Web Development", "Data Science", "Design", "Mobile Development",
  "Machine Learning", "Business", "Marketing", "Photography"
];

export const mockInstructors: Instructor[] = [
  { id: "i1", name: "Sarah Chen", specialty: "Full-Stack Development", avatar: "", rating: 4.9, students: 15200, courses: 12, bio: "Senior engineer at a top tech company with 10+ years of experience building scalable web applications." },
  { id: "i2", name: "James Wilson", specialty: "Data Science & AI", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", rating: 4.8, students: 11800, courses: 8, bio: "PhD in Computer Science, specializing in machine learning and artificial intelligence." },
  { id: "i3", name: "Maria Rodriguez", specialty: "UX/UI Design", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", rating: 4.9, students: 9500, courses: 6, bio: "Lead designer with expertise in user experience and interface design for Fortune 500 companies." },
  { id: "i4", name: "Alex Kumar", specialty: "Mobile Development", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", rating: 4.7, students: 8200, courses: 9, bio: "Mobile app developer who has launched 20+ apps on both iOS and Android platforms." },
  { id: "i5", name: "Emily Park", specialty: "Machine Learning", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", rating: 4.8, students: 7600, courses: 5, bio: "Research scientist at a leading AI lab, passionate about making ML accessible to everyone." },
];

export const mockCourses: Course[] = [
  {
    id: "c1", title: "Complete React & Next.js Masterclass", description: "Build modern web apps from zero to production with React 18 and Next.js 14.", longDescription: "This comprehensive course covers everything from React fundamentals to advanced patterns. You'll learn hooks, context, Redux, server-side rendering with Next.js, and deploy production applications.", instructor: "Sarah Chen", instructorId: "i1", category: "Web Development", price: 89.99, rating: 4.9, reviewCount: 342, students: 4520, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop", level: "Intermediate", duration: "42h", lessons: 186, isFree: false, isPremium: true,
    curriculum: [
      { title: "Getting Started with React", lessons: [{ title: "Introduction to React", duration: "12:30", isPreview: true }, { title: "Setting Up Your Environment", duration: "8:45", isPreview: true }, { title: "Your First Component", duration: "15:20", isPreview: false }] },
      { title: "Hooks & State Management", lessons: [{ title: "useState Deep Dive", duration: "18:00", isPreview: false }, { title: "useEffect Patterns", duration: "22:15", isPreview: false }, { title: "Custom Hooks", duration: "16:40", isPreview: false }] },
      { title: "Next.js Fundamentals", lessons: [{ title: "Pages & Routing", duration: "14:30", isPreview: false }, { title: "Server Components", duration: "20:00", isPreview: false }, { title: "API Routes", duration: "17:50", isPreview: false }] },
    ],
  },
  {
    id: "c2", title: "Python for Data Science & ML", description: "Master Python, Pandas, NumPy and build real ML models.", longDescription: "From Python basics to advanced machine learning. Covers data wrangling, visualization, and building predictive models with scikit-learn and TensorFlow.", instructor: "James Wilson", instructorId: "i2", category: "Data Science", price: 79.99, rating: 4.8, reviewCount: 278, students: 3890, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop", level: "Beginner", duration: "38h", lessons: 154, isFree: false, isPremium: true,
    curriculum: [
      { title: "Python Fundamentals", lessons: [{ title: "Variables & Data Types", duration: "10:00", isPreview: true }, { title: "Control Flow", duration: "14:30", isPreview: true }, { title: "Functions", duration: "12:00", isPreview: false }] },
      { title: "Data Analysis with Pandas", lessons: [{ title: "DataFrames", duration: "20:00", isPreview: false }, { title: "Data Cleaning", duration: "18:30", isPreview: false }] },
    ],
  },
  {
    id: "c3", title: "UI/UX Design from Scratch", description: "Learn design thinking, Figma, and create stunning interfaces.", longDescription: "A complete design course covering user research, wireframing, prototyping, and visual design. You'll build a full portfolio by the end.", instructor: "Maria Rodriguez", instructorId: "i3", category: "Design", price: 0, rating: 4.9, reviewCount: 195, students: 6200, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", level: "Beginner", duration: "28h", lessons: 96, isFree: true, isPremium: false,
    curriculum: [
      { title: "Design Fundamentals", lessons: [{ title: "Color Theory", duration: "15:00", isPreview: true }, { title: "Typography", duration: "12:00", isPreview: true }, { title: "Layout Principles", duration: "18:00", isPreview: false }] },
      { title: "Figma Mastery", lessons: [{ title: "Interface Tour", duration: "10:00", isPreview: false }, { title: "Components & Variants", duration: "22:00", isPreview: false }] },
    ],
  },
  {
    id: "c4", title: "React Native — Build Mobile Apps", description: "Create cross-platform mobile apps with React Native and Expo.", longDescription: "Build iOS and Android apps with a single codebase. Covers navigation, state management, native modules, and publishing to app stores.", instructor: "Alex Kumar", instructorId: "i4", category: "Mobile Development", price: 69.99, rating: 4.7, reviewCount: 156, students: 2340, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop", level: "Intermediate", duration: "32h", lessons: 128, isFree: false, isPremium: false,
    curriculum: [
      { title: "React Native Basics", lessons: [{ title: "Setup & First App", duration: "14:00", isPreview: true }, { title: "Core Components", duration: "16:30", isPreview: false }] },
    ],
  },
  {
    id: "c5", title: "Deep Learning with TensorFlow", description: "Build neural networks and deploy AI models in production.", longDescription: "From perceptrons to transformers. Build CNNs, RNNs, GANs, and learn to deploy models with TensorFlow Serving.", instructor: "Emily Park", instructorId: "i5", category: "Machine Learning", price: 99.99, rating: 4.8, reviewCount: 134, students: 1890, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", level: "Advanced", duration: "45h", lessons: 198, isFree: false, isPremium: true,
    curriculum: [
      { title: "Neural Network Fundamentals", lessons: [{ title: "Perceptrons", duration: "18:00", isPreview: true }, { title: "Backpropagation", duration: "24:00", isPreview: false }] },
    ],
  },
  {
    id: "c6", title: "Digital Marketing Masterclass", description: "Learn SEO, social media marketing, and paid advertising.", longDescription: "Comprehensive digital marketing course covering organic and paid strategies across all major platforms.", instructor: "Sarah Chen", instructorId: "i1", category: "Marketing", price: 49.99, rating: 4.6, reviewCount: 89, students: 3100, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", level: "Beginner", duration: "20h", lessons: 78, isFree: false, isPremium: false,
    curriculum: [
      { title: "Marketing Fundamentals", lessons: [{ title: "Marketing Strategy", duration: "12:00", isPreview: true }, { title: "Customer Personas", duration: "10:00", isPreview: false }] },
    ],
  },
  {
    id: "c7", title: "Photography & Lightroom Pro", description: "Master photography composition, lighting, and post-processing.", longDescription: "Learn professional photography techniques and advanced Lightroom editing to create stunning images.", instructor: "Maria Rodriguez", instructorId: "i3", category: "Photography", price: 0, rating: 4.5, reviewCount: 67, students: 4500, image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop", level: "Beginner", duration: "16h", lessons: 52, isFree: true, isPremium: false,
    curriculum: [
      { title: "Camera Basics", lessons: [{ title: "Understanding Exposure", duration: "14:00", isPreview: true }, { title: "Composition Rules", duration: "12:00", isPreview: false }] },
    ],
  },
  {
    id: "c8", title: "Business Strategy & Startups", description: "From idea validation to scaling — build your startup.", longDescription: "Learn to validate ideas, create business models, pitch to investors, and scale operations.", instructor: "James Wilson", instructorId: "i2", category: "Business", price: 59.99, rating: 4.7, reviewCount: 112, students: 2800, image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop", level: "Intermediate", duration: "24h", lessons: 86, isFree: false, isPremium: false,
    curriculum: [
      { title: "Startup Fundamentals", lessons: [{ title: "Idea Validation", duration: "16:00", isPreview: true }, { title: "Business Model Canvas", duration: "14:00", isPreview: false }] },
    ],
  },
];

export const mockReviews: Review[] = [
  { id: "r1", courseId: "c1", userName: "Michael T.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", rating: 5, comment: "Best React course I've taken. The Next.js section alone is worth the price. Sarah explains complex concepts with clarity.", date: "2024-12-15" },
  { id: "r2", courseId: "c1", userName: "Lisa K.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face", rating: 4, comment: "Excellent content and well-structured. Would love more advanced patterns in a follow-up course.", date: "2024-11-28" },
  { id: "r3", courseId: "c2", userName: "David R.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face", rating: 5, comment: "Went from zero Python knowledge to building ML models. James is an amazing instructor!", date: "2024-12-01" },
  { id: "r4", courseId: "c3", userName: "Anna S.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face", rating: 5, comment: "This free course is better than most paid ones. Maria's teaching style is engaging and practical.", date: "2024-12-10" },
  { id: "r5", courseId: "c5", userName: "Chris W.", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face", rating: 5, comment: "Challenging but incredibly rewarding. The hands-on projects make all the difference.", date: "2024-11-20" },
  { id: "r6", courseId: "c4", userName: "Sophie L.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face", rating: 4, comment: "Great for learning React Native. The Expo sections are particularly well done.", date: "2024-12-05" },
];

export const mockEnrolledCourses: EnrolledCourse[] = [
  { courseId: "c1", progress: 72, completedLessons: 134, totalLessons: 186, certificate: false },
  { courseId: "c3", progress: 100, completedLessons: 96, totalLessons: 96, certificate: true },
  { courseId: "c4", progress: 35, completedLessons: 45, totalLessons: 128, certificate: false },
  { courseId: "c2", progress: 15, completedLessons: 23, totalLessons: 154, certificate: false },
];

export const instructorEarnings = [
  { month: "Jul", earnings: 2400 },
  { month: "Aug", earnings: 3200 },
  { month: "Sep", earnings: 2800 },
  { month: "Oct", earnings: 4100 },
  { month: "Nov", earnings: 3600 },
  { month: "Dec", earnings: 4800 },
  { month: "Jan", earnings: 5200 },
];

export const adminStats = {
  totalUsers: 28500,
  totalCourses: 156,
  totalRevenue: 482000,
  activeStudents: 12400,
  monthlyGrowth: 12.5,
};
