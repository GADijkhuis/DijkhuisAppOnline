import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function isUserAuthenticated() {
    const { data, error } = await supabase.auth.getSession();

    if (error != null) return false;
    if (!data.session) return false;
    if (await supabase.auth == null) return false;

    const expiresAt = data.session.expires_at;
    return Math.floor(Date.now() / 1000) < expiresAt;
}

export async function signInUser(email, password) {
    try {
        const {data, error: authError} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError != null) {
            return "Invalid Credentials";
        }

        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function signOutUser() {
    await supabase.auth.signOut();
}