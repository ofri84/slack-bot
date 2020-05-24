declare module "slackbots" {
    type EventTypes = "start" | "message" | "open" | "close" | "error";

    interface InitParams {
        token: string,
        name: string,
        disconnect?: boolean,
    };
    
    export interface User {
        id: string,
        name: string,
    };
    export interface Channel {
        id: string,
    };
    export interface MessageData {
        text: string | undefined,
        type: string,
        channel: string,
        user: string | undefined,
    };

    class SlackBot {
        constructor(params: InitParams);

        on(event: EventTypes, callback: (...args: any[]) => void): void;
        getUsers(): Promise<{members: Partial<User>[]}>;
        getChannels(): Promise<{channels: Partial<Channel>[]}>;
        getImChannels(): Promise<{ims: Partial<Channel>[]}>;
        postMessage(channelId: string, message: string, params?: any): Promise<any>;
    }
}
