import React, { useState, useCallback } from 'react'
import { useNotification } from '../../shared/context/NotificationContext'

interface SEOData {
  id: string
  page: string
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonical: string
  score: number
}

interface SEOIssue {
  field: string
  severity: 'error' | 'warning' | 'info'
  message: string
}

const DEFAULT_PAGES: SEOData[] = [
  {
    id: '1',
    page: 'Home',
    title: 'Welcome to Our Site',
    description: 'Discover amazing products and services',
    keywords: ['home', 'welcome', 'services'],
    ogTitle: 'Welcome to Our Site',
    ogDescription: 'Discover amazing products and services',
    ogImage: 'https://via.placeholder.com/1200x630',
    canonical: 'https://example.com',
    score: 75
  },
  {
    id: '2',
    page: 'About',
    title: 'About Us',
    description: 'Learn about our company',
    keywords: ['about', 'company', 'team'],
    ogTitle: 'About Us',
    ogDescription: 'Learn about our company',
    ogImage: '',
    canonical: 'https://example.com/about',
    score: 60
  }
]

export default function App() {
  const [pages, setPages] = useState<SEOData[]>(DEFAULT_PAGES)
  const [selectedPage, setSelectedPage] = useState<SEOData | null>(pages[0])
  const [message, setMessage] = useState('')
  const [showTemplate, setShowTemplate] = useState(false)

  const checkSEO = (page: SEOData): SEOIssue[] => {
    const issues: SEOIssue[] = []

    if (!page.title || page.title.length === 0) {
      issues.push({ field: 'title', severity: 'error', message: 'Title is missing' })
    } else if (page.title.length < 30) {
      issues.push({ field: 'title', severity: 'warning', message: 'Title should be at least 30 characters' })
    } else if (page.title.length > 60) {
      issues.push({ field: 'title', severity: 'warning', message: 'Title is too long (60 chars max)' })
    }

    if (!page.description || page.description.length === 0) {
      issues.push({ field: 'description', severity: 'error', message: 'Meta description is missing' })
    } else if (page.description.length < 120) {
      issues.push({ field: 'description', severity: 'warning', message: 'Description should be at least 120 characters' })
    } else if (page.description.length > 160) {
      issues.push({ field: 'description', severity: 'warning', message: 'Description is too long (160 chars max)' })
    }

    if (page.keywords.length === 0) {
      issues.push({ field: 'keywords', severity: 'warning', message: 'No keywords defined' })
    }

    if (!page.ogImage) {
      issues.push({ field: 'ogImage', severity: 'warning', message: 'Social image not set' })
    }

    if (!page.ogTitle) {
      issues.push({ field: 'ogTitle', severity: 'info', message: 'OG title not optimized' })
    }

    return issues
  }

  const calculateScore = (page: SEOData): number => {
    const issues = checkSEO(page)
    let score = 100

    issues.forEach(issue => {
      if (issue.severity === 'error') score -= 25
      else if (issue.severity === 'warning') score -= 10
      else if (issue.severity === 'info') score -= 5
    })

    return Math.max(0, score)
  }

  const updatePage = (id: string, updates: Partial<SEOData>) => {
    const updated = pages.map(p =>
      p.id === id ? { ...p, ...updates, score: calculateScore({ ...p, ...updates }) } : p
    )
    setPages(updated)
    const page = updated.find(p => p.id === id)
    if (page) setSelectedPage(page)
    setMessage('✅ Page updated')
  }

  const applySEOTemplate = (id: string, template: string) => {
    const templates = {
      product: {
        ogTitle: 'Discover Our Premium Products',
        ogDescription: 'Shop our exclusive collection of high-quality items. Free shipping on orders over $50.'
      },
      blog: {
        ogTitle: 'Read Our Latest Insights',
        ogDescription: 'Stay updated with our in-depth articles on industry trends and best practices.'
      },
      service: {
        ogTitle: 'Professional Services | Expert Team',
        ogDescription: 'Get expert assistance with our professional services. Contact us for a free consultation.'
      }
    }

    const selectedTemplate = templates[template as keyof typeof templates]
    if (selectedTemplate) {
      updatePage(id, selectedTemplate)
      setMessage(`✅ Applied ${template} template`)
    }
  }

  const generateSuggesttion = (page: SEOData, field: string): string => {
    const suggestions = {
      title: `${page.page} - Premium Quality & Expert Service`,
      description: `Explore ${page.page}. High-quality products and services tailored to your needs. Learn more about our offerings.`,
      ogTitle: `${page.page} | Your Brand Name`,
      ogDescription: `Discover ${page.page} with our expert team. Premium solutions for your business.`
    }
    return suggestions[field as keyof typeof suggestions] || ''
  }

  const issues = selectedPage ? checkSEO(selectedPage) : []
  const errorCount = issues.filter(i => i.severity === 'error').length
  const warningCount = issues.filter(i => i.severity === 'warning').length

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 SEO Automator</h1>
        <p>Optimize SEO metadata for all pages</p>
      </header>

      {message && (
        <div className="message">
          {message}
          <button className="close-btn" onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className="container">
        <aside className="sidebar">
          <div className="pages-list">
            <h3>Pages</h3>
            {pages.map(page => (
              <button
                key={page.id}
                className={`page-btn ${selectedPage?.id === page.id ? 'active' : ''}`}
                onClick={() => setSelectedPage(page)}
              >
                <span className="page-name">{page.page}</span>
                <span className={`score score-${page.score >= 80 ? 'good' : page.score >= 60 ? 'ok' : 'poor'}`}>
                  {page.score}%
                </span>
              </button>
            ))}
          </div>

          <div className="tools">
            <button className="btn btn-secondary" onClick={() => setShowTemplate(!showTemplate)}>
              📋 Use Template
            </button>
          </div>

          {showTemplate && selectedPage && (
            <div className="templates">
              <h4>Templates</h4>
              <button onClick={() => applySEOTemplate(selectedPage.id, 'product')}>Product Page</button>
              <button onClick={() => applySEOTemplate(selectedPage.id, 'blog')}>Blog Post</button>
              <button onClick={() => applySEOTemplate(selectedPage.id, 'service')}>Service Page</button>
            </div>
          )}
        </aside>

        <main className="main">
          {selectedPage ? (
            <>
              <div className="page-header">
                <h2>{selectedPage.page}</h2>
                <div className={`score-badge score-${selectedPage.score >= 80 ? 'good' : selectedPage.score >= 60 ? 'ok' : 'poor'}`}>
                  <div className="score-circle">{selectedPage.score}%</div>
                  <div className="score-label">SEO Score</div>
                </div>
              </div>

              {errorCount > 0 || warningCount > 0 ? (
                <div className="issues">
                  <h3>Issues Found ({errorCount + warningCount})</h3>
                  <div className="issues-list">
                    {issues.map((issue, i) => (
                      <div key={i} className={`issue issue-${issue.severity}`}>
                        <span className="issue-label">{issue.severity.toUpperCase()}</span>
                        <div>
                          <strong>{issue.field}</strong>
                          <p>{issue.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="success-message">
                  ✅ All SEO checks passed!
                </div>
              )}

              <div className="form-section">
                <h3>Meta Tags</h3>

                <div className="form-group">
                  <label>Title Tag</label>
                  <input
                    type="text"
                    value={selectedPage.title}
                    onChange={(e) => updatePage(selectedPage.id, { title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="char-count">{selectedPage.title.length}/60</p>
                  <button
                    className="suggest-btn"
                    onClick={() => {
                      const suggestion = generateSuggesttion(selectedPage, 'title')
                      updatePage(selectedPage.id, { title: suggestion })
                    }}
                  >
                    💡 Suggest
                  </button>
                </div>

                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    value={selectedPage.description}
                    onChange={(e) => updatePage(selectedPage.id, { description: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="char-count">{selectedPage.description.length}/160</p>
                  <button
                    className="suggest-btn"
                    onClick={() => {
                      const suggestion = generateSuggesttion(selectedPage, 'description')
                      updatePage(selectedPage.id, { description: suggestion })
                    }}
                  >
                    💡 Suggest
                  </button>
                </div>

                <div className="form-group">
                  <label>Keywords (comma-separated)</label>
                  <textarea
                    value={selectedPage.keywords.join(', ')}
                    onChange={(e) => updatePage(selectedPage.id, { keywords: e.target.value.split(',').map(k => k.trim()) })}
                    rows={2}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="form-group">
                  <label>Canonical URL</label>
                  <input
                    type="text"
                    value={selectedPage.canonical}
                    onChange={(e) => updatePage(selectedPage.id, { canonical: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Open Graph (Social Media)</h3>

                <div className="form-group">
                  <label>OG Title</label>
                  <input
                    type="text"
                    value={selectedPage.ogTitle}
                    onChange={(e) => updatePage(selectedPage.id, { ogTitle: e.target.value })}
                    maxLength={55}
                  />
                  <p className="char-count">{selectedPage.ogTitle.length}/55</p>
                </div>

                <div className="form-group">
                  <label>OG Description</label>
                  <textarea
                    value={selectedPage.ogDescription}
                    onChange={(e) => updatePage(selectedPage.id, { ogDescription: e.target.value })}
                    maxLength={65}
                    rows={2}
                  />
                  <p className="char-count">{selectedPage.ogDescription.length}/65</p>
                </div>

                <div className="form-group">
                  <label>OG Image URL</label>
                  <input
                    type="text"
                    value={selectedPage.ogImage}
                    onChange={(e) => updatePage(selectedPage.id, { ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="hint">Recommended: 1200x630px</p>
                </div>
              </div>

              <div className="preview-section">
                <h3>Google Search Preview</h3>
                <div className="search-preview">
                  <div className="preview-url">example.com</div>
                  <div className="preview-title">{selectedPage.title || 'Your page title'}</div>
                  <div className="preview-desc">{selectedPage.description || 'Your meta description'}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">Select a page to edit SEO</div>
          )}
        </main>
      </div>
    </div>
  )
}
