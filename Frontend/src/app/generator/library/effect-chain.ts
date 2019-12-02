import { ToneAudioNode } from 'tone';
import { MCPEffect, MCPEffectIdentifier } from './music.service';
import { Logger } from '@upe/logger';

export type EffectChainIdentifier = string;

export class EffectChain {

  private logger: Logger;

  private effects: MCPEffect[] = [];

  /**
   * @param id An unique identifier for an effect chain
   * @param inputNode Input signal that flows into this effect chain
   */
  constructor(private id: EffectChainIdentifier, private inputNode: ToneAudioNode) {
    this.logger = new Logger({ name: `EffectChain ${id}`, flags: ['effect-chain'] });
  }

  //region Public Methods
  public getOutputNode(): ToneAudioNode {
    if (this.effects.length > 0) {
      return this.effects[this.effects.length - 1].effect;
    } else {
      this.logger.warn('Output node is input node. Effect chain is empty!');
      return this.inputNode;
    }
  }

  /**
   * Adds a new effect to the end of this effect chain. This means that everything has to be rewired.
   * @param effect Effect to push at the end of this effect chain
   */
  public pushEffect(effect: MCPEffect) {
    this.logger.debug(`Adding effect ${effect.id} at the end of the effect chain..`, this.effects);

    this.effects.push(effect);
    this.deleteConnections();
    this.createConnections();

    if (this.effects.length === 1) {
      this.inputNode.connect(effect.effect);
    }

    this.logger.debug(`Added effect ${effect.id} at the end of the effect chain`, this.effects);
  }

  /**
   * Deletes the specified effect from this effect chain. Then the chain has to be "rewired".
   * If there are multiple effects with the same name only the first found is deleted.
   * You should not add multiple effects with the same name!
   * @param effectID The id of the effect that should be deleted from this effect chain
   */
  public deleteEffectByID(effectID: MCPEffectIdentifier) {
    this.logger.debug(`Removing effect with id '${effectID}'...`);
    const index = this.effects.findIndex((effect: MCPEffect) => effect.id === effectID);
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

    const effectToDelete: MCPEffect = this.effects[index];

    this.deleteConnections();
    this.effects = this.effects.filter((_, arrayIndex: number) => arrayIndex !== index);
    this.createConnections();

    if (index === 0 && this.effects.length > 0) {
      this.logger.debug(`Rewiring input node to effect '${this.effects[0].id}':`, this.effects[0]);
      this.inputNode.disconnect(effectToDelete.effect);
      this.inputNode.connect(this.effects[0].effect);
    }
  }
  //endregion

  //region Private Methods
  /**
   * Deletes all connections from the effect nodes in the master effect chain
   * so that it is possible to reset them later.
   */
  private deleteConnections() {
    this.logger.debug('Disconnecting all effects...');
    for (const effect of this.effects) {
      effect.effect.disconnect();
      this.logger.debug(`Disconnected effect ${effect.id}`);
    }
    this.logger.debug('Disconnected all effects');
  }

  /**
   * Adds connections within the chain so that an output signal of
   * a predecessor effect flows into the input of the successor effect.
   *
   * effect 1 -> effect 2 -> ... -> effect n-1 -> effect n
   */
  private createConnections() {
    this.logger.debug('Creating connections between the effects..');
    this.effects.forEach((effect, index) => {
      if (index + 1 < this.effects.length) {
        effect.effect.connect(this.effects[index + 1].effect);
      }
    });
    this.logger.debug('Created connections between the effects');
  }
  //endregion

}
