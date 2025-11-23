/**
 * Hybrid App Setup Template
 *
 * Complete guide for setting up a hybrid Webflow application combining
 * Designer Extensions and Data Client capabilities.
 *
 * @example
 * import { HybridAppSetup } from './templates/hybrid-app-setup';
 * const hybrid = new HybridAppSetup(config);
 * await hybrid.initialize();
 */

import OAuthManager, { OAuthConfig } from './authentication-oauth';
import EventManager from './event-subscriptions';
import PageManager from './page-operations';
import ComponentManager from './component-management';
import TokenManager from './variables-tokens';
import AssetManager from './asset-management';

/**
 * Hybrid app configuration
 */
export interface HybridAppConfig {
  oauth: OAuthConfig;
  extensionName: string;
  extensionVersion: string;
  apiEndpoint: string;
  enableLogging?: boolean;
  enableAutoSync?: boolean;
  syncInterval?: number;
}

/**
 * Hybrid app state
 */
export interface HybridAppState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUser: any;
  currentSite: any;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncTime: Date | null;
}

/**
 * Comprehensive hybrid app setup class
 */
export class HybridAppSetup {
  private config: HybridAppConfig;
  private state: HybridAppState;
  private oauthManager: OAuthManager;
  private eventManager: EventManager;
  private pageManager: PageManager;
  private componentManager: ComponentManager;
  private tokenManager: TokenManager;
  private assetManager: AssetManager;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(config: HybridAppConfig) {
    this.config = {
      enableLogging: true,
      enableAutoSync: true,
      syncInterval: 30000, // 30 seconds
      ...config
    };

    this.state = {
      isInitialized: false,
      isAuthenticated: false,
      currentUser: null,
      currentSite: null,
      syncStatus: 'idle',
      lastSyncTime: null
    };

    // Initialize managers
    this.oauthManager = new OAuthManager(config.oauth);
    this.eventManager = new EventManager();
    this.pageManager = new PageManager();
    this.componentManager = new ComponentManager();
    this.tokenManager = new TokenManager();
    this.assetManager = new AssetManager();

    this.log('Hybrid app initialized');
  }

  /**
   * Initialize the hybrid app
   */
  async initialize(): Promise<boolean> {
    try {
      this.log('Starting initialization...');

      // Check if already authenticated
      if (!this.oauthManager.isAuthenticated()) {
        this.log('Not authenticated, attempting login...');
        // User needs to login
        return false;
      }

      // Get user information
      const user = await this.oauthManager.getCurrentUser();

      if (!user) {
        this.log('Failed to get user info');
        return false;
      }

      this.state.currentUser = user;
      this.state.isAuthenticated = true;

      // Setup event listeners
      this.setupEventListeners();

      // Start auto-sync if enabled
      if (this.config.enableAutoSync) {
        this.startAutoSync();
      }

      this.state.isInitialized = true;
      this.log(`Initialization complete for user ${user.email}`);

      return true;
    } catch (error) {
      this.log(`Initialization failed: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    try {
      // Listen for selection changes
      this.eventManager.onElementSelectedDebounced((elements) => {
        this.log(`Selected ${elements.length} element(s)`);
        // Sync selection state to backend
        this.syncSelectionState(elements);
      });

      // Listen for property changes
      this.eventManager.onPropertyChangedThrottled((elementId, property, value) => {
        this.log(`Property changed: ${property} = ${value}`);
        // Sync changes to backend
        this.syncPropertyChange(elementId, property, value);
      });

      // Listen for page changes
      this.eventManager.onPageChanged(() => {
        this.log('Page changed');
        this.syncPageState();
      });

      // Listen for element creation
      this.eventManager.onElementCreated((element) => {
        this.log('Element created');
        this.syncElementCreation(element);
      });

      // Listen for element deletion
      this.eventManager.onElementDeleted((elementId) => {
        this.log(`Element deleted: ${elementId}`);
        this.syncElementDeletion(elementId);
      });

      this.log('Event listeners configured');
    } catch (error) {
      this.log(`Failed to setup listeners: ${error}`, 'error');
    }
  }

  /**
   * Start auto-sync timer
   */
  private startAutoSync(): void {
    try {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
      }

      this.syncInterval = setInterval(async () => {
        await this.performFullSync();
      }, this.config.syncInterval);

      this.log('Auto-sync started');
    } catch (error) {
      this.log(`Failed to start auto-sync: ${error}`, 'error');
    }
  }

  /**
   * Stop auto-sync timer
   */
  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.log('Auto-sync stopped');
    }
  }

  /**
   * Perform full synchronization
   */
  private async performFullSync(): Promise<void> {
    try {
      if (this.state.syncStatus === 'syncing') {
        return;
      }

      this.state.syncStatus = 'syncing';

      // Sync pages
      const pages = await this.pageManager.getAllPages();

      // Sync components
      const components = await this.componentManager.getAllComponents();

      // Sync tokens
      const tokens = await this.tokenManager.getAllTokens();

      // Sync assets
      const assets = await this.assetManager.getAllAssets();

      // Send to backend
      await this.syncToBackend({
        pages,
        components,
        tokens,
        assets
      });

      this.state.lastSyncTime = new Date();
      this.state.syncStatus = 'idle';

      this.log('Full sync completed');
    } catch (error) {
      this.state.syncStatus = 'error';
      this.log(`Sync failed: ${error}`, 'error');
    }
  }

  /**
   * Sync selection state to backend
   */
  private async syncSelectionState(elements: any[]): Promise<void> {
    try {
      const selectionData = {
        elementCount: elements.length,
        elementIds: elements.map(el => el.getId?.()),
        timestamp: new Date()
      };

      await this.sendToBackend('/sync/selection', selectionData);
    } catch (error) {
      this.log(`Failed to sync selection: ${error}`, 'error');
    }
  }

  /**
   * Sync property changes to backend
   */
  private async syncPropertyChange(
    elementId: string,
    property: string,
    value: any
  ): Promise<void> {
    try {
      await this.sendToBackend('/sync/property', {
        elementId,
        property,
        value,
        timestamp: new Date()
      });
    } catch (error) {
      this.log(`Failed to sync property: ${error}`, 'error');
    }
  }

  /**
   * Sync page state to backend
   */
  private async syncPageState(): Promise<void> {
    try {
      const currentPage = await this.pageManager.getCurrentPage();

      if (currentPage) {
        await this.sendToBackend('/sync/page', {
          page: currentPage,
          timestamp: new Date()
        });
      }
    } catch (error) {
      this.log(`Failed to sync page: ${error}`, 'error');
    }
  }

  /**
   * Sync element creation to backend
   */
  private async syncElementCreation(element: any): Promise<void> {
    try {
      await this.sendToBackend('/sync/element-created', {
        elementId: element.getId?.(),
        tag: element.getTag?.(),
        timestamp: new Date()
      });
    } catch (error) {
      this.log(`Failed to sync element creation: ${error}`, 'error');
    }
  }

  /**
   * Sync element deletion to backend
   */
  private async syncElementDeletion(elementId: string): Promise<void> {
    try {
      await this.sendToBackend('/sync/element-deleted', {
        elementId,
        timestamp: new Date()
      });
    } catch (error) {
      this.log(`Failed to sync element deletion: ${error}`, 'error');
    }
  }

  /**
   * Send data to backend
   */
  private async sendToBackend(endpoint: string, data: any): Promise<any> {
    try {
      const token = await this.oauthManager.getAccessToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Backend sync failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.log(`Backend sync error: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Sync data to backend (full payload)
   */
  private async syncToBackend(data: any): Promise<void> {
    await this.sendToBackend('/sync/full', data);
  }

  /**
   * Get app state
   */
  getState(): HybridAppState {
    return { ...this.state };
  }

  /**
   * Get authentication status
   */
  getAuthStatus(): object {
    return this.oauthManager.getStatus();
  }

  /**
   * Login
   */
  login(): void {
    const authUrl = this.oauthManager.getAuthorizationUrl();
    window.location.href = authUrl;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.stopAutoSync();
    this.eventManager.unsubscribeAll();
    await this.oauthManager.revokeToken();
    this.state.isAuthenticated = false;
    this.state.isInitialized = false;
    this.log('Logged out');
  }

  /**
   * Get page manager
   */
  getPageManager(): PageManager {
    return this.pageManager;
  }

  /**
   * Get component manager
   */
  getComponentManager(): ComponentManager {
    return this.componentManager;
  }

  /**
   * Get token manager
   */
  getTokenManager(): TokenManager {
    return this.tokenManager;
  }

  /**
   * Get asset manager
   */
  getAssetManager(): AssetManager {
    return this.assetManager;
  }

  /**
   * Get event manager
   */
  getEventManager(): EventManager {
    return this.eventManager;
  }

  /**
   * Get OAuth manager
   */
  getOAuthManager(): OAuthManager {
    return this.oauthManager;
  }

  /**
   * Logging utility
   */
  private log(message: string, level: 'info' | 'error' | 'warn' = 'info'): void {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${this.config.extensionName}]`;

      switch (level) {
        case 'error':
          console.error(`${prefix} ERROR: ${message}`);
          break;
        case 'warn':
          console.warn(`${prefix} WARN: ${message}`);
          break;
        default:
          console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Get status summary
   */
  getStatus(): object {
    return {
      extension: this.config.extensionName,
      version: this.config.extensionVersion,
      state: this.state,
      auth: this.getAuthStatus(),
      eventListeners: this.eventManager.getListenerStats()
    };
  }
}

export default HybridAppSetup;
