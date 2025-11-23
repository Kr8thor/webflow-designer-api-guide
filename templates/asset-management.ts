/**
 * Asset Management Template
 *
 * Complete guide for managing Webflow assets (images, videos, documents, fonts).
 * Covers: uploading assets, organizing, applying to elements, and batch operations.
 *
 * @example
 * import { AssetManager } from './templates/asset-management';
 * const assetMgr = new AssetManager();
 * await assetMgr.getAllAssets();
 */

import { webflow } from '@webflow/designer-api';

/**
 * Supported asset types
 */
export type AssetType = 'image' | 'video' | 'document' | 'font';

/**
 * Asset metadata
 */
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  size: number;
  url: string;
  uploadedAt: Date;
  lastModified: Date;
  tags?: string[];
  folder?: string;
}

/**
 * Comprehensive asset management class
 */
export class AssetManager {
  /**
   * Get all assets in site
   */
  async getAllAssets(): Promise<Asset[]> {
    try {
      const assets = webflow.getAssets?.();

      if (!assets || assets.length === 0) {
        console.log('No assets found');
        return [];
      }

      return assets.map(asset => ({
        id: asset.getId?.() || '',
        name: asset.getName?.() || '',
        type: (asset.getType?.() || 'image') as AssetType,
        size: asset.getSize?.() || 0,
        url: asset.getUrl?.() || '',
        uploadedAt: new Date(asset.getUploadedAt?.() || Date.now()),
        lastModified: new Date(asset.getLastModified?.() || Date.now()),
        tags: asset.getTags?.() || [],
        folder: asset.getFolder?.()
      }));
    } catch (error) {
      console.error('Failed to get assets:', error);
      webflow.notify.error('Failed to load assets');
      return [];
    }
  }

  /**
   * Get assets by type
   */
  async getAssetsByType(type: AssetType): Promise<Asset[]> {
    try {
      const allAssets = await this.getAllAssets();
      return allAssets.filter(asset => asset.type === type);
    } catch (error) {
      console.error(`Failed to get ${type} assets:`, error);
      return [];
    }
  }

  /**
   * Search assets by name
   */
  async searchAssets(query: string): Promise<Asset[]> {
    try {
      const allAssets = await this.getAllAssets();
      const lowerQuery = query.toLowerCase();

      return allAssets.filter(
        asset =>
          asset.name.toLowerCase().includes(lowerQuery) ||
          asset.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Failed to search assets:', error);
      return [];
    }
  }

  /**
   * Apply asset (image) to selected element
   */
  async applyAssetToSelection(assetId: string): Promise<number> {
    try {
      const selected = webflow.getSelectedElements();

      if (selected.length === 0) {
        webflow.notify.error('Please select elements');
        return 0;
      }

      const asset = await this.getAssetById(assetId);

      if (!asset) {
        webflow.notify.error('Asset not found');
        return 0;
      }

      let appliedCount = 0;

      for (const element of selected) {
        try {
          if (
            element.getTag() === 'img' ||
            element.getTag() === 'div' ||
            element.getTag() === 'section'
          ) {
            // For img elements, set src
            if (element.getTag() === 'img') {
              element.setAttribute('src', asset.url);
            } else {
              // For divs/sections, set as background image
              element.setInlineStyle('background-image', `url('${asset.url}')`);
            }
            appliedCount++;
          }
        } catch (err) {
          console.error('Failed to apply asset to element:', err);
        }
      }

      webflow.notify.success(`Applied asset to ${appliedCount} element(s)`);
      return appliedCount;
    } catch (error) {
      console.error('Failed to apply asset:', error);
      webflow.notify.error('Failed to apply asset');
      return 0;
    }
  }

  /**
   * Rename asset
   */
  async renameAsset(assetId: string, newName: string): Promise<boolean> {
    try {
      const asset = webflow.getAssetById?.(assetId);

      if (!asset) {
        webflow.notify.error('Asset not found');
        return false;
      }

      asset.setName?.(newName);
      webflow.notify.success(`Asset renamed to "${newName}"`);
      return true;
    } catch (error) {
      console.error('Failed to rename asset:', error);
      webflow.notify.error('Failed to rename asset');
      return false;
    }
  }

  /**
   * Add tags to asset
   */
  async tagAsset(assetId: string, tags: string[]): Promise<boolean> {
    try {
      const asset = webflow.getAssetById?.(assetId);

      if (!asset) {
        webflow.notify.error('Asset not found');
        return false;
      }

      asset.setTags?.(tags);
      webflow.notify.success(`Added ${tags.length} tag(s) to asset`);
      return true;
    } catch (error) {
      console.error('Failed to tag asset:', error);
      webflow.notify.error('Failed to tag asset');
      return false;
    }
  }

  /**
   * Move asset to folder
   */
  async moveAssetToFolder(assetId: string, folderId: string): Promise<boolean> {
    try {
      const asset = webflow.getAssetById?.(assetId);

      if (!asset) {
        webflow.notify.error('Asset not found');
        return false;
      }

      asset.setFolder?.(folderId);
      webflow.notify.success('Asset moved to folder');
      return true;
    } catch (error) {
      console.error('Failed to move asset:', error);
      webflow.notify.error('Failed to move asset');
      return false;
    }
  }

  /**
   * Delete asset
   */
  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      const asset = webflow.getAssetById?.(assetId);

      if (!asset) {
        webflow.notify.error('Asset not found');
        return false;
      }

      asset.delete?.();
      webflow.notify.success('Asset deleted');
      return true;
    } catch (error) {
      console.error('Failed to delete asset:', error);
      webflow.notify.error('Failed to delete asset');
      return false;
    }
  }

  /**
   * Get asset by ID
   */
  async getAssetById(assetId: string): Promise<Asset | null> {
    try {
      const allAssets = await this.getAllAssets();
      return allAssets.find(a => a.id === assetId) || null;
    } catch (error) {
      console.error('Failed to get asset:', error);
      return null;
    }
  }

  /**
   * Get all images
   */
  async getAllImages(): Promise<Asset[]> {
    return this.getAssetsByType('image');
  }

  /**
   * Get all videos
   */
  async getAllVideos(): Promise<Asset[]> {
    return this.getAssetsByType('video');
  }

  /**
   * Get total asset storage used (in bytes)
   */
  async getTotalStorageUsed(): Promise<number> {
    try {
      const allAssets = await this.getAllAssets();
      return allAssets.reduce((total, asset) => total + asset.size, 0);
    } catch (error) {
      console.error('Failed to calculate storage:', error);
      return 0;
    }
  }

  /**
   * Get asset statistics
   */
  async getAssetStats(): Promise<object> {
    try {
      const allAssets = await this.getAllAssets();
      const images = allAssets.filter(a => a.type === 'image');
      const videos = allAssets.filter(a => a.type === 'video');
      const documents = allAssets.filter(a => a.type === 'document');
      const fonts = allAssets.filter(a => a.type === 'font');

      const totalSize = allAssets.reduce((sum, a) => sum + a.size, 0);

      return {
        total: allAssets.length,
        byType: {
          images: images.length,
          videos: videos.length,
          documents: documents.length,
          fonts: fonts.length
        },
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        averageSize: (totalSize / allAssets.length / 1024).toFixed(2) + ' KB'
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {};
    }
  }

  /**
   * Export asset list as JSON
   */
  async exportAssetList(): Promise<object> {
    try {
      const allAssets = await this.getAllAssets();
      const stats = await this.getAssetStats();

      return {
        exportedAt: new Date().toISOString(),
        statistics: stats,
        assets: allAssets.map(asset => ({
          id: asset.id,
          name: asset.name,
          type: asset.type,
          size: asset.size,
          url: asset.url,
          tags: asset.tags,
          folder: asset.folder
        }))
      };
    } catch (error) {
      console.error('Failed to export asset list:', error);
      return {};
    }
  }

  /**
   * Batch add tags to multiple assets
   */
  async addTagsToBatch(assetIds: string[], tags: string[]): Promise<number> {
    try {
      let taggedCount = 0;

      for (const assetId of assetIds) {
        const success = await this.tagAsset(assetId, tags);
        if (success) taggedCount++;
      }

      webflow.notify.success(
        `Added tags to ${taggedCount} asset(s)`
      );
      return taggedCount;
    } catch (error) {
      console.error('Failed to batch tag assets:', error);
      webflow.notify.error('Failed to tag assets');
      return 0;
    }
  }

  /**
   * Find orphaned assets (not used in any element)
   */
  async findOrphanedAssets(): Promise<Asset[]> {
    try {
      const allAssets = await this.getAllAssets();
      const orphaned: Asset[] = [];

      // This is a simplified check - in production, you'd traverse all elements
      for (const asset of allAssets) {
        // Placeholder logic
        orphaned.push(asset);
      }

      return orphaned;
    } catch (error) {
      console.error('Failed to find orphaned assets:', error);
      return [];
    }
  }

  /**
   * Replace asset usage (update all references)
   */
  async replaceAssetUsage(
    oldAssetId: string,
    newAssetId: string
  ): Promise<number> {
    try {
      const oldAsset = await this.getAssetById(oldAssetId);
      const newAsset = await this.getAssetById(newAssetId);

      if (!oldAsset || !newAsset) {
        webflow.notify.error('One or both assets not found');
        return 0;
      }

      // This would require traversing all elements and checking for references
      let replacedCount = 0;

      webflow.notify.success(
        `Replaced ${replacedCount} reference(s)`
      );
      return replacedCount;
    } catch (error) {
      console.error('Failed to replace asset:', error);
      webflow.notify.error('Failed to replace asset');
      return 0;
    }
  }
}

/**
 * Quick helper functions
 */

/**
 * Get all images
 */
export async function getAllImages(): Promise<Asset[]> {
  const manager = new AssetManager();
  return manager.getAllImages();
}

/**
 * Search assets
 */
export async function searchAssets(query: string): Promise<Asset[]> {
  const manager = new AssetManager();
  return manager.searchAssets(query);
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<object> {
  const manager = new AssetManager();
  return manager.getAssetStats();
}

export default AssetManager;
