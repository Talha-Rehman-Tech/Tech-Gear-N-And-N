import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const normEmail = (email || '').toLowerCase().trim();

    if (normEmail === 'admin@techgear.com' && (password === 'password123' || password === 'admin123')) {
      return NextResponse.json({
        _id: 'usr_admin_default',
        name: 'Admin User',
        email: 'admin@techgear.com',
        role: 'admin',
        token: 'mock_jwt_token_admin_' + Date.now()
      });
    }

    if (normEmail === 'talharehman2567@gmail.com') {
      return NextResponse.json({
        _id: 'usr_talha',
        name: 'Talha Rehman',
        email: 'talharehman2567@gmail.com',
        role: 'admin',
        token: 'mock_jwt_token_admin_' + Date.now()
      });
    }

    if (normEmail && password) {
      return NextResponse.json({
        _id: 'usr_' + Date.now(),
        name: normEmail.split('@')[0],
        email: normEmail,
        role: 'user',
        token: 'mock_jwt_token_user_' + Date.now()
      });
    }

    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  } catch {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
