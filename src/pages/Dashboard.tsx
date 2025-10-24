import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Store,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Coins,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<
    Array<{ date: string; vendor: string; amount: number }>
  >([]);

  const currentUser = JSON.parse(
    localStorage.getItem("vpay_currentUser") || "{}"
  );

  useEffect(() => {
    if (!currentUser.username || currentUser.role !== "student") {
      navigate("/");
      return;
    }

    // Load user balance and transactions
    const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");
    const userData = users[currentUser.username];
    if (userData) {
      setWalletBalance(userData.balance || 0);
      setTransactions(userData.transactions || []);
    }
  }, []);

  const nearbyVendors = [
    { id: 1, name: "Campus Cafeteria", distance: "50m" },
    { id: 2, name: "Bookstore", distance: "120m" },
    { id: 3, name: "Coffee Shop", distance: "200m" },
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendor || !amount || !pin) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");
    const userData = users[currentUser.username];

    // Verify PIN
    if (userData.pin !== pin) {
      toast({
        title: "Error",
        description: "Invalid PIN",
        variant: "destructive",
      });
      return;
    }

    const paymentAmount = parseFloat(amount);

    // Check balance
    if (userData.balance < paymentAmount) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    // Update balance and transactions
    userData.balance -= paymentAmount;
    const newTransaction = {
      date: new Date().toISOString().split("T")[0],
      vendor: vendor,
      amount: -paymentAmount,
    };

    if (!userData.transactions) {
      userData.transactions = [];
    }
    userData.transactions.unshift(newTransaction);

    // Save to localStorage
    users[currentUser.username] = userData;
    localStorage.setItem("vpay_users", JSON.stringify(users));

    // Update state
    setWalletBalance(userData.balance);
    setTransactions(userData.transactions);

    toast({
      title: "Payment Successful",
      description: `₹${paymentAmount.toFixed(2)} paid to ${vendor}`,
    });

    setVendor("");
    setAmount("");
    setPin("");
  };

  const handleLogout = () => {
    localStorage.removeItem("vpay_currentUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
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
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  V-Pay
                </h1>
                <p className="text-xs sm:text-sm text-blue-100">
                  Student Dashboard
                </p>
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 hover:bg-blue-700"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-800 text-white">
                      {currentUser.username?.substring(8, 10).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {currentUser.username?.substring(8, 10).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {currentUser.username}
                      </p>
                      <p className="text-sm text-muted-foreground">Student </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-50">
                <CardTitle className="text-base font-medium text-blue-900">
                  Wallet Balance
                </CardTitle>
                <Coins className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600">
                  ₹{walletBalance.toFixed(2)}
                </div>
                <p className="text-sm text-blue-600/70 mt-1.5">
                  Available for spending
                </p>
              </CardContent>
            </Card>

            <Card className="shadow border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-50">
                <CardTitle className="text-base font-medium text-blue-900">
                  Vendors Nearby
                </CardTitle>
                <Store className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {nearbyVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-blue-900 text-sm font-medium">
                        {vendor.name}
                      </span>
                      <span className="text-blue-700 text-xs bg-blue-100 px-2 py-1 rounded">
                        {vendor.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & History Section */}
          <div className="space-y-4">
            {/* Make Payment */}
            <Card className="shadow border-blue-200">
              <CardHeader className="pb-4 bg-blue-50">
                <CardTitle className="text-lg text-blue-900">
                  Make Payment
                </CardTitle>
                <CardDescription className="text-sm text-blue-600/70">
                  Send money to campus vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePayment} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="vendor" className="text-base text-blue-900">
                      Select Vendor
                    </Label>
                    <Select value={vendor} onValueChange={setVendor}>
                      <SelectTrigger
                        id="vendor"
                        className="h-12 text-base border-blue-200 focus:ring-blue-500"
                      >
                        <SelectValue placeholder="Choose a vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {nearbyVendors.map((v) => (
                          <SelectItem
                            key={v.id}
                            value={v.name}
                            className="text-base py-3"
                          >
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base text-blue-900">
                      Amount (₹)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 text-base border-blue-200 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin" className="text-base text-blue-900">
                      PIN
                    </Label>
                    <Input
                      id="pin"
                      type="password"
                      maxLength={4}
                      placeholder="Enter your 4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="h-12 text-base text-center tracking-widest border-blue-200 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold mt-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Pay Now
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="shadow border-blue-200">
              <CardHeader className="pb-4 bg-blue-50">
                <CardTitle className="text-lg text-blue-900">
                  Transaction History
                </CardTitle>
                <CardDescription className="text-sm text-blue-600/70">
                  Your recent payment activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <div className="grid grid-cols-[2fr_2fr_1.5fr] gap-3 pb-3 text-xs font-semibold border-b border-blue-200 text-blue-700">
                    <div>Date</div>
                    <div>Vendor</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="space-y-3 pt-3">
                    {transactions.length > 0 ? (
                      transactions.map((transaction, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[2fr_2fr_1.5fr] gap-3 items-center py-2 border-b border-blue-100 last:border-0"
                        >
                          <div className="text-blue-600/70 text-xs">
                            {transaction.date}
                          </div>
                          <div className="text-blue-900 text-sm font-medium truncate">
                            {transaction.vendor}
                          </div>
                          <div
                            className={`text-right font-semibold text-sm flex items-center justify-end gap-1 ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5" />
                            )}
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-blue-600/70 text-sm text-center py-4">
                        No transactions yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center border-t">
          <p className="text-sm text-muted-foreground">
            © 2025 All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
