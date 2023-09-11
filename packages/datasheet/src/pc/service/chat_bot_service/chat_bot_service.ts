import { resourceService } from '../../resource_service';
import { ResourceServiceEnhanced } from '../../resource_service/service';
import { IChatBotService } from './interface';
import { SocketService } from './socket_service';

export class ChatBotService implements IChatBotService {
  constructor(
    private resourceService: ResourceServiceEnhanced,
    private socket: SocketService,
  ) {}

  init() {
    this.resourceService.roomService.leaveRoom();
    this.socket.init();
  }

  setMessages() {}

  receiveMessages() {
    // this.socket.receiveMessages();
  }

  destroy() {}
}

export const chatBotService = new ChatBotService(resourceService.instance, new SocketService());
