interface iConfig extends Window {
  disqusProxy: {
    username: string;
    server: string;
    port: undefined | number;
    protocol: string;
    defaultAvatar: string;
    adminAvatar: string;
    identifier: string;
    debug: boolean;
  };
}

declare const window: iConfig;

export const config = window;
