---
title: 'One Click Login'
description: 'Learn how to implement frictionless authentication with Google One Tap and Sign In with Apple on a static website using Supabase and Cloudflare Pages.'
tags: ['authentication', 'supabase', 'cloudflare', 'google', 'apple', 'oauth']
readingTime: 15
wordCount: 3500
publishDate: 2025-10-02
draft: false
featured: false
image: '@assets/images/google_one_tap.png'
---

# A Definitive Guide to Implementing Google One Tap and Sign In with Apple on a Static Website with Supabase and Cloudflare

## Introduction: Architecting Frictionless Authentication on the Modern Web

In the contemporary digital landscape, the user's initial interaction with an application is a critical determinant of its success. Cumbersome registration forms and forgotten passwords represent significant barriers to entry, often leading to user attrition before the value of a service can be demonstrated. Modern authentication strategies, therefore, prioritize a frictionless onboarding experience. Social login providers, particularly those offering seamless, one-tap solutions, have become the gold standard for enhancing user experience, increasing conversion rates, and bolstering security.[1] Google One Tap and Sign In with Apple stand as premier examples of this paradigm, offering users a familiar, trusted, and expedited path to authentication.[2]

The architectural foundation for web applications has concurrently evolved towards a serverless, Jamstack model. This approach leverages the power of backend-as-a-service (BaaS) platforms and global content delivery networks to deliver unparalleled performance, scalability, and an improved developer experience. This guide focuses on a best-in-class serverless stack: Supabase, a powerful open-source Firebase alternative built on PostgreSQL, for the authentication and data backend [3, 4]; and Cloudflare Pages, a globally distributed platform for deploying static and dynamic web applications with exceptional performance and security.[5, 6] This combination provides a robust, scalable, and cost-effective solution for modern web development.

This report provides a definitive, step-by-step guide for integrating Google One Tap and Sign In with Apple into a pure static website, hosted on Cloudflare Pages and powered by Supabase Auth. It will navigate the intricate configurations required across the Google Cloud Platform, the Apple Developer Portal, the Supabase dashboard, and the Cloudflare environment. The core architectural pattern employed for both providers is the client-side ID Token flow, utilizing the `supabase.auth.signInWithIdToken` method. This modern approach decouples the application's user interface from backend redirects, offering a superior user experience and a more flexible implementation, a crucial distinction from traditional server-side OAuth redirect flows.[2, 7, 8] By following this comprehensive guide, developers can implement a secure, professional-grade authentication system that meets the high expectations of today's web users.

## Section 1: Foundational Configuration for Supabase and Cloudflare

Before integrating third-party authentication providers, a solid foundation must be established within the core Supabase and Cloudflare platforms. Correctly configuring the Supabase client, managing environment variables, and aligning URL and Cross-Origin Resource Sharing (CORS) policies are critical prerequisites. Errors or omissions in this foundational stage are the most common source of downstream failures, leading to issues that are often difficult to diagnose. This section provides the necessary steps to ensure the underlying infrastructure is correctly prepared for the social login integrations.

### 1.1. Initializing the Supabase Client for a Static Website

For a pure static website built with HTML, CSS, and vanilla JavaScript, the standard `@supabase/supabase-js` client library is all that is required to interact with Supabase services.[8] Server-side rendering (SSR) specific libraries, such as `@supabase/ssr`, are designed for frameworks like Next.js or SvelteKit and are not necessary for this client-only architecture.[9, 10, 11]

The client is initialized with the project's unique URL and its public `anon` key. These credentials can be found in the Supabase project dashboard under `Project Settings > API`.[9, 12, 13]

A recommended practice is to create a dedicated JavaScript file to manage the Supabase client instance, which can then be imported or included across the application.

\*\*Example `public/js/supabaseClient.js`:\*\*javascript
// public/js/supabaseClient.js

// It is crucial to understand that these values are publicly visible in the browser.
// Supabase is designed for this, with security managed by Row Level Security (RLS).
// Ensure RLS is enabled on your tables for any sensitive data.
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase Anon Key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose the client for use in other scripts, for example by attaching it to the window object.
// In a more complex application, you might use ES modules.
window.supabase = supabase;

````

This file can then be included in the main HTML document before any other application scripts that need to access Supabase.

**Example `index.html` inclusion:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Supabase App</title>
    <script src="[https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2](https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2)"></script>
</head>
<body>
    <script src="/js/supabaseClient.js"></script>
    <script src="/js/app.js"></script>
</body>
</html>
````

This setup provides a clean and reusable way to access the Supabase client throughout the static application.[14]

### 1.2. Mastering Environment Variables on Cloudflare Pages

Cloudflare Pages provides a robust system for managing environment variables for both build-time and runtime processes. These are configured in the project's dashboard under `Settings > Environment variables`.[15, 16] However, a pure static website, by its nature, has no server-side runtime to inject these variables into the client-side code. The browser-run JavaScript cannot directly access variables set in the Cloudflare dashboard.

For this architecture, where only publicly safe keys like the Supabase `anon` key are needed on the client, the most straightforward approach is to place these values directly into the client-side JavaScript, as demonstrated in the previous section. It is imperative to reiterate that only non-secret, public keys should ever be exposed in client-side code. Supabase's security model accounts for this by relying on Row Level Security (RLS) policies on the database to protect data, rather than on the secrecy of the `anon` key.[3, 5, 12]

For more advanced use cases or stricter policies against hardcoding credentials, an alternative pattern involves using a Cloudflare Function (previously known as a Worker). A simple function can be deployed alongside the static site to serve a configuration endpoint (e.g., `/api/config`) that returns the public environment variables. The client-side JavaScript would then fetch from this endpoint to retrieve the keys upon initialization. This approach centralizes key management in the Cloudflare dashboard while still making them available to the static frontend.[5, 12, 17] For the purposes of this guide, the direct inclusion method will be used for simplicity.

### 1.3. Aligning Supabase Auth URLs and CORS for Cloudflare Deployments

This is the most critical and often overlooked step when deploying a Supabase-authenticated application to a platform like Cloudflare Pages. A mismatch between the URLs configured in Supabase and the actual URLs used by the deployment will cause authentication flows to fail silently or with cryptic errors.

The primary challenge arises from Cloudflare Pages' automatic generation of unique URLs for preview deployments. When a developer pushes code to a new git branch, Cloudflare creates a preview environment at a URL like `https://<branch-name>.<project-name>.pages.dev`. If Supabase Auth is only configured with the production domain, any attempt to log in from these preview environments will be rejected as an unauthorized redirect.

To solve this, Supabase's authentication settings must be configured to accept URLs from local development, production, and any potential Cloudflare preview environments.

**Step-by-Step URL Configuration:**

1.  **Set the Main Site URL:** In the Supabase dashboard, navigate to `Authentication > URL Configuration`. Set the `Site URL` to the primary, canonical production domain of the website (e.g., `https://www.yourdomain.com`).[6] This URL is used as the default for email templates and other communications.

2.  **Add Additional Redirect URLs:** This is the key to supporting multiple environments. In the `Additional Redirect URLs` field, add patterns that match all valid deployment targets. Supabase supports wildcards for this purpose.[18] Add the following entries, replacing `<your-project-name>` with the name of the Cloudflare Pages project:
    - `http://localhost:3000/**` (Adjust the port if the local development server uses a different one).
    - `https://*.<your-project-name>.pages.dev/**` (This wildcard pattern will match all Cloudflare preview and branch deployments).
    - `https://<your-project-name>.pages.dev/**` (This covers the main project URL on Cloudflare).

3.  **Configure CORS:** Cross-Origin Resource Sharing (CORS) is a browser security feature that restricts how web pages can request resources from a different domain. The Supabase API will reject requests from unknown origins. To allow the static website to communicate with the Supabase backend, the application's domains must be added to the CORS allow list.
    - In the Supabase dashboard, navigate to `Project Settings > API`.
    - In the `CORS Configuration` section, add the same set of URLs used for redirects: `http://localhost:3000`, `https://www.yourdomain.com`, and `*.pages.dev`.[19]

By completing this foundational setup, the application is correctly configured to handle authentication requests from any development, preview, or production environment, preventing a common class of deployment-specific errors.

## Section 2: Implementing Google One Tap with Supabase Auth

Integrating Google One Tap provides a seamless, low-friction authentication experience. The implementation leverages Google's Identity Services (GIS) library on the client side to obtain a secure ID Token. This token is then passed to Supabase for verification, which creates a user session without requiring traditional page redirects. This entire section is predicated on this ID Token flow, which necessitates a specific configuration in both the Google Cloud Platform and the Supabase dashboard that differs significantly from the standard OAuth redirect flow.

### 2.1. Google Cloud Platform: OAuth Credential Configuration

The first step is to register the application with Google and obtain the necessary credentials. This is done within the Google Cloud Platform (GCP) console.

1.  **Create or Select a GCP Project:** Navigate to the [Google Cloud Console](https://console.cloud.google.com/). Create a new project or select an existing one to house the authentication configuration.

2.  **Configure the OAuth Consent Screen:** Before creating credentials, the consent screen must be configured. This is what users see when asked to grant permissions to the application.
    - Go to `APIs & Services > OAuth consent screen`.
    - Select `External` for the User Type and click `Create`.
    - Fill in the required branding information, such as `App name`, `User support email`, and developer contact information. It is highly recommended to provide links to the application's `Privacy Policy` and `Terms of Service` to build user trust.[7]
    - On the `Scopes` page, no additional scopes need to be added for basic authentication. The default `email`, `profile`, and `openid` scopes are sufficient.
    - Save and continue through the remaining steps.

3.  **Create an OAuth 2.0 Client ID:** This is the credential the frontend application will use to identify itself to Google.
    - Navigate to `APIs & Services > Credentials`.
    - Click `+ CREATE CREDENTIALS` and select `OAuth client ID`.
    - For `Application type`, select `Web application`.[9, 20]
    - Give the client ID a descriptive name (e.g., "Web App Client").
    - **Authorized JavaScript origins:** This is a critical step for the ID Token flow. This field must contain the exact origins from which the application will be served. Add the URLs for local, production, and Cloudflare preview environments [7]:
      - `http://localhost:3000` (or your local development port)
      - `https://www.yourdomain.com` (your production domain)
      - `https://<your-project-name>.pages.dev` (the main Cloudflare Pages domain)
    - **Authorized redirect URIs:** While not strictly used for the One Tap callback itself, it is good practice to also add the application's base URLs here. For this flow, the Supabase callback URL (`https://<project-id>.supabase.co/auth/v1/callback`) is **not** required in this section.[7]
    - Click `Create`. A dialog will appear with the `Client ID` and `Client Secret`. For this client-side implementation, only the **Client ID** is needed. The Client Secret is not used and can be ignored.[7]

### 2.2. Supabase Dashboard: Enabling the Google Provider for ID Token Flow

With the Google Client ID obtained, the next step is to configure Supabase to recognize and validate ID tokens generated by it.

1.  **Navigate to the Google Provider Settings:** In the Supabase dashboard, go to `Authentication > Providers` and select `Google`.

2.  **Enable the Provider:** Toggle the `Enable Sign in with Google` switch to the on position.

3.  **Skip Client ID and Secret:** For the ID Token flow, the `Client ID` and `Client Secret` fields at the top of the configuration page should be left blank. These are intended for the server-side OAuth redirect flow.

4.  **Add Authorized Client ID:** This is the most important step in this section. Scroll down to the `Authorized Client IDs` list. Click `Add client ID` and paste the **Client ID** obtained from the Google Cloud Console in the previous step.[7] This action explicitly tells Supabase's authentication server that it should trust and attempt to validate ID tokens that were issued for this specific Google client.

By following this specific configuration, Supabase is now prepared to handle authentication requests initiated by the client-side Google Identity Services library.

### 2.3. Client-Side Integration: Bringing Google One Tap to Life

The final step is to integrate the Google Identity Services (GIS) library into the static website's HTML and JavaScript.

**HTML (`index.html`):**

The GIS library is loaded via a script tag. The One Tap prompt and the personalized Sign In button are rendered by adding specific `<div>` elements to the page, configured with `data-` attributes.[7]

```html
<body>
  <div id="auth-container">
    <div
      id="g_id_onload"
      data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
      data-callback="handleSignInWithGoogle"
      data-auto_select="true"
      data-context="signin"
    ></div>

    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>

  <div id="user-container" style="display:none;">
    <p>Welcome, <span id="user-email"></span>!</p>
    <button id="logout-button">Sign Out</button>
  </div>

  <script src="[https://accounts.google.com/gsi/client](https://accounts.google.com/gsi/client)" async></script>

  <script src="/js/supabaseClient.js"></script>
  <script src="/js/app.js"></script>
</body>
```

**JavaScript (`public/js/app.js`):**

A global callback function must be defined to handle the response from Google. This function receives the ID Token and passes it to Supabase.

```javascript
// public/js/app.js

/**
 * This function is called by the Google Identity Services library after a
 * successful sign-in.
 * @param {object} response - The credential response object from Google.
 */
async function handleSignInWithGoogle(response) {
  console.log('Received Google credential:', response);

  const { data, error } = await window.supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  });

  if (error) {
    console.error('Error signing in with Google ID token:', error);
    alert('Authentication failed. Please try again.');
  } else {
    console.log('Successfully signed in with Supabase:', data);
    // The onAuthStateChange listener will handle the UI update.
  }
}
```

With this code in place, when a user visits the page, the One Tap prompt will appear. If they proceed, or if they click the fallback button, the `handleSignInWithGoogle` function will be invoked, completing the authentication flow with Supabase.[2, 7]

### 2.4. Security Deep Dive: A Practical Guide to Nonce Verification

While the basic integration works, a production-grade implementation must include nonce verification to prevent replay attacks. A replay attack occurs when an attacker intercepts a user's ID Token and "replays" it to the application's backend to gain unauthorized access. A nonce (number used once) is a unique, randomly generated string for each sign-in attempt that mitigates this threat.

The flow is as follows:

1.  The client application generates a random string (the raw nonce).
2.  The client includes this nonce in the request to the identity provider (Google).
3.  The identity provider embeds the nonce within the signed ID Token it returns.
4.  The client sends this ID Token to the backend (Supabase), along with the original raw nonce.
5.  The backend verifies the token's signature and confirms that the nonce inside the token matches the one it received from the client for this specific attempt.

Supabase introduces a specific requirement to this flow: the nonce value provided to the Google library must be a SHA-256 hash of the raw nonce. Supabase then performs the same hashing on the raw nonce it receives to validate against the value in the token.[7]

**Implementing Nonce Verification:**

First, a helper function to perform SHA-256 hashing is needed. The browser's built-in Web Crypto API is the standard way to achieve this.

**SHA-256 Helper (`public/js/crypto.js`):**

```javascript
// public/js/crypto.js

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

window.sha256 = sha256;
```

**Updated HTML and JavaScript:**

The nonce must be generated and stored before the Google library renders its UI, and then used in the callback.

**HTML (`index.html` - modified `div`):**

```html
<head>
  <script src="/js/crypto.js"></script>
</head>
<body>
  <div
    id="g_id_onload"
    data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
    data-callback="handleSignInWithGoogle"
    data-auto_select="true"
    data-context="signin"
    data-nonce=""
  ></div>
</body>
```

**JavaScript (`public/js/app.js` - updated logic):**

```javascript
// public/js/app.js

// Store the raw nonce globally or in a module scope to access it in the callback.
let rawNonce = null;

/**
 * Initializes the Google Sign-In with a dynamically generated nonce.
 */
async function initializeGoogleSignIn() {
  // Generate a secure random string for the nonce
  rawNonce = crypto.randomUUID();

  const hashedNonce = await window.sha256(rawNonce);

  const googleOnloadDiv = document.getElementById('g_id_onload');
  if (googleOnloadDiv) {
    googleOnloadDiv.setAttribute('data-nonce', hashedNonce);
  }

  // The Google library will automatically read the new data-nonce attribute.
}

/**
 * This function is called by the Google Identity Services library after a
 * successful sign-in.
 * @param {object} response - The credential response object from Google.
 */
async function handleSignInWithGoogle(response) {
  if (!rawNonce) {
    console.error('Nonce not available for validation.');
    alert('A security error occurred. Please refresh and try again.');
    return;
  }

  const { data, error } = await window.supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
    nonce: rawNonce, // Provide the ORIGINAL raw nonce to Supabase
  });

  if (error) {
    console.error('Error signing in with Google ID token:', error);
    // Check for specific nonce error
    if (error.message.includes('nonce')) {
      alert('Authentication failed due to a security check. Please try again.');
    } else {
      alert('Authentication failed. Please try again.');
    }
  } else {
    console.log('Successfully signed in with Supabase:', data);
  }

  // Reset the nonce for the next sign-in attempt
  rawNonce = null;
  initializeGoogleSignIn(); // Re-initialize for next potential login
}

// Initialize the process when the script loads
document.addEventListener('DOMContentLoaded', initializeGoogleSignIn);
```

This implementation correctly follows the secure nonce verification flow required by Supabase, providing robust protection against replay attacks.

## Section 3: Implementing Sign In with Apple with Supabase Auth

Similar to the Google integration, implementing Sign In with Apple for a web application is best achieved using a client-side JavaScript library to obtain an ID Token, which is then passed to Supabase. This approach, using Apple's official Sign in with Apple JS framework, provides a native-feel experience without full-page redirects.[8] The configuration process involves several precise steps within the Apple Developer Portal and the Supabase dashboard.

### 3.1. Navigating the Apple Developer Portal: App ID and Services ID Setup

The Apple Developer Portal is notoriously complex, and correct configuration is essential for the integration to function. The process requires creating two primary identifiers: an App ID and a Services ID.

1.  **Create an App ID:** An App ID serves as a general identifier for the application across Apple's ecosystem.
    - Log in to the([https://developer.apple.com/](https://developer.apple.com/)) and navigate to `Certificates, IDs & Profiles > Identifiers`.
    - Click the `+` button to register a new identifier.
    - Select `App IDs` and click `Continue`.
    - Choose the `App` type and click `Continue`.
    - Provide a `Description` (e.g., "My Web App") and a `Bundle ID`. The Bundle ID should be in reverse-domain name format (e.g., `com.yourdomain.app`).
    - Scroll down to the list of `Capabilities` and check the box for `Sign in with Apple`.
    - Click `Continue` and then `Register` to finalize the App ID creation.[8]

2.  **Create a Services ID:** The Services ID is the specific identifier for the web-based implementation of Sign in with Apple. This ID will be used as the `Client ID` in the frontend code.
    - In the `Identifiers` section, click the `+` button again.
    - Select `Services IDs` and click `Continue`.
    - Provide a `Description` (e.g., "My Web App - Web Service") and an `Identifier`. This should also be in reverse-domain format and is often related to the App ID (e.g., `com.yourdomain.webapp`). Make a note of this identifier, as it is the `Client ID`.
    - Ensure the `Sign in with Apple` capability is enabled for this Services ID by clicking `Configure`.
    - **Configure Web Domain and Return URLs:** This is a critical step.
      - In the `Domains and Subdomains` field, enter the domains where the website will be hosted. This must include the production domain and the Cloudflare Pages domain: `www.yourdomain.com`, `yourdomain.com`, `pages.dev`.
      - In the `Return URLs` field, enter the full URL of the page on the website that will handle the authentication. Even though the client-side flow handles the response, Apple requires a registered return URL. This should be a page on the live site, for example, `https://www.yourdomain.com/auth/callback`.
    - Click `Continue` and `Register` to create the Services ID.[8]

3.  **Private Key (Note):** The portal also allows for the creation of private keys for signing server-to-server requests.[8] For the client-side Sign in with Apple JS flow described here, generating and using a private key is **not** necessary, which significantly simplifies the setup.

### 3.2. Supabase Dashboard: Configuring the Apple Provider for Client-Side Sign-In

The configuration within Supabase is analogous to the Google ID Token setup. The goal is to authorize Supabase to validate tokens issued by the newly created Apple Services ID.

1.  **Navigate to the Apple Provider Settings:** In the Supabase dashboard, go to `Authentication > Providers` and select `Apple`.

2.  **Enable the Provider:** Toggle the `Enable Sign in with Apple` switch to the on position.

3.  **Skip OAuth Configuration Fields:** Leave the main configuration fields (`Team ID`, `Key ID`, `Client ID`, `Private Key`) blank. These are required only for the server-side OAuth redirect flow, which is not being used in this guide.[8]

4.  **Add Authorized Client ID:** Scroll to the bottom of the page to the `Authorized Client IDs` list. This is the crucial step for the ID Token flow.
    - Click `Add client ID`.
    - Paste the **Services ID** identifier created in the Apple Developer Portal (e.g., `com.yourdomain.webapp`) into this field.[8]

With this configuration, Supabase is now set up to securely validate ID tokens originating from the web application's Sign in with Apple integration.

### 3.3. Client-Side Integration: The Sign in with Apple JS Workflow

The final piece is to add the necessary HTML and JavaScript to the static site to render the Apple sign-in button and handle the authentication callback.

**HTML (`index.html`):**

Apple's JavaScript library is loaded via a script tag. A specific `<div>` element is used to render the official "Sign in with Apple" button.

```html
<head>
  <script
    type="text/javascript"
    src="[https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js](https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js)"
  ></script>
</head>
<body>
  <div id="auth-container">
    <div id="appleid-signin" data-color="black" data-border="true" data-type="sign-in"></div>
  </div>
</body>
```

**JavaScript (`public/js/app.js`):**

The JavaScript code must first initialize the Apple library with the Services ID. Then, an event listener is attached to the button to trigger the sign-in process. The successful response contains the `id_token` needed for Supabase.

```javascript
// public/js/app.js

/**
 * Initializes the Sign in with Apple JS library and sets up the sign-in handler.
 */
function initializeAppleSignIn() {
  try {
    AppleID.auth.init({
      clientId: 'com.yourdomain.webapp', // Your Services ID from Apple Developer Portal
      scope: 'name email', // Request user's name and email
      redirectURI: '[https://www.yourdomain.com/auth/callback](https://www.yourdomain.com/auth/callback)', // Your registered Return URL
      usePopup: true, // Use a popup for the sign-in flow for better UX
    });
  } catch (error) {
    console.error('Error initializing Apple Sign In:', error);
  }

  // Add an event listener for successful sign-in
  document.addEventListener('AppleIDSignInOnSuccess', async (event) => {
    const { authorization } = event.detail;
    const { id_token, user } = authorization;

    if (!id_token) {
      console.error('Apple Sign In Success: No ID token received.');
      alert('Authentication with Apple failed. Please try again.');
      return;
    }

    console.log('Received Apple ID token.');

    const { data, error: supabaseError } = await window.supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: id_token,
    });

    if (supabaseError) {
      console.error('Error signing in with Apple ID token:', supabaseError);
      alert('Authentication failed. Please try again.');
    } else {
      console.log('Successfully signed in with Supabase via Apple:', data);
      // The onAuthStateChange listener will handle the UI update.
    }
  });

  // Add an event listener for sign-in failures
  document.addEventListener('AppleIDSignInOnFailure', (event) => {
    console.error('Apple Sign In Failure:', event.detail.error);
    alert('Could not sign in with Apple. Please try again.');
  });
}

// Initialize Apple Sign In when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeAppleSignIn);
```

This implementation provides a complete, client-side authentication flow for Sign In with Apple. The use of `usePopup: true` is recommended for single-page applications as it avoids a full-page redirect, creating a smoother user experience that aligns well with the behavior of Google One Tap.[8]

## Section 4: Unifying the User Experience: Dynamic Session Management

With the provider-specific integrations in place, the final and most crucial step is to create a unified and reactive user experience on the static website. In a traditional server-rendered application, authentication state is often checked by middleware on every request. On a static site, there is no server middleware. Instead, client-side JavaScript must listen for authentication events and dynamically update the user interface accordingly. The `supabase.auth.onAuthStateChange` method is the cornerstone of this process, acting as a centralized event listener for all session-related activities.

### 4.1. The Application's Auth Heartbeat: Leveraging `onAuthStateChange`

The `onAuthStateChange` function subscribes to all significant authentication events within the Supabase client. It fires not only when a user actively signs in or out but also on initial page load and when the session is refreshed in the background. This makes it the ideal mechanism for managing UI state in a reliable and consistent manner.[14, 21]

The listener's callback function receives two arguments: `event` and `session`.

- `event`: A string indicating the type of authentication event that occurred.
- `session`: The user session object if a user is authenticated, or `null` if they are not.

The key events for managing UI state are [14]:

- `INITIAL_SESSION`: Fired once when the client is initialized and attempts to load a session from storage (e.g., `localStorage`). This is essential for determining the user's state when they first land on the page or refresh it.
- `SIGNED_IN`: Fired whenever a user successfully authenticates, either through a login action or when a session is re-established (e.g., when a tab is refocused).
- `SIGNED_OUT`: Fired when a user's session is terminated, either by an explicit call to `signOut()` or due to session expiration.

By implementing a single listener, the application can react to all these state changes from one central location.

### 4.2. Practical UI State Management for a Static Site

A practical implementation involves creating distinct UI containers for authenticated and unauthenticated states and toggling their visibility based on the session object provided by `onAuthStateChange`.

**HTML Structure (`index.html`):**

```html
<body>
  <h1>My Awesome App</h1>

  <div id="auth-container">
    <p>Please sign in to continue.</p>
    <div class="g_id_signin" data-type="standard"></div>
    <div id="appleid-signin" data-color="black" data-border="true" data-type="sign-in"></div>
  </div>

  <div id="user-container" style="display:none;">
    <p>Welcome, <strong id="user-email"></strong>!</p>
    <button id="logout-button">Sign Out</button>
  </div>
</body>
```

**JavaScript Logic (`public/js/app.js`):**

The `app.js` file will house the `onAuthStateChange` listener and the logic to manipulate the DOM.

```javascript
// public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('auth-container');
  const userContainer = document.getElementById('user-container');
  const userEmailSpan = document.getElementById('user-email');
  const logoutButton = document.getElementById('logout-button');

  // Set up the onAuthStateChange listener
  window.supabase.auth.onAuthStateChange((event, session) => {
    console.log(`Auth event: ${event}`, session);

    if (session && session.user) {
      // User is signed in
      authContainer.style.display = 'none';
      userContainer.style.display = 'block';
      userEmailSpan.textContent = session.user.email;
    } else {
      // User is signed out
      authContainer.style.display = 'block';
      userContainer.style.display = 'none';
      userEmailSpan.textContent = '';
    }
  });

  // Add event listener for the logout button
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      const { error } = await window.supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('User signed out.');
        // The onAuthStateChange listener will automatically handle the UI update
      }
    });
  }

  // Initialize Google and Apple Sign-In functions (as defined in previous sections)
  initializeGoogleSignIn();
  initializeAppleSignIn();
});
```

This code creates a complete, closed-loop system. When the page loads, `INITIAL_SESSION` fires, setting the correct UI state. When a user signs in via Google or Apple, `SIGNED_IN` fires, updating the UI to the authenticated view. When the user clicks the logout button, `signOut()` is called, which triggers the `SIGNED_OUT` event, and the listener reverts the UI to the unauthenticated state. This pattern provides a robust and reactive experience on a purely static site.[22, 23]

### 4.3. Advanced `onAuthStateChange`: Best Practices and Pitfall Avoidance

While powerful, the `onAuthStateChange` callback must be used with care, as some events can fire frequently, especially with multiple tabs open. The following best practices are critical to avoid performance issues and potential deadlocks [14]:

1.  **Keep Callbacks Lightweight:** The callback function should be as fast and efficient as possible. Its primary responsibility should be to update the UI state. Defer or debounce any heavy computations or network requests to be performed outside the callback.

2.  **Avoid `async` Callbacks and `await`:** It is strongly recommended to avoid making the callback function `async`. The callback runs synchronously during the processing of the state change. Using `await` on another Supabase function call from within the callback can easily create a deadlock, where the client library is waiting for a response while also being blocked by the callback it is trying to execute.

3.  **Safe Pattern for Subsequent Supabase Calls:** If it is absolutely necessary to call another Supabase function in response to an auth event (e.g., fetching profile data from a database table after sign-in), do not call it directly from the callback. Instead, use a `setTimeout` with a delay of 0. This dispatches the function to run immediately after the current execution stack has cleared, safely breaking the synchronous chain and preventing deadlocks.

**Example of the safe pattern:**

```javascript
window.supabase.auth.onAuthStateChange((event, session) => {
  // Update UI synchronously and quickly
  updateUI(session);

  if (event === 'SIGNED_IN') {
    // If we need to fetch more data, do it outside the direct callback flow
    setTimeout(async () => {
      if (session && session.user) {
        // Now it's safe to await another Supabase function
        const { data: profile, error } = await window.supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          updateProfileUI(profile.username);
        }
      }
    }, 0);
  }
});
```

Adhering to these best practices ensures that the application remains responsive, stable, and free of hard-to-debug race conditions and deadlocks.

## Section 5: Production Readiness: Advanced Topics and Troubleshooting

Moving from a working implementation to a production-ready application requires attention to additional details, including user identity management, environment-specific configurations, and a clear strategy for debugging common issues. This section covers these final considerations to ensure a robust and maintainable authentication system.

### 5.1. Understanding Automatic Identity Linking

Supabase Auth includes a powerful feature called automatic identity linking. When a user signs in with a new OAuth provider, Supabase checks if an existing user account already has the same verified email address. If a match is found, the new provider identity is automatically linked to the existing user account instead of creating a new, separate user.[24]

For example, if a user first signs up with Google using the email `jane.doe@example.com`, an entry is created in the `auth.users` table. If that same user later returns to the application and uses Sign In with Apple, and Apple provides the same verified email `jane.doe@example.com`, Supabase will not create a second user. Instead, it will add the Apple identity to the original user's record.

This behavior provides a significant user experience benefit: users do not need to remember which social provider they originally used to sign up. They can use any enabled provider associated with their email address and always access the same account, preventing accidental creation of duplicate accounts and the confusion that follows.[24] This feature works out-of-the-box and requires no additional configuration.

### 5.2. Local Development vs. Production Environments

A common source of deployment failure is the discrepancy in configuration between local, preview, and production environments. The following table consolidates the critical URL settings that must be correctly configured across all platforms to ensure seamless operation.

| Configuration Item                              | Local (`http://localhost:3000`)                  | Cloudflare Preview (`https://*.<proj>.pages.dev`) | Cloudflare Production (`https://yourdomain.com`) |
| :---------------------------------------------- | :----------------------------------------------- | :------------------------------------------------ | :----------------------------------------------- |
| **Google Cloud: Authorized JavaScript origins** | `http://localhost:3000`                          | `https://<your-project-name>.pages.dev`           | `https://www.yourdomain.com`                     |
| **Apple Developer: Domains and Subdomains**     | `localhost`                                      | `pages.dev`                                       | `yourdomain.com`, `www.yourdomain.com`           |
| **Supabase: Site URL**                          | `https://www.yourdomain.com` (Set to production) | `https://www.yourdomain.com` (Set to production)  | `https://www.yourdomain.com` (Set to production) |
| **Supabase: Additional Redirect URLs**          | `http://localhost:3000/**`                       | `https://*.<your-project-name>.pages.dev/**`      | (Production URL is covered by Site URL)          |
| **Supabase: CORS Configuration**                | `http://localhost:3000`                          | `*.pages.dev`                                     | `https://www.yourdomain.com`                     |

This checklist serves as a vital tool for verifying that all interdependent services are correctly configured for every environment the application will run in, from a developer's local machine to the final production deployment.

### 5.3. Common Errors and Debugging Playbook

When integrating multiple complex systems, errors are inevitable. This playbook provides a first line of defense for diagnosing and resolving the most common issues encountered during the implementation of Supabase Auth with Google and Apple on Cloudflare.

| Error Message / Symptom                                                          | Likely Cause(s)                                                                                                                                                                                     | Resolution Steps                                                                                                                                                                                                                                                                                                                                                               |
| :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google `redirect_uri_mismatch` or `origin_mismatch`**                          | The URL of the web application (e.g., `localhost`, preview URL) is not listed in the "Authorized JavaScript origins" within the Google Cloud Console OAuth Client ID settings.                      | **1.** Go to the Google Cloud Console \> `APIs & Services` \> `Credentials`. **2.** Edit the relevant OAuth 2.0 Client ID. **3.** Under `Authorized JavaScript origins`, ensure the exact URL from the browser's address bar is present. **4.** Refer to Section 2.1 for a complete list of required origins.                                                                  |
| **Apple `invalid_client` error during sign-in**                                  | The `clientId` provided in the `AppleID.auth.init` call does not exactly match the Services ID registered in the Apple Developer Portal and/or is not listed in Supabase's `Authorized Client IDs`. | **1.** Verify the Services ID (e.g., `com.yourdomain.webapp`) in the Apple Developer Portal. **2.** Ensure this exact string is used for the `clientId` in the JavaScript initialization. **3.** In the Supabase dashboard (`Authentication > Providers > Apple`), confirm this same Services ID is in the `Authorized Client IDs` list. **4.** Refer to Sections 3.1 and 3.2. |
| **Browser Console: CORS errors (e.g., `...has been blocked by CORS policy...`)** | The domain the website is running on has not been added to the Supabase project's CORS allow list.                                                                                                  | **1.** In the Supabase dashboard, navigate to `Project Settings > API`. \*\*2. \*\* In the `CORS Configuration` section, add the origin from which the request is being made (e.g., `http://localhost:3000`, `https://branch.project.pages.dev`). **3.** Refer to Section 1.3 for wildcard configurations.                                                                     |
| **Supabase error: `AuthApiError: Nonce is invalid`**                             | The nonce verification flow is incorrect. This is typically caused by passing the wrong nonce value to Supabase or by a mismatch in hashing.                                                        | **1.** Confirm that the `data-nonce` attribute on the Google sign-in element is set to the **SHA-256 hash** of the raw nonce. **2.** Verify that the `nonce` parameter in the `supabase.auth.signInWithIdToken` call is the **original, un-hashed raw nonce**. **3.** Refer to the detailed implementation in Section 2.4.                                                     |
| **Login appears to work, but user is immediately logged out**                    | Supabase successfully validates the ID token but rejects the session creation because the token's `aud` (audience) claim, which is the provider's Client ID, is not in the authorized list.         | **1.** This is a classic symptom of a misconfigured `Authorized Client IDs` list in Supabase. **2.** For Google, go to `Authentication > Providers > Google` and ensure the Google Cloud Client ID is in the list. **3.** For Apple, go to `Authentication > Providers > Apple` and ensure the Apple Services ID is in the list. **4.** Refer to Sections 2.2 and 3.2.         |
| **Authentication works locally but fails on Cloudflare preview deployments**     | The wildcard URL for Cloudflare preview deployments is missing from the Supabase redirect URL allow list and/or the provider's authorized domain/origin list.                                       | **1.** This is an environment configuration issue. Systematically check every configuration point using the table in Section 5.2. **2.** Pay special attention to adding `https://*.<your-project-name>.pages.dev/**` to Supabase's `Additional Redirect URLs` and the corresponding origins to Google and Apple's settings. **3.** Refer to Section 1.3.                      |

## Conclusion: A Robust and Secure Authentication System

This report has provided a comprehensive, end-to-end guide for implementing Google One Tap and Sign In with Apple on a modern, serverless web stack. By leveraging the power of Supabase Auth and the global reach of Cloudflare Pages, developers can create a highly performant, scalable, and secure application with a world-class user onboarding experience.

The key technical achievement of this integration lies in the successful implementation of the client-side ID Token authentication flow. This modern architectural pattern offers a superior user experience by eliminating disruptive page redirects and provides a flexible foundation for rich, interactive web applications. The detailed walkthroughs of the Google Cloud and Apple Developer portals, combined with the precise Supabase configurations, demystify what are often opaque and challenging processes. Furthermore, the emphasis on security best practices, particularly the meticulous implementation of nonce verification for Google Sign-In, ensures that the resulting system is not only user-friendly but also resilient against common threats like replay attacks.

By following the foundational setup, provider-specific integrations, and production-readiness checks detailed in this guide, developers are equipped to build a robust authentication system that meets the highest standards of the modern web. The final result is a seamless, secure, and user-centric authentication solution that enhances user trust and drives application adoption.
