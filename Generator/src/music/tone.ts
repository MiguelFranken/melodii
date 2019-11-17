import "reflect-metadata";

import { path } from "./config";
import { SocketServer } from "./socket-server";
import { CONTROLLERS } from "./controllers";
import { Container } from "./decorator";
import { Music } from './music';

export const container = new Container();
const socket = new SocketServer(path);
socket.addControllers(CONTROLLERS);

const button = document.getElementById("play");
const music = new Music();
if (button != null) {
    console.log("Found button.");
    button.addEventListener("click", () => music.playNote("C4"));
} else {
    console.log("Did not find button.");
}