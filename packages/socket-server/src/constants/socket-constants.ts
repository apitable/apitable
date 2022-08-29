export class SocketConstants {
  public static readonly SOCKET_TYPES = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];

  public static readonly SOCKET_REQUEST_TIMEOUT = process.env.SOCKET_REQUEST_TIMEOUT || 10000;

  public static readonly JAVA_SERVER_PREFIX = 'java';

  public static readonly NEST_SERVER_PREFIX = 'nest_server';
  public static readonly USER_SOCKET_ROOM = 'user:';

  public static readonly SOCKET_COOKIE_LANGUAGE_KEY = 'vika-i18n';
  /**
   * 空间房间前缀
   */
  public static readonly SPACE_ROOM_PREFIX = 'space:';

  /**
   *
   * GrpcClientProxy 健康检测模式（DEFAULT：socket自己定时维护roomIp池，XXL_JOB：java XXL JOB定时任务维护roomIp池）
   */
  public static readonly GRPC_CLIENT_PROXY_HEALTH_MODEL = process.env.HEALTH_MODEL || 'DEFAULT';


  /**
   * GRPC_OPTIONS gRPC参数选项
   */
  public static readonly GRPC_OPTIONS = {
    // 通道可以发送的最大消息长度
    maxSendMessageLength: 1024 * 1024 * 100,
    // 通道可以接收的最大消息长度
    maxReceiveMessageLength: 1024 * 1024 * 100,

    // 通道（频道）策略
    channelOptions: {
      // 后续连接尝试之间的最短时间，以毫秒为单位
      'grpc.min_reconnect_backoff_ms': 500,
      // 后续连接尝试之间的最长时间，以毫秒为单位
      'grpc.max_reconnect_backoff_ms': 15000,
    },

    // 看门狗策略
    keepalive: {
      // 在这段时间之后，客户端/服务器 ping 其对等方以查看传输是否仍然有效
      keepaliveTimeMs: 7200000,
      // 等待这段时间后，如果keepalive ping 发送方没有收到ping ack，它将关闭传输
      keepaliveTimeoutMs: 10000,
      // 是否允许在没有任何未完成的流的情况下发送 keepalive ping
      keepalivePermitWithoutCalls: 0,
      // 在需要发送数据/报头帧之前，我们可以发送多少个 ping
      http2MaxPingsWithoutData: 2,
    },

    // 重试策略
    retryPolicy: {
      // 最大尝试次数
      maxAttempts: parseInt(process.env.GRPC_RETRY_MAX_ATTEMPTS || '5', 10),
    },
  };

}
