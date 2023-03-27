declare module '@elastic/ecs-helpers' {
  import http from 'http';

  declare const version: string;

  declare function stringify(ecs: any): string;

  declare function formatError(ecsFields: any, err: any): boolean;

  declare function formatHttpRequest(ecs: any, req: http.IncomingMessage): boolean;

  declare function formatHttpResponse(ecs: any, req: http.ServerResponse): boolean;
}