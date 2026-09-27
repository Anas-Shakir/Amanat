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
    <div className="max-w-4xl mx-auto px-4 py-12 w-full space-y-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role-Based Access Control</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Sign In to Amanat Aid Network
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Choose your role persona to access your customized portal or sign in with your Supabase credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Instant 1-Click Demo Personas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Instant Demo Personas (1-Click)</span>
          </div>

          <div className="space-y-3">
            <Card 
              className="p-4 hover:border-emerald-500/50 cursor-pointer transition-all hover:bg-slate-850/60 group"
              onClick={() => handleDemoSignIn("DONOR", "/donor")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      Donor Persona
                    </div>
                    <div className="text-xs text-slate-400">
                      Anas Shakir • Global Pool Contributor
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-slate-850/60 group"
              onClick={() => handleDemoSignIn("MERCHANT", "/merchant")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                      Merchant Persona
                    </div>
                    <div className="text-xs text-slate-400">
                      Madina Kiryana Store • Johi Bazaar, Dadu
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-indigo-500/50 cursor-pointer transition-all hover:bg-slate-850/60 group"
              onClick={() => handleDemoSignIn("ORGANIZATION", "/organization")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                      Issuer / NGO Persona
                    </div>
                    <div className="text-xs text-slate-400">
                      Tariq Shah • Sindh Relief Foundation
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-amber-500/50 cursor-pointer transition-all hover:bg-slate-850/60 group"
              onClick={() => handleDemoSignIn("ADMIN", "/admin")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                      Admin / Relayer Persona
                    </div>
                    <div className="text-xs text-slate-400">
                      Amanat Node Operator • Base Sepolia
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            </Card>
          </div>
        </div>

        {/* Email/Password Supabase Login */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Account Login</CardTitle>
            <CardDescription>
              Sign in with your registered organization or merchant credentials.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleDemoSignIn("DONOR", "/donor"); }} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold uppercase tracking-wider">
                  Email Address
                </label>
                <Input
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donor@amanat.org"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold uppercase tracking-wider">
                  Password
                </label>
                <Input
                  type="password"
                  icon={<Lock className="w-4 h-4" />}
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
