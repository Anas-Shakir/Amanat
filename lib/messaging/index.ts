import { formatBeneficiaryMessage } from "../vouchers";
import { getSupabaseServiceClient } from "../supabase/service";

export type MessagingChannel = "SMS" | "WHATSAPP" | "DEMO";

export interface NotificationLog {
  id: string;
  recipientPhone: string;
  householdCode: string;
  voucherCode: string;
  amount: number;
  channel: MessagingChannel;
  provider: "demo" | "whatsapp_cloud" | "twilio";
  status: "DELIVERED" | "SIMULATED" | "FAILED";
  messageText: string;
  timestamp: string;
}

// In-memory ring buffer for recent simulated dispatches
const NOTIFICATION_HISTORY: NotificationLog[] = [];

/**
 * Dispatches a voucher notification via Demo provider, Twilio SMS, or WhatsApp Cloud API
 */
export async function sendVoucherNotification(
  householdCode: string,
  voucherCode: string,
  amount: number,
  phone: string = "+923001234567",
  preferredChannel: MessagingChannel = "SMS"
): Promise<NotificationLog> {
  const providerType = process.env.MESSAGING_PROVIDER || "demo";
  const messages = formatBeneficiaryMessage(voucherCode, householdCode, amount);
  const messageText = messages.en;

  let deliveryStatus: "DELIVERED" | "SIMULATED" | "FAILED" = "SIMULATED";
  let activeProvider: "demo" | "whatsapp_cloud" | "twilio" = "demo";

  // 1. Try Twilio SMS if credentials exist and selected
  if (
    providerType === "twilio" &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      activeProvider = "twilio";
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_PHONE_NUMBER;

      const authHeader = `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`;
      const bodyParams = new URLSearchParams({
        To: phone,
        From: from,
        Body: messageText,
      });

      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        }
      );

      if (twilioRes.ok) {
        deliveryStatus = "DELIVERED";
      } else {
        deliveryStatus = "SIMULATED";
      }
    } catch (err) {
      console.warn("Twilio SMS dispatch failed, falling back to simulation:", err);
      deliveryStatus = "SIMULATED";
    }
  }

  // 2. Try WhatsApp Cloud API if credentials exist
  else if (
    providerType === "whatsapp" &&
    process.env.WHATSAPP_API_TOKEN &&
    process.env.WHATSAPP_PHONE_NUMBER_ID
  ) {
    try {
      activeProvider = "whatsapp_cloud";
      const token = process.env.WHATSAPP_API_TOKEN;
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      const waRes = await fetch(
        `https://graph.facebook.com/v19.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone.replace(/[^0-9]/g, ""),
            type: "text",
            text: { body: messageText },
          }),
        }
      );

      if (waRes.ok) {
        deliveryStatus = "DELIVERED";
      } else {
        deliveryStatus = "SIMULATED";
      }
    } catch (err) {
      console.warn("WhatsApp Cloud API failed, falling back to simulation:", err);
      deliveryStatus = "SIMULATED";
    }
  }

  const logEntry: NotificationLog = {
    id: `notif-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    recipientPhone: phone,
    householdCode,
    voucherCode,
    amount,
    channel: preferredChannel,
    provider: activeProvider,
    status: deliveryStatus,
    messageText,
    timestamp: new Date().toISOString(),
  };

  NOTIFICATION_HISTORY.unshift(logEntry);
  if (NOTIFICATION_HISTORY.length > 50) NOTIFICATION_HISTORY.pop();

  // Log in Supabase audit events if connected
  try {
    const supabase = getSupabaseServiceClient();
    if (supabase) {
      await supabase.from("audit_events").insert({
        action: "VOUCHER_NOTIFICATION_DISPATCHED",
        entity_type: "VOUCHER",
        entity_id: voucherCode,
        actor_role: "ADMIN",
        actor_id: "messaging-service",
        details: {
          recipientPhone: phone,
          householdCode,
          channel: preferredChannel,
          provider: activeProvider,
          status: deliveryStatus,
        },
      });
    }
  } catch (err) {
    // Ignore logging errors
  }

  return logEntry;
}

export function getRecentNotifications(): NotificationLog[] {
  return NOTIFICATION_HISTORY;
}
