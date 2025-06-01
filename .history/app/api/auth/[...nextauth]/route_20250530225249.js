import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongoose'
import bcrypt from 'bcryptjs'
import User from '@/lib/user'

export const authOptions = {
  providers: [
    // OAuth authentication providers
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // Email/Password credentials
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }
          
          // Check if user has a password (might be a social login user)
          if (!user.password) {
            return null;
          }
          
          // Check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Return user object (without password)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only run this for OAuth providers
      if (account.provider === 'google' || account.provider === 'github') {
        try {
          await connectToDatabase();
          
          // Check if user already exists in our database
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create a new user if they don't exist
            const newUser = new User({
              name: user.name,
              email: user.email,
              image: user.image,
              // No password for OAuth users initially
            });
            
            await newUser.save();
          } else {
            // Update user info if they exist but might have new details
            if (existingUser.name !== user.name || existingUser.image !== user.image) {
              existingUser.name = user.name;
              existingUser.image = user.image;
              await existingUser.save();
            }
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error);
          // Still allow sign in even if DB save fails
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || user._id;
        
        // Add provider info to token
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.provider = token.provider;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }