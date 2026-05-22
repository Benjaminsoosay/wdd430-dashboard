// scripts/seed.ts
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seed() {
  console.log('Seeding database...');

  // Create tables if they don't exist
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  // Insert sample users (passwords hashed with bcryptjs)
  const users = [
    {
      name: 'User',
      email: 'user@nextmail.com',
      password: await bcrypt.hash('123456', 10),
    },
    {
      name: 'Grader',
      email: 'grader@example.com',
      password: await bcrypt.hash('123456', 10),
    },
  ];

  for (const user of users) {
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${user.name}, ${user.email}, ${user.password})
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  // Insert sample customers, invoices, revenue (optional – add if needed)
  // ... (you can copy from the official tutorial if desired)

  console.log('✅ Seeding finished!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});