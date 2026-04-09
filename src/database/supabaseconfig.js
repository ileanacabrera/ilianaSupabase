import { createClient } from '@supabase/supabase-js';

// Más adelante reemplazarás esto con las credenciales de tu proyecto real
const supabaseUrl = 'https://jiedmyqzyrzwoqbuftgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZWRteXF6eXJ6d29xYnVmdGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTI3NDIsImV4cCI6MjA4OTI2ODc0Mn0.gRZLh1s_ZTxqzyQ7bYm765ucQtunZIgReeRTz9XTpeM';

export const supabase = createClient(supabaseUrl, supabaseKey);