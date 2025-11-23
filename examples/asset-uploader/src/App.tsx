import React, { useState, useEffect, useRef } from 'react'

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: number
  folderId: string
  uploadedAt: Date
  url?: string
  tags: string[]
}

interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: Date
  assetCount: number
}

type SortBy = 'name' | 'size' | 'date'

export default function App() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string>('root')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [message, setMessage] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDefaultAssets()
  }, [])

  const loadDefaultAssets = () => {
    const defaultFolders: Folder[] = [
      {
        id: 'images',
        name: 'Images',
        parentId: 'root',
        createdAt: new Date(),
        assetCount: 2
      },
      {
        id: 'videos',
        name: 'Videos',
        parentId: 'root',
        createdAt: new Date(),
        assetCount: 1
      }
    ]

    const defaultAssets: Asset[] = [
      {
        id: '1',
        name: 'hero-image.jpg',
        type: 'image',
        size: 2500000,
        folderId: 'images',
        uploadedAt: new Date(),
        url: 'https://via.placeholder.com/400x300',
        tags: ['hero', 'homepage']
      },
      {
        id: '2',
        name: 'logo.png',
        type: 'image',
        size: 50000,
        folderId: 'images',
        uploadedAt: new Date(),
        url: 'https://via.placeholder.com/200x100',
        tags: ['logo', 'brand']
      },
      {
        id: '3',
        name: 'intro-video.mp4',
        type: 'video',
        size: 50000000,
        folderId: 'videos',
        uploadedAt: new Date(),
        tags: ['intro', 'hero']
      }
    ]

    setFolders(defaultFolders)
    setAssets(defaultAssets)
  }

  const handleFileUpload = (files: FileList) => {
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const type = getAssetType(file.name)

      const newAsset: Asset = {
        id: Date.now().toString() + i,
        name: file.name,
        type,
        size: file.size,
        folderId: currentFolderId,
        uploadedAt: new Date(),
        tags: []
      }

      setAssets([...assets, newAsset])
      setMessage(`✅ Uploaded: ${file.name}`)
    }
  }

  const getAssetType = (filename: string): 'image' | 'video' | 'document' => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image'
    if (['mp4', 'webm', 'mov'].includes(ext)) return 'video'
    return 'document'
  }

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      parentId: currentFolderId,
      createdAt: new Date(),
      assetCount: 0
    }
    setFolders([...folders, newFolder])
    setMessage(`✅ Created folder: ${name}`)
  }

  const deleteAsset = (id: string) => {
    const asset = assets.find(a => a.id === id)
    setAssets(assets.filter(a => a.id !== id))
    setMessage(`✅ Deleted: ${asset?.name}`)
  }

  const deleteFolder = (id: string) => {
    const folder = folders.find(f => f.id === id)
    setFolders(folders.filter(f => f.id !== id))
    setAssets(assets.filter(a => a.folderId !== id))
    setMessage(`✅ Deleted folder: ${folder?.name}`)
  }

  const getCurrentFolderAssets = () => {
    let filtered = assets.filter(a => a.folderId === currentFolderId)

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return b.size - a.size
        case 'date':
        default:
          return b.uploadedAt.getTime() - a.uploadedAt.getTime()
      }
    })

    return filtered
  }

  const getCurrentFolderFolders = () => {
    return folders.filter(f => f.parentId === currentFolderId)
  }

  const getTotalSize = () => {
    return assets
      .filter(a => a.folderId === currentFolderId)
      .reduce((sum, a) => sum + a.size, 0)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const currentAssets = getCurrentFolderAssets()
  const currentFolders = getCurrentFolderFolders()
  const totalSize = getTotalSize()
  const totalAssets = assets.filter(a => a.folderId === currentFolderId).length

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>📁 Asset Uploader</h1>
          <p>Manage and organize your project assets</p>
        </div>
      </header>

      {message && (
        <div className="message">
          {message}
          <button className="close-btn" onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className="container">
        <main className="main">
          <div className="toolbar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>

            <div className="actions">
              <button className="btn btn-secondary" onClick={() => {
                const name = prompt('Folder name:')
                if (name) createFolder(name)
              }}>
                + New Folder
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowUpload(!showUpload)
                }}
              >
                ⬆️ Upload
              </button>
            </div>
          </div>

          {showUpload && (
            <div className="upload-zone">
              <div
                className="upload-area"
                onDrop={(e) => {
                  e.preventDefault()
                  handleFileUpload(e.dataTransfer.files)
                  setShowUpload(false)
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="upload-icon">📤</div>
                <h3>Drop files here or</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files)
                      setShowUpload(false)
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="breadcrumb">
            <button
              className={currentFolderId === 'root' ? 'active' : ''}
              onClick={() => setCurrentFolderId('root')}
            >
              All Assets
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-value">{totalAssets}</div>
              <div className="stat-label">Assets</div>
            </div>
            <div className="stat">
              <div className="stat-value">{formatBytes(totalSize)}</div>
              <div className="stat-label">Total Size</div>
            </div>
            <div className="stat">
              <div className="stat-value">{currentFolders.length}</div>
              <div className="stat-label">Folders</div>
            </div>
          </div>

          {currentFolders.length > 0 && (
            <div className="section">
              <h3>Folders</h3>
              <div className="folders-grid">
                {currentFolders.map(folder => (
                  <div key={folder.id} className="folder-card">
                    <div className="folder-icon">📂</div>
                    <h4>{folder.name}</h4>
                    <p className="folder-count">{folder.assetCount} assets</p>
                    <div className="folder-actions">
                      <button
                        className="action-btn"
                        onClick={() => setCurrentFolderId(folder.id)}
                      >
                        Open
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => deleteFolder(folder.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAssets.length === 0 ? (
            <div className="empty-state">
              <p>No assets found</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowUpload(true)}
              >
                Upload your first asset
              </button>
            </div>
          ) : (
            <div className="section">
              <h3>Assets</h3>
              <div className="assets-grid">
                {currentAssets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onDelete={() => deleteAsset(asset.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

interface AssetCardProps {
  asset: Asset
  onDelete: () => void
}

function AssetCard({ asset, onDelete }: AssetCardProps) {
  const getIcon = () => {
    switch (asset.type) {
      case 'image':
        return '🖼️'
      case 'video':
        return '🎬'
      case 'document':
        return '📄'
    }
  }

  return (
    <div className="asset-card">
      <div className="asset-preview">
        {asset.type === 'image' && asset.url ? (
          <img src={asset.url} alt={asset.name} />
        ) : (
          <div className="asset-placeholder">{getIcon()}</div>
        )}
      </div>
      <div className="asset-info">
        <h4 title={asset.name}>{asset.name}</h4>
        <p className="asset-meta">
          <span>{asset.type}</span> • <span>{Math.round(asset.size / 1024)} KB</span>
        </p>
        {asset.tags.length > 0 && (
          <div className="asset-tags">
            {asset.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <button className="delete-btn" onClick={onDelete} title="Delete">×</button>
    </div>
  )
}
