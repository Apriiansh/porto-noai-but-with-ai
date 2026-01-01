import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function PATCH(request: Request) {
  try {
    const updates: Array<{ id: string; order: number }> = await request.json();
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No order data provided" }, { status: 400 });
    }

    // Gunakan transaction untuk menghindari konflik UNIQUE constraint
    await sql.begin(async (tx) => {
      // Step 1: Set semua order ke nilai negatif temporary untuk menghindari konflik
      const ids = updates.map(u => u.id);
      await tx`
        UPDATE projects 
        SET "order" = -"order" - 1000000
        WHERE id = ANY(${ids}::uuid[])
      `;

      // Step 2: Update ke nilai final
      const valuesClause = updates.map((u, i) => `($${i * 2 + 1}::uuid, $${i * 2 + 2}::integer)`).join(", ");
      const values = updates.flatMap(u => [u.id, u.order]);
      
      await tx.unsafe(`
        UPDATE projects AS p 
        SET "order" = c.new_order
        FROM (VALUES ${valuesClause}) AS c(id, new_order) 
        WHERE p.id = c.id
      `, values);
    });

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}