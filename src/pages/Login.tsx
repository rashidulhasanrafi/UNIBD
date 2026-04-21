import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/Card";
import { GraduationCap } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUP, setIsSignUp] = useState(false);
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Mock login since Firebase was rejected
    login({ 
      name: isSignUP ? name : email.split('@')[0], 
      email 
    });
    navigate("/");
  };

  const handleGuestLogin = () => {
    login({
      name: "Guest Student",
      email: "guest@unitrack.bd"
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            UniTrack BD
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            The all-in-one minimal dashboard for students
          </p>
        </div>

        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-transparent">
            <CardTitle className="text-xl font-bold">{isSignUP ? "Create an account" : "Sign in to your account"}</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {isSignUP 
                ? "Enter your details to get started" 
                : "Enter your email below to login to your dashboard"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {isSignUP && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Name</label>
                  <Input 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Email</label>
                <Input 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-6 bg-transparent border-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit">
                {isSignUP ? "Sign Up" : "Sign In"}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={handleGuestLogin}
              >
                Guest Mode
              </Button>

              <div className="text-center text-sm text-slate-500 mt-2">
                {isSignUP ? "Already have an account? " : "Don't have an account? "}
                <button 
                  type="button"
                  className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => setIsSignUp(!isSignUP)}
                >
                  {isSignUP ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
