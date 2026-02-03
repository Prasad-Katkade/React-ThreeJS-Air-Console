import { useRef, useState } from "react";

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

    return (
        <div className="md:hidden w-full h-screen bg-slate-950 overflow-hidden select-none">

            <div className="flex flex-col h-full justify-between text-white">

                {/* Up / Down */}
                <div className="w-full mt-10 p-4 flex justify-center gap-2">
                    <div
                        className={`border p-10 text-4xl select-none ${activeControls.backward && "bg-slate-600"
                            }`}
                        onTouchStart={() => {
                            backward.current = true;
                            sendJoystickState(
                                forward.current,
                                backward.current,
                                left.current,
                                right.current
                            );
                            setActiveControls((p) => ({ ...p, backward: true }));
                        }}
                        onTouchEnd={() => {
                            backward.current = false;
                            sendJoystickState(
                                forward.current,
                                backward.current,
                                left.current,
                                right.current
                            );
                            setActiveControls((p) => ({ ...p, backward: false }));
                        }}
                    >
                        {"<"}
                    </div>

                    <div
                        className={`border p-10 text-4xl select-none ${activeControls.forward && "bg-slate-600"
                            }`}
                        onTouchStart={() => {
                            forward.current = true;
                            sendJoystickState(
                                forward.current,
                                backward.current,
                                left.current,
                                right.current
                            );
                            setActiveControls((p) => ({ ...p, forward: true }));
                        }}
                        onTouchEnd={() => {
                            forward.current = false;
                            sendJoystickState(
                                forward.current,
                                backward.current,
                                left.current,
                                right.current
                            );
                            setActiveControls((p) => ({ ...p, forward: false }));
                        }}
                    >
                        {">"}
                    </div>
                </div>

                {/* Left / Right */}
                <div className="w-full mb-20 p-4 flex flex-col gap-2 items-center">
                    <div className="flex flex-col gap-2 items-center">
                        <div
                            className={`border p-10 text-4xl rotate-90 select-none ${activeControls.left && "bg-slate-600"
                                }`}
                            onTouchStart={() => {
                                left.current = true;
                                sendJoystickState(
                                    forward.current,
                                    backward.current,
                                    left.current,
                                    right.current
                                );
                                setActiveControls((p) => ({ ...p, left: true }));
                            }}
                            onTouchEnd={() => {
                                left.current = false;
                                sendJoystickState(
                                    forward.current,
                                    backward.current,
                                    left.current,
                                    right.current
                                );
                                setActiveControls((p) => ({ ...p, left: false }));
                            }}
                        >
                            {"<"}
                        </div>

                        <div
                            className={`border p-10 text-4xl rotate-90 select-none ${activeControls.right && "bg-slate-600"
                                }`}
                            onTouchStart={() => {
                                right.current = true;
                                sendJoystickState(
                                    forward.current,
                                    backward.current,
                                    left.current,
                                    right.current
                                );
                                setActiveControls((p) => ({ ...p, right: true }));
                            }}
                            onTouchEnd={() => {
                                right.current = false;
                                sendJoystickState(
                                    forward.current,
                                    backward.current,
                                    left.current,
                                    right.current
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
