import postgres from 'postgres';
import { projects, education, contact, user, about } from '@/lib/data_placeholder';
import bcrypt from 'bcryptjs';

async function seedUser() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  // Hash the password before inserting
  const hashedPassword = await bcrypt.hash(user[0].password, 10);

  const insertedUser = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${user[0].name}, ${user[0].email}, ${hashedPassword})
    ON CONFLICT (email) DO NOTHING;
  `;

  return insertedUser;
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedProjects() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      tech TEXT[] NOT NULL,
      type VARCHAR(50) NOT NULL,
      link VARCHAR(255),
      github_link VARCHAR(255)
    );
  `;

  const insertedProjects = await Promise.all(
    projects.map(
      (project) => sql`
        INSERT INTO projects (title, description, tech, type, link, github_link)
        VALUES (
          ${project.title},
          ${project.description},
          ${sql.array(project.tech)},
          ${project.type},
          ${project.link},
          ${project.githubLink || null}
        )
        ON CONFLICT (title) DO NOTHING;
      `,
    ),
  );

  return insertedProjects;
}

async function seedEducation() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS education (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      degree VARCHAR(255) NOT NULL,
      institution VARCHAR(255) NOT NULL,
      year VARCHAR(50) NOT NULL,
      gpa VARCHAR(10),
      UNIQUE (degree, institution, year)
    );
  `;

  const insertedEducation = await Promise.all(
    education.map(
      (edu) => sql`
        INSERT INTO education (degree, institution, year, gpa)
        VALUES (${edu.degree}, ${edu.institution}, ${edu.year}, ${edu.gpa})
        ON CONFLICT (degree, institution, year) DO NOTHING;
      `,
    ),
  );

  return insertedEducation;
}

async function seedContact() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50),
      github VARCHAR(255),
      linkedin VARCHAR(255)
    );
  `;

  const insertedContact = await sql`
    INSERT INTO contact (email, phone, github, linkedin)
    VALUES (${contact[0].email}, ${contact[0].phone}, ${contact[0].github}, ${contact[0].linkedin})
    ON CONFLICT (email) DO NOTHING;
  `;

  return insertedContact;
}

async function seedAbout() {
  await sql`
    CREATE TABLE IF NOT EXISTS about (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      skills TEXT[] NOT NULL,
      hobbies TEXT[] NOT NULL,
      photo TEXT
    );
  `;

  // Add photo column if not exists
  await sql`
    ALTER TABLE about ADD COLUMN IF NOT EXISTS photo TEXT;
  `;

  const insertedAbout = await sql`
    INSERT INTO about (name, role, description, skills, hobbies, photo)
    VALUES (${about[0].name}, ${about[0].role}, ${about[0].description}, ${sql.array(about[0].skills)}, ${sql.array(about[0].hobbies)}, ${about[0].photo})
    ON CONFLICT DO NOTHING;
  `;

  // Update existing row with photo if not set
  await sql`
    UPDATE about SET photo = ${about[0].photo} WHERE photo IS NULL;
  `;

  return insertedAbout;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedProjects(),
      seedEducation(),
      seedContact(),
      seedAbout(),
      seedUser(),
    ]);

    return Response.json({ message: 'Portfolio database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
