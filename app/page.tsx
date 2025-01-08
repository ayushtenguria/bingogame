"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [numbers, setNumbers] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchNumbers = async () => {
      const response = await fetch('/api/numbers');
      const data = await response.json();
      setNumbers(data);
    };
    
    fetchNumbers();
    
    // Set up SSE for real-time updates
    const eventSource = new EventSource('/api/numbers/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNumbers(data);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Bingo Board</h1>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 90 }, (_, i) => i + 1).map((number) => (
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