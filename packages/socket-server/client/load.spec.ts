import * as io from 'socket.io-client';

const MAX_CLIENTS = 1000;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const createClient = () => {
  const socket = io('http://127.0.0.1:3005',
    {
      path: '/room',
      transports: ['websocket'],
      secure:true
    });
    
  setInterval(() => {
    socket.emit('WATCH_ROOM', { roomId: 'dstusPpqsZ2sRRmJjA' });
  }, EMIT_INTERVAL_IN_MS);

  socket.on('ACTIVATE_COLLABORATORS', () => {
    packetsSinceLastReport++;
  });

  socket.on('disconnect', (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);