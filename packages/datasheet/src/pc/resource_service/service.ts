import { BroadcastTypes, IReduxState, Selectors } from '@apitable/core';
import { IServiceError, ResourceService } from '@apitable/widget-sdk';
import { SimpleEmitter } from 'modules/shared/simple_emitter';
import { Store } from 'redux';
import { Clipboard } from '../common/clipboard';
import { KeybindingService } from '../../modules/shared/shortcut_key/keybinding_service';
import { UploadManager } from '../utils';

export class ResourceServiceEnhanced extends ResourceService {
  simpleEmitter!: SimpleEmitter;
  uploadManager!: UploadManager;
  keybindingService!: KeybindingService;
  clipboard!: Clipboard;

  constructor(public store: Store<IReduxState>, public onError: IServiceError) {
    super(store, onError);
  }

  init() {
    if (this.initialized) {
      console.warn('! ' + 'Do not repeat the initialize resource service');
      return;
    }
    super.init();
    this.simpleEmitter = new SimpleEmitter();
    this.keybindingService = new KeybindingService();
    this.uploadManager = new UploadManager(5, this.commandManager);
    this.clipboard = new Clipboard(this.commandManager, this.uploadManager);
    console.log('resource service initialized successfully');
  }

  destroy() {
    if (!this.initialized) {
      return;
    }
    super.destroy();
    this.simpleEmitter.destroy();
    this.uploadManager.destroy();
    this.keybindingService.destroy();
  }

  sendCursor(props: any) {
    this.roomService.sendMessages(BroadcastTypes.ENGAGEMENT_CURSOR, props);
  }

}

/**
 * For debug && testing
 */
(()=>{
  if(!process.env.SSR){
    (window as any).VkSelectors = Selectors;
  }
})();
