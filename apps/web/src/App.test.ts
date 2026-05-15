import { describe, expect, it } from 'vitest';

class TestElement {
  className = '';
  textContent = '';
  children: TestElement[] = [];

  constructor(readonly tagName: string) {}

  append(...children: TestElement[]) {
    this.children.push(...children);
  }

  replaceChildren(...children: TestElement[]) {
    this.children = children;
  }

  get innerText(): string {
    return [this.textContent, ...this.children.map((child) => child.innerText)]
      .filter(Boolean)
      .join(' ');
  }
}

describe('renderApp', () => {
  it('renders the read-only foundation inspection shell without expanding claims', async () => {
    const documentStub = {
      createElement: (tagName: string) => new TestElement(tagName),
    };
    Object.defineProperty(globalThis, 'document', {
      value: documentStub,
      configurable: true,
    });

    const { renderApp } = await import('./App');
    const root = new TestElement('div') as unknown as HTMLElement;
    renderApp(root);

    const text = (root as unknown as TestElement).innerText;
    expect(text).toContain('Automated Water Filter System');
    expect(text).toContain('No potable-water');
    expect(text).toContain('Foundation inspection only');
    expect(text).toContain('Modules');
    expect(text).toContain('Products');
    expect(text).toContain('Education');
  });
});
