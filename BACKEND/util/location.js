const axios = require('axios');
const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'mern-app-contact@example.com' // Use your email or app name
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new HttpError('Could not find location for the specified address.', 422);
    }

    const data = response.data[0];
    return {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon)
    };
  } catch (err) {
    if (err.response && err.response.status === 403) {
      throw new HttpError('Geocoding API blocked your request. Please try again later or use a different address.', 403);
    }
    throw new HttpError('Geocoding failed. Please check your address or try again later.', 500);
  }
}

module.exports = getCoordsForAddress;