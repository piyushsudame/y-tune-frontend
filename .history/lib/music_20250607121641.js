export async function searchYouTubeMusic(query){
    const response = await fetch(`/api/get-stream-url`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'search', query})
    });

    if(!response.ok) throw new Error("Search failed");
    return response.json()
}

export async function getStreamUrl(videoId){
    const response = await fetch(`/api/get-stream-url`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'stream', videoId })
    })
    
    if(!response.ok) throw new Error("Failed to get Stream URL")
    
    const data = await response.json();
    
    // Validate the response
    if (!data.streamUrl) {
        throw new Error("No stream URL found in the response");
    }
    
    // Validate the URL
    try {
        new URL(data.streamUrl);
    } catch (error) {
        console.error("Invalid stream URL:", data.streamUrl);
        throw new Error("Invalid stream URL received from server");
    }
    
    return data;
}