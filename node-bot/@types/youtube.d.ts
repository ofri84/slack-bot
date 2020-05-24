declare module "youtube" {
    export interface SearchParams {
        userId: string,
        subject?: string,
        maxSongs: number,
        maxMinutes: number,
        minMinutes: number,
    };
    
    export interface YoutubeQuery {
        key: string,
        part: string,
        type: string,
        q?: string,
        maxResults?: number,
        videoDuration?: string,
    };
    
    export interface YoutubeItem {
        id:  any,
        snippet: any,
    };
}
