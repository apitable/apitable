import { UndoManager } from './undo_manager';
import LRU from 'lru-cache';

export class UndoManagerStash {
  private stash: LRU<string, UndoManager>;

  constructor() {
    this.stash = new LRU(5);
  }

  public setStash(resourceId: string, undoManager: UndoManager) {
    this.stash.set(resourceId, undoManager);
  }

  public getStash(resourceId: string): UndoManager {
    let undoManager = this.stash.get(resourceId);
    if (!undoManager) {
      undoManager = new UndoManager(resourceId);
      this.setStash(resourceId, undoManager);
    }
    return undoManager;
  }

  public destroy() {
    this.stash.reset();
  }
}