import { error } from 'console';
import play from 'play-dl';
import ytdl from 'ytdl-core';

export async function POST(req) {
    try {
        const requestBody = await req.json();
        console.log('Full request body:', requestBody);
        const { action, query, id } = requestBody;
        console.log('Extracted parameters:', { action, query, id });

        if (action === "search") {
            console.log('Performing search for:', query);
            const results = await play.search(query, {
                source: { youtube: 'video' },
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
            // const videoId = id || requestBody.id;
            console.log('Streaming video ID:', id);

            // Check if videoId is valid
            if (!id) {
                console.error('Invalid or missing video ID');
                return Response.json({ error: "Invalid or missing video ID" }, { status: 400 });
            }

            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
            console.log('YouTube URL being used:', youtubeUrl);

            try {
                const info = await ytdl.getInfo(youtubeUrl);
                const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

                if (!format || !format.url) {
                    console.error('No audio stream found');
                    return Response.json({ error: "No streamable audio format found" }, { status: 500 });
                }

                return Response.json({
                    streamUrl: format.url,
                    quality: format.audioQuality || "unknown",
                    mimeType: format.mimeType || "audio/mpeg"
                });
            } catch (err) {
                console.error('YTDL Error:', err);
                return Response.json({ error: err.message }, { status: 500 });
            }

            // return Response.json({
            //     streamUrl: format.url,
            //     quality: format.audioQuality,
            //     mimeType: format.mimeType
            // });

            // const streamInfo = await play.stream(youtubeUrl)
            // console.log(streamInfo)

            // const streamUrl = streamInfo.stream.url

            // return Response.json({
            //     streamUrl: streamInfo.stream.url,
            //     quality: streamInfo.quality
            // });
        }

        console.log('Invalid action received:', action);
        return Response.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error('API Error:', error)
        return Response.json({ error: error.message }, { status: 500 });
    }
}