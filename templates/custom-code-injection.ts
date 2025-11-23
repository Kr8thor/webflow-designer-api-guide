/**
 * Custom Code Injection Template
 *
 * Complete guide for injecting custom code into Webflow sites.
 * Covers: head/body code injection, script injection, style injection, and code management.
 *
 * @example
 * import { CodeInjector } from './templates/custom-code-injection';
 * const injector = new CodeInjector();
 * await injector.injectHeadCode('<meta name="custom" content="value">');
 */

import { webflow } from '@webflow/designer-api';

/**
 * Code injection types
 */
export type CodeType = 'javascript' | 'css' | 'html';
export type CodeLocation = 'head' | 'body' | 'element';

/**
 * Code injection metadata
 */
export interface InjectedCode {
  id: string;
  name: string;
  code: string;
  type: CodeType;
  location: CodeLocation;
  elementId?: string;
  createdAt: Date;
  enabled: boolean;
}

/**
 * Comprehensive code injection class
 */
export class CodeInjector {
  /**
   * Inject code into page head
   */
  async injectHeadCode(code: string, name?: string): Promise<boolean> {
    try {
      if (!code || code.trim().length === 0) {
        webflow.notify.error('Code cannot be empty');
        return false;
      }

      const page = webflow.getCurrentPage?.();

      if (!page) {
        webflow.notify.error('No page selected');
        return false;
      }

      // Get or create head element
      const head = page.getElements?.()?.find(el => el.getTag?.() === 'head');

      if (!head) {
        webflow.notify.error('Head element not found');
        return false;
      }

      // Create script/style element
      if (code.includes('<script') || code.includes('javascript')) {
        const script = webflow.createElem('script', {
          text: code,
          attributes: { type: 'text/javascript' }
        });
        head.append(script);
      } else if (code.includes('<style') || code.includes('css')) {
        const style = webflow.createElem('style', {
          text: code,
          attributes: { type: 'text/css' }
        });
        head.append(style);
      } else {
        // Raw HTML
        const temp = webflow.createElem('div', {
          attributes: { style: 'display:none;' },
          text: code
        });
        head.append(temp);
      }

      webflow.notify.success(
        `Code injected to head${name ? ` (${name})` : ''}`
      );
      return true;
    } catch (error) {
      console.error('Failed to inject head code:', error);
      webflow.notify.error('Failed to inject code');
      return false;
    }
  }

  /**
   * Inject code into page body
   */
  async injectBodyCode(code: string, name?: string): Promise<boolean> {
    try {
      if (!code || code.trim().length === 0) {
        webflow.notify.error('Code cannot be empty');
        return false;
      }

      const page = webflow.getCurrentPage?.();

      if (!page) {
        webflow.notify.error('No page selected');
        return false;
      }

      // Get or create body element
      const body = page.getElements?.()?.find(el => el.getTag?.() === 'body');

      if (!body) {
        webflow.notify.error('Body element not found');
        return false;
      }

      // Create script element
      const script = webflow.createElem('script', {
        text: code,
        attributes: {
          type: 'text/javascript',
          'data-injected': 'true',
          'data-name': name || 'injected-code'
        }
      });

      body.append(script);

      webflow.notify.success(
        `Code injected to body${name ? ` (${name})` : ''}`
      );
      return true;
    } catch (error) {
      console.error('Failed to inject body code:', error);
      webflow.notify.error('Failed to inject code');
      return false;
    }
  }

  /**
   * Inject CSS into page
   */
  async injectCSS(css: string, name?: string): Promise<boolean> {
    try {
      if (!css || css.trim().length === 0) {
        webflow.notify.error('CSS cannot be empty');
        return false;
      }

      const page = webflow.getCurrentPage?.();

      if (!page) {
        webflow.notify.error('No page selected');
        return false;
      }

      const head = page.getElements?.()?.find(el => el.getTag?.() === 'head');

      if (!head) {
        webflow.notify.error('Head element not found');
        return false;
      }

      const style = webflow.createElem('style', {
        text: css,
        attributes: {
          type: 'text/css',
          'data-injected': 'true',
          'data-name': name || 'injected-css'
        }
      });

      head.append(style);

      webflow.notify.success(`CSS injected${name ? ` (${name})` : ''}`);
      return true;
    } catch (error) {
      console.error('Failed to inject CSS:', error);
      webflow.notify.error('Failed to inject CSS');
      return false;
    }
  }

  /**
   * Inject code into specific element
   */
  async injectToElement(
    elementId: string,
    code: string,
    type: 'before' | 'after' | 'append' | 'prepend' = 'append'
  ): Promise<boolean> {
    try {
      const element = webflow.getElement(elementId);

      if (!element) {
        webflow.notify.error('Element not found');
        return false;
      }

      const wrapper = webflow.createElem('div', {
        attributes: { 'data-injected': 'true' },
        text: code
      });

      switch (type) {
        case 'before':
          element.before(wrapper);
          break;
        case 'after':
          element.after(wrapper);
          break;
        case 'prepend':
          element.prepend(wrapper);
          break;
        case 'append':
          element.append(wrapper);
          break;
      }

      webflow.notify.success(`Code injected to element (${type})`);
      return true;
    } catch (error) {
      console.error('Failed to inject to element:', error);
      webflow.notify.error('Failed to inject code');
      return false;
    }
  }

  /**
   * Get all injected code in page
   */
  async getInjectedCode(): Promise<InjectedCode[]> {
    try {
      const page = webflow.getCurrentPage?.();

      if (!page) {
        return [];
      }

      const injected: InjectedCode[] = [];
      const elements = page.getElements?.() || [];

      for (const element of elements) {
        if (element.getAttribute('data-injected') === 'true') {
          injected.push({
            id: element.getId?.() || '',
            name: element.getAttribute('data-name') || 'Unnamed',
            code: element.getText?.() || '',
            type: element.getTag?.() === 'script' ? 'javascript' : 'html',
            location: 'element',
            elementId: element.getId?.(),
            createdAt: new Date(),
            enabled: true
          });
        }
      }

      return injected;
    } catch (error) {
      console.error('Failed to get injected code:', error);
      return [];
    }
  }

  /**
   * Remove injected code
   */
  async removeInjectedCode(codeId: string): Promise<boolean> {
    try {
      const element = webflow.getElement(codeId);

      if (!element) {
        webflow.notify.error('Injected code not found');
        return false;
      }

      element.delete?.();
      webflow.notify.success('Injected code removed');
      return true;
    } catch (error) {
      console.error('Failed to remove injected code:', error);
      webflow.notify.error('Failed to remove code');
      return false;
    }
  }

  /**
   * Update injected code
   */
  async updateInjectedCode(codeId: string, newCode: string): Promise<boolean> {
    try {
      const element = webflow.getElement(codeId);

      if (!element) {
        webflow.notify.error('Injected code not found');
        return false;
      }

      element.setText?.(newCode);
      webflow.notify.success('Injected code updated');
      return true;
    } catch (error) {
      console.error('Failed to update injected code:', error);
      webflow.notify.error('Failed to update code');
      return false;
    }
  }

  /**
   * Inject external script
   */
  async injectExternalScript(
    src: string,
    async = true,
    defer = false
  ): Promise<boolean> {
    try {
      if (!src || !src.startsWith('http')) {
        webflow.notify.error('Invalid script URL');
        return false;
      }

      const page = webflow.getCurrentPage?.();

      if (!page) {
        webflow.notify.error('No page selected');
        return false;
      }

      const head = page.getElements?.()?.find(el => el.getTag?.() === 'head');

      if (!head) {
        webflow.notify.error('Head element not found');
        return false;
      }

      const script = webflow.createElem('script', {
        attributes: {
          src,
          type: 'text/javascript',
          async: async ? 'async' : '',
          defer: defer ? 'defer' : '',
          'data-external': 'true'
        }
      });

      head.append(script);

      webflow.notify.success(`External script injected: ${src}`);
      return true;
    } catch (error) {
      console.error('Failed to inject external script:', error);
      webflow.notify.error('Failed to inject script');
      return false;
    }
  }

  /**
   * Inject external stylesheet
   */
  async injectExternalStylesheet(href: string): Promise<boolean> {
    try {
      if (!href || !href.startsWith('http')) {
        webflow.notify.error('Invalid stylesheet URL');
        return false;
      }

      const page = webflow.getCurrentPage?.();

      if (!page) {
        webflow.notify.error('No page selected');
        return false;
      }

      const head = page.getElements?.()?.find(el => el.getTag?.() === 'head');

      if (!head) {
        webflow.notify.error('Head element not found');
        return false;
      }

      const link = webflow.createElem('link', {
        attributes: {
          rel: 'stylesheet',
          href,
          type: 'text/css',
          'data-external': 'true'
        }
      });

      head.append(link);

      webflow.notify.success(`External stylesheet injected: ${href}`);
      return true;
    } catch (error) {
      console.error('Failed to inject stylesheet:', error);
      webflow.notify.error('Failed to inject stylesheet');
      return false;
    }
  }

  /**
   * Check if code is valid JavaScript
   */
  isValidJavaScript(code: string): boolean {
    try {
      new Function(code);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if code is valid CSS
   */
  isValidCSS(code: string): boolean {
    try {
      const style = document.createElement('style');
      style.textContent = code;
      return !style.textContent.includes('ERROR');
    } catch {
      return false;
    }
  }

  /**
   * Export injected code
   */
  async exportInjectedCode(): Promise<object> {
    try {
      const injected = await this.getInjectedCode();

      return {
        exportedAt: new Date().toISOString(),
        count: injected.length,
        code: injected.map(c => ({
          name: c.name,
          type: c.type,
          code: c.code,
          createdAt: c.createdAt
        }))
      };
    } catch (error) {
      console.error('Failed to export code:', error);
      return {};
    }
  }
}

/**
 * Quick helper functions
 */

/**
 * Inject JavaScript code
 */
export async function injectJavaScript(code: string): Promise<boolean> {
  const injector = new CodeInjector();
  return injector.injectBodyCode(code, 'JavaScript');
}

/**
 * Inject CSS code
 */
export async function injectCSSCode(css: string): Promise<boolean> {
  const injector = new CodeInjector();
  return injector.injectCSS(css, 'Custom CSS');
}

/**
 * Inject external script
 */
export async function injectScript(src: string): Promise<boolean> {
  const injector = new CodeInjector();
  return injector.injectExternalScript(src);
}

export default CodeInjector;
