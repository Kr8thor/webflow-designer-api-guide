/**
 * OAuth Authentication Template
 *
 * Complete OAuth 2.0 implementation for Webflow Data Client apps,
 * including token management, refresh handling, and secure storage.
 *
 * @example
 * ```typescript
 * const auth = new OAuth2Client(config)
 * const token = await auth.authenticate()
 * const refreshed = await auth.refreshToken()
 * ```
 */

/**
 * OAuth configuration
 */
export interface OAuth2Config {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
  authorizationEndpoint: string
  tokenEndpoint: string
  revokeEndpoint?: string
}

/**
 * OAuth token response
 */
interface TokenResponse {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
  scope?: string
}

/**
 * Stored token data
 */
interface StoredToken {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  tokenType: string
  scope: string
  grantedAt: Date
}

/**
 * OAuth state data
 */
interface OAuthState {
  state: string
  codeVerifier?: string
  nonce?: string
  createdAt: Date
}

/**
 * Main OAuth 2.0 client
 */
export class OAuth2Client {
  private config: OAuth2Config
  private token: StoredToken | null = null
  private states: Map<string, OAuthState> = new Map()
  private isRefreshing = false
  private refreshPromise: Promise<StoredToken> | null = null

  constructor(config: OAuth2Config) {
    this.config = config
    this.loadStoredToken()
  }

  /**
   * Start OAuth flow and get authorization code
   *
   * @returns Authorization URL
   */
  getAuthorizationUrl(state?: string, codeChallenge?: string): string {
    const stateValue = state || this.generateState()
    const nonce = this.generateNonce()

    // Store state for verification
    this.states.set(stateValue, {
      state: stateValue,
      nonce,
      codeVerifier: codeChallenge,
      createdAt: new Date()
    })

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope.join(' '),
      state: stateValue,
      nonce
    })

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge)
      params.append('code_challenge_method', 'S256')
    }

    return `${this.config.authorizationEndpoint}?${params.toString()}`
  }

  /**
   * Exchange authorization code for token
   *
   * @param code - Authorization code
   * @param state - State parameter for verification
   * @returns Token response
   */
  async exchangeCodeForToken(code: string, state: string): Promise<StoredToken> {
    try {
      // Verify state
      const oauthState = this.states.get(state)
      if (!oauthState) {
        throw new Error('Invalid state parameter')
      }

      // Check state expiry (5 minutes)
      const stateAge = Date.now() - oauthState.createdAt.getTime()
      if (stateAge > 5 * 60 * 1000) {
        throw new Error('State parameter expired')
      }

      // Exchange code
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri
      })

      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      })

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`)
      }

      const data = (await response.json()) as TokenResponse
      const token = this.processTokenResponse(data)

      // Store token
      this.storeToken(token)

      // Clean up state
      this.states.delete(state)

      return token
    } catch (error) {
      throw new Error(`OAuth token exchange failed: ${error}`)
    }
  }

  /**
   * Get current access token
   *
   * @returns Access token or null
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.token) {
      return null
    }

    // Check if token expired
    if (this.isTokenExpired()) {
      // Refresh if available
      if (this.token.refreshToken) {
        const refreshed = await this.refreshToken()
        return refreshed.accessToken
      }
      return null
    }

    return this.token.accessToken
  }

  /**
   * Refresh access token
   *
   * @returns New token
   */
  async refreshToken(): Promise<StoredToken> {
    // Prevent multiple refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    if (!this.token?.refreshToken) {
      throw new Error('No refresh token available')
    }

    this.isRefreshing = true

    try {
      this.refreshPromise = this.performRefresh()
      const newToken = await this.refreshPromise

      this.isRefreshing = false
      this.refreshPromise = null

      return newToken
    } catch (error) {
      this.isRefreshing = false
      this.refreshPromise = null
      throw error
    }
  }

  /**
   * Perform token refresh
   *
   * @private
   */
  private async performRefresh(): Promise<StoredToken> {
    if (!this.token?.refreshToken) {
      throw new Error('No refresh token available')
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: this.token.refreshToken,
      grant_type: 'refresh_token'
    })

    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })

    if (!response.ok) {
      // Clear token on failure
      this.clearToken()
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const data = (await response.json()) as TokenResponse
    const newToken = this.processTokenResponse(data)

    // Store new token
    this.storeToken(newToken)

    return newToken
  }

  /**
   * Revoke access token
   */
  async revokeToken(): Promise<void> {
    if (!this.token || !this.config.revokeEndpoint) {
      return
    }

    try {
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        token: this.token.accessToken
      })

      await fetch(this.config.revokeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      })
    } catch (error) {
      console.error('Token revocation failed:', error)
    } finally {
      this.clearToken()
    }
  }

  /**
   * Check if token is expired
   *
   * @returns True if expired
   */
  isTokenExpired(): boolean {
    if (!this.token) return true

    // Refresh if within 1 minute of expiry
    const buffer = 60 * 1000
    return Date.now() >= this.token.expiresAt - buffer
  }

  /**
   * Get token info
   *
   * @returns Token info or null
   */
  getTokenInfo(): Omit<StoredToken, 'accessToken'> | null {
    if (!this.token) return null

    const { accessToken, ...info } = this.token
    return info
  }

  /**
   * Check if authenticated
   *
   * @returns True if valid token exists
   */
  isAuthenticated(): boolean {
    return this.token !== null && !this.isTokenExpired()
  }

  /**
   * Clear authentication
   */
  logout(): void {
    this.clearToken()
  }

  /**
   * Process token response
   *
   * @private
   */
  private processTokenResponse(data: TokenResponse): StoredToken {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + data.expiresIn * 1000,
      tokenType: data.tokenType || 'Bearer',
      scope: data.scope || this.config.scope.join(' '),
      grantedAt: new Date()
    }
  }

  /**
   * Store token securely
   *
   * @private
   */
  private storeToken(token: StoredToken): void {
    this.token = token

    // Store in localStorage (in production, use secure storage)
    // Note: Don't store sensitive data in localStorage for real apps
    // Use secure cookies or other secure storage mechanisms
    try {
      localStorage.setItem(
        'oauth_token',
        JSON.stringify({
          refreshToken: token.refreshToken,
          expiresAt: token.expiresAt,
          tokenType: token.tokenType,
          scope: token.scope,
          grantedAt: token.grantedAt.toISOString()
        })
      )
    } catch (error) {
      console.error('Failed to store token:', error)
    }
  }

  /**
   * Load stored token
   *
   * @private
   */
  private loadStoredToken(): void {
    try {
      const stored = localStorage.getItem('oauth_token')
      if (!stored) return

      const data = JSON.parse(stored)
      // Note: Access token is not stored for security reasons
      // Must go through refresh flow if expired

      if (data.expiresAt && Date.now() < data.expiresAt && data.refreshToken) {
        this.token = {
          accessToken: '', // Will be refreshed on demand
          ...data,
          grantedAt: new Date(data.grantedAt)
        }
      }
    } catch (error) {
      console.error('Failed to load stored token:', error)
    }
  }

  /**
   * Clear stored token
   *
   * @private
   */
  private clearToken(): void {
    this.token = null
    localStorage.removeItem('oauth_token')
  }

  /**
   * Generate random state
   *
   * @private
   */
  private generateState(): string {
    return Math.random().toString(36).substring(7)
  }

  /**
   * Generate nonce
   *
   * @private
   */
  private generateNonce(): string {
    return Math.random().toString(36).substring(7)
  }
}

/**
 * Helper for making authenticated requests
 */
export class AuthenticatedFetcher {
  private client: OAuth2Client

  constructor(client: OAuth2Client) {
    this.client = client
  }

  /**
   * Make authenticated fetch request
   *
   * @param url - Request URL
   * @param options - Fetch options
   * @returns Response
   */
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.client.getAccessToken()

    if (!token) {
      throw new Error('Not authenticated')
    }

    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${token}`)

    return fetch(url, {
      ...options,
      headers
    })
  }

  /**
   * Make JSON request
   *
   * @param url - Request URL
   * @param options - Fetch options
   * @returns JSON response
   */
  async json<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, options)

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`)
    }

    return response.json()
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const config: OAuth2Config = {
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   redirectUri: 'https://yourapp.com/callback',
 *   scope: ['read:sites', 'write:sites'],
 *   authorizationEndpoint: 'https://webflow.com/oauth/authorize',
 *   tokenEndpoint: 'https://webflow.com/oauth/token',
 *   revokeEndpoint: 'https://webflow.com/oauth/revoke'
 * }
 *
 * const oauth = new OAuth2Client(config)
 *
 * // Step 1: Redirect to authorization URL
 * const authUrl = oauth.getAuthorizationUrl()
 * window.location.href = authUrl
 *
 * // Step 2: Handle callback
 * const params = new URLSearchParams(window.location.search)
 * const code = params.get('code')
 * const state = params.get('state')
 *
 * const token = await oauth.exchangeCodeForToken(code, state)
 *
 * // Step 3: Use authenticated requests
 * const fetcher = new AuthenticatedFetcher(oauth)
 * const sites = await fetcher.json('/api/sites')
 *
 * // Step 4: Handle token refresh automatically
 * const accessToken = await oauth.getAccessToken()
 *
 * // Step 5: Logout
 * await oauth.revokeToken()
 * oauth.logout()
 * ```
 */
