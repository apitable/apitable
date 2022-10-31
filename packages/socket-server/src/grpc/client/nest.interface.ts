import { Observable } from 'rxjs';

export interface ISocketService {
  watchRoom(data: any): Observable<any>;

  leaveRoom(data: any): Observable<any>;

  roomChange(data: any): Observable<any>;
}
