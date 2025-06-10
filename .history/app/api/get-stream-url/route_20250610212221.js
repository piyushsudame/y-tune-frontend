import { error } from 'console';
import play from 'play-dl';

export async function POST(req) {
    try {
        const requestBody = await req.json();
        console.log('Full request body:', requestBody);
        const { action, query, id } = requestBody;
        console.log('Extracted parameters:', { action, query, id });
        
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
            // Extract the video ID from the request
            // It could be in either 'id' or 'videoId' parameter
            const videoId = id || requestBody.id;
            console.log('Streaming video ID:', videoId);
            
            // Check if videoId is valid
            if (!videoId) {
                console.error('Invalid or missing video ID');
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }
            
            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            console.log('YouTube URL being used:', youtubeUrl);
            const stream = await play.stream(youtubeUrl)
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