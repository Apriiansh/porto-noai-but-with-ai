import { Project } from "@/lib/definitions";
import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: Partial<Project> = await request.json();
    const { id } = await params;

    // Only update fields that are provided, keep others unchanged
    const fields: string[] = [];
    const values: any[] = [];
    if (body.title !== undefined) { fields.push('title'); values.push(body.title); }
    if (body.description !== undefined) { fields.push('description'); values.push(body.description); }
    if (body.tech !== undefined) { fields.push('tech'); values.push(sql.array(body.tech)); }
    if (body.type !== undefined) { fields.push('type'); values.push(body.type); }
    if (body.link !== undefined) { fields.push('link'); values.push(body.link); }
    if (body.githubLink !== undefined) { fields.push('github_link'); values.push(body.githubLink); }
    if (body.order !== undefined) { fields.push('"order"'); values.push(body.order); }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Build dynamic SET clause
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE projects SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, title, description, tech, type, link, github_link as "githubLink", "order"`;
    const updatedProject = await sql.unsafe(query, [...values, id]);

    if (updatedProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: "Failed to update project data" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedProject = await sql`
      DELETE FROM projects WHERE id = ${id}
      RETURNING *
    `;

    if (deletedProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: "Failed to delete project data" }, { status: 500 });
  }
}