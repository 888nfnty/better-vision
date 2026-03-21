import "@testing-library/jest-dom";

// Mock IntersectionObserver for jsdom (used by RoadmapAtlas scroll-linked storytelling)
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = jest.fn();

// Mock matchMedia for jsdom (used by VisualEffectsProvider reduced-motion detection)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock canvas getContext for jsdom (used by HeroShaderCanvas WebGL initialization)
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
