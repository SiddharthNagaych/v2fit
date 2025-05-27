import { prisma } from "../src/lib/prisma";

import { ProgramLevel } from "@prisma/client";  // ✅ this gives you access to enums like Prisma.ProgramLevel



const programs = [
  {
    title: "Complete Body Transformation",
    description:
      "Transform your body with our 12-week program combining strength training, cardio, and nutrition coaching.",
    price: 299,
    originalPrice: 399,
    duration: "12 weeks",
    level: ProgramLevel.INTERMEDIATE,
    category: "Weight Loss",
    instructor: "Sarah Johnson",
    rating: 4.9,
    reviews: 1247,
    students: 5420,
    image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
    features: [
      "Personal trainer guidance",
      "Nutrition plan",
      "Progress tracking",
      "24/7 support",
      "Mobile app access"
    ],
    tags: ["popular", "bestseller"],
    isFeatured: true,
    isPopular: true
  },
  {
    title: "Strength & Power Building",
    description:
      "Build raw strength and power with a 16-week intense lifting program. Ideal for serious lifters.",
    price: 249,
    duration: "16 weeks",
    level:ProgramLevel.ADVANCED,
    category: "Strength Training",
    instructor: "Mike Rodriguez",
    rating: 4.8,
    reviews: 892,
    students: 3210,
    image: "https://i.postimg.cc/gksQwmnt/strong1.jpg",
    features: [
      "Advanced lifting cycles",
      "Powerlifting focus",
      "Weekly check-ins",
      "Competition prep",
      "Form breakdown videos"
    ],
    tags: ["strength", "power"],
    isFeatured: false,
    isPopular: true
  },
  {
    title: "Yoga for Flexibility",
    description:
      "Improve flexibility and mental clarity with this 8-week yoga flow guided by top instructors.",
    price: 149,
    duration: "8 weeks",
    level: ProgramLevel.BEGINNER,
    category: "Yoga",
    instructor: "Emma Chen",
    rating: 4.7,
    reviews: 654,
    students: 2840,
    image: "https://i.postimg.cc/dZDbCxd8/gym2.jpg",
    features: [
      "Beginner-friendly flows",
      "Daily stretching routines",
      "Guided meditation",
      "Mindfulness practices",
      "No equipment needed"
    ],
    tags: ["mindfulness", "flexibility"],
    isFeatured: true,
    isPopular: false
  },
  {
    title: "HIIT Cardio Blast",
    description:
      "Torch fat and build endurance with explosive high-intensity workouts. Only 30 mins/day.",
    price: 199,
    originalPrice: 249,
    duration: "10 weeks",
    level: ProgramLevel.INTERMEDIATE,
    category: "Cardio",
    instructor: "Jake Thompson",
    rating: 4.6,
    reviews: 432,
    students: 1920,
    image: "https://i.postimg.cc/Y2Xpm7T9/cardio.jpg",
    features: [
      "Fast-paced workouts",
      "No gym required",
      "Bodyweight only",
      "Quick results",
      "Mobile-friendly"
    ],
    tags: ["hiit", "cardio"],
    isFeatured: false,
    isPopular: true
  },
  {
    title: "Mindful Movement & Meditation",
    description:
      "Reduce stress and improve mental health through movement and guided meditation.",
    price: 129,
    duration: "6 weeks",
    level: ProgramLevel.BEGINNER,
    category: "Wellness",
    instructor: "Lisa Park",
    rating: 4.8,
    reviews: 321,
    students: 1540,
    image: "https://i.postimg.cc/DZC3VPf7/meditate.jpg",
    features: [
      "Mental clarity focus",
      "Gentle movement routines",
      "Breathwork training",
      "Sleep improvement",
      "Daily meditation"
    ],
    tags: ["wellness", "mental health"],
    isFeatured: false,
    isPopular: false
  },
  {
    title: "Athletic Performance Program",
    description:
      "Elite-level training designed to enhance speed, power, and agility for competitive sports.",
    price: 399,
    originalPrice: 499,
    duration: "20 weeks",
    level: ProgramLevel.ADVANCED,
    category: "Sports Performance",
    instructor: "David Kim",
    rating: 4.9,
    reviews: 156,
    students: 892,
    image: "https://i.postimg.cc/3Jy5Fwcs/athlete.jpg",
    features: [
      "Sport-specific drills",
      "1-on-1 coaching",
      "Recovery protocols",
      "Agility ladders & cones",
      "Performance tracking"
    ],
    tags: ["elite", "performance"],
    isFeatured: true,
    isPopular: false
  }
];

async function main() {
  await prisma.product.deleteMany(); // Optional: reset existing

  await prisma.product.createMany({
    data: programs,
  });

  console.log("✅ Seeded products successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding products:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
