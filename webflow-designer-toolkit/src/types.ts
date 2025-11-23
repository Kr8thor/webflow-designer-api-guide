/**
 * Designer API Type Definitions
 *
 * This file provides type definitions for the Designer API
 * In production, these come from @webflow/designer-api
 */

export interface Element {
  getId?(): string;
  getName?(): string;
  getTagName?(): string;
  getAttributes?(): Record<string, any>;
  setAttributes?(attrs: Record<string, any>): void;
  getChildren?(): Element[];
  getParent?(): Element | null;
  setInlineStyle?(property: string, value: string): void;
  delete?(): void;
}

export interface Component {
  getId?(): string;
  getName?(): string;
  getInstances?(): Element[];
  getVariants?(): string[];
  setName?(name: string): void;
}

export interface Page {
  getId?(): string;
  getName?(): string;
  getElements?(): Element[];
}

export interface Variable {
  getId?(): string;
  getName?(): string;
  getType?(): string;
  getValue?(): any;
  setValue?(value: any): void;
  setName?(name: string): void;
  delete?(): void;
}

export interface Asset {
  getId?(): string;
  getName?(): string;
  getType?(): string;
  getSize?(): number;
  getUrl?(): string;
}

export interface NotificationAPI {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
}

export interface DesignerAPI {
  getSelectedElements(): Element[];
  selectElements(elements: Element[]): void;
  createElem(tag: string, options?: any): Element;
  getElement(id: string): Element | null;
  getAllPages?(): Page[];
  getCurrentPage(): Page | null;
  getPage(id: string): Page | null;
  getComponents?(): Component[];
  getVariables?(): Variable[];
  getAssets?(): Asset[];
  on(event: string, callback: Function): void;
  off(event: string, callback?: Function): void;
  notify: NotificationAPI;
}

// Global webflow object
declare const webflow: DesignerAPI;

export { webflow };
