const axios = require('axios');

const MSG91_AUTH_KEY = '401846AEjwSihvV64e4ed4dP1';
const TEMPLATE_ID = '64c25855d6fc050aeb1dc733';

async function sendOTP(phoneNumber, otp) {
  const url = `https://api.msg91.com/api/v5/otp?authkey=${MSG91_AUTH_KEY}&template_id=${TEMPLATE_ID}&mobile=${phoneNumber}&otp=${otp}`;
    console.log("url: ", url);
  try {
    const response = await axios.post(url);
    // console.log("response: ", response);
    return response.data;
  } catch (error) {
    throw new Error('Failed to send OTP.');
  }
}

// const jwt = require('jsonwebtoken');

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  return otp.toString();
}

const userPhoneNumber = '+918006387557';
const generatedOTP = generateOTP();

sendOTP(userPhoneNumber, generatedOTP)
  .then(response => {
    console.log('OTP sent successfully:', response);
  })
  .catch(error => {
    console.error('Error sending OTP:', error.message);
  });

