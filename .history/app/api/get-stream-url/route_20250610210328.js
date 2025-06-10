import { error } from 'console';
import play from 'play-dl';

export async function POST(req) {
    try {
        const { action, query, videoId } = await req.json();
        console.log('Received request:', { action, query, videoId });
        
        if(action === "search") {
            console.log('Performing search for:', query);
            const results = await play.search(query, {
                source: { youtube: 'video'},
                limit: 10
            });
            console.log('Search results count:', results.length);

            const formattedResults = results.map(video => ({
                id: video.id,
                title: video.title,
                artist: video.channel.name || "Unknown",
                duration: video.durationRaw,
                thumbnail: video.thumbnails[0]?.url || "",
                views: video.views
            }));
            console.log('Formatted results:', formattedResults);

            return Response.json(formattedResults);
        }

        if (action === "stream") {
            console.log('Streaming video ID:', videoId);
            const stream = await play.stream(`https://www.youtube.com/watch?v=${videoId}`)
            console.log('Stream details:', { url: stream.url, quality: stream.quality });

            return Response.json({
                streamUrl: stream.url,
                quality: stream.quality
            });
        }

        console.log('Invalid action received:', action);
        return Response.json({ error: "Invalid action" }, { status: 400 });
    } catch(error) {
        console.error('API Error:', error)
        return Response.json({ error: error.message }, { status: 500 });
    }
}