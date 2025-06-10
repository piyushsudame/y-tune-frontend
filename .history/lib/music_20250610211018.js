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

export async function getStreamUrl(videoId){
    console.log('Getting stream URL for video:', videoId);
    const response = await fetch(`/api/get-stream-url`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'stream', id: videoId })
    })
    
    if(!response.ok) {
        console.error('Failed to get stream URL with status:', response.status);
        throw new Error("Failed to get Stream URL");
    }
    const data = await response.json();
    console.log('Stream URL retrieved:', data);
    return data;
}