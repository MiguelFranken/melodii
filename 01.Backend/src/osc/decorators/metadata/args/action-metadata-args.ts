/**
 * Action metadata used to storage information about registered action
 */
export interface IActionMetadataArgs {

  /**
   * Message's address after the namespace to listen to
   */
  name?: Set<string>;

  /**
   * Controller class on which's method this action is attached
   */
  target: Function;

  /**
   * Controller class' method that will be executed on this action
   */
  method: string;

}
