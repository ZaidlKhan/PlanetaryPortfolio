//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const textureLoader = new THREE.TextureLoader();

const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");

const scene = new THREE.Scene();
//NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;

function createStars(count, size) {
  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3); // Each star needs x, y, z coordinates
  const colors = new Float32Array(count * 3); // Each color needs r, g, b components

  for (let i = 0; i < count; i++) {
    const r = 500 * Math.random() + 4500; // Spherical radius
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      const index = 3 * i;
      positions[index] = r * Math.sin(phi) * Math.cos(theta); // x
      positions[index + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      positions[index + 2] = r * Math.cos(phi); // z

      // Random brightness
      const brightness = 0.5 + 0.5 * Math.random(); // 50% to 100% brightness
      colors[index] = brightness;   // Red
      colors[index + 1] = brightness;   // Green
      colors[index + 2] = brightness;   // Blue
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starsMaterial = new THREE.PointsMaterial({
      size: size,
      sizeAttenuation: true,
      vertexColors: true, // Use vertex colors
      transparent: true,
      opacity: 0.8
  });

  return new THREE.Points(starsGeometry, starsMaterial);
}

const starField = createStars(10000, 1);
scene.add(starField);


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 400);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.minPolarAngle = Math.PI / 4; 
orbit.maxPolarAngle = 2.5 * Math.PI / 4;
orbit.enableZoom = false;

const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

const path_of_planets = [];

function createLineLoopWithMesh(radius, color = 0x333333, width = 1) {
  const material = new THREE.LineDashedMaterial({
    color: color,
    linewidth: width,
    scale: 1, // Adjust this value as needed to control the appearance of the dashes
    dashSize: 0.3, // Length of the dashes
    gapSize: 0.15, // Length of the gaps between dashes
    transparent: true,
    opacity: 0.5
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  const numSegments = 1000; 
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );

  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}

// create planet
const genratePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

//Chagne last value for c
const planets = [
  {
    ...genratePlanet(1.6, mercuryTexture, 45), 
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...genratePlanet(3.4, venusTexture, 75),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...genratePlanet(3.5, earthTexture, 95),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...genratePlanet(2.3, marsTexture, 125),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...genratePlanet(8.8, jupiterTexture, 150),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...genratePlanet(7.4, saturnTexture, 190, {
      innerRadius: 8,
      outerRadius: 18,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...genratePlanet(4.1, uranusTexture, 230, {
      innerRadius: 6,
      outerRadius: 11,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...genratePlanet(4.1, neptuneTexture, 270),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
];

//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);

//NOTE - animate function
function animate(time) {
  sun.rotateY(options.speed * 0.004);
  planets.forEach(
    ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );
  renderer.render(scene, camera);
}

camera.far = 10000;
camera.updateProjectionMatrix();

renderer.setAnimationLoop(animate);
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
