import Link from "next/link";
import { 
  ShieldCheck, 
  Store, 
  HeartHandshake, 
  Flame, 
  MapPin, 
  ArrowRight, 
  Smartphone, 
  CheckCircle2, 
  Coins, 
  Users, 
  Activity,
  Layers
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-600/20 via-cyan-500/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-emerald-400 shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deployment Target: Dadu, Sindh — Pakistan Flood Zone</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            From Entrusted Money to{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Actual Food Received
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Amanat connects humanitarian donor pools to verified household entitlements and local kiryana stores with gasless settlement on Base Sepolia.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donor"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/40 hover:-translate-y-0.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Explore Aid Pools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-all hover:-translate-y-0.5"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Merchant Mobile PWA</span>
            </Link>

            <Link
              href="/voucher"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-semibold text-sm hover:bg-emerald-900/40 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test SMS / Voucher</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Mode Feature Card Section */}
      <section className="py-12 bg-slate-950/60 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Disaster-First, Not Disaster-Only</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              The Amanat infrastructure stays active during normal welfare periods (Zakat, food baskets) so it is instantly operational when emergencies strike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Mode Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border border-rose-800/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm tracking-wide">
                  <Flame className="w-4 h-4 animate-bounce" />
                  <span>EMERGENCY MODE</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-700/50">
                  Flood / Crisis
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rapid Disaster Relief Allocation</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Activated during climate emergencies in Dadu. Rapidly distributes food and clean water entitlements to displaced families across decentralized local kiryana stores without dangerous mass crowd queues.
              </p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  Instant emergency voucher distribution via WhatsApp & SMS
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  Decentralized fulfillment prevents central warehouse bottlenecks
                </li>
              </ul>
            </div>

            {/* Community Mode Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wide">
                  <ShieldCheck className="w-4 h-4" />
                  <span>COMMUNITY MODE</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  Normal Welfare
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sustainable Local Welfare & Zakat</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Runs continually during normal times. Channels Zakat, monthly food rations, and medical assistance directly into verified household balances with complete donor visibility and dignified private redemption.
              </p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Support for partial redemptions (e.g. Rs. 1,200 of Rs. 4,000)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Zero crypto burden for beneficiaries or shop owners
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Loop Infographic */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">The Verifiable Aid Journey</h2>
          <p className="text-slate-400 text-sm mt-2">
            Eliminating opacity between aid allocation and real household fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 font-bold">
              1
            </div>
            <h4 className="font-semibold text-white text-base">Community Pool Funded</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Donors contribute to geographic aid pools (e.g. Dadu Flood Emergency Food Pool) on Base Sepolia.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <h4 className="font-semibold text-white text-base">Household Entitlement</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified local NGOs register families (e.g. AMN-48291) and issue food vouchers while PII stays off-chain.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400 font-bold">
              3
            </div>
            <h4 className="font-semibold text-white text-base">Local Store Fulfillment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Beneficiary presents a short 4-digit code at a nearby kiryana store. Merchant fulfills goods via simple PWA.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950 border border-teal-700/50 flex items-center justify-center text-teal-400 font-bold">
              4
            </div>
            <h4 className="font-semibold text-white text-base">Gasless Settlement</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server relayer submits cryptographic settlement proofs to smart contracts; donors see live audited fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Role Navigation Tiles */}
      <section className="py-12 bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Select System Role</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/donor"
              className="p-5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all group"
            >
              <HeartHandshake className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-white text-sm">Donor Portal</div>
              <div className="text-xs text-slate-400 mt-1">
                View Dadu campaigns, track fulfillment metrics, inspect live on-chain settlements.
              </div>
            </Link>

            <Link
              href="/merchant"
              className="p-5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition-all group"
            >
              <Store className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-white text-sm">Merchant PWA</div>
              <div className="text-xs text-slate-400 mt-1">
                Lightweight, high-contrast interface for local store owners to verify codes and confirm aid.
              </div>
            </Link>

            <Link
              href="/organization"
              className="p-5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all group"
            >
              <Users className="w-6 h-6 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-white text-sm">Issuer & Organization</div>
              <div className="text-xs text-slate-400 mt-1">
                Register households, manage verification records, and issue aid entitlements.
              </div>
            </Link>

            <Link
              href="/admin"
              className="p-5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition-all group"
            >
              <Activity className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-white text-sm">Admin & Relayer Oversight</div>
              <div className="text-xs text-slate-400 mt-1">
                Monitor relayer transactions, configure merchants, and toggle Emergency Mode.
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
