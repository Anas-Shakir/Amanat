import { formatBeneficiaryMessage } from "../vouchers";

export interface NotificationLog {
  id: string;
  recipientPhone?: string;
  householdCode: string;
  voucherCode: string;
  amount: number;
  provider: "demo" | "whatsapp" | "twilio";
  status: "DELIVERED" | "SIMULATED" | "FAILED";
  timestamp: string;
}

// In-memory log for demo evaluations
const NOTIFICATION_HISTORY: NotificationLog[] = [];

export async function sendVoucherNotification(
  householdCode: string,
  voucherCode: string,
  amount: number,
  phone: string = "+923001234567"
): Promise<NotificationLog> {
  const provider = process.env.MESSAGING_PROVIDER || "demo";
  const messages = formatBeneficiaryMessage(voucherCode, householdCode, amount);

  const logEntry: NotificationLog = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientPhone: phone,
    householdCode,
    voucherCode,
    amount,
    provider: provider as "demo" | "whatsapp" | "twilio",
    status: provider === "demo" ? "SIMULATED" : "DELIVERED",
    timestamp: new Date().toISOString(),
  };

  NOTIFICATION_HISTORY.unshift(logEntry);
  console.log(`[Amanat Messaging - ${provider.toUpperCase()}] To: ${phone} | Voucher: ${voucherCode} | Household: ${householdCode}`);

  return logEntry;
}

export function getRecentNotifications(): NotificationLog[] {
  return NOTIFICATION_HISTORY;
}
