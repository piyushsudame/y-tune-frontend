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
        body: JSON.stringify({ action: 'strea', videoId })
    })
}