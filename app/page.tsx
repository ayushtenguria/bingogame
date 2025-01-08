"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

// Utility function to shuffle an array
const shuffleArray = (array: number[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() })) // Attach random sort keys
    .sort((a, b) => a.sort - b.sort) // Sort by the random keys
    .map(({ value }) => value); // Extract the original values
};

export default function Home() {
  const [numbers, setNumbers] = useState<{ [key: number]: boolean }>({});
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);

  useEffect(() => {
    const fetchNumbers = async () => {
      const response = await fetch('/api/numbers');
      const data = await response.json();
      console.log('Initial Numbers:', data); // Debugging
      setNumbers(data.revealedNumbers);

      // Generate and shuffle the numbers array
      const shuffled = shuffleArray(Array.from({ length: 90 }, (_, i) => i + 1));
      setShuffledNumbers(shuffled);
    };

    fetchNumbers();

    const eventSource = new EventSource('/api/numbers/stream');

    eventSource.onmessage = (event) => {
      const updatedNumber = JSON.parse(event.data);
      setNumbers((prevNumbers) => ({
        ...prevNumbers,
        ...updatedNumber,
      }));
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  if (shuffledNumbers.length === 0) {
    return <div>Loading Bingo Board...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Bingo Board</h1>
      <div className="grid grid-cols-10 gap-2">
        {shuffledNumbers.map((number) => (
          <Card 
            key={number}
            className={`p-4 text-center font-bold text-xl cursor-pointer transition-all duration-300 ${
              numbers[number] ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {numbers[number] ? number : '?'}
          </Card>
        ))}
      </div>
    </div>
  );
}
