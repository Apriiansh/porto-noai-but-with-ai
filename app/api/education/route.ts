import { Education } from "@/lib/definitions";
import postgres from "postgres";
import { NextResponse } from "next/server";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const education = await sql`
      SELECT id, degree, institution, year, gpa FROM education ORDER BY year DESC
    ` 
    if (education.length === 0) {
      return NextResponse.json({ error: "Education data not found" }, { status: 404 });
    }
    console.log('Education data:', education);
    return NextResponse.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: "Failed to fetch education data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Partial<Education> = await request.json();
    
    const insertedEducation = await sql`
      insert into education (degree, institution, year, gpa) 
      values (${body.degree ?? ''}, ${body.institution ?? ''}, ${body.year ?? ''}, ${body.gpa ?? null})
      returning *
    `;
    
    return NextResponse.json(insertedEducation[0], { status: 201 })
  } catch (error) {
    console.error('Error adding education:', error);
    return NextResponse.json({ error: "Failed to add education data" }, { status: 500 });
  }
}