// Element Manipulation Template
// Comprehensive examples for working with elements in Webflow Designer API

interface Element {
  id: string;
  name: string;
  type: string;
  parent?: Element;
  children?: Element[];
  styles?: Record<string, string>;
  properties?: Record<string, any>;
}

/**
 * Get the currently selected element
 */
export async function getSelectedElement(): Promise<Element | null> {
  try {
    const element = await window.webflow.getSelectedElement();
    if (!element) {
      console.warn('ℹ️ No element selected');
      return null;
    }
    return element as unknown as Element;
  } catch (error) {
    console.error('❌ Failed to get selected element:', error);
    return null;
  }
}

/**
 * Get the root element of the current page
 */
export async function getRootElement(): Promise<Element | null> {
  try {
    const element = await window.webflow.getRootElement();
    if (!element) {
      console.warn('ℹ️ Root element not found');
      return null;
    }
    return element as unknown as Element;
  } catch (error) {
    console.error('❌ Failed to get root element:', error);
    return null;
  }
}

/**
 * Create a new element and append to parent
 */
export async function createElement(
  parentElement: Element,
  elementType: string,
  name: string
): Promise<Element | null> {
  try {
    const newElement = await (parentElement as any).append(elementType);
    await (newElement as any).setName(name);
    console.log('✅ Created element:', name, 'of type:', elementType);
    return newElement as unknown as Element;
  } catch (error) {
    console.error('❌ Failed to create element:', error);
    return null;
  }
}

/**
 * Set element styles
 */
export async function setElementStyles(
  element: Element,
  styles: Record<string, string>
): Promise<boolean> {
  try {
    await (element as any).setStyles(styles);
    console.log('✅ Styles applied to element:', element.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to set styles:', error);
    return false;
  }
}

/**
 * Set element properties
 */
export async function setElementProperties(
  element: Element,
  properties: Record<string, any>
): Promise<boolean> {
  try {
    await (element as any).setProperties(properties);
    console.log('✅ Properties updated for element:', element.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to set properties:', error);
    return false;
  }
}

/**
 * Set element text content
 */
export async function setElementText(
  element: Element,
  text: string
): Promise<boolean> {
  try {
    await (element as any).setTextContent(text);
    console.log('✅ Text content set for element:', element.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to set text content:', error);
    return false;
  }
}

/**
 * Add CSS classes to element
 */
export async function addElementClasses(
  element: Element,
  classes: string[]
): Promise<boolean> {
  try {
    await (element as any).setClasses([...classes]);
    console.log('✅ Classes added to element:', element.name, classes);
    return true;
  } catch (error) {
    console.error('❌ Failed to add classes:', error);
    return false;
  }
}

/**
 * Remove element from canvas
 */
export async function removeElement(element: Element): Promise<boolean> {
  try {
    await (element as any).remove();
    console.log('✅ Element removed:', element.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to remove element:', error);
    return false;
  }
}

/**
 * Duplicate an element
 */
export async function duplicateElement(element: Element): Promise<Element | null> {
  try {
    const duplicate = await (element as any).duplicate();
    console.log('✅ Element duplicated:', element.name);
    return duplicate as unknown as Element;
  } catch (error) {
    console.error('❌ Failed to duplicate element:', error);
    return null;
  }
}

/**
 * Move element to new parent
 */
export async function moveElement(
  element: Element,
  newParent: Element,
  position?: number
): Promise<boolean> {
  try {
    await (element as any).moveTo(newParent, position);
    console.log('✅ Element moved to new parent:', newParent.name);
    return true;
  } catch (error) {
    console.error('❌ Failed to move element:', error);
    return false;
  }
}

/**
 * Get all child elements recursively
 */
export async function getElementChildren(element: Element): Promise<Element[]> {
  try {
    const children = (element as any).children || [];
    console.log('✅ Retrieved children for element:', element.name);
    return children as unknown as Element[];
  } catch (error) {
    console.error('❌ Failed to get children:', error);
    return [];
  }
}

/**
 * Find element by name recursively
 */
export async function findElementByName(
  parentElement: Element,
  targetName: string
): Promise<Element | null> {
  try {
    if (parentElement.name === targetName) {
      return parentElement;
    }

    const children = await getElementChildren(parentElement);
    for (const child of children) {
      const found = await findElementByName(child, targetName);
      if (found) return found;
    }

    return null;
  } catch (error) {
    console.error('❌ Failed to find element:', error);
    return null;
  }
}

/**
 * Batch create multiple elements
 */
export async function createMultipleElements(
  parentElement: Element,
  elementConfigs: Array<{
    type: string;
    name: string;
    styles?: Record<string, string>;
    text?: string;
  }>
): Promise<Element[]> {
  const createdElements: Element[] = [];

  try {
    for (const config of elementConfigs) {
      const element = await createElement(parentElement, config.type, config.name);
      if (element) {
        if (config.styles) {
          await setElementStyles(element, config.styles);
        }
        if (config.text) {
          await setElementText(element, config.text);
        }
        createdElements.push(element);
      }
    }
    console.log('✅ Created', createdElements.length, 'elements');
    return createdElements;
  } catch (error) {
    console.error('❌ Batch creation failed:', error);
    return createdElements;
  }
}

/**
 * Clone element with all its properties and styles
 */
export async function cloneElement(
  element: Element,
  newParent: Element
): Promise<Element | null> {
  try {
    const cloned = await createElement(
      newParent,
      element.type,
      element.name + '_clone'
    );

    if (!cloned) return null;

    if (element.styles) {
      await setElementStyles(cloned, element.styles);
    }

    if (element.properties) {
      await setElementProperties(cloned, element.properties);
    }

    console.log('✅ Element cloned:', element.name);
    return cloned;
  } catch (error) {
    console.error('❌ Failed to clone element:', error);
    return null;
  }
}

/**
 * Set element visibility (display: none / block)
 */
export async function setElementVisibility(
  element: Element,
  isVisible: boolean
): Promise<boolean> {
  try {
    const display = isVisible ? 'block' : 'none';
    await setElementStyles(element, { display });
    console.log(
      '✅ Element visibility set:',
      element.name,
      isVisible ? 'visible' : 'hidden'
    );
    return true;
  } catch (error) {
    console.error('❌ Failed to set visibility:', error);
    return false;
  }
}

export default {
  getSelectedElement,
  getRootElement,
  createElement,
  setElementStyles,
  setElementProperties,
  setElementText,
  addElementClasses,
  removeElement,
  duplicateElement,
  moveElement,
  getElementChildren,
  findElementByName,
  createMultipleElements,
  cloneElement,
  setElementVisibility,
};
