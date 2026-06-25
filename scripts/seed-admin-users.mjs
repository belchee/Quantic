import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const USERS = [
  { username: "admin",      password: "Orangutan!1234", role: "superadmin" },
  { username: "Quanticshpk", password: "Loasket1001.",  role: "admin" },
];

async function seed() {
  console.log("Seeding admin users...");
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 12);
    const { error } = await supabase
      .from("admin_users")
      .upsert({ username: u.username, password_hash: hash, role: u.role }, { onConflict: "username" });
    if (error) {
      console.error(`Failed to upsert ${u.username}:`, error.message);
    } else {
      console.log(`  OK: ${u.username} (${u.role})`);
    }
  }
  console.log("Done.");
}

seed().catch(console.error);
