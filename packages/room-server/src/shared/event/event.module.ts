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

<<<<<<<< HEAD:apitable/packages/room-server/src/shared/event/event.module.ts
import { Module } from '@nestjs/common';
import { OTEventService } from './ot.event.service';

@Module({
  imports: [],
  providers: [OTEventService],
  exports: [OTEventService],
})
export class EventModule {}
========
package com.apitable.interfaces.document.facade;

import java.util.List;

/**
 * document service facade.
 */
public interface DocumentServiceFacade {

    String getSpaceIdByDocumentName(String documentName);

    void remove(Long userId, List<String> nodeIds);

    void recover(Long userId, List<String> nodeIds);
}
>>>>>>>> 9bb4ea7908331ff48e515120432efc95f83d16c8:apitable/backend-server/application/src/main/java/com/apitable/interfaces/document/facade/DocumentServiceFacade.java
