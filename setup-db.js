const postgres = require('postgres');

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function setup() {
  console.log('Creating users table...');
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  console.log('Inserting grader user...');
  await sql`
    INSERT INTO users (name, email, password)
    VALUES (
      'Grader',
      'grader@example.com',
      '$2a$10$XQhWlL8LxE.TiY0jXp5H2uJ8ZvYqS1qZrN9sWxE.f8VnYbLmQpKi'
    )
    ON CONFLICT (email) DO NOTHING;
  `;

  console.log('✅ Setup complete!');
  process.exit(0);
}

setup().catch(err => console.error('Error:', err));