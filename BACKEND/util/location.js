const axios = require('axios');
const HttpError = require('../models/http-error'); // Assuming you have a custom error class

async function getCoordsForAddress(address) {
    console.log('🔍 Geocoding address:', address);
    
    try {
        // First attempt with full address
        let response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`
        );

        let data = response.data;
        console.log('📍 Geocoding response:', data.length, 'results found');

        // If no results, try with simplified address (remove commas and extra spaces)
        if (!data || data.length === 0) {
            const simplifiedAddress = address.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
            console.log('🔄 Trying simplified address:', simplifiedAddress);
            
            response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simplifiedAddress)}&limit=5`
            );
            data = response.data;
        }

        // If still no results, try with just the city and state/country
        if (!data || data.length === 0) {
            const parts = address.split(',').map(part => part.trim());
            if (parts.length >= 2) {
                const cityStateCountry = parts.slice(-3).join(', '); // Last 3 parts
                console.log('🔄 Trying city/state/country:', cityStateCountry);
                
                response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityStateCountry)}&limit=5`
                );
                data = response.data;
            }
        }

        if (!data || data.length === 0) {
            console.error('❌ No location found for address:', address);
            const error = new HttpError('Could not find location for the specified address. Please try a more general address like "City, State, Country".', 422);
            throw error;
        }

        const coordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };

        console.log('✅ Found coordinates:', coordinates);
        return coordinates;
        
    } catch (error) {
        if (error.response) {
            console.error('❌ Geocoding API error:', error.response.status, error.response.data);
        } else {
            console.error('❌ Geocoding error:', error.message);
        }
        throw error;
    }
}

module.exports = getCoordsForAddress;
