/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Store } from 'redux';
import { BroadcastTypes, IReduxState, Selectors } from '@apitable/core';
import { IServiceError, ResourceService } from '@apitable/widget-sdk';
import { SimpleEmitter } from 'modules/shared/simple_emitter';
import { UploadManager } from 'pc/utils/upload_manager';
import { KeybindingService } from '../../modules/shared/shortcut_key/keybinding_service';
import { Clipboard } from '../common/clipboard';

export class ResourceServiceEnhanced extends ResourceService {
  simpleEmitter!: SimpleEmitter;
  uploadManager!: UploadManager;
  keybindingService!: KeybindingService;
  clipboard!: Clipboard;

  constructor(
    public override store: Store<IReduxState>,
    public override onError: IServiceError,
  ) {
    super(store, onError);
  }

  override init() {
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

  override destroy() {
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
(() => {
  if (!process.env.SSR) {
    (window as any).VkSelectors = Selectors;
  }
})();
