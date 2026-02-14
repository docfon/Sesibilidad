import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }
            if (data) {
                setUserProfile(data);
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error);
        }
    };

    useEffect(() => {
        let mounted = true;
        let sessionResolved = false; // track if loading was already set to false

        const markReady = () => {
            if (mounted && !sessionResolved) {
                sessionResolved = true;
                console.log('AuthContext: Setting loading false');
                setLoading(false);
            }
        };

        // onAuthStateChange is the PRIMARY mechanism.
        // It fires before getSession resolves when there's a cached session.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('AuthContext: Auth state changed', event);
            if (!mounted) return;

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            // Set loading false FIRST, then fetch profile in background
            markReady();

            if (currentUser) {
                // Non-blocking: fetch profile in background
                fetchProfile(currentUser.id);
            } else {
                setUserProfile(null);
            }
        });

        // getSession() is a FALLBACK for when there's no cached session
        // (e.g. first visit, incognito). Give it 5 seconds max.
        const initSession = async () => {
            try {
                console.log('AuthContext: Initializing session...');

                const timeout = new Promise((resolve) =>
                    setTimeout(() => resolve({ data: { session: null }, timedOut: true }), 5000)
                );
                const result = await Promise.race([supabase.auth.getSession(), timeout]);

                if (!mounted || sessionResolved) return;

                if (result.timedOut) {
                    console.warn('AuthContext: getSession timed out, relying on auth listener');
                    markReady();
                    return;
                }

                const { data, error } = result;
                if (error) {
                    console.warn('AuthContext: getSession error:', error.message);
                    markReady();
                    return;
                }

                console.log('AuthContext: Session retrieved', data?.session ? 'active' : 'none');
                const currentUser = data?.session?.user ?? null;
                setUser(currentUser);
                markReady();

                if (currentUser) {
                    fetchProfile(currentUser.id);
                }
            } catch (err) {
                console.error('AuthContext: Error initializing session:', err);
                markReady();
            }
        };

        initSession();

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email, password, role = 'patient', additionalData = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role } // Store role in metadata effectively as backup, main source is profiles table
            }
        });

        if (data?.user && !error) {
            // Create profile immediately if possible, or handle via trigger if set.
            // We'll update the profile manually here to ensure role and email are set.
            // Note: The handle_new_user trigger might have already created a basic row.
            // We use upsert to be safe.
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email: email,
                role: role,
                ...additionalData
            });
        }
        return { data, error };
    };

    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = () => {
        setUserProfile(null);
        return supabase.auth.signOut();
    };

    const resetPassword = (email) => {
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
    };

    const value = {
        signUp,
        signIn,
        signOut,
        resetPassword,
        user,
        userProfile,
        loading,
        refreshProfile: () => user && fetchProfile(user.id)
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Cargando DentalSens...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
