import { useContext, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import ControllerContext from "./ControlContext";

export const useControls = (vehicleApi, chassisApi) => {
  const { forward, backward, left, right } = useContext(ControllerContext);
  const [controls, setControls] = useState({});

  useEffect(() => {
    const down = (e) =>
      setControls((c) => ({ ...c, [e.key.toLowerCase()]: true }));
    const up = (e) =>
      setControls((c) => ({ ...c, [e.key.toLowerCase()]: false }));

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(() => {
    if (!vehicleApi || !chassisApi) return;

    const f = controls.w || forward.current;
    const b = controls.s || backward.current;
    const l = controls.a || left.current;
    const r = controls.d || right.current;

    const reset = controls.r;

    if (reset) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
      return;
    }

    // engine
    if (f) {
      vehicleApi.applyEngineForce(150, 2);
      vehicleApi.applyEngineForce(150, 3);
    } else if (b) {
      vehicleApi.applyEngineForce(-150, 2);
      vehicleApi.applyEngineForce(-150, 3);
    } else {
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    }

    // steering
    if (l) {
      vehicleApi.setSteeringValue(0.35, 2);
      vehicleApi.setSteeringValue(0.35, 3);
      vehicleApi.setSteeringValue(-0.1, 0);
      vehicleApi.setSteeringValue(-0.1, 1);
    } else if (r) {
      vehicleApi.setSteeringValue(-0.35, 2);
      vehicleApi.setSteeringValue(-0.35, 3);
      vehicleApi.setSteeringValue(0.1, 0);
      vehicleApi.setSteeringValue(0.1, 1);
    } else {
      for (let i = 0; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }
  });
};
