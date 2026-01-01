import { Contact } from "@/lib/definitions";
import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  try {
    const contact = await sql`
      SELECT yapping, email, phone, github, linkedin, facebook, instagram FROM contact LIMIT 1;
    `
    if (contact.length === 0) return NextResponse.json({ error: "Contact data not found" }, { status: 404 });

    return NextResponse.json(contact[0]);
  } catch (error)  {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: Partial<Contact> = await request.json();

    const updateFields: any = {
      yapping: body.yapping,
      email: body.email,
      phone: body.phone,
      github: body.github,
      linkedin: body.linkedin,
      facebook: body.facebook,
      instagram: body.instagram,
    }

    const updateContact = await sql`
      UPDATE contact SET yapping = ${updateFields.yapping || ""}, email = ${updateFields.email || ""}, phone = ${updateFields.phone || ""}, github = ${updateFields.github || ""}, linkedin = ${updateFields.linkedin || ""}, facebook = ${updateFields.facebook || ""}, instagram = ${updateFields.instagram || ""} WHERE id = 1
      RETURNING yapping, email, phone, github, linkedin, facebook, instagram;
    `;
    return NextResponse.json(updateContact[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: "Failed to update contact data" }, { status: 500 });
  }
}