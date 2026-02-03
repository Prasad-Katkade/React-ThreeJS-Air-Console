# React ThreeJS Air Console

This repository contains a **car game** built with **React, Three.js, and Cannon.js**, where your **phone acts as a controller** using **WebSockets**.  
You can steer the car using mobile controls, and the game supports **haptic feedback (vibration)** on collisions.

---

## 1. car-backend

A simple **TypeScript backend** that uses **WebSockets** to communicate with the game client and the mobile controller.

### Setup & Run

```bash
npm install
npm run dev
```


## 2. car-backend

A React (JavaScript) frontend using:

- Three.js for 3D rendering

- Cannon.js for physics

- WebSockets for real-time control

This is where the 3D car, environment, and gameplay live.

### Setup & Run

```bash
npm install
npm run start
```

## Credits

### 3D Model
**Low Poly Car – Muscle Car 2**  
- Model: https://sketchfab.com/3d-models/low-poly-car-muscle-car-2-ac23acdb0bd54ab38ea72008f3312861  
- Author: the 86 guy  
- Profile: https://sketchfab.com/the_86_guy  

### Tutorials & References
- Game Tutorial (Irradiance):  
  https://youtu.be/wHw3Gh0IhNc?si=pxobg3M4ZwSve9V1  

- Base Repository:  
  https://github.com/Domenicobrz/R3F-in-practice/tree/main/car-physics

