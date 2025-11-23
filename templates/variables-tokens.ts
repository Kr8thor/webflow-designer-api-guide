/**
 * Design Tokens & Variables Template
 *
 * Complete guide for managing Webflow design tokens (colors, typography, spacing, etc.).
 * Covers: creating variables, applying tokens, managing groups, and batch operations.
 *
 * @example
 * import { TokenManager } from './templates/variables-tokens';
 * const tokenMgr = new TokenManager();
 * await tokenMgr.getAllTokens();
 */

import { webflow } from '@webflow/designer-api';

/**
 * Token types supported by Webflow
 */
export type TokenType = 'color' | 'typography' | 'spacing' | 'custom';

/**
 * Token metadata
 */
export interface Token {
  id: string;
  name: string;
  type: TokenType;
  value: string | object;
  group?: string;
  createdAt: Date;
  usage: number;
}

/**
 * Token group for organization
 */
export interface TokenGroup {
  name: string;
  tokens: Token[];
  description?: string;
}

/**
 * Comprehensive token/variable management class
 */
export class TokenManager {
  /**
   * Get all design tokens
   */
  async getAllTokens(): Promise<Token[]> {
    try {
      const variables = webflow.getVariables?.();

      if (!variables || variables.length === 0) {
        console.log('No variables found');
        return [];
      }

      return variables.map(variable => ({
        id: variable.getId?.() || '',
        name: variable.getName?.() || '',
        type: (variable.getType?.() || 'custom') as TokenType,
        value: variable.getValue?.() || '',
        group: variable.getGroup?.(),
        createdAt: new Date(),
        usage: 0
      }));
    } catch (error) {
      console.error('Failed to get tokens:', error);
      webflow.notify.error('Failed to load design tokens');
      return [];
    }
  }

  /**
   * Get tokens by type
   */
  async getTokensByType(type: TokenType): Promise<Token[]> {
    try {
      const allTokens = await this.getAllTokens();
      return allTokens.filter(token => token.type === type);
    } catch (error) {
      console.error(`Failed to get ${type} tokens:`, error);
      return [];
    }
  }

  /**
   * Get tokens organized by group
   */
  async getTokensByGroup(): Promise<Map<string, Token[]>> {
    try {
      const allTokens = await this.getAllTokens();
      const grouped = new Map<string, Token[]>();

      for (const token of allTokens) {
        const groupName = token.group || 'Ungrouped';
        if (!grouped.has(groupName)) {
          grouped.set(groupName, []);
        }
        grouped.get(groupName)!.push(token);
      }

      return grouped;
    } catch (error) {
      console.error('Failed to group tokens:', error);
      return new Map();
    }
  }

  /**
   * Create a new color token
   */
  async createColorToken(
    name: string,
    hexValue: string,
    group?: string
  ): Promise<boolean> {
    try {
      if (!hexValue.match(/^#[0-9A-F]{6}$/i)) {
        webflow.notify.error('Invalid hex color format');
        return false;
      }

      const variables = webflow.getVariables?.();

      if (!variables) {
        webflow.notify.error('Variables API not available');
        return false;
      }

      const newVar = variables.create?.({
        name,
        type: 'color',
        value: hexValue,
        group
      });

      webflow.notify.success(`Color token "${name}" created`);
      return !!newVar;
    } catch (error) {
      console.error('Failed to create color token:', error);
      webflow.notify.error('Failed to create color token');
      return false;
    }
  }

  /**
   * Create a typography token
   */
  async createTypographyToken(
    name: string,
    typography: {
      fontSize?: string;
      fontWeight?: string;
      lineHeight?: string;
      letterSpacing?: string;
    },
    group?: string
  ): Promise<boolean> {
    try {
      const variables = webflow.getVariables?.();

      if (!variables) {
        webflow.notify.error('Variables API not available');
        return false;
      }

      const newVar = variables.create?.({
        name,
        type: 'typography',
        value: typography,
        group
      });

      webflow.notify.success(`Typography token "${name}" created`);
      return !!newVar;
    } catch (error) {
      console.error('Failed to create typography token:', error);
      webflow.notify.error('Failed to create typography token');
      return false;
    }
  }

  /**
   * Create a spacing token
   */
  async createSpacingToken(
    name: string,
    value: string,
    group?: string
  ): Promise<boolean> {
    try {
      const variables = webflow.getVariables?.();

      if (!variables) {
        webflow.notify.error('Variables API not available');
        return false;
      }

      const newVar = variables.create?.({
        name,
        type: 'spacing',
        value,
        group
      });

      webflow.notify.success(`Spacing token "${name}" created`);
      return !!newVar;
    } catch (error) {
      console.error('Failed to create spacing token:', error);
      webflow.notify.error('Failed to create spacing token');
      return false;
    }
  }

  /**
   * Apply token to selected elements
   */
  async applyTokenToSelection(
    tokenId: string,
    property: string
  ): Promise<number> {
    try {
      const selected = webflow.getSelectedElements();

      if (selected.length === 0) {
        webflow.notify.error('Please select elements');
        return 0;
      }

      let appliedCount = 0;

      for (const element of selected) {
        try {
          const styleValue = webflow.getVariableById?.(tokenId);

          if (styleValue) {
            element.setStyleValue?.(property, styleValue);
            appliedCount++;
          }
        } catch (err) {
          console.error(`Failed to apply token to element:`, err);
        }
      }

      webflow.notify.success(
        `Applied token to ${appliedCount} element(s)`
      );
      return appliedCount;
    } catch (error) {
      console.error('Failed to apply token:', error);
      webflow.notify.error('Failed to apply token');
      return 0;
    }
  }

  /**
   * Update token value
   */
  async updateToken(tokenId: string, newValue: string | object): Promise<boolean> {
    try {
      const variable = webflow.getVariableById?.(tokenId);

      if (!variable) {
        webflow.notify.error('Token not found');
        return false;
      }

      variable.setValue?.(newValue);
      webflow.notify.success('Token updated');
      return true;
    } catch (error) {
      console.error('Failed to update token:', error);
      webflow.notify.error('Failed to update token');
      return false;
    }
  }

  /**
   * Rename token
   */
  async renameToken(tokenId: string, newName: string): Promise<boolean> {
    try {
      const variable = webflow.getVariableById?.(tokenId);

      if (!variable) {
        webflow.notify.error('Token not found');
        return false;
      }

      variable.setName?.(newName);
      webflow.notify.success(`Token renamed to "${newName}"`);
      return true;
    } catch (error) {
      console.error('Failed to rename token:', error);
      webflow.notify.error('Failed to rename token');
      return false;
    }
  }

  /**
   * Delete token
   */
  async deleteToken(tokenId: string): Promise<boolean> {
    try {
      const variable = webflow.getVariableById?.(tokenId);

      if (!variable) {
        webflow.notify.error('Token not found');
        return false;
      }

      variable.delete?.();
      webflow.notify.success('Token deleted');
      return true;
    } catch (error) {
      console.error('Failed to delete token:', error);
      webflow.notify.error('Failed to delete token');
      return false;
    }
  }

  /**
   * Export all tokens as JSON
   */
  async exportTokens(): Promise<object> {
    try {
      const allTokens = await this.getAllTokens();
      const grouped = await this.getTokensByGroup();

      return {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        summary: {
          totalTokens: allTokens.length,
          byType: {
            color: allTokens.filter(t => t.type === 'color').length,
            typography: allTokens.filter(t => t.type === 'typography').length,
            spacing: allTokens.filter(t => t.type === 'spacing').length,
            custom: allTokens.filter(t => t.type === 'custom').length
          }
        },
        tokens: Object.fromEntries(grouped)
      };
    } catch (error) {
      console.error('Failed to export tokens:', error);
      return {};
    }
  }

  /**
   * Batch create color tokens from array
   */
  async createColorTokensBatch(
    colors: Array<{ name: string; value: string; group?: string }>
  ): Promise<number> {
    try {
      let createdCount = 0;

      for (const color of colors) {
        const success = await this.createColorToken(
          color.name,
          color.value,
          color.group
        );
        if (success) createdCount++;
      }

      webflow.notify.success(`Created ${createdCount} color tokens`);
      return createdCount;
    } catch (error) {
      console.error('Failed to batch create colors:', error);
      webflow.notify.error('Failed to create color tokens');
      return 0;
    }
  }

  /**
   * Find tokens used in selected elements
   */
  async findTokensInSelection(): Promise<Token[]> {
    try {
      const selected = webflow.getSelectedElements();

      if (selected.length === 0) {
        webflow.notify.warning('Please select elements');
        return [];
      }

      const allTokens = await this.getAllTokens();
      const usedTokens = new Set<string>();

      for (const element of selected) {
        const styles = element.getStyles?.();

        if (styles) {
          for (const token of allTokens) {
            if (JSON.stringify(styles).includes(token.id)) {
              usedTokens.add(token.id);
            }
          }
        }
      }

      return allTokens.filter(token => usedTokens.has(token.id));
    } catch (error) {
      console.error('Failed to find tokens:', error);
      return [];
    }
  }

  /**
   * Get color palette preview
   */
  async getColorPalette(): Promise<Array<{ name: string; hex: string }>> {
    try {
      const colorTokens = await this.getTokensByType('color');

      return colorTokens
        .map(token => ({
          name: token.name,
          hex: String(token.value)
        }))
        .filter(c => c.hex.match(/^#[0-9A-F]{6}$/i));
    } catch (error) {
      console.error('Failed to get color palette:', error);
      return [];
    }
  }
}

/**
 * Quick helper functions
 */

/**
 * Get all color tokens
 */
export async function getColorTokens(): Promise<Token[]> {
  const manager = new TokenManager();
  return manager.getTokensByType('color');
}

/**
 * Get all typography tokens
 */
export async function getTypographyTokens(): Promise<Token[]> {
  const manager = new TokenManager();
  return manager.getTokensByType('typography');
}

/**
 * Apply color token to selected elements
 */
export async function applyColorToken(tokenId: string): Promise<number> {
  const manager = new TokenManager();
  return manager.applyTokenToSelection(tokenId, 'color');
}

export default TokenManager;
