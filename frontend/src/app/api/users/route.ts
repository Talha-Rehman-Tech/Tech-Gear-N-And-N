import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, adminSecretKey } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please provide name, email, and password' }, { status: 400 });
    }

    let userRole = 'user';
    if (role === 'admin') {
      if (adminSecretKey !== 'admin123' && adminSecretKey !== 'techgear_admin_secret_key_2026') {
        return NextResponse.json({ message: 'Invalid Admin Secret Key. Access denied.' }, { status: 403 });
      }
      userRole = 'admin';
    }

    return NextResponse.json({
      _id: 'usr_' + Date.now(),
      name,
      email: email.toLowerCase().trim(),
      role: userRole,
      token: 'mock_jwt_token_' + Date.now()
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Server error during registration' }, { status: 500 });
  }
}
