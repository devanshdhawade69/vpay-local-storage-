import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { toast } from "@/hooks/use-toast";

const SetPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");

  if (!username) {
    navigate("/");
    return null;
  }

  const handlePinComplete = (value: string) => {
    if (step === "enter") {
      setPin(value);
      setStep("confirm");
      setConfirmPin("");
      toast({
        title: "PIN Set",
        description: "Now confirm your PIN",
      });
    } else {
      if (value === pin) {
        // Save PIN to localStorage
        const users = JSON.parse(localStorage.getItem("vpay_users") || "{}");
        if (users[username]) {
          users[username].pin = value;
          users[username].balance = users[username].balance || 0;
          localStorage.setItem("vpay_users", JSON.stringify(users));
          
          toast({
            title: "Success",
            description: "PIN set successfully!",
          });
          
          navigate("/dashboard");
        }
      } else {
        toast({
          title: "Error",
          description: "PINs do not match. Please try again.",
          variant: "destructive",
        });
        setStep("enter");
        setPin("");
        setConfirmPin("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center px-6 pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-lg overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="V-Pay Logo" 
                className="h-16 w-32 object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Set Your PIN</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            {step === "enter" ? "Enter a 4-digit PIN" : "Confirm your PIN"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={step === "enter" ? pin : confirmPin}
              onChange={step === "enter" ? setPin : setConfirmPin}
              onComplete={handlePinComplete}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {step === "confirm" && (
            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => {
                setStep("enter");
                setPin("");
                setConfirmPin("");
              }}
            >
              Reset PIN
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPin;
