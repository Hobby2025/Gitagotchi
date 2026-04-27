import { ActivityEvent } from '../core/events';

/**
 * VSCode 런타임 모듈에 대한 안전한 접근을 제공합니다.
 * 테스트 환경(vscode 미설치)에서도 실행될 수 있도록 try-catch로 감쌉니다.
 */
type VscodeModule = typeof import('vscode');

export function getVscode(): VscodeModule | undefined {
  try {
    return require('vscode') as VscodeModule;
  } catch {
    return undefined;
  }
}
