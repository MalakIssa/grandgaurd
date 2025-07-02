require('dotenv').config({ path: './zoom.env' }); // Loads your Zoom and email credentials

const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Load credentials from environment variables
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Set up nodemailer (example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Function to get a Zoom access token using your credentials
async function getZoomAccessToken() {
  const response = await axios.post(
    'https://zoom.us/oauth/token',
    `grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
}

// API endpoint to schedule a Zoom meeting, update status, and send email
app.post('/api/schedule-zoom-meeting', async (req, res) => {
  try {
    const { topic, start_time, duration, email, volunteer_id, admin_id } = req.body;
    const accessToken = await getZoomAccessToken();

    // 1. Create the Zoom meeting
    const meetingResponse = await axios.post(
      `https://api.zoom.us/v2/users/me/meetings`,
      {
        topic,
        type: 2,
        start_time,
        duration,
        timezone: 'Asia/Beirut'
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 2. Update volunteer status in Supabase
    if (volunteer_id) {
      await supabase
        .from('volunteers')
        .update({ status: 'interviewing' })
        .eq('volunteer_id', volunteer_id);
    }

    // 3. Insert interview record into Supabase
    const { data: interviewInsertData, error: interviewInsertError } = await supabase
      .from('interviews')
      .insert([{
        volunteer_id: volunteer_id,
        admin_id: admin_id || null,
        scheduled_time: start_time,
        status: 'scheduled',
        zoom_join_url: meetingResponse.data.join_url,
        zoom_start_url: meetingResponse.data.start_url
      }]);

    if (interviewInsertError) {
      console.error('Supabase interview insert error:', interviewInsertError);
      return res.status(500).json({ error: 'Failed to insert interview record', details: interviewInsertError.message });
    }
    console.log('Interview record inserted:', interviewInsertData, 'for volunteer_id:', volunteer_id);

    // 4. Send email to volunteer
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Your Caregiver Interview Invitation',
      text: `Dear Caregiver,\n\nYou are invited to a Zoom interview.\n\nDate: ${new Date(start_time).toLocaleDateString()}\nTime: ${new Date(start_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Beirut' })} (Beirut Time)\n\nJoin the meeting at the scheduled time using this link:\n${meetingResponse.data.join_url}\n\nBest regards,\nGrandGuard Team`
    };
    await transporter.sendMail(mailOptions);

    // 5. Respond to frontend
    res.json({
      join_url: meetingResponse.data.join_url,
      start_url: meetingResponse.data.start_url
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));