import { ActivityEvent } from '../core/events';

/**
 * VS Code 런타임 모듈에 안전하게 접근합니다.
 * 테스트 환경처럼 vscode 모듈이 없을 수 있는 상황을 try-catch로 감쌉니다.
 */
type VscodeModule = typeof import('vscode');

export function getVscode(): VscodeModule | undefined {
  try {
    return require('vscode') as VscodeModule;
  } catch {
    return undefined;
  }
}
