/**
 * Utility functions for handling music streaming
 */

/**
 * Get a streamable URL for a song from the backend
 * @param {string} songName - The name of the song to stream
 * @returns {Promise<string>} - The HLS stream URL
 */
export async function getStreamUrl(songName) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_RESEND_BASE_URL || 'https://ytune-backend.onrender.com';
    
    const response = await fetch(`${backendUrl}/api/get-stream-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ song_name: songName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get stream URL: ${response.status}`);
    }

    const data = await response.json();
    return data.stream_url;
  } catch (error) {
    console.error('Error getting stream URL:', error);
    throw error;
  }
}