import play from 'play-dl';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
            console.log('Getting stream URL for video ID:', id);
       
            if (!id) {
                console.error('Invalid or missing video ID');
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }
       
            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
            console.log('YouTube URL being used:', youtubeUrl);
       
            try {
                // Method 1: Using yt-dlp (recommended)
                console.log('Attempting to get stream URL with yt-dlp...');
                
                const { stdout, stderr } = await execAsync(
                    `yt-dlp -f "bestaudio/best" --get-url "${youtubeUrl}"`
                );
                
                if (stderr) {
                    console.warn('yt-dlp stderr:', stderr);
                }
                
                const streamUrl = stdout.trim();
                
                if (!streamUrl || !streamUrl.startsWith('http')) {
                    throw new Error('Invalid stream URL returned from yt-dlp');
                }
                
                console.log('Successfully got stream URL');
                
                // Get additional info
                const videoInfo = await play.video_basic_info(youtubeUrl);
                
                return Response.json({
                    streamUrl: streamUrl,
                    title: videoInfo.video_details.title,
                    duration: videoInfo.video_details.durationRaw,
                    channel: videoInfo.video_details.channel?.name
                });
                
            } catch (ytdlpError) {
                console.error('yt-dlp Error:', ytdlpError);
                
                // Fallback: Try alternative method with youtube-dl
                try {
                    console.log('Fallback: Attempting with youtube-dl...');
                    
                    const { stdout: fallbackStdout } = await execAsync(
                        `youtube-dl -f "bestaudio/best" --get-url "${youtubeUrl}"`
                    );
                    
                    const fallbackStreamUrl = fallbackStdout.trim();
                    
                    if (fallbackStreamUrl && fallbackStreamUrl.startsWith('http')) {
                        return Response.json({
                            streamUrl: fallbackStreamUrl,
                            title: "Unknown Title",
                            duration: "Unknown",
                            channel: "Unknown Channel"
                        });
                    }
                    
                    throw new Error('Both yt-dlp and youtube-dl failed');
                    
                } catch (fallbackError) {
                    console.error('Fallback Error:', fallbackError);
                    return Response.json({ 
                        error: "Failed to extract stream URL. Make sure yt-dlp or youtube-dl is installed.",
                        details: fallbackError.message 
                    }, { status: 500 });
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
                    description: videoInfo.video_details.description?.slice(0, 200) + '...'
                });
                
            } catch (infoError) {
                console.error('Info Error:', infoError);
                return Response.json({ error: "Failed to get video info: " + infoError.message }, { status: 500 });
            }
        }

        // Method for streaming directly (if you want to pipe the stream)
        if (action === "stream_direct") {
            console.log('Direct streaming for video ID:', id);
            
            if (!id) {
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }
            
            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
            
            try {
                // This returns a readable stream, not a URL
                const stream = await play.stream(youtubeUrl);
                
                // You would pipe this stream to the response
                // This is for server-side streaming, not client-side URLs
                const response = new Response(stream.stream, {
                    headers: {
                        'Content-Type': 'audio/mpeg',
                        'Content-Disposition': 'inline',
                    },
                });
                
                return response;
                
            } catch (streamError) {
                console.error('Direct Stream Error:', streamError);
                return Response.json({ error: "Direct streaming failed: " + streamError.message }, { status: 500 });
            }
        }
        
        console.log('Invalid action received:', action);
        return Response.json({ 
            error: "Invalid action. Supported actions: search, stream, info, stream_direct" 
        }, { status: 400 });
        
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: "Internal server error: " + error.message }, { status: 500 });
    }
}