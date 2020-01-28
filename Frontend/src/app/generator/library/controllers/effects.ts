import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { MusicService } from '../music.service';
import { Logger } from '@upe/logger';
import { InstrumentName } from '../types';
import { OSCError } from "../error";
import { TypeChecker } from "../type-checker";
import { EQ3, PingPongDelay, Reverb } from "tone";

@Controller('/effect')
export class EffectsController {

  private logger: Logger = new Logger({ name: 'EffectsController', flags: ['music'] });

  constructor(private musicService: MusicService) { }

  private printError(e: any) {
    if (e instanceof OSCError) {
      e.print(this.logger);
      e.printFrontend(this.musicService.getLogService());
    } else {
      this.logger.error("Unidentifiable error", e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Instrument Reverb Effect
   * @apiDesc Adds/removes reverb effect for specified instrument
   * @apiPath /effect/instrument/reverb
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/instrument/reverb')
  public reverbInstrument(@Message() message: IOSCMessage) {
    try {
      const instrument: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const state: boolean = TypeChecker.ValidBoolArg(message.args[1]);

      if (!state) {
        this.musicService.deleteEffect(instrument, 'reverb');
        this.logger.info(`Removed reverb effect from effect chain of instrument ${instrument}`);
      } else {
        this.musicService.addEffect(instrument, 'reverb');
        this.logger.info(`Added reverb effect to effect chain of instrument ${instrument}`);
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Instrument Autofilter Effect
   * @apiDesc Adds/removes autofilter effect for specified instrument
   * @apiPath /effect/instrument/autofilter
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/instrument/autofilter')
  public autofilterInstrument(@Message() message: IOSCMessage) {
    try {
      const instrument: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const state: boolean = TypeChecker.ValidBoolArg(message.args[1]);

      if (!state) {
        this.musicService.deleteEffect(instrument, 'autofilter');
        this.logger.info(`Removed autofilter effect from effect chain of instrument ${instrument}`);
      } else {
        this.musicService.addEffect(instrument, 'autofilter');
        this.logger.info(`Added autofilter effect to effect chain of instrument ${instrument}`);
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Instrument PingPongDeleay Effect
   * @apiDesc Adds/removes pingpongdelay effect for specified instrument
   * @apiPath /effect/instrument/pingpongdelay
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/instrument/pingpongdelay')
  public pingpongdelayInstrument(@Message() message: IOSCMessage) {
    try {
      const instrument: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const state: boolean = TypeChecker.ValidBoolArg(message.args[1]);

      if (!state) {
        this.musicService.deleteEffect(instrument, 'pingpongdelay');
        this.logger.info(`Removed pingpongdelay effect from effect chain of instrument ${instrument}`);
      } else {
        this.musicService.addEffect(instrument, 'pingpongdelay');
        this.logger.info(`Added pingpongdelay effect to effect chain of instrument ${instrument}`);
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Master Reverb Effect
   * @apiDesc Adds/removes reverb effect to/from master output
   * @apiPath /effect/master/reverb
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/master/reverb')
  public reverbMaster(@Message() message: IOSCMessage) {
    try {
      const state: boolean = TypeChecker.ValidBoolArg(message.args[0]);

      if (!state) {
        this.musicService.deleteEffectFromMasterEffectChain('reverb');
        this.logger.info('Removed reverb effect from master effect chain');
      } else {
        this.musicService.addReverbEffectToMasterEffectChain();
        this.logger.info('Added reverb effect from master effect chain');
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Master PingPongDeleay Effect
   * @apiDesc Adds/removes pingpongdelay effect to/from master output
   * @apiPath /effect/master/pingpongdelay
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/master/pingpongdelay')
  public pingPongDelayMaster(@Message() message: IOSCMessage) {
    try {
      const state: boolean = TypeChecker.ValidBoolArg(message.args[0]);

      if (message.args[0].value === 0) {
        this.musicService.deleteEffectFromMasterEffectChain('pingpongdelay');
        this.logger.info('Removed pingpongdelay effect from master effect chain');
      } else {
        this.musicService.addPingPongDelayToMasterEffectChain();
        this.logger.info('Added pingpongdelay effect from master effect chain');
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Decay Master Reverb Effect
   * @apiDesc Changes the decay of the master reverb effect
   * @apiPath /effect/master/reverb/decay
   * @apiArgs f,seconds Expects seconds (> 0) as float value
   */
  @OnMessage('/master/reverb/decay')
  public changeReverbDecay(@Message() message: IOSCMessage) {
    try {
      const decay = TypeChecker.ValidTimeConstantArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('reverb');
      const reverb = effectObject.effect as Reverb;
      reverb.decay = decay;
      reverb.generate();

      this.logger.info('Change decay of reverb effect on master', { decay });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Dry/Wet Master Reverb Effect
   * @apiDesc Changes the dry/wet ration of the master reverb effect
   * @apiPath /effect/master/reverb/wet
   * @apiArgs f,ratio Expects the ratio for the wet signal as float value between [0,1]
   */
  @OnMessage('/master/reverb/wet')
  public changeReverbWet(@Message() message: IOSCMessage) {
    try {
      const wet = TypeChecker.ValidNormalRangeArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('reverb');
      const reverb = effectObject.effect as Reverb;
      reverb.wet.value = wet;
      reverb.generate();

      this.logger.info('Change ration of dry/wet of reverb effect on master.', { wet, dry: 1 - wet });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Delay Time Master PingPongDelay Effect
   * @apiDesc Changes the delay time between consecutive echos of the master pingpongdelay effect
   * @apiPath /effect/master/pingpongdelay/delay
   * @apiArgs f,delay Expects the delay in seconds (> 0) as float value
   */
  @OnMessage('/master/pingpongdelay/delay')
  public changePingPongDelayMasterDelayTime(@Message() message: IOSCMessage) {
    try {
      const delay = TypeChecker.ValidTimeConstantArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('pingpongdelay');
      const pingpongdelay = effectObject.effect as PingPongDelay;
      pingpongdelay.delayTime.value = delay;

      this.logger.info('Change delay of pingpongdelay effect on master', { delay });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Feedback Master PingPongDelay Effect
   * @apiDesc Changes the amount of the effected signal which is fed back through the master pingpongdelay effect
   * @apiPath /effect/master/pingpongdelay/feedback
   * @apiArgs f,feedback Expects a float value between [0,1]
   */
  @OnMessage('/master/pingpongdelay/feedback')
  public changePingPongDelayMasterFeedback(@Message() message: IOSCMessage) {
    try {
      const feedback = TypeChecker.ValidNormalRangeArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('pingpongdelay');
      const pingpongdelay = effectObject.effect as PingPongDelay;
      pingpongdelay.feedback.value = feedback;

      this.logger.info('Change feedback of pingpongdelay effect on master', { feedback });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Master EQ Effect
   * @apiDesc Adds/removes EQ effect to/from master output
   * @apiPath /effect/master/eq
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/master/eq')
  public equalizerMaster(@Message() message: IOSCMessage) {
    try {
      const status = TypeChecker.ValidBoolArg(message.args[0]);
      if (!status) {
        this.musicService.deleteEffectFromMasterEffectChain('threebandeq');
        this.logger.info('Removed equalizer effect from master effect chain');
      } else {
        this.musicService.addThreeBandEQToMasterEffectChain();
        this.logger.info('Added equalizer effect from master effect chain');
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change High Gain Master
   * @apiDesc Changes the gain applied to the high of the master output
   * @apiPath /effect/master/eq/high
   * @apiArgs f,decibel Expects an integer between [-20,10]
   */
  @OnMessage('/master/eq/high')
  public changeHighLevelOfEqualizer(@Message() message: IOSCMessage) {
    try {
      const highGain = TypeChecker.ValidDecibelArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('threebandeq');
      const eq = effectObject.effect as EQ3;
      eq.high.value = highGain;

      this.logger.info('Changed the gain applied to the high of the master output', { highGain });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Mid Gain Master
   * @apiDesc Changes the gain applied to the mid of the master output
   * @apiPath /effect/master/eq/mid
   * @apiArgs f,decibel Expects an integer between [-20,10]
   */
  @OnMessage('/master/eq/mid')
  public changeMidLevelOfEqualizer(@Message() message: IOSCMessage) {
    try {
      const midGain = TypeChecker.ValidDecibelArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('threebandeq');
      const eq = effectObject.effect as EQ3;
      eq.mid.value = midGain;

      this.logger.info('Changed the gain applied to the mid of the master output', { midGain });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Low Gain Master
   * @apiDesc Changes the gain applied to the low of the master output
   * @apiPath /effect/master/eq/low
   * @apiArgs f,decibel Expects an integer between [-20,10]
   */
  @OnMessage('/master/eq/low')
  public changeLowLevelOfEqualizer(@Message() message: IOSCMessage) {
    try {
      const lowGain = TypeChecker.ValidDecibelArg(message.args[0]);

      const effectObject = this.musicService.getMasterEffect('threebandeq');
      const eq = effectObject.effect as EQ3;
      eq.low.value = lowGain;

      this.logger.info('Changed the gain applied to the low of the master output', { lowGain });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Switch Instrument EQ Effect
   * @apiDesc Adds/removes EQ effect for specified instrument
   * @apiPath /effect/instrument/eq
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,state Expects 1 (on) or 0 (off) as float (boolean)
   */
  @OnMessage('/instrument/eq')
  public eqInstrument(@Message() message: IOSCMessage) {
    this.logger.debug('Trying to add EQ to some instrument\'s effect chain', message);

    try {
      const instrument: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const state: boolean = TypeChecker.ValidBoolArg(message.args[1]);

      if (!state) {
        this.musicService.deleteEffect(instrument, 'threebandeq');
        this.logger.info(`Removed eq effect from effect chain of instrument ${instrument}`);
      } else {
        this.musicService.addEffect(instrument, 'threebandeq');
        this.logger.info(`Added eq effect to effect chain of instrument ${instrument}`);
      }
    } catch (e) {
      this.printError(e);
    }
  }



  /**
   * @apiGroup Effects
   * @apiName Change High Gain Instrument
   * @apiDesc Changes the gain applied to the high of the output of the specified instrument
   * @apiPath /effect/instrument/eq/high
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,decibel Expects an integer between [-20,10]
   */
  @OnMessage('/instrument/eq/high')
  public changeHighLevelOfEqualizerInstrument(@Message() message: IOSCMessage) {
    try {
      const name: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const highGain = TypeChecker.ValidDecibelArg(message.args[1]);

      const effectObject = this.musicService.getEffect(name, 'threebandeq');
      const eq = effectObject.effect as EQ3;
      eq.high.value = highGain;

      this.logger.info('Changed the gain applied to the high of the master output', { highGain });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change High Mid Instrument
   * @apiDesc Changes the gain applied to the mid of the output of the specified instrument
   * @apiPath /effect/instrument/eq/mid
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,decibel Expects an integer between [-20,10]
   */
  @OnMessage('/instrument/eq/mid')
  public changeMidLevelOfEqualizerInstrument(@Message() message: IOSCMessage) {
    try {
      const name: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const midGain = TypeChecker.ValidDecibelArg(message.args[1]);

      const effectObject = this.musicService.getEffect(name, 'threebandeq');
      const eq = effectObject.effect as EQ3;
      eq.mid.value = midGain;

      this.logger.info('Changed the gain applied to the mid of the master output', { midGain });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Effects
   * @apiName Change Low Gain Instrument
   * @apiDesc Changes the gain applied to the low of the output of the specified instrument
   * @apiPath /effect/instrument/eq/low
   * @apiArgs s,name Expects the name of the instrument as string
   * @apiArgs f,decibel Expects an integer between [-20,10]
   */
  @OnMessage('/instrument/eq/low')
  public changeLowLevelOfEqualizerInstrument(@Message() message: IOSCMessage) {
    try {
      const name: InstrumentName = TypeChecker.ValidInstrumentNameArg(message.args[0]);
      const lowGain = TypeChecker.ValidDecibelArg(message.args[1]);

      const effectObject = this.musicService.getEffect(name, 'threebandeq');
      const eq = effectObject.effect as EQ3;
      eq.low.value = lowGain;

      this.logger.info('Changed the gain applied to the low of the master output', { lowGain });
    } catch (e) {
      this.printError(e);
    }
  }

}
