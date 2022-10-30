
export interface ISocialWecomGetConfigResponse {
  data: {
    agentId: number;
    agentSecret: string;
    agentStatu: 0 | 1;
    corpId: string;
    domainName: string;
  };
}

export interface IWecomAgentBindSpaceResponse {
  data: {
    bindSpaceId: string;
  };
}
