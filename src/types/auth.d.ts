/**
 * Global type declarations for authentication components
 */

declare global {
  interface Window {
    authContainerCleanup?: () => void;
    googleOneTapCleanup?: () => void;
    appleSignInCleanup?: () => void;
    fedcmConfig?: {
      clientId: string;
      nonce: string;
      context: string;
    };
  }

  interface CredentialRequestOptions {
    identity?: {
      providers: Array<{
        configURL: string;
        clientId: string;
        nonce: string;
      }>;
    };
  }
}

export {};
