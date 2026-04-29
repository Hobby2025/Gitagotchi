import { createInitialPetState } from "../src/core/petState";
import { createI18n } from "../src/i18n";
import { renderPetPanelHtml } from "../src/ui/petPanelPresentation";

describe("pet panel chrome", () => {
  it("renders readable language controls without emoji flags", () => {
    const html = renderPetPanelHtml(
      createInitialPetState("2026-04-28T00:00:00.000Z"),
      createI18n("ko"),
      {
        cspSource: "vscode-resource:",
        nonce: "abc",
      },
    );

    expect(html).toContain('class="lang-bar"');
    expect(html).toContain('data-locale="en" title="EN">EN</button>');
    expect(html).toContain('data-locale="ko" title="KO">KO</button>');
    expect(html).toContain('data-locale="ja" title="JA">JA</button>');
    expect(html).toContain('data-locale="zh" title="ZH">ZH</button>');
  });

  it("renders a page footer copyright notice", () => {
    const html = renderPetPanelHtml(
      createInitialPetState("2026-04-28T00:00:00.000Z"),
      createI18n("en"),
      {
        cspSource: "vscode-resource:",
        nonce: "abc",
      },
    );

    expect(html).toContain('class="page-footer"');
    expect(html).toContain("Copyright 2026 Hobby. All rights reserved.");
  });
});
