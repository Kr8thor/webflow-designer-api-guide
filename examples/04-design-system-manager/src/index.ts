/**
 * Design System Manager - Token Management Extension
 */

import { webflow } from '@webflow/designer-api';

interface Token {
  id: string;
  name: string;
  type: 'color' | 'typography' | 'spacing' | 'other';
  value: any;
  group?: string;
}

class DesignSystemManager {
  async getAllTokens(): Promise<Token[]> {
    try {
      const variables = webflow.getVariables?.() || [];
      return variables.map((v) => ({
        id: v.getId?.(),
        name: v.getName?.(),
        type: v.getType?.() as any || 'other',
        value: v.getValue?.(),
        group: undefined
      }));
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return [];
    }
  }

  async getTokensByType(type: string): Promise<Token[]> {
    const all = await this.getAllTokens();
    return all.filter((t) => t.type === type);
  }

  async createColorToken(name: string, color: string, group?: string): Promise<boolean> {
    try {
      // Note: Designer API may not have direct token creation
      // This is a placeholder showing the pattern
      webflow.notify.warning('Token creation via API not available yet');
      return false;
    } catch (error) {
      console.error('Failed to create token:', error);
      return false;
    }
  }

  async applyTokensToSelection(tokens: Token[]): Promise<number> {
    try {
      const selected = webflow.getSelectedElements();
      if (selected.length === 0) {
        webflow.notify.error('Please select elements');
        return 0;
      }

      let applied = 0;
      for (const element of selected) {
        for (const token of tokens) {
          if (token.type === 'color') {
            element.setInlineStyle?.('color', token.value);
            applied++;
          }
        }
      }

      webflow.notify.success(`Applied ${applied} tokens`);
      return applied;
    } catch (error) {
      console.error('Failed to apply tokens:', error);
      return 0;
    }
  }

  getTokenStats(): object {
    try {
      const variables = webflow.getVariables?.() || [];
      const types = new Map<string, number>();

      for (const v of variables) {
        const type = v.getType?.() || 'other';
        types.set(type, (types.get(type) || 0) + 1);
      }

      return {
        totalTokens: variables.length,
        byType: Object.fromEntries(types),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { error: String(error) };
    }
  }

  exportDesignSystem(): object {
    try {
      const tokens = webflow.getVariables?.() || [];
      return {
        tokens: tokens.map((t) => ({
          name: t.getName?.(),
          type: t.getType?.(),
          value: t.getValue?.()
        })),
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      return { error: String(error) };
    }
  }
}

async function initializeExtension(): Promise<void> {
  try {
    console.log('🎨 Initializing Design System Manager');

    const manager = new DesignSystemManager();
    (window as any).designSystem = manager;

    const stats = manager.getTokenStats();
    console.log('Design System Stats:', stats);

    // Create UI
    const container = document.createElement('div');
    container.style.cssText = 'font-family: sans-serif; padding: 16px; font-size: 13px;';
    container.innerHTML = `
      <h2 style="margin: 0 0 16px 0;">🎨 Design System</h2>
      <div style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 16px;">
        <p style="margin: 0;"><strong>${(stats as any).totalTokens}</strong> tokens</p>
      </div>
      <button onclick="alert('See console for available commands')" style="padding: 8px 12px; background: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        View Tokens
      </button>
    `;
    document.body.appendChild(container);

    webflow.notify.success('Design System Manager ready');
  } catch (error) {
    console.error('Failed to initialize:', error);
    webflow.notify.error('Initialization failed');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

export { DesignSystemManager };
