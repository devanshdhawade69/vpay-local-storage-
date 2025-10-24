import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, TrendingUp, Users, ArrowDownRight } from "lucide-react";

interface Transaction {
  date: string;
  vendor: string;
  amount: number;
  student: string;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("vpay_currentUser") || "{}");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!currentUser.username || currentUser.role !== "vendor") {
      navigate("/");
      return;
    }
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");
    const transactions: Transaction[] = [];

    // Loop through all users and collect transactions from students
    Object.entries(users).forEach(([username, user]: [string, any]) => {
      if (user.role === "student" && user.transactions) {
        user.transactions.forEach((transaction: any) => {
          transactions.push({
            ...transaction,
            student: username,
          });
        });
      }
    });

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAllTransactions(transactions);
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
                <p className="text-xs sm:text-sm text-blue-100">Vendor Dashboard</p>
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
                      <p className="text-sm text-muted-foreground">Vendor</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-50">
                <CardTitle className="text-base font-medium text-blue-900">Total Transactions</CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600">{allTransactions.length}</div>
                <p className="text-sm text-blue-600/70 mt-1.5">All time</p>
              </CardContent>
            </Card>

            <Card className="shadow border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-50">
                <CardTitle className="text-base font-medium text-blue-900">Total Revenue</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600">
                  ₹{allTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}
                </div>
                <p className="text-sm text-blue-600/70 mt-1.5">From all vendors</p>
              </CardContent>
            </Card>
          </div>

          {/* All Transactions */}
          <Card className="shadow border-blue-200">
            <CardHeader className="pb-4 bg-blue-50">
              <CardTitle className="text-lg text-blue-900">All Transactions</CardTitle>
              <CardDescription className="text-sm text-blue-600/70">Student payments across all vendors</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <div className="grid grid-cols-[2fr_2fr_2fr_1.5fr] gap-3 pb-3 text-xs font-semibold border-b border-blue-200 text-blue-700">
                  <div>Date</div>
                  <div>Student</div>
                  <div>Vendor</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="space-y-3 pt-3">
                  {allTransactions.length > 0 ? (
                    allTransactions.map((transaction, index) => (
                      <div key={index} className="grid grid-cols-[2fr_2fr_2fr_1.5fr] gap-3 items-center py-2 border-b border-blue-100 last:border-0">
                        <div className="text-blue-600/70 text-xs">{transaction.date}</div>
                        <div className="text-blue-900 text-sm font-medium truncate">{transaction.student}</div>
                        <div className="text-blue-900 text-sm truncate">{transaction.vendor}</div>
                        <div className="text-right font-semibold text-sm flex items-center justify-end gap-1 text-red-600">
                          <ArrowDownRight className="h-3.5 w-3.5" />
                          ₹{Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-blue-600/70 text-sm text-center py-4">No transactions yet</p>
                  )}
                </div>
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

export default VendorDashboard;