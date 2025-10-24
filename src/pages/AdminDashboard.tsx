import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Array<{ username: string; balance: number }>>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("vpay_currentUser") || "{}");

  useEffect(() => {
    if (!currentUser.username || currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    loadStudents();
  }, []);

  const loadStudents = () => {
    const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");
    const studentList = Object.entries(users)
      .filter(([_, user]: [string, any]) => user.role === "student")
      .map(([username, user]: [string, any]) => ({
        username,
        balance: user.balance || 0,
      }));
    setStudents(studentList);
  };

  const handleAddCoins = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !amount) {
      toast({
        title: "Error",
        description: "Please select a student and enter amount",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");
    if (users[selectedStudent]) {
      users[selectedStudent].balance = (users[selectedStudent].balance || 0) + amountNum;
      localStorage.setItem("vpay_users", JSON.stringify(users));
      
      toast({
        title: "Success",
        description: `Added ${amountNum} V-Coins to ${selectedStudent}`,
      });

      setSelectedStudent("");
      setAmount("");
      loadStudents();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vpay_currentUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 sticky top-0 z-10 px-4 py-4 shadow-sm border-b border-blue-700">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg overflow-hidden">
                <img 
                  src="/vpay-logo.png" 
                  alt="V-Pay Logo" 
                  className="h-12 w-24 object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">V-Pay</h1>
                <p className="text-xs sm:text-sm text-blue-100">Admin Dashboard</p>
              </div>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-blue-700">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-800 text-white">
                      {currentUser.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {currentUser.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{currentUser.username}</p>
                      <p className="text-sm text-muted-foreground">Administrator</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Add V-Coins Section */}
          <Card className="border-blue-200 shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-xl sm:text-2xl text-blue-900">Add V-Coins</CardTitle>
              <CardDescription className="text-blue-600/70">Add V-Coins to student accounts</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddCoins} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="student" className="text-base text-blue-900">Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="student" className="h-12 text-base border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.username} value={student.username} className="text-base py-3">
                          {student.username} (Balance: {student.balance} V-Coins)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base text-blue-900">Amount (V-Coins)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 text-base border-blue-200 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700">
                  Add V-Coins
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card className="border-blue-200 shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-xl sm:text-2xl text-blue-900">All Students</CardTitle>
              <CardDescription className="text-blue-600/70">Current balances</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.username} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {student.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-blue-900">{student.username}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{student.balance} V-Coins</span>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-center text-blue-600/70 py-8">No students registered yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center border-t border-blue-200">
          <p className="text-sm text-blue-600/70">© 2025 All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;