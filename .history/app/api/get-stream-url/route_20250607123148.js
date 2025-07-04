import { error } from 'console';
import play from 'play-dl';

export async function POST(req) {
    try {
        const { action, query, videoId } = await req.json();
        
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
            // If videoId is provided, use it directly
            if (videoId) {
                const stream = await play.stream(`https://www.youtube.com/watch?v=${videoId}`);
                return Response.json({
                    streamUrl: stream.url,
                    quality: stream.quality
                });
            } 
            // If only query is provided, search first then get stream URL
            else if (query) {
                const searchResults = await play.search(query, {
                    source: { youtube: 'video' },
                    limit: 1
                });
                
                if (searchResults && searchResults.length > 0) {
                    const videoId = searchResults[0].id;
                    const stream = await play.stream(`https://www.youtube.com/watch?v=${videoId}`);
                    return Response.json({
                        streamUrl: stream.url,
                        quality: stream.quality,
                        videoDetails: {
                            id: videoId,
                            title: searchResults[0].title,
                            artist: searchResults[0].channel?.name || "Unknown",
                            thumbnail: searchResults[0].thumbnails[0]?.url || ""
                        }
                    });
                } else {
                    return Response.json({ error: "No results found for the query" }, { status: 404 });
                }
            } else {
                return Response.json({ error: "Either videoId or query is required for stream action" }, { status: 400 });
            }
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });
    } catch(error) {
        console.error('API Error:', error);
        return Response.json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}