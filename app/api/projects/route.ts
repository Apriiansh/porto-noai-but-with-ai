import { Project } from "@/lib/definitions";
import postgres from "postgres";
import { NextResponse } from "next/server";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const projects = await sql`
      SELECT id, title, description, tech, type, link, github_link as "githubLink", "order" FROM projects ORDER BY "order" ASC, id ASC
    `;
    if (projects.length === 0) {
      return NextResponse.json({ error: "Projects data not found" }, { status: 404 });
    }
    console.log('Projects data:', projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: "Failed to fetch projects data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Partial<Project> = await request.json();

    const title = body.title || '';
    const description = body.description || '';
    const tech = body.tech || [];
    const type = body.type || '';
    const link = body.link || '';
    const githubLink = body.githubLink || null;
    const order = (await sql`SELECT COALESCE(MAX("order"), 0) + 1 as new_order FROM projects`)[0].new_order;

    const insertedProject = await sql`
      insert into projects (title, description, tech, type, link, github_link, "order") 
      values (${title}, ${description}, ${sql.array(tech)}, ${type}, ${link}, ${githubLink}, ${order})
      returning id, title, description, tech, type, link, github_link as "githubLink", "order"
    `;

    return NextResponse.json(insertedProject[0], { status: 201 })
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: "Failed to add project data" }, { status: 500 });
  }
}