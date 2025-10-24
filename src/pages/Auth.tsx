import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");

    // Check if user exists
    if (!users[username]) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
      return;
    }

    const user = users[username];

    // Validate password and role
    if (user.password !== password) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
      return;
    }

    if (user.role !== role) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
      return;
    }

    // Store current user
    localStorage.setItem(
      "vpay_currentUser",
      JSON.stringify({ username, role })
    );

    toast({
      title: "Login Successful",
      description: `Welcome back, ${username}!`,
    });

    // Check if student needs to set PIN
    if (role === "student" && !user.pin) {
      navigate("/set-pin", { state: { username } });
      return;
    }

    // Route based on role
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "vendor") {
      navigate("/vendor");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="space-y-2 text-center px-6 pt-8 pb-6 bg-blue-50">
          <div className="flex justify-center mb-1">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src="/vpay-logo.png"
                alt="V-Pay Logo"
                className="h-16 w-32 object-cover"
              />
            </div>
          </div>
          <CardDescription className="text-blue-600/70 text-base">
            Secure digital transactions for campus
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base text-blue-900">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base border-blue-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base text-blue-900">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base border-blue-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-base text-blue-900">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger
                  id="role"
                  className="h-12 text-base border-blue-200 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student" className="text-base py-3">
                    Student
                  </SelectItem>
                  <SelectItem value="vendor" className="text-base py-3">
                    Vendor
                  </SelectItem>
                  <SelectItem value="admin" className="text-base py-3">
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold mt-6 bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
