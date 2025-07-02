import supabase from './supabaseClient';

export const AuthService = {
  async signUpVolunteer(volunteerData) {
    try {
      // 1. First create the auth user with minimal data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: volunteerData.email.toLowerCase(),
        password: volunteerData.password
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData?.user?.id) {
        throw new Error('No user ID received from authentication');
      }

      // 2. Create the volunteer profile
      const volunteerProfile = {
        volunteer_id: authData.user.id,
        full_name: volunteerData.fullName,
        email: volunteerData.email.toLowerCase(),
        phone: parseInt(volunteerData.phone),
        gender: volunteerData.gender || null,
        date_of_birth: volunteerData.dateOfBirth || null,
        specialization: volunteerData.specialization || null,
        location: volunteerData.location || null,
        experience: volunteerData.experience ? parseInt(volunteerData.experience) : 0,
        description: volunteerData.description || '',
        wage_per_hour: volunteerData.wage_per_hour,
        availability: volunteerData.availability || [],
        role: 'volunteer',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      console.log('Attempting to insert volunteer profile:', volunteerProfile);

      const { data: insertedVolunteer, error: insertError } = await supabase
        .from('volunteers')
        .insert([volunteerProfile])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        // Attempt to clean up the auth user
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (deleteError) {
          console.error('Failed to delete auth user:', deleteError);
        }
        throw new Error(`Failed to create volunteer profile: ${insertError.message}`);
      }

      return {
        success: true,
        user: authData.user,
        volunteer: insertedVolunteer
      };

    } catch (error) {
      console.error('Signup process error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  },

  async updateVolunteerApprovalStatus(volunteerId, newStatus, volunteerEmail) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .update({ status: newStatus })
        .eq('volunteer_id', volunteerId);

      if (error) {
        console.error('Database update error:', error);
        return { success: false, error: `Failed to update volunteer status: ${error.message}` };
      }

      // Prepare email based on the new status
      let emailSubject = '';
      let emailBody = '';

      switch (newStatus) {
        case 'interviewing':
          emailSubject = 'Caregiver Interview Invitation from GrandGuard';
          emailBody = `Dear Caregiver,\n\nThank you for your application to GrandGuard. We were impressed with your profile and would like to invite you for an interview to discuss your application further.\n\nPlease reply to this email to schedule a time that works for you.\n\nBest regards,\nGrandGuard Team`;
          break;
        case 'accepted':
          emailSubject = 'Congratulations! Your GrandGuard Caregiver Application is Accepted!';
          emailBody = `Dear Caregiver,\n\nWe are delighted to inform you that your application to join GrandGuard has been accepted! 🎉\n\nWelcome to our team! We are excited to have you join our community of dedicated caregivers.\n\nBest regards,\nGrandGuard Team`;
          break;
        case 'rejected':
          emailSubject = 'Update on Your GrandGuard Caregiver Application';
          emailBody = `Dear Caregiver,\n\nThank you for your interest in joining GrandGuard. After careful consideration, we regret to inform you that we are unable to proceed with your application at this time.\n\nWe wish you the best in your future endeavors.\n\nBest regards,\nGrandGuard Team`;
          break;
        default:
          return { success: true, message: 'Status updated, but no email sent for this status.' };
      }

      // Trigger Edge Function to send email
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('send-email', {
        body: JSON.stringify({
          to: volunteerEmail,
          subject: emailSubject,
          text: emailBody
        })
      });

      if (edgeFunctionError) {
        console.error('Edge Function invocation error:', edgeFunctionError);
        return { success: false, error: `Failed to send email: ${edgeFunctionError.message}` };
      }

      console.log('Email sent via Edge Function:', edgeFunctionData);

      return { success: true, data };

    } catch (error) {
      console.error('Error in updateVolunteerApprovalStatus:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }
};