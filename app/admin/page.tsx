"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "party2024"
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [selectedNumber, setSelectedNumber] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
    }
  };

  const revealNumber = async (number?: number) => {
    const numberToReveal = number || Math.floor(Math.random() * 90) + 1;
    await fetch('/api/numbers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number: numberToReveal }),
    });
    router.refresh();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reveal Random Number</h2>
          <Button onClick={() => revealNumber()} className="w-full">
            Reveal Random Number
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reveal Specific Number</h2>
          <div className="flex space-x-4">
            <Input
              type="number"
              min="1"
              max="90"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value)}
              placeholder="Enter number (1-90)"
            />
            <Button
              onClick={() => revealNumber(parseInt(selectedNumber))}
              disabled={!selectedNumber || parseInt(selectedNumber) < 1 || parseInt(selectedNumber) > 90}
            >
              Reveal
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}