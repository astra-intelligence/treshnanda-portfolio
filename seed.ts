import { eq } from "drizzle-orm";
import { db } from "./src/db";
import { profile, projects, settings } from "./src/db/schema";

const profileSeed = {
  name: "Treshnanda",
  role: "AI systems & automation engineer",
  bio: "CS grad, 3.97 GPA. I architect logic that scales with zero friction: systems that take repetitive work off people's plates and run it reliably, end to end.",
  avatarUrl: "/portrait.jpg",
  heroHeadline: "Work that does itself.",
  heroSubheadline:
    "I'm Nanda, an AI systems and automation engineer in Bali. I design and ship agents, automations, and web systems that take repetitive work off your plate.",
  contactEmail: "treshnanda@gmail.com",
  location: "Bali, Indonesia",
  socials: {
    github: "https://github.com/Tresnanda",
    linkedin: "https://linkedin.com/in/treshnanda",
    twitter: "",
    whatsapp: "https://wa.me/6287852986638",
  },
};

const projectSeeds = [
  {
    title: "MAN|MADE",
    description:
      "Story-driven apparel e-commerce: pre-orders, live courier rates, Midtrans payments, custom CMS.",
    category: "E-commerce · Web app",
    imageUrl: "/projects/manmade.jpg",
    link: "https://manmade.id",
    github: null as string | null,
    tags: ["Next.js", "PostgreSQL", "Midtrans", "CMS"],
    isFeatured: true,
    status: "live",
    metadata: { year: "2026" },
  },
  {
    title: "RIDENATION",
    description:
      "Royal Enfield rental in Bali with booking, live availability, and a custom CMS.",
    category: "Web app",
    imageUrl: "/projects/ridenation.jpg",
    link: null,
    github: null,
    tags: ["Next.js", "Booking", "CMS"],
    isFeatured: true,
    status: "live",
    metadata: { year: "2026" },
  },
  {
    title: "Ciao",
    description:
      "Terminal-first dev workstation in your pocket that drives any coding agent.",
    category: "Mobile app",
    imageUrl: "/projects/ciao.jpg",
    link: null,
    github: null,
    tags: ["React Native", "Agents", "Mobile"],
    isFeatured: true,
    status: "live",
    metadata: { year: "2026" },
  },
  {
    title: "ENVGUARD",
    description:
      "Catches missing, unused, and exposed env variables before they reach production.",
    category: "CLI",
    imageUrl: "/projects/envguard.jpg",
    link: "https://github.com/Tresnanda/envguard",
    github: "https://github.com/Tresnanda/envguard",
    tags: ["CLI", "TypeScript", "DX"],
    isFeatured: true,
    status: "live",
    metadata: { year: "2026" },
  },
  {
    title: "GIT-STANDUP",
    description:
      "Turns git history into standup-ready summaries, local text or AI-written.",
    category: "CLI · Agent skills",
    imageUrl: "/projects/git-standup.jpg",
    link: "https://github.com/Tresnanda/git-standup",
    github: "https://github.com/Tresnanda/git-standup",
    tags: ["CLI", "Git", "Agents"],
    isFeatured: true,
    status: "live",
    metadata: { year: "2026" },
  },
];

const settingsSeed = [
  {
    key: "skills",
    value: JSON.stringify([
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "AI systems",
      "Python",
      "React Native",
      "Docker",
      "Automation",
    ]),
    group: "technical",
    description: "Technical index shown on the about section",
  },
  {
    key: "skills_updated",
    value: "07 / 2026",
    group: "technical",
    description: "Last update label for the technical index",
  },
  {
    key: "contact_cta",
    value: "Tell me what's slowing you down.",
    group: "general",
    description: "Contact section headline",
  },
];

async function seed() {
  console.log("--- Portfolio seed ---");

  const existingProfile = await db.select().from(profile).limit(1);
  if (existingProfile.length === 0) {
    await db.insert(profile).values(profileSeed);
    console.log("✓ profile created");
  } else {
    await db
      .update(profile)
      .set({ ...profileSeed, updatedAt: new Date() })
      .where(eq(profile.id, existingProfile[0].id));
    console.log("✓ profile updated");
  }

  const existingProjects = await db.select().from(projects);
  if (existingProjects.length === 0) {
    await db.insert(projects).values(projectSeeds);
    console.log(`✓ ${projectSeeds.length} projects inserted`);
  } else {
    console.log(`· projects already present (${existingProjects.length}) — left untouched`);
    console.log("  Tip: truncate projects and re-run seed to reset.");
  }

  for (const row of settingsSeed) {
    await db
      .insert(settings)
      .values(row)
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: row.value,
          group: row.group,
          description: row.description,
          updatedAt: new Date(),
        },
      });
  }
  console.log("✓ settings synced");
  console.log("--- Seed complete ---");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
