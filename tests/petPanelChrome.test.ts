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

  it("renders a localized help button and guide next to language controls", () => {
    const html = renderPetPanelHtml(
      createInitialPetState("2026-04-28T00:00:00.000Z"),
      createI18n("ko"),
      {
        cspSource: "vscode-resource:",
        nonce: "abc",
      },
    );

    expect(html).toContain('class="guide-btn"');
    expect(html).toContain('class="top-action-btn" data-command="rename"');
    expect(html).toContain('class="top-action-btn danger" data-command="reset"');
    expect(html).toMatch(/<div class="top-actions">[\s\S]*data-command="rename"[\s\S]*data-command="reset"[\s\S]*data-guide-open/);
    expect(html).toContain('aria-label="도움말"');
    expect(html).toContain('title="도움말">?</button>');
    expect(html).toContain('id="guide-panel"');
    expect(html).toContain('Gitagotchi 가이드');
    expect(html).toContain('성장 방향');
    expect(html).toContain('커밋, 코드 변경, 문제 해결로 경험치와 스타일 점수를 얻습니다.');
    expect(html).toContain('data-guide-open');
    expect(html).toContain('data-guide-close');
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
