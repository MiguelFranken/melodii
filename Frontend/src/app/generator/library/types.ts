import { Effect } from 'tone/build/esm/effect/Effect';
import { StereoEffect } from 'tone/build/esm/effect/StereoEffect';

/**
 * TODO: Siehe z.B. wie ToneJS dies definiert....
 */
export type Note = string;

/**
 * A number that is between [0, 1]
 */
export type Velocity = number;

/**
 * A Cent is one hundredth semitone.
 */
export type Cents = number;

/**
 * TODO
 */
export type Duration = string | number;

/**
 * Unique name of an instrument
 */
export type InstrumentName = string;

/**
 * Unique name of an meter
 * Needed as we insert Meter objects in a Map and we access the objects via the name
 */
export type MeterName = InstrumentName | 'master';

/**
 *
 */
export type MCPEffectIdentifier = string;

export interface IMCPEffect {
  id: MCPEffectIdentifier;
  effect: Effect<any> | StereoEffect<any>;
}
