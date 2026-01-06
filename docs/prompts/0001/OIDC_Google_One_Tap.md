Here are the two sequence diagrams that illustrate the difference in user experience and technical flow.

### 1. The Standard OIDC Flow (Generic Google Provider)

**Key Characteristic:** The user is physically redirected away from your app to Zitadel, then to Google, and then back. The state of your current page (e.g., scroll position, unsaved form inputs) is lost unless carefully managed.

Code snippet

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant Zitadel
    participant Google

    Note over User, Browser: User clicks "Login with Google" button
    Browser->>Zitadel: Redirect to Zitadel Authorization Endpoint

    Note right of Browser: 🔄 Full Page Navigation (App Unloads)

    Zitadel->>Google: Redirect to Google OIDC Endpoint
    Browser->>Google: Load Google Login Page
    User->>Google: Enter Credentials / Select Account
    Google->>Zitadel: Redirect back with Auth Code

    Zitadel->>Google: Back-channel: Exchange Code for Token
    Google-->>Zitadel: Return ID Token & Profile
    Zitadel->>Zitadel: Create User Session

    Zitadel->>Browser: Redirect back to Your App

    Note right of Browser: 🔄 Full Page Reload (App Restarts)

    Browser->>User: Show "Logged In" State
```

---

### 2. The Google One Tap Flow (JWT IdP)

**Key Characteristic:** The user never leaves the page. The Google login happens in an overlay (iframe), and the authentication with Zitadel happens in the background (AJAX/Fetch).

Code snippet

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant GoogleScript as Google One Tap (JS)
    participant Zitadel

    Note over User, Browser: User visits your page (No click needed)

    Browser->>GoogleScript: Load One Tap Library
    GoogleScript-->>User: Show "Continue as [Name]" Overlay

    User->>GoogleScript: Clicks the Overlay
    GoogleScript->>GoogleScript: Authenticate internally (Iframe)
    GoogleScript-->>Browser: Callback(Google_ID_Token)

    Note right of Browser: 🛑 No Navigation. App state preserved.

    Browser->>Zitadel: POST /v2/users/me (Header: x-auth-token: Google_ID_Token)

    Note over Zitadel: Zitadel validates Google Signature<br/>(JWT IdP Config)

    Zitadel-->>Browser: Return 200 OK + Zitadel Session Cookie/Token

    Browser->>User: UI updates to "Logged In" instantly
```

### The Trade-off

- **Diagram 1 (Standard)** is robust, standard, and works for _all_ providers (GitHub, Microsoft, etc.) identically.
- **Diagram 2 (One Tap)** is smoother ("magic"), but requires custom handling just for Google and is strictly limited to Google accounts.
