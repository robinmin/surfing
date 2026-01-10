// Global type declarations for OIDC initialization
declare global {
    interface Window {
        __OIDC_CONFIG__?: {
            authority?: string;
            clientId?: string;
            redirectUri?: string;
            postLogoutUri?: string;
            orgId?: string;
            idpGoogle?: string;
            idpGithub?: string;
            idpApple?: string;
            idpMicrosoft?: string;
        };
        __OIDC_INIT_PROMISE__?: Promise<void>;
        __OIDC_INIT_RESOLVE__?: () => void;
    }
}

export {};
