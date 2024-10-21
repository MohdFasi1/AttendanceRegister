import { io } from 'socket.io-client';

// Create a socket instance, connecting to the server
const socket = io(`${import.meta.env.VITE_API_URL}`);

export default socket;
