import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { getSession } from './auth';

export const useSocket = (query) => {
  const [socket, setSocket] = useState()
  const [isConnecting, setConnecting] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    const ioSocket = io('http://localhost:3005');
    ioSocket.on('connect', () => {
      console.log('connect');
      ioSocket.emit("authentication", { token: getSession() });
    });
    ioSocket.on('disconnect', () => {
      setConnecting(false);
      setError({msg: 'disconnected'});;
    });
  
    ioSocket.on('authenticated', data => {
      console.log(data);
      ioSocket.username = data;
      setSocket(ioSocket);
      setConnecting(false);
    });
    ioSocket.on('unauthorized', data => {
      setConnecting(false);
      setError({msg: 'unauthorized'});
    });
  }, []);
  // ioSocket.emit("authentication", { token: getSession() });

  return {
    socket,
    isConnecting,
    error
  };
};