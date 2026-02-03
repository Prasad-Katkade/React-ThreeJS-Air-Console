// import { useContext, useEffect, useState } from "react";
// import ControllerContext from "./ControlContext";

// export const useControls = (vehicleApi, chassisApi) => {
//   let [controls, setControls] = useState({});

//   const { forward, backward, left, right } = useContext(ControllerContext);

//   console.log("vars", forward, backward, left, right);

//   useEffect(() => {
//     const keyDownPressHandler = (e) => {
//       setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: true }));
//     };

//     const keyUpPressHandler = (e) => {
//       setControls((controls) => ({
//         ...controls,
//         [e.key.toLowerCase()]: false,
//       }));
//     };

//     window.addEventListener("keydown", keyDownPressHandler);
//     window.addEventListener("keyup", keyUpPressHandler);
//     return () => {
//       window.removeEventListener("keydown", keyDownPressHandler);
//       window.removeEventListener("keyup", keyUpPressHandler);
//     };
//   }, []);

//   useEffect(() => {
//     if (!vehicleApi || !chassisApi) return;

//     if (controls.w || forward.current) {
//       vehicleApi.applyEngineForce(150, 2);
//       vehicleApi.applyEngineForce(150, 3);
//     } else if (controls.s || backward.current) {
//       vehicleApi.applyEngineForce(-150, 2);
//       vehicleApi.applyEngineForce(-150, 3);
//     } else {
//       vehicleApi.applyEngineForce(0, 2);
//       vehicleApi.applyEngineForce(0, 3);
//     }

//     if (controls.a || left.current) {
//       vehicleApi.setSteeringValue(0.35, 2);
//       vehicleApi.setSteeringValue(0.35, 3);
//       vehicleApi.setSteeringValue(-0.1, 0);
//       vehicleApi.setSteeringValue(-0.1, 1);
//     } else if (controls.d || right.current) {
//       vehicleApi.setSteeringValue(-0.35, 2);
//       vehicleApi.setSteeringValue(-0.35, 3);
//       vehicleApi.setSteeringValue(0.1, 0);
//       vehicleApi.setSteeringValue(0.1, 1);
//     } else {
//       for (let i = 0; i < 4; i++) {
//         vehicleApi.setSteeringValue(0, i);
//       }
//     }

//     if (controls.arrowdown || backward.current)
//       chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1]);
//     if (controls.arrowup || forward.current) chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1]);
//     if (controls.arrowleft || left.current)
//       chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0]);
//     if (controls.arrowright || right.current)
//       chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0]);

//     if (controls.r) {
//       chassisApi.position.set(-1.5, 0.5, 3);
//       chassisApi.velocity.set(0, 0, 0);
//       chassisApi.angularVelocity.set(0, 0, 0);
//       chassisApi.rotation.set(0, 0, 0);
//     }
//   }, [controls, vehicleApi, chassisApi]);

//   return controls;
// };
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
