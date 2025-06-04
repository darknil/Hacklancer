import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessageBrokerService {
  constructor(@Inject('MESSAGE_BROKER') private readonly client: ClientProxy) {}

  emit(event: string, payload: any) {
    return this.client.emit(event, payload);
  }

  send<T = any, R = any>(pattern: T, data: R) {
    return this.client.send(pattern, data);
  }
}
