import io from 'socket.io-client';
import SOCKET_URL from '../config/config';

export class SocketIOService {
  constructor(accesstoken, userId, limitMessage) {
    this.SOCKET_SERVER_URL = SOCKET_URL;
    this.CHANNEL = 'message';
    this.socket = io(this.SOCKET_SERVER_URL, {
      auth: { accesstoken },
      query: { userId, limitMessage },
    });
    console.log('SOCKET.IO Establish connection');
  }

  onListenMessage(callback) {
    this.socket.on(this.CHANNEL, callback);
  }

  onListenError(callback) {
    this.socket.on('connect_error', callback);
  }

  getNotify(userId, page, limit) {
    this.socket.emit(this.CHANNEL, {
      userId,
      page,
      limit,
    });
  }
}
