export async function searchYouTubeMusic(query){
    console.log('Searching YouTube Music for:', query);
    const response = await fetch(`/api/get-stream-url`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'search', query})
    });

    if(!response.ok) {
        console.error('Search failed with status:', response.status);
        throw new Error("Search failed");
    }
    const data = await response.json();
    console.log('Search results:', data);
    return data;
}

export async function getStreamUrl(id){
    console.log('Getting stream URL for video:', id);
    
    // Ensure videoId is valid
    if (!id) {
        console.error('Invalid or missing video ID');
        throw new Error("Invalid or missing video ID");
    }
    
    const response = await fetch(`/api/get-stream-url`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'stream', id: id })
    })
    
    if(!response.ok) {
        console.error('Failed to get stream URL with status:', response.status);
        throw new Error("Failed to get Stream URL");
    }
    const data = await response.json();
    console.log('Stream URL retrieved:', data);
    return data;
}