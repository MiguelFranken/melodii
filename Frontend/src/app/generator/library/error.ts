import { Logger } from '@upe/logger';
import { LogService } from '../log/log.service';

/**
 * Consists of MCP for 'Media Compution Project' followed by a unique number
 * e.g. MCPx0024 or MCPx0101
 */
export type ErrorCode = string;

export class OSCError {

  private logger: Logger = new Logger({ name: 'OSCError', flags: ['error'] });

  constructor(private code: ErrorCode, private msg: string, private data?: any) {
  }

  public print(logger?: Logger) {
    const errorMessage = `${this.code}: ${this.msg}`;
    if (logger) {
      logger.error(errorMessage, this.data);
    } else {
      this.logger.error(errorMessage, this.data);
    }
  }

  public printFrontend(logger?: LogService) {
    const errorMessage = `${this.code}: ${this.msg} (${JSON.stringify(this.data)})`;
    if (logger) {
      logger.addErrorMessage(errorMessage);
    } else {
      this.logger.error(errorMessage);
    }
  }

}
