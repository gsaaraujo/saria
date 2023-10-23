import { QueueAdapter } from '@application/adapters/queue-adapter';

export type FakeMessageDTO = {
  name: string;
  data: string;
};

export class FakeQueueAdapter implements QueueAdapter {
  public messages: FakeMessageDTO[] = [];
  public subscribers: string[] = [];

  async publish(name: string, data: string): Promise<void> {
    this.messages.push({ name, data });
  }

  async subscribe(name: string, handler: (data: string) => void): Promise<void> {
    handler('');
    this.subscribers.push(name);
  }
}
