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
