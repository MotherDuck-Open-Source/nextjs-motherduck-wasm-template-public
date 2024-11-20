import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createReadOnlyToken from './createReadOnlyToken';


export async function GET(request: NextRequest) {
  try {
    if (request.nextUrl.searchParams.get("read_only") === "true" && process.env.NODE_ENV !== 'development') {
      const { token, expire_at } = await createReadOnlyToken(3600);
      return NextResponse.json({ mdToken: token, expire_at });
    }

    return NextResponse.json({ mdToken: process.env.MOTHERDUCK_TOKEN || '', expire_at: '' });

  } catch (error) {
    console.error('Failed to generate token', error);
    return NextResponse.json(
      { error: `Failed to generate token` },
      { status: 500 }
    );
  }
}