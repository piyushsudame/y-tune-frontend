import play from 'play-dl';

export async function POST(req) {
    try {
        const requestBody = await req.json();
        console.log('Full request body:', requestBody);
        const { action, query, id } = requestBody;
        console.log('Extracted parameters:', { action, query, id });

        if (action === "search") {
            console.log('Performing search for:', query);
            
            try {
                const results = await play.search(query, {
                    source: { youtube: 'video' },
                    limit: 10
                });
                
                console.log('Search results count:', results.length);
                
                const formattedResults = results.map(video => ({
                    id: video.id,
                    title: video.title,
                    artist: video.channel?.name || "Unknown",
                    duration: video.durationRaw,
                    thumbnail: video.thumbnails?.[0]?.url || "",
                    views: video.views,
                    url: video.url
                }));
                
                console.log('Formatted results:', formattedResults);
                return Response.json(formattedResults);
                
            } catch (searchError) {
                console.error('Search Error:', searchError);
                return Response.json({ error: "Search failed: " + searchError.message }, { status: 500 });
            }
        }

        if (action === "stream") {
            console.log('Streaming video ID:', id);
       
            if (!id) {
                console.error('Invalid or missing video ID');
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }
       
            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
            console.log('YouTube URL being used:', youtubeUrl);
       
            try {
                // First, validate the URL
                const isValidUrl = play.yt_validate(youtubeUrl);
                if (isValidUrl !== 'video') {
                    console.error('Invalid YouTube URL');
                    return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
                }

                // Get video info first (optional, for additional metadata)
                const videoInfo = await play.video_basic_info(youtubeUrl);
                console.log('Video info retrieved:', videoInfo.video_details.title);

                // Get the stream
                const stream = await play.stream(youtubeUrl);
       
                if (!stream || !stream.url) {
                    console.error('No audio stream found');
                    return Response.json({ error: "No streamable audio format found" }, { status: 500 });
                }
       
                return Response.json({
                    streamUrl: stream.url,
                    quality: stream.quality || "unknown",
                    type: stream.type || "unknown",
                    title: videoInfo.video_details.title,
                    duration: videoInfo.video_details.durationRaw
                });
                
            } catch (streamError) {
                console.error('Stream Error:', streamError);
                
                // Handle specific error cases
                if (streamError.message.includes('Video unavailable')) {
                    return Response.json({ error: "Video is unavailable or private" }, { status: 404 });
                } else if (streamError.message.includes('Age restricted')) {
                    return Response.json({ error: "Video is age restricted" }, { status: 403 });
                } else {
                    return Response.json({ error: "Stream failed: " + streamError.message }, { status: 500 });
                }
            }
        }

        if (action === "info") {
            console.log('Getting info for video ID:', id);
            
            if (!id) {
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }

            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
            
            try {
                const videoInfo = await play.video_basic_info(youtubeUrl);
                
                return Response.json({
                    title: videoInfo.video_details.title,
                    channel: videoInfo.video_details.channel?.name,
                    duration: videoInfo.video_details.durationRaw,
                    views: videoInfo.video_details.views,
                    thumbnail: videoInfo.video_details.thumbnails?.[0]?.url,
                    description: videoInfo.video_details.description?.slice(0, 200) + '...' // Truncate description
                });
                
            } catch (infoError) {
                console.error('Info Error:', infoError);
                return Response.json({ error: "Failed to get video info: " + infoError.message }, { status: 500 });
            }
        }
        
        console.log('Invalid action received:', action);
        return Response.json({ error: "Invalid action. Supported actions: search, stream, info" }, { status: 400 });
        
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: "Internal server error: " + error.message }, { status: 500 });
    }
}