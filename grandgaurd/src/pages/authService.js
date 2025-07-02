import supabase from './supabaseClient';


export const AuthService = {
  // Sign in with email and password
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user exists in admin table
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('admin_id', data.user.id)
        .single();
      
      if (adminError || !adminData) {
        throw new Error("User not found in admin table");
      }
      
      return { user: data.user, admin: adminData };
    } catch (error) {
      throw error;
    }
  },

  // Sign up with email and password
  signup: async (email, password, adminData) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Then create admin record
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin')
        .insert([{
          admin_id: authData.user.id,
          ...adminData
        }])
        .select()
        .single();
      
      if (adminError) throw adminError;
      
      return { user: authData.user, admin: adminRecord };
    } catch (error) {
      throw error;
    }
  },

  //volunteer signup

volunteerSignup: async (email, password, volunteerData) => {
  try {
    // 1. First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          role: 'volunteer'
        }
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // 2. Create volunteer record with the auth user's ID
    const { data: volunteerRecord, error: volunteerError } = await supabase
      .from('volunteers')
      .insert({
        volunteer_id: authData.user.id, // This is the critical line
        ...volunteerData,
        is_approved: false,
        role: 'volunteer'
      })
      .select()
      .single();
    
    if (volunteerError) {
      // Cleanup auth user if volunteer creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error('Cleanup failed:', deleteError);
      }
      throw volunteerError;
    }
    
    return { user: authData.user, volunteer: volunteerRecord };
  } catch (error) {
    console.error('Full error details:', error);
    throw error;
  }
},

  // Sign out
  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      throw error;
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      throw error;
    }
  }
};