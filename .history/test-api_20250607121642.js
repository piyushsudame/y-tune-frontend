// Simple test script to check if the API works correctly
const fetch = require('node-fetch');

async function testStreamAPI() {
    try {
        // Test with a videoId
        const response = await fetch('http://localhost:3000/api/get-stream-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'stream',
                videoId: 'dQw4w9WgXcQ' // Rick Astley - Never Gonna Give You Up
            })
        });

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.streamUrl) {
            console.log('Stream URL found:', data.streamUrl.substring(0, 100) + '...');
            console.log('Test passed!');
        } else {
            console.error('No stream URL found in the response');
        }
    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testStreamAPI();