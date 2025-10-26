"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful sign in (e.g., store token, update UI)
        console.log('Signed in successfully:', data);
      } else {
        // Handle error
        console.error('Sign in failed');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  const categories = [
    { name: 'Legal', href: '/legal' },
    { name: 'Academics', href: '/academics' },
    { name: 'Healthcare', href: '/healthcare' },
    { name: 'Conferences', href: '/conferences' },
    { name: 'Recreation', href: '/recreation' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              KnightSource
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              href="/home"
              className="text-sm font-medium transition-colors hover:text-amber-600"
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-amber-600 flex items-center gap-1">
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.href} asChild>
                    <Link href={cat.href} className="cursor-pointer">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="group relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 px-6"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 px-6"
                  >
                    <span className="flex items-center gap-2">
                      <UserCircle2 className="w-4 h-4 text-amber-600" />
                      <span className="font-medium">Sign In</span>
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
