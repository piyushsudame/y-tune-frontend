export async function searchYouTubeMusic(query){
    const response = await fetch(`/api/get-stream-url`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'search', query})
    });

    if(!response.ok) throw new Error("")
}