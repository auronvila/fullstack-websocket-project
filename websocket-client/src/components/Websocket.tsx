import {useContext, useEffect, useState} from "react";
import {WebsocketContext} from "../context/WebsocketContext.tsx";

export default function Websocket() {
  const [value, setValue] = useState('');
  const [socketData, setSocketData] = useState<string[]>([]);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    setSocketData([]);

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('onMessage', (args) => {
      console.log('received a message from onMessage event');
      console.log(args.body);
      setSocketData((data) => [...data, args.body]);
    });

    socket.on('connectedTabsCount', (args) => {
      console.log('new tab connected', args);
    });

    return () => {
      console.log('unregistered from events');
      socket.on('disconnect', () => {
        console.log('disconnected')
      })
      socket.off('connect');
      socket.off('connectedTabsCount');
      socket.off('onMessage');
    };
  }, [socket]);

  function handleSocketRequest() {
    if (!value) {
      return
    }
    socket.emit('newMessage', value);
    setValue('');
  }

  return (
    <>
      <h1>Websocket Component</h1>
      <input value={value} onChange={(e) => setValue(e.target.value)} type={'text'}/>
      <button onClick={handleSocketRequest}>Submit</button>
      <ul>
        {socketData.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}
