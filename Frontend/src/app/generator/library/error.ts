import { Logger } from '@upe/logger';

/**
 * Consists of MCP for 'Media Compution Project' followed by a unique number
 * e.g. MCPx0024 or MCPx0101
 */
export type ErrorCode = string;

export class OSCError {

  private logger: Logger = new Logger({ name: 'OSCError', flags: ['error'] });

  constructor(private code: ErrorCode, private msg: string) {
  }

  public print() {
    this.logger.error(`${this.code}: ${this.msg}`);
  }

}
