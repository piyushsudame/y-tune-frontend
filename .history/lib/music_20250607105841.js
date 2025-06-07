export async function searchYouTubeMusic(query){
    const response = await fetch(`https://music.youtube.com/youtubei/v1/search?key=${process.env.YOUTUBE_API_KEY}`, {)
}