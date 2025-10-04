// Debug script to check authentication state
// Run this in browser console on http://localhost:4321/

console.log('🔍 Authentication Debug Report');
console.log('==============================');

// 1. Check environment variables
console.log('1. Environment Variables:');
console.log('PUBLIC_GOOGLE_CLIENT_ID:', import.meta.env?.PUBLIC_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('PUBLIC_SUPABASE_URL:', import.meta.env?.PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('PUBLIC_SUPABASE_ANON_KEY:', import.meta.env?.PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

// 2. Check DOM elements
console.log('\n2. DOM Elements:');
const authContainers = document.querySelectorAll('[id^="auth-container-"]');
console.log('Auth containers found:', authContainers.length);

const googleContainers = document.querySelectorAll('[id^="google-signin-"]');
console.log('Google sign-in containers found:', googleContainers.length);

const loginSections = document.querySelectorAll('[id^="auth-login-"]');
console.log('Auth login sections found:', loginSections.length);

const loadingSections = document.querySelectorAll('[id^="auth-loading-"]');
console.log('Auth loading sections found:', loadingSections.length);

// 3. Check visibility
console.log('\n3. Visibility Status:');
loginSections.forEach((section, index) => {
  console.log(`Login section ${index + 1}:`, section.classList.contains('hidden') ? '❌ Hidden' : '✅ Visible');
});

loadingSections.forEach((section, index) => {
  console.log(`Loading section ${index + 1}:`, section.classList.contains('hidden') ? '❌ Hidden' : '✅ Visible');
});

// 4. Check Google API
console.log('\n4. Google API Status:');
console.log('window.google:', typeof window.google !== 'undefined' ? '✅ Available' : '❌ Not available');
console.log('window.google.accounts:', window.google?.accounts ? '✅ Available' : '❌ Not available');
console.log('window.google.accounts.id:', window.google?.accounts?.id ? '✅ Available' : '❌ Not available');

// 5. Check for errors
console.log('\n5. Error Checking:');
const errorSections = document.querySelectorAll('[id^="auth-error-"]');
console.log('Error sections found:', errorSections.length);
errorSections.forEach((section, index) => {
  const isVisible = !section.classList.contains('hidden');
  console.log(`Error section ${index + 1}:`, isVisible ? '❌ Visible Error' : '✅ No Error');
  if (isVisible) {
    const errorText = section.querySelector('p');
    if (errorText) {
      console.log(`Error message:`, errorText.textContent);
    }
  }
});

// 6. Check authentication config
console.log('\n6. Authentication Config:');
fetch('/src/lib/config.ts')
  .then((response) => response.text())
  .then((code) => {
    const hasGoogleAuth = code.includes('google_one_tap') && code.includes('enabled: true');
    const hasAppleAuth = code.includes('apple_sign_in') && code.includes('enabled: true');
    console.log('Google One Tap enabled:', hasGoogleAuth ? '✅ Yes' : '❌ No');
    console.log('Apple Sign In enabled:', hasAppleAuth ? '✅ Yes' : '❌ No');
  })
  .catch((error) => {
    console.log('❌ Error loading config:', error.message);
  });

// 7. Manual trigger check
console.log('\n7. Manual Trigger Test:');
if (typeof window.initializeAuth === 'function') {
  console.log('✅ initializeAuth function available');
} else {
  console.log('❌ initializeAuth function not available');
}

if (typeof window.googleOneTapCleanup === 'function') {
  console.log('✅ googleOneTapCleanup function available');
} else {
  console.log('❌ googleOneTapCleanup function not available');
}

console.log('\n🏁 Debug Complete');
