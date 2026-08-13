export type Country = { code: string; name: string; flag: string };

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
];

export const BUSINESS_TYPES = [
  "Restaurant / Cafe",
  "Salon & Spa",
  "Gym & Fitness",
  "Real Estate",
  "Clinic & Dental",
  "Retail Store",
  "Interior Designer",
  "Photographer",
  "Travel Agency",
  "Auto Repair",
  "Education & Coaching",
  "Construction & Contractor",
];

export const LEAD_FIELDS = [
  { id: "businessName", label: "Business Name", icon: "building" },
  { id: "ownerName", label: "Owner Name", icon: "user" },
  { id: "phone", label: "Phone Number", icon: "phone" },
  { id: "email", label: "Email", icon: "mail" },
  { id: "social", label: "Social Media", icon: "share" },
] as const;
