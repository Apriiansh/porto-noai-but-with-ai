import { About } from "@/lib/definitions";
import postgres from "postgres";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const about = await sql`SELECT id, name, role, description, skills, hobbies, photo FROM about LIMIT 1`;
    if (about.length === 0) {
      return NextResponse.json({ error: "About data not found" }, { status: 404 });
    }
    console.log('About data:', about[0]);
    return NextResponse.json(about[0]);
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Partial<About> = {};
    let photoPath: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body.name = formData.get("name") as string;
      body.role = formData.get("role") as string;
      body.description = formData.get("description") as string;
      body.skills = (formData.get("skills") as string)?.split(",").map(s => s.trim()).filter(s => s) || [];
      body.hobbies = (formData.get("hobbies") as string)?.split(",").map(h => h.trim()).filter(h => h) || [];

      const file = formData.get("photo") as File | null;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `profile-${Date.now()}.${file.name.split('.').pop()}`;
        const filepath = path.join(process.cwd(), "public", filename);
        await mkdir(path.dirname(filepath), { recursive: true });
        await writeFile(filepath, buffer);
        photoPath = `/${filename}`;
      }
    } else {
      body = await request.json();
    }

    const updateFields: any = {
      name: body.name,
      role: body.role,
      description: body.description,
      skills: sql.array(body.skills || []),
      hobbies: sql.array(body.hobbies || []),
    };
    if (photoPath || body.photo) {
      updateFields.photo = photoPath || body.photo;
    }

    const updatedAbout = await sql`
      UPDATE about
      SET ${sql(updateFields)}
      WHERE id = 1
      RETURNING *
    `;
    if (updatedAbout.length === 0) {
      return NextResponse.json({ error: "About data not found" }, { status: 404 });
    }
    return NextResponse.json(updatedAbout[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 });
  }
}