import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: '*' })
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private activeSockets: Set<string> = new Set<string>();

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(socket.id);
      console.log('connected');
      this.activeSockets.add(socket.id);
      this.sendConnectedTabsCount();
    });

    this.server.on('disconnect', (socket: Socket) => {
      console.log(socket.id);
      console.log('disconnected');
      this.activeSockets.delete(socket.id);
      this.sendConnectedTabsCount();
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', { msg: 'new message', body: body });
  }

  private sendConnectedTabsCount() {
    const connectedTabsCount = this.activeSockets.size;
    this.server.emit('connectedTabsCount', connectedTabsCount);
  }
}
