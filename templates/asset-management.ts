/**
 * Asset Management Template
 *
 * Comprehensive guide for uploading, organizing, and managing assets
 * in Webflow, including images, icons, documents, and videos.
 *
 * @example
 * ```typescript
 * const assetMgr = new AssetManager(webflow)
 * const asset = await assetMgr.uploadAsset(file, '/images', { tags: ['hero'] })
 * const folder = await assetMgr.createFolder('/icons')
 * const assets = await assetMgr.listAssets('/images')
 * ```
 */

import type { WebflowDesignerAPI } from '@webflow/designer'

/**
 * Asset types
 */
type AssetType = 'image' | 'icon' | 'document' | 'video' | 'audio'

/**
 * Asset metadata
 */
interface Asset {
  id: string
  name: string
  fileName: string
  type: AssetType
  url: string
  size: number
  mimeType: string
  folder: string
  uploadedAt: Date
  modifiedAt: Date
  tags?: string[]
  metadata?: Record<string, any>
  dimensions?: { width: number; height: number }
  duration?: number // For video/audio
}

/**
 * Asset folder structure
 */
interface AssetFolder {
  id: string
  name: string
  path: string
  parentPath: string
  createdAt: Date
  assetCount: number
}

/**
 * Upload options
 */
interface UploadOptions {
  tags?: string[]
  metadata?: Record<string, any>
  overwrite?: boolean
}

/**
 * Main asset manager class
 */
export class AssetManager {
  private webflow: WebflowDesignerAPI
  private assets: Map<string, Asset> = new Map()
  private folders: Map<string, AssetFolder> = new Map()

  constructor(webflow: WebflowDesignerAPI) {
    this.webflow = webflow
  }

  /**
   * Upload an asset
   *
   * @param file - File to upload
   * @param folderPath - Destination folder path
   * @param options - Upload options
   * @returns Created asset
   */
  async uploadAsset(
    file: File,
    folderPath: string,
    options?: UploadOptions
  ): Promise<Asset> {
    try {
      // Validate file
      this.validateFile(file)

      // Ensure folder exists
      await this.ensureFolder(folderPath)

      // Create asset
      const asset: Asset = {
        id: this.generateId(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        type: this.getAssetType(file.type),
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type,
        folder: folderPath,
        uploadedAt: new Date(),
        modifiedAt: new Date(),
        tags: options?.tags,
        metadata: options?.metadata
      }

      // Get dimensions for images
      if (asset.type === 'image') {
        asset.dimensions = await this.getImageDimensions(file)
      }

      // Get duration for video
      if (asset.type === 'video' || asset.type === 'audio') {
        asset.duration = await this.getMediaDuration(file)
      }

      // Store asset
      this.assets.set(asset.id, asset)

      // Update folder asset count
      const folder = this.folders.get(folderPath)
      if (folder) {
        folder.assetCount++
      }

      return asset
    } catch (error) {
      throw new Error(`Failed to upload asset: ${error}`)
    }
  }

  /**
   * Upload multiple assets
   *
   * @param files - Files to upload
   * @param folderPath - Destination folder
   * @returns Created assets
   */
  async uploadAssets(files: File[], folderPath: string): Promise<Asset[]> {
    const uploaded: Asset[] = []

    for (const file of files) {
      const asset = await this.uploadAsset(file, folderPath)
      uploaded.push(asset)
    }

    return uploaded
  }

  /**
   * Create a folder
   *
   * @param path - Folder path (e.g., '/images' or '/icons/social')
   * @returns Created folder
   */
  async createFolder(path: string): Promise<AssetFolder> {
    if (this.folders.has(path)) {
      throw new Error(`Folder ${path} already exists`)
    }

    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/'
    const name = path.substring(path.lastIndexOf('/') + 1)

    const folder: AssetFolder = {
      id: this.generateId(),
      name,
      path,
      parentPath,
      createdAt: new Date(),
      assetCount: 0
    }

    this.folders.set(path, folder)
    return folder
  }

  /**
   * Ensure folder exists, create if needed
   *
   * @private
   */
  private async ensureFolder(path: string): Promise<void> {
    if (!this.folders.has(path)) {
      await this.createFolder(path)
    }
  }

  /**
   * List assets in folder
   *
   * @param folderPath - Folder path
   * @returns Assets in folder
   */
  async listAssets(folderPath: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(a => a.folder === folderPath)
  }

  /**
   * Get asset by ID
   *
   * @param id - Asset ID
   * @returns Asset or null
   */
  async getAsset(id: string): Promise<Asset | null> {
    return this.assets.get(id) || null
  }

  /**
   * Search assets by name or tags
   *
   * @param query - Search query
   * @returns Matching assets
   */
  async searchAssets(query: string): Promise<Asset[]> {
    const lowerQuery = query.toLowerCase()

    return Array.from(this.assets.values()).filter(
      asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Get assets by type
   *
   * @param type - Asset type
   * @returns Matching assets
   */
  async getAssetsByType(type: AssetType): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(a => a.type === type)
  }

  /**
   * Get assets by tag
   *
   * @param tag - Tag to search
   * @returns Assets with tag
   */
  async getAssetsByTag(tag: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      a => a.tags?.includes(tag)
    )
  }

  /**
   * Delete asset
   *
   * @param id - Asset ID
   */
  async deleteAsset(id: string): Promise<void> {
    const asset = this.assets.get(id)
    if (!asset) {
      throw new Error(`Asset ${id} not found`)
    }

    this.assets.delete(id)

    // Update folder count
    const folder = this.folders.get(asset.folder)
    if (folder) {
      folder.assetCount = Math.max(0, folder.assetCount - 1)
    }
  }

  /**
   * Move asset to different folder
   *
   * @param id - Asset ID
   * @param newFolder - Destination folder
   */
  async moveAsset(id: string, newFolder: string): Promise<void> {
    const asset = this.assets.get(id)
    if (!asset) {
      throw new Error(`Asset ${id} not found`)
    }

    // Update old folder
    const oldFolder = this.folders.get(asset.folder)
    if (oldFolder) {
      oldFolder.assetCount = Math.max(0, oldFolder.assetCount - 1)
    }

    // Update asset
    asset.folder = newFolder
    asset.modifiedAt = new Date()

    // Update new folder
    const newFolderObj = this.folders.get(newFolder)
    if (newFolderObj) {
      newFolderObj.assetCount++
    }
  }

  /**
   * Rename asset
   *
   * @param id - Asset ID
   * @param newName - New name
   */
  async renameAsset(id: string, newName: string): Promise<void> {
    const asset = this.assets.get(id)
    if (!asset) {
      throw new Error(`Asset ${id} not found`)
    }

    asset.name = newName
    asset.modifiedAt = new Date()
  }

  /**
   * Add tags to asset
   *
   * @param id - Asset ID
   * @param tags - Tags to add
   */
  async addTags(id: string, tags: string[]): Promise<void> {
    const asset = this.assets.get(id)
    if (!asset) {
      throw new Error(`Asset ${id} not found`)
    }

    asset.tags = [...new Set([...(asset.tags || []), ...tags])]
    asset.modifiedAt = new Date()
  }

  /**
   * Remove tags from asset
   *
   * @param id - Asset ID
   * @param tags - Tags to remove
   */
  async removeTags(id: string, tags: string[]): Promise<void> {
    const asset = this.assets.get(id)
    if (!asset) {
      throw new Error(`Asset ${id} not found`)
    }

    asset.tags = asset.tags?.filter(t => !tags.includes(t)) || []
    asset.modifiedAt = new Date()
  }

  /**
   * Get folder structure
   *
   * @returns All folders organized
   */
  async getFolderStructure(): Promise<AssetFolder[]> {
    return Array.from(this.folders.values())
  }

  /**
   * Get storage statistics
   *
   * @returns Statistics object
   */
  async getStatistics(): Promise<{
    totalAssets: number
    totalSize: number
    byType: Record<AssetType, number>
    largestAssets: Asset[]
  }> {
    const allAssets = Array.from(this.assets.values())
    const byType: Record<AssetType, number> = {
      image: 0,
      icon: 0,
      document: 0,
      video: 0,
      audio: 0
    }

    let totalSize = 0

    for (const asset of allAssets) {
      byType[asset.type]++
      totalSize += asset.size
    }

    const largestAssets = allAssets
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)

    return {
      totalAssets: allAssets.length,
      totalSize,
      byType,
      largestAssets
    }
  }

  /**
   * Export folder as ZIP
   *
   * @param folderPath - Folder to export
   */
  async exportFolder(folderPath: string): Promise<Blob> {
    const assets = await this.listAssets(folderPath)
    // Implementation would use JSZip or similar
    // This is a placeholder
    const blob = new Blob()
    return blob
  }

  /**
   * Get asset usage count
   *
   * @param id - Asset ID
   */
  async getAssetUsage(id: string): Promise<number> {
    // In real implementation, would track where asset is used
    return 0
  }

  /**
   * Helper: Validate file
   *
   * @private
   */
  private validateFile(file: File): void {
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit')
    }

    const allowed = ['image/', 'video/', 'audio/', 'application/pdf']
    const isAllowed = allowed.some(type => file.type.startsWith(type))
    if (!isAllowed) {
      throw new Error(`File type ${file.type} not allowed`)
    }
  }

  /**
   * Helper: Determine asset type from MIME type
   *
   * @private
   */
  private getAssetType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('pdf')) return 'document'
    return 'document'
  }

  /**
   * Helper: Get image dimensions
   *
   * @private
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Helper: Get media duration
   *
   * @private
   */
  private async getMediaDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const media = document.createElement('audio')
      media.onloadedmetadata = () => resolve(media.duration)
      media.onerror = () => reject(new Error('Failed to load media'))
      media.src = URL.createObjectURL(file)
    })
  }

  /**
   * Generate unique asset ID
   *
   * @private
   */
  private generateId(): string {
    return `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const assets = new AssetManager(webflow)
 *
 * // Create folders
 * await assets.createFolder('/images')
 * await assets.createFolder('/icons')
 * await assets.createFolder('/icons/social')
 *
 * // Upload assets
 * const imageAsset = await assets.uploadAsset(
 *   imageFile,
 *   '/images',
 *   { tags: ['hero', 'homepage'] }
 * )
 *
 * // Upload multiple
 * const icons = await assets.uploadAssets(iconFiles, '/icons')
 *
 * // Search and organize
 * const heroImages = await assets.searchAssets('hero')
 * const images = await assets.getAssetsByType('image')
 * const heroAssets = await assets.getAssetsByTag('hero')
 *
 * // Get statistics
 * const stats = await assets.getStatistics()
 * console.log(`Total assets: ${stats.totalAssets}`)
 * console.log(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`)
 * ```
 */
