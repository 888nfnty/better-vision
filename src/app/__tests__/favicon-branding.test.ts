/**
 * Favicon branding tests — VAL-VISUAL-010
 *
 * The browser tab icon must use the provided BETTER light isotype asset
 * rather than a generic placeholder or the default Next.js favicon.
 *
 * Next.js App Router serves `app/icon.svg` as the site favicon
 * automatically via the file-convention metadata pipeline.
 */

import * as fs from "fs";
import * as path from "path";

const APP_DIR = path.resolve(__dirname, "..");

describe("Favicon branding (VAL-VISUAL-010)", () => {
  it("icon.svg exists in the app directory", () => {
    const iconPath = path.join(APP_DIR, "icon.svg");
    expect(fs.existsSync(iconPath)).toBe(true);
  });

  it("icon.svg is a valid SVG containing the BETTER isotype paths", () => {
    const iconPath = path.join(APP_DIR, "icon.svg");
    const content = fs.readFileSync(iconPath, "utf-8");
    // Must be a valid SVG document
    expect(content).toContain("<svg");
    expect(content).toContain("</svg>");
    // Must contain the BETTER isotype geometry (key path from the source asset)
    expect(content).toContain('viewBox="0 0 495 437"');
    expect(content).toContain('fill="white"');
  });

  it("the default favicon.ico has been removed", () => {
    const faviconPath = path.join(APP_DIR, "favicon.ico");
    expect(fs.existsSync(faviconPath)).toBe(false);
  });
});
