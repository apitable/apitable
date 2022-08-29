import { Observable } from 'rxjs';

/**
 * nest service 相关方法定义
 * todo ro/vo 返回定义
 */
export interface ISocketService {
  watchRoom(data: any): Observable<any>;

  leaveRoom(data: any): Observable<any>;

  roomChange(data: any): Observable<any>;
}
