import { IOSCMessage } from '../osc/osc-message';
import { Controller, Message, OnMessage } from '../decorator/decorators';
import { Logger } from '@upe/logger';
import { MusicService } from "../music.service";
import { InstrumentName } from "../types";
import { TypeChecker } from "../type-checker";
import { OSCError } from "../error";

@Controller('/volume')
export class VolumeController {

  private logger: Logger = new Logger({ name: 'VolumeController', flags: ['controller'] });

  constructor(private musicService: MusicService) {
  }

  @OnMessage('/instrument')
  public changeVolumeForInstrument(@Message() message: IOSCMessage) {
    try {
      const name: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const decibel = TypeChecker.ValidDecibelArg(message.args[1]);

      let volumeNode = this.musicService.getVolumeNode(name);
      if (!volumeNode) {
        this.logger.error("Cannot find instrument");
      }

      volumeNode.volume.value = decibel;

      this.logger.info(`Changed volume of instrument ${name}`, { volume: decibel });
    } catch(e) {
      this.printError(e);
    }
  }

  @OnMessage('/master')
  public changeVolumeForMaster(@Message() message: IOSCMessage) {
    try {
      const decibel = TypeChecker.ValidDecibelArg(message.args[0]);
      let volumeNode = this.musicService.getMasterVolumeNode();
      volumeNode.volume.value = decibel;

      this.logger.info(`Changed volume of master output`, { volume: decibel });
    } catch(e) {
      this.printError(e);
    }
  }

  private printError(e: any) {
    if (e instanceof OSCError) {
      e.print(this.logger);
      e.printFrontend(this.musicService.getLogService());
    } else {
      this.logger.error("Unidentifiable error", e);
    }
  }

}
