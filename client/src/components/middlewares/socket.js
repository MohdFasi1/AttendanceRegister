import { io } from 'socket.io-client';

// Create a socket instance, connecting to the server
const socket = io(`${process.env.REACT_APP_API_URL}`);

export default socket;
