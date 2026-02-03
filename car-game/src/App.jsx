import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Scene } from "./Scene";
import MobileControls from "./MobileControl";
import ControllerContext from "./ControlContext";
import { QRCodeSVG } from "qrcode.react";

const App = () => {
  const forward = useRef(false);
  const backward = useRef(false);
  const left = useRef(false);
  const right = useRef(false);
  const wsRef = useRef(null);
  const [url, setUrl] = useState(null);
  const BE_URL = "react-threejs-air-console.onrender.com";
  const FE_URL = "https://react-air-console.netlify.app/";

  const setCollisionDetected = (val) => {
    sendJoystickState(
      forward.current,
      backward.current,
      left.current,
      right.current,
      val,
    );
    setTimeout(() => {
      sendJoystickState(
        forward.current,
        backward.current,
        left.current,
        right.current,
        false,
      );
    }, 100);
  };

  useEffect(() => {
    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);

    async function init() {
      let roomCode = window.location.pathname.replace("/", "");
      if ((!roomCode || roomCode.length !== 5) && !isMobile) {
        const res = await fetch(`https://${BE_URL}/create-room`);
        const data = await res.json();
        roomCode = data.room;
        window.history.pushState({}, "", `/${roomCode}`);
      }
      if (!roomCode) return;
      const ws = new WebSocket(`wss://${BE_URL}/${roomCode}`);
      setUrl(`${FE_URL}${roomCode}`);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "state") {
          const s = msg.payload;

          forward.current = s.forward;
          backward.current = s.backward;
          left.current = s.left;
          right.current = s.right;
          if (s.collision && isMobile) {
            window.navigator.vibrate([500]);
          }
        }
      };
    }

    init();
  }, []);

  const sendJoystickState = (f, b, l, r, c = false) => {
    forward.current = f;
    backward.current = b;
    left.current = l;
    right.current = r;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "joystick",
          payload: {
            forward: forward.current,
            backward: backward.current,
            left: left.current,
            right: right.current,
            collision: c,
          },
        }),
      );
    }
  };

  return (
    <>
      <div className="desktop-container ">
        <ControllerContext.Provider
          value={{
            forward: forward,
            backward: backward,
            left: left,
            right: right,
            setCollisionDetected: setCollisionDetected,
          }}
        >
          <Canvas>
            <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
              <Scene />
            </Physics>
          </Canvas>
        </ControllerContext.Provider>

        <div className="controls">
          <div className="h-full">
            {url ? (
              <>
                <p>Scan to open controls</p>
                <p>on mobile with haptics</p>
              </>
            ) : (
              <p>Loading Controls for Phone..</p>
            )}
            <p className="text-center">Or</p>
            <p>press W A S D to move</p>
            <p>press K to swap camera</p>
            <p>press R to reset</p>
          </div>
          {url && (
            <div className="h-full bg-red-50 ml-1 flex flex-col items-center justify-center">
              <QRCodeSVG value={url} marginSize={5} />
            </div>
          )}
        </div>
        <div className="credits">
          <p>Credits-</p>
          <p>
            Game Tutorial :
            <a
              className="underline"
              href="https://youtu.be/wHw3Gh0IhNc?si=pxobg3M4ZwSve9V1"
            >
              Irradiance
            </a>
          </p>
          <p>
            Air-Console Integration :
            <a
              className="underline"
              href="https://github.com/Prasad-Katkade/React-ThreeJS-Air-Console"
            >
              Prasad's Github
            </a>
          </p>
        </div>
      </div>

      <div className="mobile-container">
        <MobileControls
          sendJoystickState={(f, b, l, r) => sendJoystickState(f, b, l, r)}
        />
      </div>
    </>
  );
};

export default App;
