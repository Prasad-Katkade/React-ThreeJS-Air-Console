import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";

export function Scene() {
  const [thirdPerson, setThirdPerson] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key == "k") {
        // random is necessary to trigger a state change
        if (thirdPerson)
          setCameraPosition([-6, 3.9, 6.21 + Math.random() * 0.01]);
        setThirdPerson(!thirdPerson);
      }
    }

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [thirdPerson]);

  const LoadingScreen = () => {
    return (
      <Html center fullscreen>
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <h1 className="text-lg font-medium tracking-wide text-white">
            Loading...
          </h1>
        </div>
      </Html>
    );
  };

  return (
    <Suspense
      fallback={
        <Html center>
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <h1 className="text-lg font-medium text-black">Loading...</h1>
        </Html>
      }
    >
      <Environment
        files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
        background={"both"}
      />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
      {!thirdPerson && <OrbitControls target={[-2.64, -0.71, 0.03]} />}

      <Ground />
      <Track />
      <Car thirdPerson={thirdPerson} />
    </Suspense>
  );
}
