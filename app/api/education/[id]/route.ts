import { Education } from "@/lib/definitions";
import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: Partial<Education> = await request.json();
    const { id } = await params;

    console.log('PUT body:', body); // Debug

    const updatedEducation = await sql.unsafe(`
      UPDATE education
      SET institution = '${body.institution || ''}', degree = '${body.degree || ''}', year = '${body.year || ''}', gpa = ${body.gpa ? `'${body.gpa}'` : 'NULL'}
      WHERE id = '${id}'
      RETURNING *
    `);

    if (updatedEducation.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEducation[0]);
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedEducation = await sql`
      DELETE FROM education
      WHERE id = ${id}
      RETURNING *
    `;

    if (deletedEducation.length === 0) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Education deleted" });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}