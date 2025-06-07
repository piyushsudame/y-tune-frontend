import play from 'play-dl';

export async function POST(req) {
    try {
        const { action, query, videoId } = await request.json();
        
        if(action === "search") {
            const results = await play.search(query, {
                source: { youtube: 'video'},
                limit: 10
            });

            const formattedResults = results.map(video => ({
                id: video.id,
                title: video.title,
                artist: video.channel.name || "Unknown",
                duration: video.durationRaw,
                thumbnail: video.thumbnails[0]?.url || "",
                views: video.views
            }));

            return Response.json(formattedResults);
        }

        if (action === "stream") {
            const stream
        }
    }
}