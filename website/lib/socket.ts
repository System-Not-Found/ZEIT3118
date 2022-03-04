import { Team } from './types';

const websocketAddress = "wss://localhost" //process.env["WEBSOCKET_ADDRESS"];

if (!websocketAddress) {
  throw new Error("Environment variable WEBSOCKET_ADDRESS was not supplied");
}

export const socket = new WebSocket(websocketAddress);

socket.onopen = (e) => {
  console.log("[open] Connection established");
}

socket.onmessage = (event) => {
  console.log(`[message] Data received from server ${event.data}`);
}

socket.onerror = (error) => {
  console.log(`[error] ${error}`)
}