/**
 * Authentication & OAuth Template
 *
 * Complete guide for implementing OAuth 2.0 authentication with Webflow.
 * Covers: OAuth flows, token management, user authentication, and security.
 *
 * @example
 * import { OAuthManager } from './templates/authentication-oauth';
 * const auth = new OAuthManager({
 *   clientId: process.env.WEBFLOW_CLIENT_ID,
 *   clientSecret: process.env.WEBFLOW_CLIENT_SECRET
 * });
 */

/**
 * OAuth configuration
 */
export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope?: string[];
  apiBaseUrl?: string;
}

/**
 * OAuth token response
 */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

/**
 * User information
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  siteCount: number;
  createdAt: Date;
}

/**
 * Comprehensive OAuth management class
 */
export class OAuthManager {
  private config: OAuthConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(config: OAuthConfig) {
    this.config = {
      scope: ['sites:read', 'sites:write', 'collections:read'],
      apiBaseUrl: 'https://api.webflow.com',
      ...config
    };

    // Load tokens from storage if available
    this.loadStoredTokens();
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: (this.config.scope || []).join(' ')
    });

    return `https://webflow.com/oauth/authorize?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<boolean> {
    try {
      if (!this.config.clientSecret) {
        console.error('Client secret required for token exchange');
        return false;
      }

      const response = await fetch(
        `${this.config.apiBaseUrl}/oauth/access_token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type: 'authorization_code'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokenData: TokenResponse = await response.json();
      this.setTokens(
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in
      );

      return true;
    } catch (error) {
      console.error('Failed to exchange code:', error);
      return false;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken || !this.config.clientSecret) {
        console.error('Refresh token and client secret required');
        return false;
      }

      const response = await fetch(
        `${this.config.apiBaseUrl}/oauth/access_token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refresh_token: this.refreshToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type: 'refresh_token'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const tokenData: TokenResponse = await response.json();
      this.setTokens(
        tokenData.access_token,
        tokenData.refresh_token || this.refreshToken,
        tokenData.expires_in
      );

      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    // Check if token is expired
    if (
      this.tokenExpiresAt &&
      Date.now() > this.tokenExpiresAt - 60 * 1000
    ) {
      // Refresh if within 1 minute of expiration
      await this.refreshAccessToken();
    }

    return this.accessToken;
  }

  /**
   * Set tokens
   */
  private setTokens(
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
  ): void {
    this.accessToken = accessToken;

    if (refreshToken) {
      this.refreshToken = refreshToken;
    }

    if (expiresIn) {
      this.tokenExpiresAt = Date.now() + expiresIn * 1000;
    }

    this.storeTokens();
  }

  /**
   * Store tokens in local storage
   */
  private storeTokens(): void {
    try {
      const tokens = {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: this.tokenExpiresAt
      };

      localStorage.setItem('webflow_oauth_tokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Load tokens from local storage
   */
  private loadStoredTokens(): void {
    try {
      const stored = localStorage.getItem('webflow_oauth_tokens');

      if (stored) {
        const tokens = JSON.parse(stored);
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        this.tokenExpiresAt = tokens.expiresAt;
      }
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
    }
  }

  /**
   * Clear tokens
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;

    try {
      localStorage.removeItem('webflow_oauth_tokens');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<UserInfo | null> {
    try {
      const token = await this.getAccessToken();

      if (!token) {
        return null;
      }

      const response = await fetch(`${this.config.apiBaseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to get user: ${response.statusText}`);
      }

      const userData = await response.json();

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        siteCount: userData.sites?.length || 0,
        createdAt: new Date(userData.createdAt)
      };
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Make authenticated API request
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    try {
      const token = await this.getAccessToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      const url = endpoint.startsWith('http')
        ? endpoint
        : `${this.config.apiBaseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API request failed:', error);
      return null;
    }
  }

  /**
   * Get list of authorized sites
   */
  async getAuthorizedSites(): Promise<
    Array<{ id: string; name: string }> | null
  > {
    try {
      const token = await this.getAccessToken();

      if (!token) {
        return null;
      }

      const response = await fetch(`${this.config.apiBaseUrl}/sites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to get sites: ${response.statusText}`);
      }

      const data = await response.json();

      return (
        data.sites?.map((site: any) => ({
          id: site.id,
          name: site.name
        })) || []
      );
    } catch (error) {
      console.error('Failed to get sites:', error);
      return null;
    }
  }

  /**
   * Revoke token
   */
  async revokeToken(): Promise<boolean> {
    try {
      if (!this.accessToken || !this.config.clientSecret) {
        return false;
      }

      const response = await fetch(
        `${this.config.apiBaseUrl}/oauth/revoke`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: this.accessToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret
          })
        }
      );

      if (response.ok) {
        this.clearTokens();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to revoke token:', error);
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpirationTime(): Date | null {
    if (this.tokenExpiresAt) {
      return new Date(this.tokenExpiresAt);
    }
    return null;
  }

  /**
   * Check if token is about to expire
   */
  isTokenExpiring(minutesThreshold: number = 5): boolean {
    if (!this.tokenExpiresAt) {
      return false;
    }

    const now = Date.now();
    const threshold = minutesThreshold * 60 * 1000;

    return this.tokenExpiresAt - now < threshold;
  }

  /**
   * Get authentication status
   */
  getStatus(): object {
    return {
      isAuthenticated: this.isAuthenticated(),
      tokenExpiring: this.isTokenExpiring(),
      expiresAt: this.getTokenExpirationTime(),
      scope: this.config.scope
    };
  }
}

/**
 * Helper function to initiate OAuth flow
 */
export function initiateOAuthFlow(config: OAuthConfig): void {
  const manager = new OAuthManager(config);
  window.location.href = manager.getAuthorizationUrl();
}

/**
 * Helper function to handle OAuth callback
 */
export async function handleOAuthCallback(
  config: OAuthConfig
): Promise<boolean> {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error('No authorization code in callback');
      return false;
    }

    const manager = new OAuthManager(config);
    const success = await manager.exchangeCodeForToken(code);

    if (success) {
      // Clear the code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return success;
  } catch (error) {
    console.error('OAuth callback failed:', error);
    return false;
  }
}

export default OAuthManager;
