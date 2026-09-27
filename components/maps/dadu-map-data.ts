export interface KiryanaStoreLocation {
  id: string;
  name: string;
  merchantCode: string;
  ownerName: string;
  tehsil: "Johi" | "Mehar" | "Khairpur Nathan Shah" | "Radhan" | "Dadu City";
  area: string;
  lat: number;
  lng: number;
  phone: string;
  status: "ACTIVE" | "HIGH_TRAFFIC" | "INVENTORY_RESTOCKING";
  inventoryStatus: "Abundant" | "Normal" | "Low Stock";
  supportedRations: string[];
  totalFulfilledPKR: number;
  householdsServed: number;
  settlementAddress: string;
  lastRedemption: string;
  associatedPool: string;
}

export interface ReliefZone {
  id: string;
  name: string;
  type: "EMERGENCY_FLOOD" | "COMMUNITY_ZAKAT" | "INUNDATION_WATCH";
  tehsil: string;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE";
  activePoolAmount: number;
  fulfilledAmount: number;
  verifiedHouseholds: number;
  center: [number, number];
  polygon: [number, number][];
  description: string;
  color: string;
}

export const DADU_MERCHANT_STORES: KiryanaStoreLocation[] = [
  {
    id: "store-johi-01",
    name: "Madina Kiryana Store",
    merchantCode: "MER-DADU-01",
    ownerName: "Tariq Mehmood Babar",
    tehsil: "Johi",
    area: "Main Bazaar, Opp. Civil Hospital, Johi",
    lat: 26.6917,
    lng: 67.6139,
    phone: "+92 301 5551201",
    status: "HIGH_TRAFFIC",
    inventoryStatus: "Abundant",
    supportedRations: ["Wheat Flour (Atta 20kg)", "Cooking Oil (5L)", "Lentils (Daal Chana)", "Sugar & Tea Pack"],
    totalFulfilledPKR: 245000,
    householdsServed: 85,
    settlementAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    lastRedemption: "10 mins ago (AMN-48291 • Rs. 1,350)",
    associatedPool: "Dadu Flood Emergency Food Relief",
  },
  {
    id: "store-mehar-02",
    name: "Bismillah General & Kiryana Store",
    merchantCode: "MER-DADU-02",
    ownerName: "Haji Abdul Rasheed",
    tehsil: "Mehar",
    area: "Larkana Road, Near Clock Tower, Mehar",
    lat: 27.1806,
    lng: 67.8222,
    phone: "+92 302 5551202",
    status: "ACTIVE",
    inventoryStatus: "Abundant",
    supportedRations: ["Standard Ration Package A", "Infant Milk Supplement", "Purified Water Canisters"],
    totalFulfilledPKR: 310000,
    householdsServed: 65,
    settlementAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    lastRedemption: "45 mins ago (AMN-48292 • Rs. 4,000)",
    associatedPool: "Dadu Flood Emergency Food Relief",
  },
  {
    id: "store-knshah-03",
    name: "Al-Razaq Ration Mart",
    merchantCode: "MER-DADU-03",
    ownerName: "Muhammad Aslam Soomro",
    tehsil: "Khairpur Nathan Shah",
    area: "Station Road, KN Shah City Center",
    lat: 27.0917,
    lng: 67.7333,
    phone: "+92 303 5551203",
    status: "ACTIVE",
    inventoryStatus: "Normal",
    supportedRations: ["Monthly Zakat Ration Hamper", "Rice (Basmati 10kg)", "Ghee & Spices"],
    totalFulfilledPKR: 195000,
    householdsServed: 90,
    settlementAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    lastRedemption: "2 hours ago (AMN-48294 • Rs. 2,000)",
    associatedPool: "Dadu Community — Monthly Zakat Ration Support",
  },
  {
    id: "store-radhan-04",
    name: "Radhan Community Ration Mart",
    merchantCode: "MER-DADU-04",
    ownerName: "Qadir Bux Chandio",
    tehsil: "Radhan",
    area: "Railway Station Chowk, Radhan",
    lat: 27.2472,
    lng: 67.9250,
    phone: "+92 304 5551204",
    status: "ACTIVE",
    inventoryStatus: "Abundant",
    supportedRations: ["Emergency Energy Food", "Dry Grains & Pulses", "Salt & Matchboxes"],
    totalFulfilledPKR: 100000,
    householdsServed: 45,
    settlementAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    lastRedemption: "3 hours ago (AMN-48295 • Rs. 3,500)",
    associatedPool: "Dadu Community — Monthly Zakat Ration Support",
  },
];

export const DADU_RELIEF_ZONES: ReliefZone[] = [
  {
    id: "zone-johi-flood",
    name: "Johi Western Flood Risk Corridor",
    type: "EMERGENCY_FLOOD",
    tehsil: "Johi",
    riskLevel: "CRITICAL",
    activePoolAmount: 500000,
    fulfilledAmount: 245000,
    verifiedHouseholds: 85,
    center: [26.6917, 67.6139],
    polygon: [
      [26.7400, 67.5400],
      [26.7600, 67.6800],
      [26.6500, 67.6900],
      [26.6200, 67.5800],
      [26.6700, 67.5300],
    ],
    description: "Union Councils 3 & 4 adjacent to Main Nara Valley Drain. High flash flood probability during monsoon inundation.",
    color: "#ef4444", // red
  },
  {
    id: "zone-knshah-rebuild",
    name: "KN Shah Core Relief Sector",
    type: "EMERGENCY_FLOOD",
    tehsil: "Khairpur Nathan Shah",
    riskLevel: "HIGH",
    activePoolAmount: 400000,
    fulfilledAmount: 195000,
    verifiedHouseholds: 90,
    center: [27.0917, 67.7333],
    polygon: [
      [27.1400, 67.6800],
      [27.1500, 67.7900],
      [27.0400, 67.7800],
      [27.0300, 67.6900],
    ],
    description: "Urban and peri-urban lowlands. Focus on ration stabilization and local Kiryana voucher liquidity.",
    color: "#f59e0b", // amber
  },
  {
    id: "zone-mehar-zakat",
    name: "Mehar Sustainable Community Zone",
    type: "COMMUNITY_ZAKAT",
    tehsil: "Mehar",
    riskLevel: "MODERATE",
    activePoolAmount: 350000,
    fulfilledAmount: 310000,
    verifiedHouseholds: 65,
    center: [27.1806, 67.8222],
    polygon: [
      [27.2300, 67.7700],
      [27.2200, 67.8800],
      [27.1300, 67.8700],
      [27.1400, 67.7600],
    ],
    description: "Monthly predictable social safety net funded by Zakat donor pools for verified low-income households.",
    color: "#10b981", // emerald
  },
];

export const DADU_DISTRICT_CENTER: [number, number] = [26.7341, 67.7795]; // Dadu City Hub
