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
import { getEmojiIconNativeString } from '@apitable/core';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { getAPINodeType } from 'shared/helpers/fusion.helper';
import { IAPINodeInfo } from 'shared/interfaces/node.interface';
import { RestService } from 'shared/services/rest/rest.service';

@Injectable()
export class FusionNodeApiService {
  constructor(
    private readonly restService: RestService,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) { }

  public async getNodeList(spaceId: string, type: number, role: 'reader' | 'editor'): Promise<IAPINodeInfo[]> {
    const authHeader = { token: this.request.headers.authorization };
    const nodes = await this.restService.getNodesList(authHeader, spaceId, type, role);
    return nodes.map(node => {
      return {
        id: node.nodeId,
        name: node.nodeName,
        type: getAPINodeType(node.type),
        icon: getEmojiIconNativeString(node.icon),
        parentId: node.parentId,
      };
    });
  }

}