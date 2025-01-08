import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic"; // Ensure this API route is dynamic

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      let counter = 0;

      const interval = setInterval(() => {
        const data = `data: ${JSON.stringify({ message: "Hello from the server!", counter })}\n\n`;
        controller.enqueue(new TextEncoder().encode(data)); // Encode and enqueue the data

        counter += 1;

        // Stop streaming after 10 messages
        if (counter > 10) {
          clearInterval(interval);
          controller.close(); // Close the stream
        }
      }, 1000); // Send data every second
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
