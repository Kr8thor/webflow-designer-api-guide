/**
 * Asset Organizer - Asset Management Extension
 */

import { webflow } from '@webflow/designer-api';

interface Asset {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  usage: number;
}

export class AssetOrganizer {
  async getAllAssets(): Promise<Asset[]> {
    try {
      const assets = webflow.getAssets?.() || [];
      return assets.map((a: any) => ({
        id: a.getId?.(),
        name: a.getName?.(),
        type: a.getType?.() || 'unknown',
        size: a.getSize?.() || 0,
        url: a.getUrl?.() || '',
        usage: 0
      }));
    } catch (error) {
      console.error('Failed to get assets:', error);
      return [];
    }
  }

  async findOrphanedAssets(): Promise<Asset[]> {
    try {
      const assets = await this.getAllAssets();
      return assets.filter((a) => a.usage === 0);
    } catch (error) {
      console.error('Failed to find orphaned assets:', error);
      return [];
    }
  }

  async searchAssets(query: string): Promise<Asset[]> {
    try {
      const assets = await this.getAllAssets();
      return assets.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to search assets:', error);
      return [];
    }
  }

  getStorageStats(): object {
    try {
      const assets = webflow.getAssets?.() || [];
      let totalSize = 0;
      const byType: Record<string, number> = {};

      for (const asset of assets) {
        const size = asset.getSize?.() || 0;
        const type = asset.getType?.() || 'other';

        totalSize += size;
        byType[type] = (byType[type] || 0) + size;
      }

      return {
        totalAssets: assets.length,
        totalSize,
        byType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { error: String(error) };
    }
  }

  exportAssetCatalog(): object {
    try {
      const assets = webflow.getAssets?.() || [];
      return {
        assets: assets.map((a: any) => ({
          name: a.getName?.(),
          type: a.getType?.(),
          size: a.getSize?.(),
          url: a.getUrl?.()
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
    console.log('📦 Initializing Asset Organizer');

    const organizer = new AssetOrganizer();
    (window as any).assetOrganizer = organizer;

    const stats = organizer.getStorageStats();
    console.log('Asset Stats:', stats);

    const container = document.createElement('div');
    container.style.cssText = 'font-family: sans-serif; padding: 16px; font-size: 13px;';
    container.innerHTML = `
      <h2 style="margin: 0 0 16px 0;">📦 Assets</h2>
      <div style="background: #f5f5f5; padding: 12px; border-radius: 4px;">
        <p style="margin: 0;"><strong>${(stats as any).totalAssets}</strong> assets</p>
      </div>
    `;
    document.body.appendChild(container);

    webflow.notify.success('Asset Organizer ready');
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
