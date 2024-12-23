"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log(process.env);
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/auth/admin", {
      method: "POST",
      // credentials: "include", // Include cookies with the request
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data: any) => {
        const { token } = data;
        if (!token) return toast("ADMIN login failed");
        localStorage.setItem("jwtToken", token);
        router?.replace("/admin");
      })
      .catch((error) => {
        toast("Admin login failed");
        console.error(error);
      });
  };
  return (
    <form
      onSubmit={onSubmit}
      method="POST"
      className="w-full min-h-screen flex items-center justify-center"
    >
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter admin password to access dashbaord
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e: any) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
