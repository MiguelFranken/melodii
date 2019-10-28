export interface IOSCRawMessage {
  address: string; // URL-style address path
  args: IOSCArgs[]; // Raw or type-annotated OSC arguments
}

export type OSCTypeTag = "i" | "f" | "s" | "b"; // int32, float32, OSC-string, OSC-blob

// see http://opensoundcontrol.org/spec-1_0
export interface IOSCArgs {
  type: OSCTypeTag; // OSC Type Tag String

  // todo: Not only number or strings! maybe any since we already define the type with the OSCTypeTag.
  //       But maybe we also need some convenience methods because now it is necessary to cast the value before using it
  value: number | string;
}

export interface IOSCInfo {
  address: string; // ip address of music instrument
  family: string; // e.g. IPv4
  port: number;
  size: number; // size of the message
}
