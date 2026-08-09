import { db } from "@/db";
import { projects, profile, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import HomePage from "./HomePage";

export const dynamic = "force-dynamic";

export default async function Page() {
  let initialProjects: (typeof projects.$inferSelect)[] = [];
  let userProfile: typeof profile.$inferSelect | undefined;
  let skills: string[] | undefined;
  let skillsUpdated: string | undefined;

  try {
    initialProjects = await db.select().from(projects).orderBy(projects.createdAt);
    [userProfile] = await db.select().from(profile).limit(1);

    const skillRows = await db
      .select()
      .from(settings)
      .where(eq(settings.group, "technical"));

    for (const row of skillRows) {
      if (row.key === "skills") {
        try {
          skills = JSON.parse(row.value) as string[];
        } catch {
          /* ignore malformed */
        }
      }
      if (row.key === "skills_updated") skillsUpdated = row.value;
    }
  } catch (error) {
    console.error("[page] Failed to load portfolio data:", error);
  }

  return (
    <HomePage
      initialProjects={initialProjects}
      userProfile={userProfile}
      skills={skills}
      skillsUpdated={skillsUpdated}
    />
  );
}
