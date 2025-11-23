/**
 * Design Tokens & Variables Template
 *
 * Comprehensive guide for creating and managing design tokens (variables)
 * in Webflow, including colors, typography, sizing, and spacing scales.
 *
 * @example
 * ```typescript
 * const tokenManager = new TokenManager(webflow)
 * const colors = await tokenManager.createColorScale('primary')
 * const typography = await tokenManager.createTypographyScale()
 * const spacing = await tokenManager.createSpacingScale()
 * ```
 */

import type { WebflowDesignerAPI } from '@webflow/designer'

/**
 * Variable types supported
 */
type VariableType = 'color' | 'number' | 'string'

/**
 * Color token structure
 */
interface ColorToken {
  id: string
  name: string
  value: string
  hex: string
  rgb: { r: number; g: number; b: number }
  aliases?: string[]
}

/**
 * Typography token structure
 */
interface TypographyToken {
  id: string
  name: string
  fontSize: number
  lineHeight: number
  fontWeight: number
  letterSpacing?: number
}

/**
 * Spacing token structure
 */
interface SpacingToken {
  id: string
  name: string
  value: number
  unit: 'px' | 'rem' | 'em'
}

/**
 * Token scale configuration
 */
interface TokenScaleConfig {
  baseName: string
  baseValue: number | string
  steps?: number
  multiplier?: number
  unit?: string
}

/**
 * Main token manager class
 */
export class TokenManager {
  private webflow: WebflowDesignerAPI
  private tokens: Map<string, ColorToken | TypographyToken | SpacingToken> = new Map()

  constructor(webflow: WebflowDesignerAPI) {
    this.webflow = webflow
  }

  /**
   * Create a color token
   *
   * @param name - Token name
   * @param hexColor - Hex color value
   * @param aliases - Alternative names for the token
   * @returns Created color token
   */
  async createColorToken(
    name: string,
    hexColor: string,
    aliases?: string[]
  ): Promise<ColorToken> {
    const rgb = this.hexToRgb(hexColor)
    const token: ColorToken = {
      id: this.generateId(),
      name,
      value: hexColor,
      hex: hexColor,
      rgb: rgb!,
      aliases
    }

    this.tokens.set(token.id, token)
    return token
  }

  /**
   * Create a complete color scale (e.g., primary 50-900)
   *
   * @param baseColor - Base color name
   * @param colors - Array of hex colors for the scale
   * @returns Array of created color tokens
   */
  async createColorScale(
    baseColor: string,
    colors: { [key: string]: string }
  ): Promise<ColorToken[]> {
    const scale: ColorToken[] = []

    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']

    for (const shade of shades) {
      if (colors[shade]) {
        const token = await this.createColorToken(
          `${baseColor}-${shade}`,
          colors[shade]
        )
        scale.push(token)
      }
    }

    return scale
  }

  /**
   * Create preset color scales (Material Design colors)
   *
   * @param name - Color name
   * @param baseColor - Base hex color
   * @returns Created color scale
   */
  async createMaterialColorScale(
    name: string,
    baseColor: string
  ): Promise<ColorToken[]> {
    // Material Design color palette generator
    const colors: { [key: string]: string } = {
      '50': this.lightenColor(baseColor, 95),
      '100': this.lightenColor(baseColor, 90),
      '200': this.lightenColor(baseColor, 80),
      '300': this.lightenColor(baseColor, 70),
      '400': this.lightenColor(baseColor, 60),
      '500': baseColor,
      '600': this.darkenColor(baseColor, 10),
      '700': this.darkenColor(baseColor, 20),
      '800': this.darkenColor(baseColor, 30),
      '900': this.darkenColor(baseColor, 40)
    }

    return this.createColorScale(name, colors)
  }

  /**
   * Create typography scale
   *
   * @param baseSize - Base font size in pixels
   * @returns Array of typography tokens
   */
  async createTypographyScale(baseSize: number = 16): Promise<TypographyToken[]> {
    const scales: TypographyToken[] = [
      {
        id: this.generateId(),
        name: 'Display Large',
        fontSize: Math.round(baseSize * 3.5),
        lineHeight: 1.2,
        fontWeight: 700,
        letterSpacing: -1.5
      },
      {
        id: this.generateId(),
        name: 'Display Medium',
        fontSize: Math.round(baseSize * 2.8),
        lineHeight: 1.3,
        fontWeight: 700,
        letterSpacing: 0
      },
      {
        id: this.generateId(),
        name: 'Display Small',
        fontSize: Math.round(baseSize * 2.2),
        lineHeight: 1.4,
        fontWeight: 700,
        letterSpacing: 0
      },
      {
        id: this.generateId(),
        name: 'Heading Large',
        fontSize: Math.round(baseSize * 2),
        lineHeight: 1.4,
        fontWeight: 700,
        letterSpacing: 0.15
      },
      {
        id: this.generateId(),
        name: 'Heading Medium',
        fontSize: Math.round(baseSize * 1.75),
        lineHeight: 1.5,
        fontWeight: 700,
        letterSpacing: 0.1
      },
      {
        id: this.generateId(),
        name: 'Heading Small',
        fontSize: Math.round(baseSize * 1.5),
        lineHeight: 1.6,
        fontWeight: 700,
        letterSpacing: 0.1
      },
      {
        id: this.generateId(),
        name: 'Body Large',
        fontSize: baseSize,
        lineHeight: 1.5,
        fontWeight: 400,
        letterSpacing: 0.5
      },
      {
        id: this.generateId(),
        name: 'Body Medium',
        fontSize: Math.round(baseSize * 0.875),
        lineHeight: 1.6,
        fontWeight: 400,
        letterSpacing: 0.25
      },
      {
        id: this.generateId(),
        name: 'Body Small',
        fontSize: Math.round(baseSize * 0.75),
        lineHeight: 1.5,
        fontWeight: 400,
        letterSpacing: 0.4
      },
      {
        id: this.generateId(),
        name: 'Label Large',
        fontSize: Math.round(baseSize * 0.875),
        lineHeight: 1.4,
        fontWeight: 600,
        letterSpacing: 0.1
      },
      {
        id: this.generateId(),
        name: 'Label Medium',
        fontSize: Math.round(baseSize * 0.75),
        lineHeight: 1.3,
        fontWeight: 600,
        letterSpacing: 0.5
      },
      {
        id: this.generateId(),
        name: 'Label Small',
        fontSize: Math.round(baseSize * 0.65),
        lineHeight: 1.3,
        fontWeight: 600,
        letterSpacing: 0.5
      }
    ]

    scales.forEach(scale => this.tokens.set(scale.id, scale))
    return scales
  }

  /**
   * Create spacing scale (8px or 4px based)
   *
   * @param baseValue - Base spacing value
   * @param count - Number of scale steps
   * @returns Array of spacing tokens
   */
  async createSpacingScale(
    baseValue: number = 8,
    count: number = 12
  ): Promise<SpacingToken[]> {
    const scales: SpacingToken[] = []
    const names = [
      'XS', 'S', 'SM', 'M', 'MD', 'L', 'LG', 'XL', '2XL', '3XL', '4XL', '5XL'
    ]

    for (let i = 0; i < count; i++) {
      const value = baseValue * (i + 1)
      const token: SpacingToken = {
        id: this.generateId(),
        name: `Spacing ${names[i] || `${i + 1}x`}`,
        value,
        unit: 'px'
      }
      scales.push(token)
      this.tokens.set(token.id, token)
    }

    return scales
  }

  /**
   * Create a sizing scale
   *
   * @returns Array of sizing tokens
   */
  async createSizingScale(): Promise<SpacingToken[]> {
    const sizes = [
      200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720
    ]

    return Promise.all(
      sizes.map(async size => {
        const token: SpacingToken = {
          id: this.generateId(),
          name: `Size ${size}`,
          value: size,
          unit: 'px'
        }
        this.tokens.set(token.id, token)
        return token
      })
    )
  }

  /**
   * Get token by ID
   *
   * @param id - Token ID
   * @returns Token or null
   */
  async getToken(id: string): Promise<ColorToken | TypographyToken | SpacingToken | null> {
    return this.tokens.get(id) || null
  }

  /**
   * Get token by name
   *
   * @param name - Token name
   * @returns Token or null
   */
  async getTokenByName(
    name: string
  ): Promise<ColorToken | TypographyToken | SpacingToken | null> {
    for (const token of this.tokens.values()) {
      if (token.name === name) {
        return token
      }
    }
    return null
  }

  /**
   * List all tokens
   *
   * @returns All tokens
   */
  async listTokens(): Promise<(ColorToken | TypographyToken | SpacingToken)[]> {
    return Array.from(this.tokens.values())
  }

  /**
   * List tokens by type
   *
   * @param type - Variable type
   * @returns Filtered tokens
   */
  async listTokensByType(type: string): Promise<(ColorToken | TypographyToken | SpacingToken)[]> {
    return Array.from(this.tokens.values()).filter(t => {
      if (type === 'color') return 'hex' in t
      if (type === 'typography') return 'fontSize' in t
      if (type === 'spacing') return 'unit' in t && 'value' in t
      return false
    })
  }

  /**
   * Update token
   *
   * @param id - Token ID
   * @param updates - Partial updates
   */
  async updateToken(
    id: string,
    updates: Partial<ColorToken | TypographyToken | SpacingToken>
  ): Promise<void> {
    const token = this.tokens.get(id)
    if (!token) throw new Error(`Token ${id} not found`)

    const updated = { ...token, ...updates }
    this.tokens.set(id, updated)
  }

  /**
   * Delete token
   *
   * @param id - Token ID
   */
  async deleteToken(id: string): Promise<void> {
    this.tokens.delete(id)
  }

  /**
   * Export design system as JSON
   *
   * @returns JSON representation of all tokens
   */
  async exportDesignSystem(): Promise<string> {
    const system = {
      colors: Array.from(this.tokens.values()).filter(t => 'hex' in t),
      typography: Array.from(this.tokens.values()).filter(t => 'fontSize' in t),
      spacing: Array.from(this.tokens.values()).filter(t => 'unit' in t && 'value' in t),
      exportedAt: new Date().toISOString()
    }

    return JSON.stringify(system, null, 2)
  }

  /**
   * Get statistics about design system
   *
   * @returns Statistics object
   */
  async getStatistics(): Promise<{
    totalTokens: number
    colorTokens: number
    typographyTokens: number
    spacingTokens: number
  }> {
    const allTokens = Array.from(this.tokens.values())
    return {
      totalTokens: allTokens.length,
      colorTokens: allTokens.filter(t => 'hex' in t).length,
      typographyTokens: allTokens.filter(t => 'fontSize' in t).length,
      spacingTokens: allTokens.filter(t => 'unit' in t && 'value' in t).length
    }
  }

  /**
   * Helper: Convert hex color to RGB
   *
   * @private
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  }

  /**
   * Helper: Lighten color
   *
   * @private
   */
  private lightenColor(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const lightened = {
      r: Math.round(rgb.r + (255 - rgb.r) * (percent / 100)),
      g: Math.round(rgb.g + (255 - rgb.g) * (percent / 100)),
      b: Math.round(rgb.b + (255 - rgb.b) * (percent / 100))
    }

    return `#${(
      (1 << 24) +
      (lightened.r << 16) +
      (lightened.g << 8) +
      lightened.b
    )
      .toString(16)
      .slice(1)}`
  }

  /**
   * Helper: Darken color
   *
   * @private
   */
  private darkenColor(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const darkened = {
      r: Math.round(rgb.r * (1 - percent / 100)),
      g: Math.round(rgb.g * (1 - percent / 100)),
      b: Math.round(rgb.b * (1 - percent / 100))
    }

    return `#${(
      (1 << 24) +
      (darkened.r << 16) +
      (darkened.g << 8) +
      darkened.b
    )
      .toString(16)
      .slice(1)}`
  }

  /**
   * Generate unique token ID
   *
   * @private
   */
  private generateId(): string {
    return `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const tokens = new TokenManager(webflow)
 *
 * // Create color scales
 * const primaryColors = await tokens.createMaterialColorScale('Primary', '#0066CC')
 * const neutralColors = await tokens.createMaterialColorScale('Neutral', '#F5F5F5')
 *
 * // Create typography system
 * const typography = await tokens.createTypographyScale(16)
 *
 * // Create spacing system
 * const spacing = await tokens.createSpacingScale(8, 12)
 * const sizing = await tokens.createSizingScale()
 *
 * // Export design system
 * const designSystem = await tokens.exportDesignSystem()
 * console.log(designSystem)
 *
 * // Get statistics
 * const stats = await tokens.getStatistics()
 * console.log(`Total tokens: ${stats.totalTokens}`)
 * ```
 */
