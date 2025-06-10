import play from 'play-dl';
import ytdl from '@distube/ytdl-core';

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
                // Validate URL first
                if (!ytdl.validateURL(youtubeUrl)) {
                    return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
                }

                // Get video info and extract direct stream URL
                console.log('Getting video info...');
                const info = await ytdl.getInfo(youtubeUrl);
                
                // Filter for audio-only formats
                const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
                
                if (audioFormats.length === 0) {
                    return Response.json({ error: "No audio formats available" }, { status: 404 });
                }
                
                // Choose the best audio format
                const format = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
                
                if (!format || !format.url) {
                    return Response.json({ error: "No streamable audio format found" }, { status: 500 });
                }
                
                console.log('Successfully extracted stream URL');
                console.log('Format details:', {
                    quality: format.audioQuality,
                    bitrate: format.audioBitrate,
                    container: format.container
                });
                
                return Response.json({
                    streamUrl: format.url,
                    title: info.videoDetails.title,
                    duration: info.videoDetails.lengthSeconds,
                    channel: info.videoDetails.author.name,
                    quality: format.audioQuality || "unknown",
                    bitrate: format.audioBitrate || "unknown",
                    container: format.container || "unknown",
                    // Note: These URLs expire after some time
                    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // Approx 6 hours
                });
                
            } catch (ytdlError) {
                console.error('YTDL Error:', ytdlError);
                
                // Handle specific error cases
                if (ytdlError.message.includes('Video unavailable')) {
                    return Response.json({ error: "Video is unavailable or private" }, { status: 404 });
                } else if (ytdlError.message.includes('restricted')) {
                    return Response.json({ error: "Video is age-restricted or geo-blocked" }, { status: 403 });
                } else if (ytdlError.message.includes('Private video')) {
                    return Response.json({ error: "Video is private" }, { status: 403 });
                } else {
                    return Response.json({ 
                        error: "Failed to extract stream URL: " + ytdlError.message 
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
                if (!ytdl.validateURL(youtubeUrl)) {
                    return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
                }

                const info = await ytdl.getBasicInfo(youtubeUrl);
                
                return Response.json({
                    title: info.videoDetails.title,
                    channel: info.videoDetails.author.name,
                    duration: info.videoDetails.lengthSeconds,
                    views: info.videoDetails.viewCount,
                    thumbnail: info.videoDetails.thumbnails?.[0]?.url,
                    description: info.videoDetails.description?.slice(0, 200) + '...',
                    uploadDate: info.videoDetails.uploadDate,
                    category: info.videoDetails.category
                });
                
            } catch (infoError) {
                console.error('Info Error:', infoError);
                return Response.json({ error: "Failed to get video info: " + infoError.message }, { status: 500 });
            }
        }

        if (action === "formats") {
            console.log('Getting available formats for video ID:', id);
            
            if (!id) {
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }

            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
            
            try {
                if (!ytdl.validateURL(youtubeUrl)) {
                    return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
                }

                const info = await ytdl.getInfo(youtubeUrl);
                
                // Get audio formats
                const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
                
                const formattedAudioFormats = audioFormats.map(format => ({
                    itag: format.itag,
                    quality: format.audioQuality,
                    bitrate: format.audioBitrate,
                    container: format.container,
                    codecs: format.codecs,
                    url: format.url
                }));
                
                return Response.json({
                    title: info.videoDetails.title,
                    audioFormats: formattedAudioFormats
                });
                
            } catch (formatsError) {
                console.error('Formats Error:', formatsError);
                return Response.json({ error: "Failed to get formats: " + formatsError.message }, { status: 500 });
            }
        }
        
        console.log('Invalid action received:', action);
        return Response.json({ 
            error: "Invalid action. Supported actions: search, stream, info, formats" 
        }, { status: 400 });
        
    } catch (error) {
        console.error('API Error:', error);
        return Response.json({ error: "Internal server error: " + error.message }, { status: 500 });
    }
}