// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Adjust this path as needed

export async function POST(req: NextRequest) {
  const { name, password, email, jsonUrl } = await req.json();

  if (!jsonUrl) {
    return NextResponse.json({ error: 'Missing JSON URL' }, { status: 400 });
  }

  try {
    const user_email_id = await getEmailFromPhoneEmailJson(jsonUrl);

    if (user_email_id.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Email verification failed' }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Verification failed:', err);
    return NextResponse.json({ error: 'Verification failed: ' + err }, { status: 500 });
  }
}


function getEmailFromPhoneEmailJson(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (!json.user_email_id) {
            return reject('Missing user_email_id in JSON');
          }
          resolve(json.user_email_id);
        } catch (e) {
          reject('Invalid JSON structure');
        }
      });
    }).on('error', reject);
  });
}
