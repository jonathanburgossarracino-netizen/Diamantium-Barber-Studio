import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rtdifbjwlrjorocrarro.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Dl8WO0tcPPpLqfu72b2-QQ_sKrnOw-4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const TELEFONO_ADMIN = "9381370804";
export const PIN_ADMIN = "1234";