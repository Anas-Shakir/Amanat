"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { UserRole } from "@/types";
import { 
  HeartHandshake, 
  Store, 
  Users, 
  Activity, 
  ArrowRight, 
  Lock, 
  Mail, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { switchRole } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoSignIn = async (role: UserRole, targetUrl: string) => {
    setIsSubmitting(true);
    await switchRole(role);
    router.push(targetUrl);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full space-y-10 animate-fade-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#585123]/10 border border-[#585123]/30 text-xs font-bold text-[#585123]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role-Based Access Control</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#772f1a] tracking-tight">
          Sign In to Amanat Aid Network
        </h1>
        <p className="text-[#6e5c54] text-sm max-w-md mx-auto">
          Choose your role persona to access your customized portal or sign in with your Supabase credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Instant 1-Click Demo Personas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#772f1a] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#f58549]" />
            <span>Instant Demo Personas (1-Click)</span>
          </div>

          <div className="space-y-3">
            <Card 
              className="p-4 hover:border-[#f58549] cursor-pointer transition-all hover:bg-[#fdf8f2] group border-[#eadecd] bg-white shadow-sm"
              onClick={() => handleDemoSignIn("DONOR", "/donor")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f58549]/10 border border-[#f58549]/30 flex items-center justify-center text-[#f58549]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2b1712] text-sm group-hover:text-[#772f1a] transition-colors">
                      Donor Persona
                    </div>
                    <div className="text-xs text-[#6e5c54]">
                      Anas Shakir • Global Pool Contributor
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6e5c54] group-hover:text-[#f58549] transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-[#585123] cursor-pointer transition-all hover:bg-[#fdf8f2] group border-[#eadecd] bg-white shadow-sm"
              onClick={() => handleDemoSignIn("MERCHANT", "/merchant")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#585123]/10 border border-[#585123]/30 flex items-center justify-center text-[#585123]">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2b1712] text-sm group-hover:text-[#772f1a] transition-colors">
                      Merchant Persona
                    </div>
                    <div className="text-xs text-[#6e5c54]">
                      Madina Kiryana Store • Johi Bazaar, Dadu
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6e5c54] group-hover:text-[#585123] transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-[#772f1a] cursor-pointer transition-all hover:bg-[#fdf8f2] group border-[#eadecd] bg-white shadow-sm"
              onClick={() => handleDemoSignIn("ORGANIZATION", "/organization")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#772f1a]/10 border border-[#772f1a]/30 flex items-center justify-center text-[#772f1a]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2b1712] text-sm group-hover:text-[#772f1a] transition-colors">
                      Issuer / NGO Persona
                    </div>
                    <div className="text-xs text-[#6e5c54]">
                      Tariq Shah • Sindh Relief Foundation
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6e5c54] group-hover:text-[#772f1a] transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-[#f2a65a] cursor-pointer transition-all hover:bg-[#fdf8f2] group border-[#eadecd] bg-white shadow-sm"
              onClick={() => handleDemoSignIn("ADMIN", "/admin")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f2a65a]/20 border border-[#f2a65a]/50 flex items-center justify-center text-[#772f1a]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2b1712] text-sm group-hover:text-[#772f1a] transition-colors">
                      Admin / Relayer Persona
                    </div>
                    <div className="text-xs text-[#6e5c54]">
                      Amanat Node Operator • Base Sepolia
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6e5c54] group-hover:text-[#772f1a] transition-colors" />
              </div>
            </Card>
          </div>
        </div>

        {/* Email/Password Supabase Login */}
        <Card className="bg-white border-[#eadecd] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#772f1a]">Account Login</CardTitle>
            <CardDescription className="text-[#6e5c54]">
              Sign in with your registered organization or merchant credentials.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleDemoSignIn("DONOR", "/donor"); }} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#2b1712] font-bold uppercase tracking-wider">
                  Email Address
                </label>
                <Input
                  type="email"
                  icon={<Mail className="w-4 h-4 text-[#6e5c54]" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donor@amanat.org"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#2b1712] font-bold uppercase tracking-wider">
                  Password
                </label>
                <Input
                  type="password"
                  icon={<Lock className="w-4 h-4 text-[#6e5c54]" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                <span>Sign In with Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
