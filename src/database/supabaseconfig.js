import { createClient } from '@supabase/supabase-js';

// Más adelante reemplazarás esto con las credenciales de tu proyecto real
const supabaseUrl = 'https://jiedmyqzyrzwoqbuftgu.supabase.co';
const supabaseKey = 'tu-clave-anonima-temporal';

export const supabase = createClient(supabaseUrl, supabaseKey);