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
import { DaduAidMapDynamic } from "@/components/maps/dadu-aid-map-dynamic";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 px-4 sm:px-6 lg:px-8 bg-[#fbf9f6]">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f0e8] border border-[#eadecd] text-xs font-bold text-[#585123] shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#585123]" />
            <span>Deployment Target: Dadu, Sindh — Pakistan Flood Corridor</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#772f1a] max-w-4xl mx-auto leading-[1.12]">
            From Entrusted Money to{" "}
            <span className="text-[#f58549]">
              Actual Food Received
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#6e5c54] max-w-2xl mx-auto font-normal leading-relaxed">
            Amanat connects humanitarian donor pools to verified household entitlements and local kiryana stores with gasless settlement on Base Sepolia.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donor"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#f58549] text-white font-bold text-sm hover:bg-[#e07133] transition-all shadow-sm hover:-translate-y-0.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Explore Aid Pools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#772f1a] text-white font-bold text-sm hover:bg-[#521f11] transition-all shadow-sm hover:-translate-y-0.5"
            >
              <Store className="w-4 h-4 text-[#fae4cb]" />
              <span>Merchant Mobile PWA</span>
            </Link>

            <Link
              href="/voucher"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#585123] text-white font-bold text-sm hover:bg-[#736b32] transition-all shadow-sm hover:-translate-y-0.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test SMS / Voucher</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Mode Feature Card Section */}
      <section className="py-14 bg-[#ffffff] border-y border-[#eadecd] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#772f1a]">Disaster-First, Not Disaster-Only</h2>
            <p className="text-[#6e5c54] text-sm mt-2 max-w-xl mx-auto">
              The Amanat infrastructure stays active during normal welfare periods (Zakat, monthly rations) so it is instantly operational when emergencies strike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Mode Card */}
            <div className="p-7 rounded-2xl bg-[#fbf4f2] border-2 border-[#943b22]/40 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#943b22] font-black text-sm tracking-wide">
                  <Flame className="w-4 h-4 text-[#943b22]" />
                  <span>EMERGENCY MODE</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#772f1a] text-white">
                  Flood / Crisis
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#772f1a] mb-2">Rapid Disaster Relief Allocation</h3>
              <p className="text-[#6e5c54] text-sm leading-relaxed mb-5">
                Activated during climate emergencies in Dadu. Rapidly distributes food and clean water entitlements to displaced families across decentralized local kiryana stores without dangerous mass crowd queues.
              </p>
              <ul className="text-xs text-[#6e5c54] space-y-2.5 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#943b22] shrink-0" />
                  <span>Instant emergency voucher distribution via WhatsApp & SMS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#943b22] shrink-0" />
                  <span>Decentralized fulfillment prevents central warehouse bottlenecks</span>
                </li>
              </ul>
            </div>

            {/* Community Mode Card */}
            <div className="p-7 rounded-2xl bg-[#f5f4ed] border-2 border-[#585123]/40 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#585123] font-black text-sm tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-[#585123]" />
                  <span>COMMUNITY MODE</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#585123] text-white">
                  Normal Welfare
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#772f1a] mb-2">Sustainable Local Welfare & Zakat</h3>
              <p className="text-[#6e5c54] text-sm leading-relaxed mb-5">
                Runs continually during normal times. Channels Zakat, monthly food rations, and medical assistance directly into verified household balances with complete donor visibility and dignified private redemption.
              </p>
              <ul className="text-xs text-[#6e5c54] space-y-2.5 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#585123] shrink-0" />
                  <span>Support for partial redemptions (e.g. Rs. 1,200 of Rs. 4,000)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#585123] shrink-0" />
                  <span>Zero crypto burden for beneficiaries or shop owners</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Geographic Aid Map Showcase Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f4ed] border border-[#d4d0b6] text-xs font-bold text-[#585123]">
                <MapPin className="w-3.5 h-3.5 text-[#585123]" />
                <span>Geospatial Field Telemetry</span>
              </span>
              <span className="text-xs text-[#6e5c54] font-mono font-semibold">Dadu District • Sindh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#772f1a] tracking-tight">
              Decentralized Micro-Fulfillment Network
            </h2>
            <p className="text-[#6e5c54] text-sm mt-1 max-w-2xl">
              Real-time map of verified Kiryana merchant stores, flood relief corridors, and community social safety net clusters across Johi, Mehar, and Khairpur Nathan Shah.
            </p>
          </div>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#772f1a] text-xs font-bold text-white hover:bg-[#521f11] transition-all shadow-xs"
          >
            <span>Open Full Command Map</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#fae4cb]" />
          </Link>
        </div>

        <DaduAidMapDynamic height="520px" />
      </section>

      {/* The Core Loop Infographic */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#772f1a]">The Verifiable Aid Journey</h2>
          <p className="text-[#6e5c54] text-sm mt-2">
            Eliminating opacity between aid allocation and real household fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-[#eadecd] shadow-xs flex flex-col space-y-3 hover:border-[#f2a65a] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#f58549] flex items-center justify-center text-white font-extrabold text-base shadow-xs">
              1
            </div>
            <h4 className="font-bold text-[#772f1a] text-base">Community Pool Funded</h4>
            <p className="text-xs text-[#6e5c54] leading-relaxed">
              Donors contribute to geographic aid pools (e.g. Dadu Flood Emergency Food Pool) on Base Sepolia.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eadecd] shadow-xs flex flex-col space-y-3 hover:border-[#f2a65a] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#772f1a] flex items-center justify-center text-white font-extrabold text-base shadow-xs">
              2
            </div>
            <h4 className="font-bold text-[#772f1a] text-base">Household Entitlement</h4>
            <p className="text-xs text-[#6e5c54] leading-relaxed">
              Verified local NGOs register families (e.g. AMN-48291) and issue food vouchers while PII stays off-chain.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eadecd] shadow-xs flex flex-col space-y-3 hover:border-[#f2a65a] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#585123] flex items-center justify-center text-white font-extrabold text-base shadow-xs">
              3
            </div>
            <h4 className="font-bold text-[#772f1a] text-base">Local Store Fulfillment</h4>
            <p className="text-xs text-[#6e5c54] leading-relaxed">
              Beneficiary presents a short 4-digit code at a nearby kiryana store. Merchant fulfills goods via simple PWA.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eadecd] shadow-xs flex flex-col space-y-3 hover:border-[#f2a65a] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#f2a65a] flex items-center justify-center text-[#772f1a] font-extrabold text-base shadow-xs">
              4
            </div>
            <h4 className="font-bold text-[#772f1a] text-base">Gasless Settlement</h4>
            <p className="text-xs text-[#6e5c54] leading-relaxed">
              Server relayer submits cryptographic settlement proofs to smart contracts; donors see live audited fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Role Navigation Tiles */}
      <section className="py-14 bg-[#ffffff] border-t border-[#eadecd] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-[#772f1a] mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#f58549]" />
            <span>Select System Role</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/donor"
              className="p-6 rounded-2xl bg-[#fbf9f6] hover:bg-white border border-[#eadecd] hover:border-[#f58549] transition-all group shadow-2xs hover:shadow-sm"
            >
              <HeartHandshake className="w-7 h-7 text-[#f58549] mb-3 group-hover:scale-105 transition-transform" />
              <div className="font-bold text-[#772f1a] text-base">Donor Portal</div>
              <div className="text-xs text-[#6e5c54] mt-1.5 leading-relaxed">
                View Dadu campaigns, track fulfillment metrics, inspect live on-chain settlements.
              </div>
            </Link>

            <Link
              href="/merchant"
              className="p-6 rounded-2xl bg-[#fbf9f6] hover:bg-white border border-[#eadecd] hover:border-[#772f1a] transition-all group shadow-2xs hover:shadow-sm"
            >
              <Store className="w-7 h-7 text-[#772f1a] mb-3 group-hover:scale-105 transition-transform" />
              <div className="font-bold text-[#772f1a] text-base">Merchant PWA</div>
              <div className="text-xs text-[#6e5c54] mt-1.5 leading-relaxed">
                Lightweight, high-contrast interface for local store owners to verify codes and confirm aid.
              </div>
            </Link>

            <Link
              href="/organization"
              className="p-6 rounded-2xl bg-[#fbf9f6] hover:bg-white border border-[#eadecd] hover:border-[#585123] transition-all group shadow-2xs hover:shadow-sm"
            >
              <Users className="w-7 h-7 text-[#585123] mb-3 group-hover:scale-105 transition-transform" />
              <div className="font-bold text-[#772f1a] text-base">Issuer & NGO</div>
              <div className="text-xs text-[#6e5c54] mt-1.5 leading-relaxed">
                Register households, manage verification records, and issue aid entitlements.
              </div>
            </Link>

            <Link
              href="/admin"
              className="p-6 rounded-2xl bg-[#fbf9f6] hover:bg-white border border-[#eadecd] hover:border-[#f2a65a] transition-all group shadow-2xs hover:shadow-sm"
            >
              <Activity className="w-7 h-7 text-[#f2a65a] mb-3 group-hover:scale-105 transition-transform" />
              <div className="font-bold text-[#772f1a] text-base">Admin & Relayer Oversight</div>
              <div className="text-xs text-[#6e5c54] mt-1.5 leading-relaxed">
                Monitor relayer transactions, configure merchants, and toggle Emergency Mode.
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
