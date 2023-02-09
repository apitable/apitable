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

import { generateRandomString } from '@apitable/core';
import { Metadata, MetadataValue } from '@grpc/grpc-js';
import { TRACE_ID } from 'shared/common';

export function initGlobalGrpcMetadata(extMeta?: { [key: string]: MetadataValue }) {
  const grpcMeta = new Metadata();
  // initialize trace id
  grpcMeta.set(TRACE_ID, generateRandomString());
  if (extMeta) {
    Object.entries(extMeta).forEach(([k, v]) => {
      grpcMeta.set(k, v);
    });
  }
  return grpcMeta;
}