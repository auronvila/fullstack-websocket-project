import './App.css'
import {socket, WebsocketProvider} from "./context/WebsocketContext.tsx";
import Websocket from "./components/Websocket.tsx";

function App() {

  return (
    <>
      <WebsocketProvider value={socket}>
        <Websocket/>
      </WebsocketProvider>
    </>
  )
}

export default App
