import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing data...");

  // 1. Delete dependent records first (to avoid foreign key errors)
  await prisma.sessionSchedule.deleteMany();
  await prisma.purchasedProgram.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  // 2. Now safe to delete Products
  await prisma.product.deleteMany();

  console.log("🌱 Seeding new products...");

  await prisma.product.createMany({
    data: [
      {
        title: "Body Transformation",
        description: "Transform your body with our 12-week program combining strength training and cardio.",
        price: 18999,
        originalPrice: 20000,
        duration: "12 weeks",
        level: "INTERMEDIATE",
        category: "Weight Loss",
        instructor: "Sarah Johnson",
        rating: 4.9,
        reviews: 1247,
        students: 5420,
        image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
        features: [
          "Structured Meal Plan",
          "Strength + Cardio Mix",
          "Weekly Progress Check",
          "Private Community Access",
          "Trainer Support"
        ],
        tags: ["weight loss", "transformation"],
        isFeatured: true,
        isPopular: true
      },
      {
        title: "Strength & Power Building",
        description: "Build raw strength and power with a 16-week intense lifting program. Ideal for serious lifters.",
        price: 26999,
        originalPrice: 30000,
        duration: "16 weeks",
        level: "ADVANCED",
        category: "Strength Training",
        instructor: "Mike Rodriguez",
        rating: 4.8,
        reviews: 892,
        students: 3210,
        image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
        features: [
          "Barbell & Dumbbell Focus",
          "4-Day Split Routine",
          "Progressive Overload Tracking",
          "Recovery Protocols",
          "PR Goal Setting"
        ],
        tags: ["strength", "powerlifting"],
        isFeatured: false,
        isPopular: true
      },
      {
        title: "Yoga for Flexibility",
        description: "Improve flexibility and mental clarity with this 8-week yoga flow guide.",
        price: 6999,
        originalPrice: 10000,
        duration: "8 weeks",
        level: "BEGINNER",
        category: "Yoga",
        instructor: "Emma Chen",
        rating: 4.7,
        reviews: 654,
        students: 2840,
        image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
        features: [
          "Morning Flow Series",
          "Breathwork Techniques",
          "Mindfulness Meditation",
          "Daily Stretch Calendar",
          "Beginner Friendly"
        ],
        tags: ["yoga", "flexibility"],
        isFeatured: true,
        isPopular: false
      },
      {
        title: "HIIT Cardio Blast",
        description: "Torch fat and build endurance with explosive high-intensity workouts.",
        price: 27999,
        originalPrice: 30000,
        duration: "10 weeks",
        level: "INTERMEDIATE",
        category: "Cardio",
        instructor: "Jake Thompson",
        rating: 4.6,
        reviews: 432,
        students: 1920,
        image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
        features: [
          "Follow-Along HIIT Videos",
          "Low Equipment Needed",
          "Fat Burning Plan",
          "Warm-Up/Cool-Down Guides",
          "Cardio Conditioning Schedule"
        ],
        tags: ["hiit", "fat loss"],
        isFeatured: false,
        isPopular: true
      },
      {
        title: "Movement & Meditation",
        description: "Reduce stress and improve mental health through movement and guided meditation.",
        price: 36999,
        originalPrice: 45000,
        duration: "6 weeks",
        level: "BEGINNER",
        category: "Wellness",
        instructor: "Lisa Park",
        rating: 4.8,
        reviews: 321,
        students: 1540,
        image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
        features: [
          "Daily Mobility Flow",
          "Guided Meditations",
          "Stress Management Tips",
          "Mind-Body Focus",
          "Minimal Equipment"
        ],
        tags: ["wellness", "meditation"],
        isFeatured: false,
        isPopular: false
      },
      {
        title: "Athletic Performance",
        description: "Elite-level training designed to enhance speed, power, and agility for competitive athletes.",
        price: 28999,
        originalPrice: 30000,
        duration: "20 weeks",
        level: "ADVANCED",
        category: "Sports Performance",
        instructor: "David Kim",
        rating: 4.9,
        reviews: 156,
        students: 892,
        image: "https://i.postimg.cc/6qhtksp1/gym2.jpg",
        features: [
          "Sprint & Plyometric Drills",
          "Speed & Agility Ladders",
          "Strength Cycle Integration",
          "Vertical Jump Protocols",
          "Athlete Recovery Tools"
        ],
        tags: ["athlete", "sports"],
        isFeatured: true,
        isPopular: false
      }
    ]
  });

  console.log("✅ Seeding completed.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
