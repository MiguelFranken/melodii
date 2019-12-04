import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { DrumsHiHat, DrumsKick, DrumsSnare } from '../instruments/drums';
import { OSCError } from '../error';
import { TypeChecker } from '../type-checker';
import { Logger } from '@upe/logger';

@Controller('/drums')
export class DrumsController {

    private logger: Logger = new Logger({ name: 'DrumsController', flags: ['controller'] });

    private hihatInstrument: DrumsHiHat;
    private kickInstrument: DrumsKick;
    private snareInstrument: DrumsSnare;

    constructor(private music: MusicService) {
        this.hihatInstrument = this.music.getInstrument('hihat') as DrumsHiHat;
        this.kickInstrument = this.music.getInstrument('kick') as DrumsKick;
        this.snareInstrument = this.music.getInstrument('snare') as DrumsSnare;
    }

    /**
     * @apiGroup Drums
     * @apiName Play Snare
     * @apiDesc Plays the snare from the snare sampler
     * @apiPath /snare/play
     * @apiArgs i,duration Expects the duration of the snare note as string
     * @apiArgs i,velocity Expects the velocity of the snare note as float
     */
    @OnMessage('/snare/play')
    public receivedMsgSnare(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            //TODO add postion to decorators
            const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

            this.snareInstrument.play(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }

    /**
     * @apiGroup Drums
     * @apiName Start/Stop reverb
     * @apiDesc Based on the arg starts or stops the reverb effect on the snare
     * @apiPath /snare/effect/reverb
     * @apiArgs i,boolean Expects a boolean as integer to start = 1 or stop = 0
     */
    @OnMessage('/snare/effect/reverb')
    public reverb(@Message() msg: IOSCMessage) {
        try {
            const bool = TypeChecker.ValidEffectBoolArg(msg.args[0]);
            if (bool) {
                this.snareInstrument.addReverb();
            } else {
                this.snareInstrument.deleteReverb();
            }
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }

    /**
     * @apiGroup Drums
     * @apiName Start/Stop pingpongdelay
     * @apiDesc Based on the arg starts or stops the pingpongdelay effect on the snare
     * @apiPath /snare/effect/pingpongdelay
     * @apiArgs i,boolean Expects a boolean as integer to start = 1 or stop = 0
     */
    @OnMessage('/snare/effect/pingpongdelay')
    public pingpongdelay(@Message() msg: IOSCMessage) {
        try {
            const bool = TypeChecker.ValidEffectBoolArg(msg.args[0]);
            if (bool) {
                this.snareInstrument.addPingPongDelay();
            } else {
                this.snareInstrument.deletePingPongDelay();
            }
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }

    }

    /**
     * @apiGroup Drums
     * @apiName Play Snare
     * @apiDesc Plays the basedrum (kick) from the kick sampler
     * @apiPath /kick
     * @apiArgs i,duration Expects the duration of the kick note as string
     * @apiArgs i,velocity Expects the velocity of the kick note as float
     */
    @OnMessage('/kick')
    public receivedMsgKick(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            // TODO add position to decorators
            const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

            this.kickInstrument.play(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }


    /**
     * @apiGroup Drums
     * @apiName Play HiHat
     * @apiDesc Plays the HiHat from the hihat synth
     * @apiPath /hihat
     * @apiArgs i,duration Expects the duration of the hihat note as string
     * @apiArgs i,velocity Expects the velocity of the hihat note as float
     */
    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            // TODO add position to decorators
            const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

            this.hihatInstrument.play(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }



}
