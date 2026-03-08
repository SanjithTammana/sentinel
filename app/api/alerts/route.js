import { NextResponse } from 'next/server';
import { getAlertsByUserId } from '@/lib/firestore-service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const alerts = await getAlertsByUserId(userId);
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
