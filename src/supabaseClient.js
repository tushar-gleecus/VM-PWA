import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uisclambrgfshwjuwwyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpc2NsYW1icmdmc2h3anV3d3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDA5NjcsImV4cCI6MjA2NjY3Njk2N30.27YPpRP4RNnRa8ouxxgoDA1rF3LT7mTVWvXM0XuKyR4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
