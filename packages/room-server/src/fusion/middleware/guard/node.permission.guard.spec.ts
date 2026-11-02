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

import { ApiTipConstant } from '@apitable/core';
import { Reflector } from '@nestjs/core';
import { NodePermissionGuard } from 'fusion/middleware/guard/node.permission.guard';
import { ApiException } from '../../../shared/exception';

// The real NodePermissionService pulls in the datasheet service chain
// (including native modules) at import time; the guard only needs the
// class as a constructor token, so substitute a lightweight stand-in.
jest.mock('node/services/node.permission.service', () => ({
  NodePermissionService: class NodePermissionService {},
}));

describe('NodePermissionGuard', () => {
  let guard: NodePermissionGuard;
  let context: any;
  let reflector: Reflector;
  let permissionService: any;

  const permissionError = ApiException.tipError(ApiTipConstant.api_node_permission_error);

  beforeEach(() => {
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
      getHandler: jest.fn().mockReturnThis(),
    };
    (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({
      params: { datasheetId: 'dstTest' },
      headers: { authorization: 'Bearer token' },
    });
    permissionService = {
      getNodeRole: jest.fn(),
    };
    reflector = new Reflector();
    guard = new NodePermissionGuard(reflector, permissionService as any);
  });

  describe('canActivate', () => {
    it('no permissions metadata--should return true without asking the backend', async () => {
      jest.spyOn(reflector, 'get').mockImplementationOnce(() => undefined);
      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(permissionService.getNodeRole).not.toHaveBeenCalled();
    });

    it('backend throws, as it does when a private node is denied--should throw the permission error instead of failing open', async () => {
      jest.spyOn(reflector, 'get').mockImplementationOnce(() => ['editable']);
      permissionService.getNodeRole.mockRejectedValueOnce(new Error('node access denied'));
      await expect(guard.canActivate(context)).rejects.toStrictEqual(permissionError);
    });

    it('backend returns no role--should throw the permission error instead of failing open', async () => {
      jest.spyOn(reflector, 'get').mockImplementationOnce(() => ['editable']);
      permissionService.getNodeRole.mockResolvedValueOnce(undefined);
      await expect(guard.canActivate(context)).rejects.toStrictEqual(permissionError);
    });

    it('role lacks the required permission--should throw the permission error', async () => {
      jest.spyOn(reflector, 'get').mockImplementationOnce(() => ['editable']);
      permissionService.getNodeRole.mockResolvedValueOnce({ editable: false });
      await expect(guard.canActivate(context)).rejects.toStrictEqual(permissionError);
    });

    it('role has the required permission--should return true', async () => {
      jest.spyOn(reflector, 'get').mockImplementationOnce(() => ['editable']);
      permissionService.getNodeRole.mockResolvedValueOnce({ editable: true });
      await expect(guard.canActivate(context)).resolves.toBe(true);
    });
  });
});
