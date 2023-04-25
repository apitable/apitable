import { CommonException, PermissionException, ServerException } from 'shared/exception';

export function responseCodeHandler(code: number): never {
  // 403 not in this space
  if (code === 201 || code === 403) {
    throw new ServerException(CommonException.UNAUTHORIZED);
  }
  // node not exist
  if (code === 600) {
    throw new ServerException(PermissionException.NODE_NOT_EXIST);
  }
  // access to node is denied
  if (code === 601) {
    throw new ServerException(PermissionException.ACCESS_DENIED);
  }
  // operation on node is denied
  if (code === 602) {
    throw new ServerException(PermissionException.OPERATION_DENIED);
  }
  if (code === PermissionException.SPACE_NOT_EXIST.code) {
    throw new ServerException(PermissionException.SPACE_NOT_EXIST);
  }
  if (code === PermissionException.NO_ALLOW_OPERATE.code) {
    throw new ServerException(PermissionException.NO_ALLOW_OPERATE);
  }
  throw new ServerException(CommonException.SERVER_ERROR);
}
