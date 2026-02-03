import { useEffect, useRef, useState } from "react";
import phnrotate from "./phn-rotate.gif";
import { use } from "react";

const MobileControls = ({ sendJoystickState }) => {
  const [activeControls, setActiveControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const forward = useRef(false);
  const backward = useRef(false);
  const left = useRef(false);
  const right = useRef(false);
  const [hideInfo, setHideInfo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideInfo(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="md:hidden w-full h-screen bg-slate-950 overflow-hidden select-none">
      <div className="flex flex-col h-full justify-between items-center text-white">
        {/* Up / Down */}
        <div className="w-full mt-10 p-4 flex justify-center gap-2">
          <div
            className={`border p-10 text-4xl select-none ${
              activeControls.backward && "bg-slate-600"
            }`}
            onTouchStart={() => {
              backward.current = true;
              sendJoystickState(
                forward.current,
                backward.current,
                left.current,
                right.current,
              );
              setActiveControls((p) => ({ ...p, backward: true }));
            }}
            onTouchEnd={() => {
              backward.current = false;
              sendJoystickState(
                forward.current,
                backward.current,
                left.current,
                right.current,
              );
              setActiveControls((p) => ({ ...p, backward: false }));
            }}
          >
            {"<"}
          </div>

          <div
            className={`border p-10 text-4xl select-none ${
              activeControls.forward && "bg-slate-600"
            }`}
            onTouchStart={() => {
              forward.current = true;
              sendJoystickState(
                forward.current,
                backward.current,
                left.current,
                right.current,
              );
              setActiveControls((p) => ({ ...p, forward: true }));
            }}
            onTouchEnd={() => {
              forward.current = false;
              sendJoystickState(
                forward.current,
                backward.current,
                left.current,
                right.current,
              );
              setActiveControls((p) => ({ ...p, forward: false }));
            }}
          >
            {">"}
          </div>
        </div>
        {!hideInfo && (
          <div className="text-center flex flex-col items-center">
            <img
              src={phnrotate}
              className="w-[50px] h-[50px]  "
              alt="Phone rotation guide"
            />
            <p className="text-white text-sm text-opacity-70">
              Rotate your phone.
            </p>
          </div>
        )}

        {/* Left / Right */}
        <div className="w-full mb-20 p-4 flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-2 items-center">
            <div
              className={`border p-10 text-4xl rotate-90 select-none ${
                activeControls.left && "bg-slate-600"
              }`}
              onTouchStart={() => {
                left.current = true;
                sendJoystickState(
                  forward.current,
                  backward.current,
                  left.current,
                  right.current,
                );
                setActiveControls((p) => ({ ...p, left: true }));
              }}
              onTouchEnd={() => {
                left.current = false;
                sendJoystickState(
                  forward.current,
                  backward.current,
                  left.current,
                  right.current,
                );
                setActiveControls((p) => ({ ...p, left: false }));
              }}
            >
              {"<"}
            </div>

            <div
              className={`border p-10 text-4xl rotate-90 select-none ${
                activeControls.right && "bg-slate-600"
              }`}
              onTouchStart={() => {
                right.current = true;
                sendJoystickState(
                  forward.current,
                  backward.current,
                  left.current,
                  right.current,
                );
                setActiveControls((p) => ({ ...p, right: true }));
              }}
              onTouchEnd={() => {
                right.current = false;
                sendJoystickState(
                  forward.current,
                  backward.current,
                  left.current,
                  right.current,
                );
                setActiveControls((p) => ({ ...p, right: false }));
              }}
            >
              {">"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
