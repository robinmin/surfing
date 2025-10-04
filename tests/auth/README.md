# Authentication Test Suite

Comprehensive unit tests for the authentication system, focusing on token validation logic and Google One Tap integration.

## Test Coverage

### Token Guardian Tests (`token-guardian.test.mjs`)

Tests the token caching mechanism to ensure reliability and correctness:

1. **Cache Hit Within Duration** - Validates that cache is valid immediately after update
2. **Cache Miss After Expiration** - Ensures cache invalidates after configured duration (900 seconds)
3. **Token Cache Update** - Verifies cache updates with correct timestamp and user data
4. **Cache Clearing** - Tests cache cleanup on sign out
5. **Cache Time Remaining** - Validates time remaining calculation accuracy
6. **Invalid Cache Data** - Ensures graceful handling of corrupted cache data
7. **localStorage Disabled** - Tests fallback behavior when localStorage is unavailable

### Google One Tap Tests (`google-one-tap.test.mjs`)

Tests Google One Tap authentication flow and token validation:

1. **JWT Token Decoding** - Validates proper decoding of Google ID tokens
2. **Token Expiration** - Tests expiration detection for past, present, and future timestamps
3. **Audience Validation** - Ensures tokens are validated against correct client ID
4. **Issuer Validation** - Verifies tokens are issued by Google's auth servers
5. **Email Verification** - Checks email_verified flag in token payload
6. **Nonce Handling** - Tests nonce generation, storage, and one-time use
7. **Rate Limiting** - Validates rate limiting after multiple failed attempts

## Running Tests

### Run All Tests

```bash
cd tests/auth
node run-tests.mjs
```

### Run Individual Tests

```bash
# Token Guardian tests
node token-guardian.test.mjs

# Google One Tap tests
node google-one-tap.test.mjs
```

## Test Structure

```
tests/auth/
├── README.md                      # This file
├── run-tests.mjs                  # Test runner for all auth tests
├── test-utils.mjs                 # Shared test utilities
├── token-guardian.test.mjs        # Token caching tests
└── google-one-tap.test.mjs        # Google authentication tests
```

## Mocking Strategy

Tests use lightweight mocking without external dependencies:

- **localStorage**: Custom `MockLocalStorage` class for cache testing
- **sessionStorage**: Custom `MockSessionStorage` class for nonce testing
- **Supabase Client**: Mock client in `test-utils.mjs`
- **JWT Tokens**: Mock token generator for testing token validation

## Future Test Additions

The following tests can be added in future iterations:

1. **UI State Transitions** - Testing avatar component state changes
2. **Cross-Tab Synchronization** - Testing BroadcastChannel and storage events
3. **Error Handling** - Network failures, service outages
4. **Cross-Browser Compatibility** - Browser-specific behavior testing
5. **Performance Testing** - Cache hit rates, memory usage
6. **Security Testing** - CSRF protection, nonce replay prevention
7. **Apple Sign In** - Similar test suite for Apple authentication

## Configuration

Tests use the default token cache duration of 900 seconds (15 minutes) as configured in `src/config.yaml`.

## Dependencies

Tests are designed to run with minimal dependencies:

- Node.js built-in modules only
- No external testing frameworks required
- Lightweight mocking strategy

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Auth Tests
  run: node tests/auth/run-tests.mjs
```
