import { NextResponse } from 'next/server';

// In-memory storage for revealed numbers
let revealedNumbers: { [key: number]: boolean } = {};

// Fetch all revealed numbers
export async function GET() {
  return NextResponse.json({ revealedNumbers });
}

// Reveal a specific number
export async function POST(request: Request) {
  try {
    const { number } = await request.json();

    // Validate the number
    if (typeof number !== 'number' || number < 1 || number > 90) {
      return NextResponse.json(
        { error: 'Invalid number. Please provide a number between 1 and 90.' },
        { status: 400 }
      );
    }

    // Check if the number is already revealed
    if (revealedNumbers[number]) {
      return NextResponse.json(
        { error: `Number ${number} is already revealed.` },
        { status: 409 }
      );
    }

    // Reveal the number
    revealedNumbers[number] = true;

    return NextResponse.json({
      success: true,
      revealedNumbers,
      message: `Number ${number} has been revealed.`,
    });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
}

// Reset revealed numbers (optional endpoint)
export async function DELETE() {
  revealedNumbers = {};
  return NextResponse.json({ success: true, message: 'Revealed numbers reset.' });
}
