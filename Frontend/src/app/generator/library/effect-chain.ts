import { Gain, ToneAudioNode } from 'tone';
import { IMCPEffect, MCPEffectIdentifier } from './types';
import { Logger } from '@upe/logger';

export type EffectChainIdentifier = string;

export class EffectChain {

  private logger: Logger;

  private effects: IMCPEffect[] = [];

  /**
   * @param id An unique identifier for an effect chain
   * @param inputNode Input signal that flows into this effect chain
   * @param outputNode TODO
   */
  constructor(
    private id: EffectChainIdentifier,
    private inputNode: ToneAudioNode,
    private readonly outputNode: ToneAudioNode = new Gain()
  ) {
    this.logger = new Logger({ name: `EffectChain ${id}`, flags: ['effect-chain'] });
    this.inputNode.connect(this.outputNode);
  }

  //region Public Methods
  public getOutputNode() {
    return this.outputNode;
  }

  /**
   * Adds a new effect to the end of this effect chain. This means that everything has to be rewired.
   * @param effect Effect to push at the end of this effect chain
   */
  public pushEffect(effect: IMCPEffect) {
    this.logger.debug(`Adding effect ${effect.id} at the end of the effect chain..`, this.effects);

    this.deleteConnections();
    this.effects.push(effect);
    this.createConnections();

    this.logger.info(`Added effect ${effect.id} at the end of the effect chain`, this.effects);
  }

  /**
   * Deletes the specified effect from this effect chain. Then the chain has to be "rewired".
   * If there are multiple effects with the same name only the first found is deleted.
   * You should not add multiple effects with the same name!
   * @param effectID The id of the effect that should be deleted from this effect chain
   */
  public deleteEffectByID(effectID: MCPEffectIdentifier) {
    this.logger.debug(`Removing effect with id '${effectID}'...`);
    const index = this.effects.findIndex((effect: IMCPEffect) => effect.id === effectID);
    if (index === -1) {
      this.logger.warn(`Cannot delete effect with id '${effectID}' as the chain doesn't contain such effect`);
    } else {
      this.deleteEffectByIndex(index);
      this.logger.debug(`Removed effect with id '${effectID}' (effect position ${index})`);
    }
  }

  /**
   * Deletes a specified effect from this effect chain. Then the chain has to be "rewired".
   * @param index The current position of the effect to delete in this effect chain
   */
  public deleteEffectByIndex(index: number) {
    if (this.effects.length <= index) {
      this.logger.warn(`Cannot delete effect with index ${index} as effect chain is empty`);
      return;
    }

    this.deleteConnections();
    this.effects = this.effects.filter((_, arrayIndex: number) => arrayIndex !== index);
    this.createConnections();
  }

  public getEffectByID(effectID: MCPEffectIdentifier): IMCPEffect | null {
    this.logger.debug(`Getting effect with id '${effectID}'...`);
    const index = this.effects.findIndex((effect: IMCPEffect) => effect.id === effectID);
    if (index === -1) {
      this.logger.warn(`Cannot get effect with id '${effectID}' as the chain doesn't contain such effect`);
      return null;
    } else {
      const effect = this.effects[index];
      this.logger.debug(`Found effect with id '${effectID}' (effect position ${index})`, effect);
      return effect;
    }
  }
  //endregion

  //region Private Methods
  /**
   * Deletes all connections between the nodes so that it is possible to rewire them later.
   * inputNode -/-> effect 1 -/-> effect 2 -/-> ... -/-> effect n-1 -/-> effect n -/-> outputNode
   */
  private deleteConnections() {
    this.logger.debug('Disconnecting all effects...');

    // disconnect connection between effects
    this.effects.forEach((effect: IMCPEffect, index: number) => {
      if (index + 1 < this.effects.length) {
        effect.effect.disconnect();
        this.logger.debug(`Disconnected effect '${effect.id}'`);
      }
    });

    // delete connection from input node
    this.logger.debug(`Disconnecting input node from chain...`);
    if (this.effects.length > 0) {
      // this.logger.info('fall 1.1');
      const firstEffectInChain = this.effects[0];
      this.inputNode.disconnect(firstEffectInChain.effect);
    } else {
      // this.logger.info('fall 1.2');
      this.inputNode.disconnect(this.outputNode);
    }
    this.logger.debug(`Disconnected input node from chain`);

    // delete connection to output node
    this.logger.debug(`Disconnecting chain from output node...`);
    if (this.effects.length > 0) {
      const lastEffectInChain = this.effects[this.effects.length - 1];
      this.logger.info(`Disconnecting effect from output node:`, lastEffectInChain);
      lastEffectInChain.effect.disconnect(this.outputNode);
    }
    this.logger.debug(`Disconnected chain from output node`);

    this.logger.debug('Disconnected all effects');
  }

  /**
   * Adds connections within the chain so that an output signal of
   * a predecessor effect flows into the input of the successor effect.
   *
   * inputNode -> effect 1 -> effect 2 -> ... -> effect n-1 -> effect n -> outputNode
   */
  private createConnections() {
    // create connections between effects
    this.logger.debug('Creating connections between the effects..');
    this.effects.forEach((effect, index) => {
      if (index + 1 < this.effects.length) {
        effect.effect.connect(this.effects[index + 1].effect);
      }
    });
    this.logger.debug('Created connections between the effects');

    // inputNode -> effect 1 && effect n -> outputNode
    if (this.effects.length > 0) {
      this.logger.info('Fall 1 bei createConnections()');
      this.inputNode.connect(this.effects[0].effect);
      this.logger.info(`Connected input node to effect:`, this.effects[0]);
      this.effects[this.effects.length - 1].effect.connect(this.outputNode);
      this.logger.info(`Connected effect to output node:`, this.effects[this.effects.length - 1]);
    } else {
      this.inputNode.connect(this.outputNode);
    }
    this.logger.debug('Connected input node and output node to effect chain');
  }
  //endregion

}
