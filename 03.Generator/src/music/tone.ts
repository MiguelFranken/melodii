import "reflect-metadata";

import { path } from "./config";
import { SocketServer } from "./socket-server";
import { CONTROLLERS } from "./controllers";
import { Container } from "./decorator";

export const container = new Container();
const socket = new SocketServer(path);
socket.addControllers(CONTROLLERS);
