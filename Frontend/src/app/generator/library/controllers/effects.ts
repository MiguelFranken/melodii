import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { MusicService } from '../music.service';
import { Logger } from '@upe/logger';
import { InstrumentName } from '../types';
import { TypeChecker } from "../type-checker";
import { OSCError } from "../error";
import { PingPongDelay, Reverb } from "tone";

@Controller('/effect')
export class EffectsController {

  private logger: Logger = new Logger({ name: 'EffectsController', flags: ['music'] });

  constructor(private musicService: MusicService) { }

  /**
   * @apiGroup Effects
   * @apiName Switch Instrument Reverb Effect
   * @apiDesc Adds/removes reverb effect for specified instrument
   * @apiPath /instrument/reverb
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
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

  /**
   * @apiGroup Effects
   * @apiName Switch Instrument PingPongDeleay Effect
   * @apiDesc Adds/removes pingpongdelay effect for specified instrument
   * @apiPath /instrument/pingpongdelay
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/instrument/pingpongdelay')
  public pingpongdelayInstrument(@Message() message: IOSCMessage) {
    this.logger.info('PingPongDelay Instrument', message);

    const instrument: InstrumentName = message.args[0].value as InstrumentName;

    if (message.args[1].value === 0) {
      this.musicService.deleteEffect(instrument, 'pingpongdelay');
      this.logger.info('Removed pingpongdelay effect from master effect chain');
    } else {
      this.musicService.addEffect(instrument, 'pingpongdelay');
      this.logger.info('Added pingpongdelay effect from master effect chain');
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Master Reverb Effect
   * @apiDesc Adds/removes reverb effect to/from master output
   * @apiPath /master/reverb
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
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

  /**
   * @apiGroup Effects
   * @apiName Switch Master PingPongDeleay Effect
   * @apiDesc Adds/removes pingpongdelay effect to/from master output
   * @apiPath /master/pingpongdelay
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/master/pingpongdelay')
  public pingPongDelayMaster(@Message() message: IOSCMessage) {
    this.logger.info('PingPongDelay Master', message);

    if (message.args[0].value === 0) {
      this.musicService.deleteEffectFromMasterEffectChain('pingpongdelay');
      this.logger.info('Removed pingpongdelay effect from master effect chain');
    } else {
      this.musicService.addPingPongDelayToMasterEffectChain();
      this.logger.info('Added pingpongdelay effect from master effect chain');
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Decay Master Reverb Effect
   * @apiDesc Changes the decay of the master reverb effect
   * @apiPath /master/reverb/decay
   * @apiArgs f,seconds Expects seconds as float value
   */
  @OnMessage('/master/reverb/decay')
  public changeReverbDecay(@Message() message: IOSCMessage) {
    try {
      const decay = TypeChecker.ValidFloatArg(message.args[1]);

      let effectObject = this.musicService.getMasterEffect('reverb');
      let reverb = effectObject.effect as Reverb;
      reverb.decay = decay;
      reverb.generate();

      this.logger.info('Change decay of reverb effect on master', { decay });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.musicService.getLogService());
      }
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Dry/Wet Master Reverb Effect
   * @apiDesc Changes the dry/wet ration of the master reverb effect
   * @apiPath /master/reverb/wet
   * @apiArgs f,ratio Expects the ratio for the wet signal as float value between [0,1]
   */
  @OnMessage('/master/reverb/wet')
  public changeReverbWet(@Message() message: IOSCMessage) {
    try {
      const wet = TypeChecker.ValidNormalRangeArg(message.args[1]);

      let effectObject = this.musicService.getMasterEffect('reverb');
      let reverb = effectObject.effect as Reverb;
      reverb.wet.value = wet;
      reverb.generate(); // TODO: Necessary?

      this.logger.info('Change ration of dry/wet of reverb effect on master.', { wet: wet, dry: 1 - wet });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.musicService.getLogService());
      }
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Delay Time Master PingPongDelay Effect
   * @apiDesc Changes the delay time between consecutive echos of the master pingpongdelay effect
   * @apiPath /master/pingpongdelay/delay
   * @apiArgs f,delay Expects the delay in seconds as float value
   */
  @OnMessage('/master/pingpongdelay/delay')
  public changePingPongDelayMasterDelayTime(@Message() message: IOSCMessage) {
    try {
      const delay = TypeChecker.ValidFloatArg(message.args[1]);

      let effectObject = this.musicService.getMasterEffect('pingpongdelay');
      let pingpongdelay = effectObject.effect as PingPongDelay;
      pingpongdelay.delayTime.value = delay;

      this.logger.info('Change delay of pingpongdelay effect on master', { delay: delay });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.musicService.getLogService());
      }
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Feedback Master PingPongDelay Effect
   * @apiDesc Changes the amount of the effected signal which is fed back through the master pingpongdelay effect
   * @apiPath /master/pingpongdelay/feedback
   * @apiArgs f,feedback Expects a float value between [0,1]
   */
  @OnMessage('/master/pingpongdelay/feedback')
  public changePingPongDelayMasterFeedback(@Message() message: IOSCMessage) {
    try {
      const feedback = TypeChecker.ValidNormalRangeArg(message.args[1]);

      let effectObject = this.musicService.getMasterEffect('pingpongdelay');
      let pingpongdelay = effectObject.effect as PingPongDelay;
      pingpongdelay.feedback.value = feedback;

      this.logger.info('Change feedback of pingpongdelay effect on master', { feedback: feedback });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.musicService.getLogService());
      }
    }
  }

  @OnMessage('/master/threebandeq')
  public EQMaster(@Message() message: IOSCMessage) {
    this.logger.info('EQ', message);

    if (message.args[0].value === 0) {
      this.musicService.deleteEffectFromMasterEffectChain('threebandeq');
      this.logger.info('Removed pingpongdelay effect from master effect chain');
    } else {
      this.musicService.addThreeBandEQToMasterEffectChain();
      this.logger.info('Added pingpongdelay effect from master effect chain');
    }
  }
}
