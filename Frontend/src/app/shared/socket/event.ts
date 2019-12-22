export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_FAILED = 'connect_error',
  OSC_MESSAGE = 'message',
  RTC_ANSWER = 'rtc-answer',
  NEW_ICE_CANDIDATE = "new-ice-candidate"
}
