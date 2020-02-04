import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Arc } from '../instruments/arc';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';

interface ILatency {
  controller: number;
  routing: number;
  diff: number;
}

@Controller('/latency')
export class LatencyController {

  private latencies: ILatency[] = [];

  private logger: Logger = new Logger({ name: 'LatencyController', flags: ['test'] });

  constructor() {
  }

  @OnMessage('/single')
  public single(@Message() message: IOSCMessage) {
    const timeEnd: number = performance.now();
    const controllerLatency: number = timeEnd - message.timeStart[0];
    const routingLatency: number = message.timeStart[1] - message.timeStart[0];
    const latency: ILatency = {
      controller: controllerLatency,
      routing: routingLatency,
      diff: controllerLatency - routingLatency
    };
    this.latencies.push(latency);
  }

  @OnMessage('/log')
  public log() {
    const prettyLatencies = this.latencies.map((latency: ILatency) => {
      return {
        controller: `${latency.controller.toFixed(3)}ms`,
        routing: `${latency.routing.toFixed(3)}ms`,
        diff: `${latency.diff.toFixed(3)}ms`,
      };
    });
    this.logger.info('Latencies', prettyLatencies);
  }

}
