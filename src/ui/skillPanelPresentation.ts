import { PetSkill, PetState } from '../core/petState';
import { I18n } from '../i18n';
import { renderHtmlTemplate } from './webviewSecurity';

const skillMeta: Record<PetSkill, { effectKey: string; triggerKey: string }> = {
  deepClean: { effectKey: 'skill.deepClean.effect', triggerKey: 'skill.deepClean.trigger' },
  quickFix: { effectKey: 'skill.quickFix.effect', triggerKey: 'skill.quickFix.trigger' },
  fieldGuide: { effectKey: 'skill.fieldGuide.effect', triggerKey: 'skill.fieldGuide.trigger' },
  focusFlow: { effectKey: 'skill.focusFlow.effect', triggerKey: 'skill.focusFlow.trigger' },
  commitRoar: { effectKey: 'skill.commitRoar.effect', triggerKey: 'skill.commitRoar.trigger' }
};

function renderSkillCards(state: PetState, i18n: I18n): string {
  if (state.skills.length === 0) {
    return `<div class="empty"><strong>${renderHtmlTemplate.escape(i18n.t('ui.skillsEmpty'))}</strong><span>${renderHtmlTemplate.escape(i18n.t('ui.unlockHint'))}</span></div>`;
  }

  return state.skills
    .map((skill) => {
      const meta = skillMeta[skill];

      return `<article class="skill-card"><strong>${renderHtmlTemplate.escape(i18n.t(`skill.${skill}`))}</strong><span>${renderHtmlTemplate.escape(i18n.t(meta.effectKey))}</span><em>${renderHtmlTemplate.escape(i18n.t(meta.triggerKey))}</em></article>`;
    })
    .join('');
}

export function renderSkillPanelHtml(state: PetState, i18n: I18n, cspSource = ''): string {
  const skills = renderSkillCards(state, i18n);

  return `<!doctype html>
<html lang="${i18n.locale}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${cspSource};">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    h1 { margin: 0 0 14px; font-size: 20px; line-height: 1.25; letter-spacing: 0; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .skill-card, .empty { display: grid; gap: 6px; padding: 12px; border: 1px solid var(--vscode-panel-border); border-radius: 7px; background: var(--vscode-editorWidget-background); }
    .skill-card strong, .empty strong { font-size: 13px; line-height: 1.25; }
    .skill-card span, .empty span { color: var(--vscode-descriptionForeground); font-size: 12px; line-height: 1.45; }
    .skill-card em { color: var(--vscode-charts-yellow); font-style: normal; font-size: 11px; line-height: 1.25; }
    @media (max-width: 560px) {
      .skills-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <h1>${renderHtmlTemplate.escape(i18n.t('ui.skills'))}</h1>
  <section class="skills-grid">${skills}</section>
</body>
</html>`;
}
