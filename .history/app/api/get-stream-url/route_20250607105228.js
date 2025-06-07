import play from 'play-dl';

export async function POST(req) {
    try {
        const { action, query, videoId } = await request.json();
        
        if(action === "search") {
            const results = await play.search(query, {
                source: { youtube: 'video'},
                limit: 10
            });

            const formattedResults = results.map
        }
    }
}