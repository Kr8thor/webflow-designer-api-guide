/**
 * Custom Code Injection Template
 *
 * Comprehensive guide for injecting custom HTML, CSS, and JavaScript
 * into Webflow pages at various locations.
 *
 * @example
 * ```typescript
 * const injector = new CodeInjector(webflow)
 * await injector.injectCSS('body { font-family: sans-serif; }', 'head')
 * await injector.injectJS('console.log("loaded")', 'body', { defer: true })
 * ```
 */

import type { WebflowDesignerAPI } from '@webflow/designer'

/**
 * Code injection location
 */
type InjectionLocation = 'head' | 'body' | 'before-closing-body'

/**
 * Code type
 */
type CodeType = 'html' | 'css' | 'javascript'

/**
 * Injected code metadata
 */
interface InjectedCode {
  id: string
  type: CodeType
  location: InjectionLocation
  code: string
  enabled: boolean
  createdAt: Date
  description?: string
  tags?: string[]
}

/**
 * Script injection options
 */
interface ScriptOptions {
  async?: boolean
  defer?: boolean
  noModule?: boolean
  attributes?: Record<string, string>
}

/**
 * Main code injector class
 */
export class CodeInjector {
  private webflow: WebflowDesignerAPI
  private injections: Map<string, InjectedCode> = new Map()
  private globalCode: Map<InjectionLocation, string> = new Map()

  constructor(webflow: WebflowDesignerAPI) {
    this.webflow = webflow
  }

  /**
   * Inject CSS code
   *
   * @param css - CSS code to inject
   * @param location - Where to inject (default: head)
   * @param description - Optional description
   * @returns Injected code metadata
   */
  async injectCSS(
    css: string,
    location: InjectionLocation = 'head',
    description?: string
  ): Promise<InjectedCode> {
    // Validate CSS
    this.validateCSS(css)

    const injection: InjectedCode = {
      id: this.generateId(),
      type: 'css',
      location,
      code: this.formatCSS(css),
      enabled: true,
      createdAt: new Date(),
      description
    }

    this.injections.set(injection.id, injection)
    await this.applyInjection(injection)

    return injection
  }

  /**
   * Inject JavaScript code
   *
   * @param js - JavaScript code
   * @param location - Where to inject
   * @param options - Script options
   * @param description - Optional description
   * @returns Injected code metadata
   */
  async injectJS(
    js: string,
    location: InjectionLocation = 'body',
    options?: ScriptOptions,
    description?: string
  ): Promise<InjectedCode> {
    // Validate JavaScript
    this.validateJavaScript(js)

    const injection: InjectedCode = {
      id: this.generateId(),
      type: 'javascript',
      location,
      code: this.formatJavaScript(js, options),
      enabled: true,
      createdAt: new Date(),
      description
    }

    this.injections.set(injection.id, injection)
    await this.applyInjection(injection)

    return injection
  }

  /**
   * Inject HTML code
   *
   * @param html - HTML code
   * @param location - Where to inject
   * @param description - Optional description
   * @returns Injected code metadata
   */
  async injectHTML(
    html: string,
    location: InjectionLocation = 'body',
    description?: string
  ): Promise<InjectedCode> {
    // Validate HTML
    this.validateHTML(html)

    const injection: InjectedCode = {
      id: this.generateId(),
      type: 'html',
      location,
      code: this.formatHTML(html),
      enabled: true,
      createdAt: new Date(),
      description
    }

    this.injections.set(injection.id, injection)
    await this.applyInjection(injection)

    return injection
  }

  /**
   * Inject external script
   *
   * @param src - Script source URL
   * @param location - Where to inject
   * @param options - Script options
   * @returns Injected code metadata
   */
  async injectExternalScript(
    src: string,
    location: InjectionLocation = 'body',
    options?: ScriptOptions
  ): Promise<InjectedCode> {
    const attrs = this.buildScriptAttributes(src, options)
    const code = `<script ${attrs}></script>`

    const injection: InjectedCode = {
      id: this.generateId(),
      type: 'javascript',
      location,
      code,
      enabled: true,
      createdAt: new Date(),
      description: `External script: ${src}`
    }

    this.injections.set(injection.id, injection)
    await this.applyInjection(injection)

    return injection
  }

  /**
   * Inject external stylesheet
   *
   * @param href - Stylesheet URL
   * @param location - Where to inject
   * @returns Injected code metadata
   */
  async injectExternalStylesheet(
    href: string,
    location: InjectionLocation = 'head'
  ): Promise<InjectedCode> {
    const code = `<link rel="stylesheet" href="${href}">`

    const injection: InjectedCode = {
      id: this.generateId(),
      type: 'html',
      location,
      code,
      enabled: true,
      createdAt: new Date(),
      description: `External stylesheet: ${href}`
    }

    this.injections.set(injection.id, injection)
    await this.applyInjection(injection)

    return injection
  }

  /**
   * Inject tracking code (Google Analytics, etc.)
   *
   * @param trackingId - Tracking ID
   * @param provider - Analytics provider
   * @returns Injected code metadata
   */
  async injectTrackingCode(
    trackingId: string,
    provider: 'google' | 'gtag' | 'facebook' | 'custom'
  ): Promise<InjectedCode> {
    const code = this.generateTrackingCode(trackingId, provider)
    return this.injectJS(code, 'head', undefined, `${provider} tracking`)
  }

  /**
   * Get injection by ID
   *
   * @param id - Injection ID
   * @returns Injection metadata or null
   */
  async getInjection(id: string): Promise<InjectedCode | null> {
    return this.injections.get(id) || null
  }

  /**
   * List all injections
   *
   * @returns All injections
   */
  async listInjections(): Promise<InjectedCode[]> {
    return Array.from(this.injections.values())
  }

  /**
   * List injections by location
   *
   * @param location - Injection location
   * @returns Injections at location
   */
  async listInjectionsByLocation(location: InjectionLocation): Promise<InjectedCode[]> {
    return Array.from(this.injections.values()).filter(i => i.location === location)
  }

  /**
   * List injections by type
   *
   * @param type - Code type
   * @returns Injections of type
   */
  async listInjectionsByType(type: CodeType): Promise<InjectedCode[]> {
    return Array.from(this.injections.values()).filter(i => i.type === type)
  }

  /**
   * Toggle injection enabled status
   *
   * @param id - Injection ID
   * @param enabled - Enable or disable
   */
  async toggleInjection(id: string, enabled: boolean): Promise<void> {
    const injection = this.injections.get(id)
    if (!injection) throw new Error(`Injection ${id} not found`)

    injection.enabled = enabled
  }

  /**
   * Update injection code
   *
   * @param id - Injection ID
   * @param code - New code
   */
  async updateInjectionCode(id: string, code: string): Promise<void> {
    const injection = this.injections.get(id)
    if (!injection) throw new Error(`Injection ${id} not found`)

    // Validate code based on type
    if (injection.type === 'css') {
      this.validateCSS(code)
    } else if (injection.type === 'javascript') {
      this.validateJavaScript(code)
    } else if (injection.type === 'html') {
      this.validateHTML(code)
    }

    injection.code = code
  }

  /**
   * Remove injection
   *
   * @param id - Injection ID
   */
  async removeInjection(id: string): Promise<void> {
    this.injections.delete(id)
  }

  /**
   * Export all injections
   *
   * @returns JSON representation
   */
  async exportInjections(): Promise<string> {
    return JSON.stringify(Array.from(this.injections.values()), null, 2)
  }

  /**
   * Import injections from JSON
   *
   * @param json - JSON string
   */
  async importInjections(json: string): Promise<void> {
    const data = JSON.parse(json) as InjectedCode[]

    for (const injection of data) {
      this.injections.set(injection.id, {
        ...injection,
        createdAt: new Date(injection.createdAt)
      })
    }
  }

  /**
   * Get code for location
   *
   * @private
   */
  private async applyInjection(injection: InjectedCode): Promise<void> {
    if (!injection.enabled) return

    // Update global code map
    const existing = this.globalCode.get(injection.location) || ''
    this.globalCode.set(injection.location, existing + '\n' + injection.code)
  }

  /**
   * Helper: Format CSS
   *
   * @private
   */
  private formatCSS(css: string): string {
    return css.trim()
  }

  /**
   * Helper: Format JavaScript
   *
   * @private
   */
  private formatJavaScript(js: string, options?: ScriptOptions): string {
    const attrs = this.buildScriptAttributes(undefined, options)
    return `<script ${attrs}>\n${js.trim()}\n</script>`
  }

  /**
   * Helper: Format HTML
   *
   * @private
   */
  private formatHTML(html: string): string {
    return html.trim()
  }

  /**
   * Helper: Build script attributes
   *
   * @private
   */
  private buildScriptAttributes(src?: string, options?: ScriptOptions): string {
    const attrs: string[] = []

    if (src) {
      attrs.push(`src="${src}"`)
    }

    if (options?.async) {
      attrs.push('async')
    }

    if (options?.defer) {
      attrs.push('defer')
    }

    if (options?.noModule) {
      attrs.push('noModule')
    }

    if (options?.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        attrs.push(`${key}="${value}"`)
      }
    }

    return attrs.join(' ')
  }

  /**
   * Helper: Generate tracking code
   *
   * @private
   */
  private generateTrackingCode(trackingId: string, provider: string): string {
    switch (provider) {
      case 'google':
        return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId}');
</script>`

      case 'gtag':
        return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${trackingId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`

      case 'facebook':
        return `<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${trackingId}');
  fbq('track', 'PageView');
</script>`

      default:
        return `<!-- Custom tracking code -->\n<!-- ${trackingId} -->`
    }
  }

  /**
   * Helper: Validate CSS
   *
   * @private
   */
  private validateCSS(css: string): void {
    // Basic validation - check for common CSS patterns
    if (!css.includes('{') || !css.includes('}')) {
      console.warn('CSS might be incomplete - missing curly braces')
    }
  }

  /**
   * Helper: Validate JavaScript
   *
   * @private
   */
  private validateJavaScript(js: string): void {
    try {
      new Function(js)
    } catch (error) {
      throw new Error(`Invalid JavaScript: ${error}`)
    }
  }

  /**
   * Helper: Validate HTML
   *
   * @private
   */
  private validateHTML(html: string): void {
    // Basic validation - check for common HTML patterns
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    if (doc.body.textContent === '' && !html.includes('<')) {
      throw new Error('Invalid HTML content')
    }
  }

  /**
   * Generate unique injection ID
   *
   * @private
   */
  private generateId(): string {
    return `inj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const injector = new CodeInjector(webflow)
 *
 * // Inject custom CSS
 * await injector.injectCSS(`
 *   body {
 *     font-family: 'Inter', sans-serif;
 *     background: #f5f5f5;
 *   }
 * `, 'head', 'Custom styles')
 *
 * // Inject JavaScript
 * await injector.injectJS(`
 *   console.log('Page loaded');
 *   document.addEventListener('DOMContentLoaded', () => {
 *     console.log('DOM ready');
 *   });
 * `, 'body', { defer: true })
 *
 * // Add Google Analytics
 * await injector.injectTrackingCode('UA-XXXXXXX-X', 'google')
 *
 * // Add external libraries
 * await injector.injectExternalScript(
 *   'https://cdn.jsdelivr.net/npm/chart.js',
 *   'body'
 * )
 *
 * // List all injections
 * const injections = await injector.listInjections()
 * console.log(`Total injections: ${injections.length}`)
 *
 * // Toggle injection
 * await injector.toggleInjection(injectionId, false)
 *
 * // Export for backup
 * const json = await injector.exportInjections()
 * ```
 */
