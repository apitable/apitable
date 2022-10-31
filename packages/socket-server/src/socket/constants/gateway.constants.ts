export class GatewayConstants {
  public static readonly NOTIFICATION_PORT: number = parseInt(process.env.NOTIFICATION_PORT, 10) || 3002;
  public static readonly NOTIFICATION_PATH: string = '/notification';
  public static readonly API_PORT = parseInt(process.env.PORT, 10) || 3001;
  public static readonly SOCKET_NAMESPACE = '/';
  public static readonly ROOM_PORT: number = parseInt(process.env.ROOM_PORT, 10) || 3005;
  public static readonly ROOM_PATH: string = '/room';
  public static readonly ROOM_NAMESPACE: string = 'room';
  /**
   * ack timeout default 30000ms(30s)
   */
  public static readonly ACK_TIMEOUT = parseInt(process.env.ACK_TIMEOUT, 10) || 30000;

  public static readonly PING_TIMEOUT = parseInt(process.env.PING_TIMEOUT, 10) || 120000;

  public static readonly SOCKET_SERVER_NOTIFY_PATH = '/socket/notify';

  public static readonly GRPC_URL = process.env.GRPC_URL || '0.0.0.0:3007';

  public static readonly NEST_SERVICE = 'NEST_SERVICE';

  public static readonly BACKEND_SERVICE = 'BACKEND_SERVICE';

  public static readonly GRPC_PACKAGE = 'vika.grpc';

  public static readonly NEST_GRPC_PORT = 3334;

  public static readonly NEST_GRPC_URL = process.env.NEST_GRPC_URL || '0.0.0.0:3334';

  public static readonly BACKEND_GRPC_URL = process.env.BACKEND_GRPC_URL || '0.0.0.0:8083';

  public static readonly GRPC_TIMEOUT_MAX_TIMES = parseInt(process.env.GRPC_TIMEOUT_MAX_TIMES, 10) || 3;
}
