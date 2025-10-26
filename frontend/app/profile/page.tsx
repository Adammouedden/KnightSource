"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "test@example.com",
    phone: "",
    university: "",
    major: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully!");
  };

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  return (
    <div className="px-4">
    <Header />
    <div className="container max-w-2xl py-10 place-self-center">
        
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                placeholder="Enter your university"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                value={profile.major}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                placeholder="Enter your major"
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}