import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// In-memory storage for revealed numbers
let revealedNumbers: { [key: number]: boolean } = {};

// Store active clients
const clients: Set<ReadableStreamDefaultController<any>> = new Set();

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Add this controller to the list of active clients
      clients.add(controller);

      // Send the initial state to the client
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify(revealedNumbers)}\n\n`)
      );
    },
    cancel() {
      // Remove the controller when the client disconnects
      clients.forEach((client) => {
        if (client) {
          clients.delete(client);
        }
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function POST(request: Request) {
  const { number } = await request.json();

  if (typeof number !== 'number' || number < 1 || number > 90) {
    return NextResponse.json(
      { error: 'Invalid number. Please provide a number between 1 and 90.' },
      { status: 400 }
    );
  }

  if (revealedNumbers[number]) {
    return NextResponse.json(
      { error: `Number ${number} is already revealed.` },
      { status: 409 }
    );
  }

  revealedNumbers[number] = true;

  // Broadcast the updated state to all connected clients
  const message = `data: ${JSON.stringify({ [number]: true })}\n\n`;
  clients.forEach((client) => {
    client.enqueue(new TextEncoder().encode(message));
  });

  return NextResponse.json({ success: true });
}
