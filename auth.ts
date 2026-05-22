import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    console.log('1. Looking up user:', email);
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    console.log('2. User found:', user?.length > 0 ? 'YES' : 'NO');
    if (user && user[0]) {
      console.log('2a. Stored hash (full):', user[0].password);
    }
    return user[0];
  } catch (error) {
    console.error('3. Database error details:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('0. authorize function called');
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          console.log('4. Parsed credentials - Email:', email);
          console.log('4a. Password length:', password.length);
          
          const user = await getUser(email);
          if (!user) {
            console.log('5. No user found, returning null');
            return null;
          }
          
          console.log('6. User found, comparing password...');
          console.log('6a. Password:', password);
          console.log('6b. Stored hash:', user.password);
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log('7. Password match result:', passwordsMatch);
          
          if (passwordsMatch) {
            console.log('8. Login successful, returning user');
            return user;
          } else {
            console.log('8b. Password mismatch');
          }
        } else {
          console.log('4b. Parsed credentials FAILED:', parsedCredentials.error);
        }
 
        console.log('9. Invalid credentials, returning null');
        return null;
      },
    }),
  ],
});