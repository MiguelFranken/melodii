import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { MusicService } from '../music.service';
import { Logger } from '@upe/logger';
import { InstrumentName } from '../types';

@Controller('/effect')
export class EffectsController {

  private logger: Logger = new Logger({ name: 'EffectsController', flags: ['music'] });

  constructor(private musicService: MusicService) { }

  @OnMessage('/instrument/reverb')
  public reverbInstrument(@Message() message: IOSCMessage) {
    this.logger.info('Reverb', message);

    const instrument: InstrumentName = message.args[0].value as InstrumentName;

    if (message.args[1].value === 0) {
      this.musicService.deleteEffect(instrument, 'reverb');
      this.logger.info('Removed reverb effect from master effect chain');
    } else {
      this.musicService.addEffect(instrument, 'reverb');
      this.logger.info('Added reverb effect from master effect chain');
    }
  }

  @OnMessage('/instrument/pingpongdelay')
  public pingpongdelayInstrument(@Message() message: IOSCMessage) {
    this.logger.info('Reverb', message);

    const instrument: InstrumentName = message.args[0].value as InstrumentName;

    if (message.args[1].value === 0) {
      this.musicService.deleteEffect(instrument, 'pingpongdelay');
      this.logger.info('Removed pingpongdelay effect from master effect chain');
    } else {
      this.musicService.addEffect(instrument, 'pingpongdelay');
      this.logger.info('Added pingpongdelay effect from master effect chain');
    }
  }

  @OnMessage('/master/reverb')
  public reverbMaster(@Message() message: IOSCMessage) {
    this.logger.info('Reverb', message);

    if (message.args[0].value === 0) {
      this.musicService.deleteEffectFromMasterEffectChain('reverb');
      this.logger.info('Removed reverb effect from master effect chain');
    } else {
      this.musicService.addReverbEffectToMasterEffectChain();
      this.logger.info('Added reverb effect from master effect chain');
    }
  }

  @OnMessage('/master/pingpongdelay')
  public pingPongDelayMaster(@Message() message: IOSCMessage) {
    this.logger.info('PingPongDelay', message);

    if (message.args[0].value === 0) {
      this.musicService.deleteEffectFromMasterEffectChain('pingpongdelay');
      this.logger.info('Removed pingpongdelay effect from master effect chain');
    } else {
      this.musicService.addPingPongDelayToMasterEffectChain();
      this.logger.info('Added pingpongdelay effect from master effect chain');
    }
  }

}
