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
                console.log(`Getting stream for video ID: ${videoId}`);
                
                // Try using stream method first
                try {
                    const stream = await play.stream(`https://www.youtube.com/watch?v=${videoId}`, {
                        quality: 140  // Force 140 quality (m4a, 128kbps)
                    });
                    
                    console.log('Stream object:', {
                        type: stream.type,
                        quality: stream.quality,
                        hasStream: !!stream.stream
                    });
                    
                    // Get the direct URL using video_info as a fallback
                    const videoInfo = await play.video_info(`https://www.youtube.com/watch?v=${videoId}`);
                    
                    // Log format information for debugging
                    console.log(`Video info formats: ${videoInfo.format.length} formats found`);
                    
                    // Get audio formats
                    const audioFormats = videoInfo.format.filter(format => 
                        format.mimeType && format.mimeType.includes('audio')
                    );
                    
                    console.log(`Audio formats: ${audioFormats.length} found`);
                    
                    if (audioFormats.length === 0) {
                        // If no audio formats with mimeType, try a different approach
                        const alternativeFormats = videoInfo.format.filter(format => 
                            format.audioQuality || format.audioBitrate
                        );
                        console.log(`Alternative audio formats: ${alternativeFormats.length} found`);
                        
                        if (alternativeFormats.length > 0) {
                            const bestFormat = alternativeFormats.sort((a, b) => 
                                (b.audioBitrate || 0) - (a.audioBitrate || 0)
                            )[0];
                            
                            if (bestFormat && bestFormat.url) {
                                return Response.json({
                                    streamUrl: bestFormat.url,
                                    quality: bestFormat.audioBitrate || 'unknown',
                                    videoDetails: {
                                        id: videoId,
                                        title: videoInfo.video_details.title,
                                        artist: videoInfo.video_details.channel?.name || "Unknown",
                                        thumbnail: videoInfo.video_details.thumbnails[0]?.url || ""
                                    }
                                });
                            }
                        }
                    } else {
                        // Sort by audio bitrate and get the best one
                        const bestAudioFormat = audioFormats.sort((a, b) => 
                            (b.audioBitrate || 0) - (a.audioBitrate || 0)
                        )[0];
                        
                        if (bestAudioFormat && bestAudioFormat.url) {
                            return Response.json({
                                streamUrl: bestAudioFormat.url,
                                quality: bestAudioFormat.audioBitrate,
                                videoDetails: {
                                    id: videoId,
                                    title: videoInfo.video_details.title,
                                    artist: videoInfo.video_details.channel?.name || "Unknown",
                                    thumbnail: videoInfo.video_details.thumbnails[0]?.url || ""
                                }
                            });
                        }
                    }
                    
                    // If we get here, we couldn't find a valid audio format
                    // Try to use the stream directly as a last resort
                    if (stream && stream.stream) {
                        // We can't use the stream directly in the browser, but we can try to get a URL
                        // This is a fallback and might not work
                        return Response.json({
                            error: "Could not find a direct audio URL, but a stream is available. This might not work in the browser.",
                            streamInfo: {
                                type: stream.type,
                                quality: stream.quality
                            }
                        }, { status: 206 }); // Partial content
                    }
                    
                    throw new Error("Could not find a valid audio stream");
                } catch (streamError) {
                    console.error("Error with play.stream:", streamError);
                    
                    // Try using video_basic_info and decipher_info as a fallback
                    try {
                        const basicInfo = await play.video_basic_info(`https://www.youtube.com/watch?v=${videoId}`);
                        const decipheredInfo = await play.decipher_info(basicInfo.video_details, true); // audio_only=true
                        
                        console.log(`Deciphered info formats: ${decipheredInfo.format?.length || 0} formats found`);
                        
                        if (decipheredInfo.format && decipheredInfo.format.length > 0) {
                            const audioFormats = decipheredInfo.format.filter(format => 
                                format.mimeType && format.mimeType.includes('audio')
                            );
                            
                            if (audioFormats.length > 0) {
                                const bestFormat = audioFormats.sort((a, b) => 
                                    (b.audioBitrate || 0) - (a.audioBitrate || 0)
                                )[0];
                                
                                if (bestFormat && bestFormat.url) {
                                    return Response.json({
                                        streamUrl: bestFormat.url,
                                        quality: bestFormat.audioBitrate || 'unknown',
                                        videoDetails: {
                                            id: videoId,
                                            title: decipheredInfo.video_details.title,
                                            artist: decipheredInfo.video_details.channel?.name || "Unknown",
                                            thumbnail: decipheredInfo.video_details.thumbnails[0]?.url || ""
                                        }
                                    });
                                }
                            }
                        }
                        
                        throw new Error("Could not find a valid audio stream after deciphering");
                    } catch (decipherError) {
                        console.error("Error with decipher_info:", decipherError);
                        throw new Error("All methods to get audio stream failed");
                    }
                }
            } 
            // If only query is provided, search first then get stream URL
            else if (query) {
                console.log(`Searching for: ${query}`);
                const searchResults = await play.search(query, {
                    source: { youtube: 'video' },
                    limit: 1
                });
                
                if (searchResults && searchResults.length > 0) {
                    const videoId = searchResults[0].id;
                    console.log(`Found video ID: ${videoId}`);
                    
                    // Redirect to the videoId flow
                    return POST(new Request(req.url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'stream', videoId })
                    }));
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