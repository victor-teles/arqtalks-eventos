import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export default createClient<Database>(
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.NEXT_PUBLIC_SUPABASE_KEY!,
);
