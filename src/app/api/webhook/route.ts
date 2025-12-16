import { NextRequest, NextResponse } from 'next/server';

// Webhook handler for Farcaster miniapp events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { event } = body;

    switch (event) {
      case 'miniapp_added':
        // User added the miniapp
        console.log('Miniapp added:', body);
        break;

      case 'miniapp_removed':
        // User removed the miniapp
        console.log('Miniapp removed:', body);
        break;

      case 'notifications_enabled':
        // User enabled notifications
        console.log('Notifications enabled:', body);
        // Store the notification token for this user
        break;

      case 'notifications_disabled':
        // User disabled notifications
        console.log('Notifications disabled:', body);
        break;

      default:
        console.log('Unknown event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
