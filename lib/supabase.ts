import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars are missing; chat logs will not be persisted.");
}

export const supabaseAdmin =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

type LogMeta = {
  sessionId?: string;
  userId?: string;
};

export async function logChat(
  userMessage: string,
  modelResponse: string,
  meta?: LogMeta
) {
  if (!supabaseAdmin) return;
  try {
    const { error } = await supabaseAdmin.from("chat_logs").insert({
      user_message: userMessage,
      model_response: modelResponse,
      session_id: meta?.sessionId,
      user_id: meta?.userId,
    });
    if (error) {
      console.error("Supabase log error:", error);
    }
  } catch (err) {
    console.error("Supabase log exception:", err);
  }
}
