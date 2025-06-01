import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Check if the existing user has a password (created via email/password)
      if (existingUser.password) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      } else {
        // This is a social login user (Google/GitHub) without a password
        // Update the user to add a password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        existingUser.password = hashedPassword;
        if (!existingUser.name && name) {
          existingUser.name = name;
        }
        
        await existingUser.save();
        
        return NextResponse.json(
          { 
            success: true, 
            user: {
              name: existingUser.name,
              email: existingUser.email,
              _id: existingUser._id
            },
            message: 'Your account has been linked with email/password login'
          },
          { status: 200 }
        );
      }
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    // Save the user to the database
    await newUser.save();
    
    // Return success response (without password)
    return NextResponse.json(
      { 
        success: true, 
        user: {
          name: newUser.name,
          email: newUser.email,
          _id: newUser._id
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}