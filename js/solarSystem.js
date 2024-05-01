import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { EffectComposer } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let activeButton = "home";

const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpeg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");
let mars;
let mercury;
let earth;
let saturn;
let venus;
let neptune;
let displayContent = false;
let enableOrbiting = true;

const contentTemplates = {
  'aboutMe': `
      <h2>About Me-rcury</h2>
        <div class="textdiv"> 
          <img src="./image/profilepic.png" alt="About Me Image" class="profile-pic">
          <p>Hi! I'm Zaid, a third-year student at the University of British Columbia, where I am pursuing a Bachelor's degree in Computer Science and Public Health. My academic journey is dedicated to blending cutting-edge technology with healthcare to improve systems and patient outcomes.<p>
          <p>I am deeply passionate about using my skills in software development to create innovative solutions that address the complexities of modern healthcare. Outside of my studies, I am fascinated by space exploration and enjoy spending time with my cat, Binoo, who often keeps me company while I code or catch up on the latest tech news.</p>
        </div>
  `,
  'experience': `
      <h2>Experiences on Earth</h2>
      <div class="experience">
            <div class="textdiv"> 
            <h3>SWE Intern at Radical AI</h3>
            <p>Jun 2024 - Present<br>Developed and implemented a robust data automation pipeline using Python and Azure cloud services to <span class="highlight"><strong>extract and transform data from the Starlink API</strong></span>, facilitating real-time network usage tracking in Nunavut. This included designing interactive Power BI dashboards that provided actionable insights to support strategic business decisions.<p>
            <h3>Network Automation Intern at Qiniq</h3>
            <p>Mar 2024 - Present<br>Developed and implemented a robust data automation pipeline using Python and Azure cloud services to <span class="highlight"><strong>extract and transform data from the Starlink API</strong></span>, facilitating real-time network usage tracking in Nunavut. This included designing interactive Power BI dashboards that provided actionable insights to support strategic business decisions.<p>
            </div>
      </div>
  `,
  'projects': `
      <h2>Projects</h2>
      <p>Here are some of the projects I've worked on:</p>
      <a href="link_to_project_1">Project 1</a>
      <a href="link_to_project_2">Project 2</a>
  `,

  'skills': `
      <h2>Saturn Ring's of Skills</h2>
      <div class="experience"> 
      <h3>Languages and Databases</h3>
      <p>Python, Java, HTML/CSS, C/C++, JavaScript, Swift, Oracle, MySQL, MongoDB<p>
      <h3>Frameworks and Libraries</h3>
      <p>Numpy, Pandas, Flask, Node.js, Express.js, React.js, Tensorflow, Scikit-learn<p>
      <h3>Developer Tools</h3>
      <p>Git, VScode, Microsoft Azure, AWS, Jupyter<p>
      </div>
  `,
  'contact': `
      <h2>Neptunian Networks</h2>
      <div class="experience"> 
      <h3>Languages and Databases</h3>
      <p>Python, Java, HTML/CSS, C/C++, JavaScript, Swift, Oracle, MySQL, MongoDB<p>
      <h3>Frameworks and Libraries</h3>
      <p>Numpy, Pandas, Flask, Node.js, Express.js, React.js, Tensorflow, Scikit-learn<p>
      <h3>Developer Tools</h3>
      <p>Git, VScode, Microsoft Azure, AWS, Jupyter<p>
      </div>
  `
};

const scene = new THREE.Scene();
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

//Create stars in background
function createStars(count, size) {
  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3); 
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 500 * Math.random() + 4500; 
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      const index = 3 * i;
      positions[index] = r * Math.sin(phi) * Math.cos(theta); 
      positions[index + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[index + 2] = r * Math.cos(phi);

      const brightness = 0.5 + 0.5 * Math.random(); 
      colors[index] = brightness;   
      colors[index + 1] = brightness;   
      colors[index + 2] = brightness;  
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starsMaterial = new THREE.PointsMaterial({
      size: size,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
  });

  return new THREE.Points(starsGeometry, starsMaterial);
}

//add stars to background
const starField = createStars(10000, 1);
scene.add(starField);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const initialCameraPosition = new THREE.Vector3(-50, 90, 400);  // Example values
const initialTarget = new THREE.Vector3(0, 0, 0); 
camera.position.set(-50, 90, 400);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.minPolarAngle = Math.PI / 4; 
orbit.maxPolarAngle = 2.3 * Math.PI / 4;
orbit.enableZoom = false;

const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});

const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 3, 400);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const path_of_planets = [];

//Create and add orbit lines
function createLineLoopWithMesh(radius, color = 0x333333, width = 1) {
  const material = new THREE.LineDashedMaterial({
    color: color,
    linewidth: width,
    scale: 1, 
    transparent: true,
    opacity: 0.2
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

const generatePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);

  //Start at random angle
  const initialAngle = Math.random() * 2 * Math.PI;
  planetObj.rotation.y = initialAngle;

  if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
      const ringMat = new THREE.MeshStandardMaterial({
          map: ring.ringmat,
          side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      planetObj.add(ringMesh);
      ringMesh.position.set(x, 0, 0);

      if (size  == 7.4 ) {
        ringMesh.rotation.x = -0.5 * Math.PI;
        ringMesh.rotation.y = -0.1 * Math.PI;
      } else {
        ringMesh.rotation.x = -0.1 * Math.PI;
        ringMesh.rotation.y = -0.1 * Math.PI;
      }
    
  }

  scene.add(planetObj);
  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);

  return {
      planetObj: planetObj,
      planet: planet,
  };
};

//generate all planets
const planets = [
  {
    ...generatePlanet(1.6, mercuryTexture, 45), 
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...generatePlanet(3.4, venusTexture, 75),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...generatePlanet(3.5, earthTexture, 95),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...generatePlanet(2.3, marsTexture, 125),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...generatePlanet(8.8, jupiterTexture, 170),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...generatePlanet(7.4, saturnTexture, 220, {
      innerRadius: 8,
      outerRadius: 18,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...generatePlanet(4.1, uranusTexture, 260, {
      innerRadius: 6,
      outerRadius: 11,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...generatePlanet(5.1, neptuneTexture, 300),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
];
planets.forEach((planet, index) => {
  if (index === 0) {  
    mercury = planet.planet;
  }
});

planets.forEach((planet, index) => {
  if (index === 1) {  
    venus = planet.planet;
  }
});

planets.forEach((planet, index) => {
  if (index === 2) {  
    earth = planet.planet;
  }
});

planets.forEach((planet, index) => {
  if (index === 3) {  
    mars = planet.planet;
  }
});


planets.forEach((planet, index) => {
  if (index === 5) {  
    saturn = planet.planet;
  }
});

planets.forEach((planet, index) => {
  if (index === 7) {  
    neptune = planet.planet;
  }
});

function getPlanetByName(planet) {
  switch (planet) {
    case "mercury":
      return mercury
    case "venus":
      return venus
    case "earth":
      return earth
    case "saturn":
      return saturn
    case "neptune":
      return neptune
  }
}

//update box content
function updateContent(sectionKey) {
  const template = contentTemplates[sectionKey];
  if (template) {
      aboutPanel.innerHTML = template;
      aboutPanel.style.display = 'block';
  } else {
      aboutPanel.style.display = 'none';
  }
}

//update box-planet line
function updateLine() {
  const currentPlanet = toScreenPosition(getPlanetByName(activeButton), camera);
  const aboutPanel = document.getElementById('aboutPanel');
  const verticalLine = document.getElementById('verticalLine');
  const diagonalLine = document.getElementById('diagonalLine');
  const boxRect = aboutPanel.getBoundingClientRect();

  let verticalLineStartY = currentPlanet.y - 5; 
  let verticalLineEndY = currentPlanet.y - 40; 

  switch(activeButton) {
    case "mercury":
      verticalLineStartY = currentPlanet.y - 2; 
      verticalLineEndY = currentPlanet.y - 40;
      break; 
    case "earth": 
      verticalLineStartY = currentPlanet.y - 10; 
      verticalLineEndY = currentPlanet.y - 60;
      break; 
    case "venus": 
      verticalLineStartY = currentPlanet.y - 10; 
      verticalLineEndY = currentPlanet.y - 60;
      break; 
    case "saturn": 
      verticalLineStartY = currentPlanet.y - 15; 
      verticalLineEndY = currentPlanet.y - 60;
      break;
    case "neptune": 
      verticalLineStartY = currentPlanet.y - 15; 
      verticalLineEndY = currentPlanet.y - 60;
      break;  
    default:
      break;
  }
  verticalLine.setAttribute('x1', currentPlanet.x);
  verticalLine.setAttribute('y1', verticalLineStartY);
  verticalLine.setAttribute('x2', currentPlanet.x);
  verticalLine.setAttribute('y2', verticalLineEndY);

  diagonalLine.setAttribute('x1', currentPlanet.x);
  diagonalLine.setAttribute('y1', verticalLineEndY);
  diagonalLine.setAttribute('x2', boxRect.left + 3.5); 
  diagonalLine.setAttribute('y2', boxRect.top + 3);
}

function toScreenPosition(obj, camera) {
  const vector = new THREE.Vector3();
  const canvas = renderer.domElement;
  const { left, top, width, height } = canvas.getBoundingClientRect();

  obj.getWorldPosition(vector);
  vector.project(camera);

  vector.x = ((vector.x + 1) / 2 * width) + left + 1;
  vector.y = (-(vector.y - 1) / 2 * height) + top - 30;

  return { x: vector.x, y: vector.y };
}

function animate() {
  sun.rotateY(0.3 * 0.004);
  renderer.clear();
  renderer.render(scene, camera);
  TWEEN.update();
  orbit.update();
  bloomComposer.render();
  if (displayContent) {
    updateLine(); 
  }

  if (enableOrbiting) {
      planets.forEach(
        ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
          planetObj.rotateY(0.3 * rotaing_speed_around_sun);
          planet.rotateY(0.3 * self_rotation_speed);
        }
      );
  }
}

function manageContentDisplay() {
  const aboutPanel = document.getElementById('aboutPanel');
  const infoLine = document.getElementById('verticalLine');
  const infoLine2 = document.getElementById('diagonalLine');

  if (displayContent) {
      aboutPanel.style.display = 'block';
      infoLine.style.visibility = 'visible';
      infoLine2.style.visibility = 'visible';
      updateLine();
  } else {
    aboutPanel.style.display = 'none';
    infoLine.style.visibility = 'hidden';
    infoLine2.style.visibility = 'hidden';
    updateLine();
  }
}

camera.layers.enable(0);  
camera.layers.enable(1);  
camera.far = 10000;
camera.updateProjectionMatrix();

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), 
  1.5,
  0.4,
  0.85 
);
bloomPass.threshold = 0.05;
bloomPass.strength = 1.5;
bloomPass.radius = 1;


const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('DOMContentLoaded', function() {
  const realViewButton = document.getElementById('realViewButton');
  const showPathButton = document.getElementById('showPathButton');
  const aboutMeButton = document.getElementById('aboutMeButton');
  const experinceButton = document.getElementById('experinceButton');
  const skillsButton = document.getElementById('skillsButton');
  const contactButton = document.getElementById('contactButton');

  const finalIntensity = 0.8;
  const saturnIntensity = 0.65; 
  const initialSunlightIntensity = 3; 
  sunLight.intensity = initialSunlightIntensity; 

  //Home Button (reset)
  document.getElementById('homeButton').addEventListener('click', function() {
    enableOrbiting = true;
    if (activeButton === 'home') return;
    displayContent = false;
    manageContentDisplay(); 
    activeButton = 'home';
    const currentCameraPosition = camera.position.clone();
    const currentTarget = orbit.target.clone();
    const currentIntensity = sunLight.intensity;

    const tweenObject = {
        camX: currentCameraPosition.x,
        camY: currentCameraPosition.y,
        camZ: currentCameraPosition.z,
        targetX: currentTarget.x,
        targetY: currentTarget.y,
        targetZ: currentTarget.z,
        intensity: currentIntensity  
    };

    new TWEEN.Tween(tweenObject)
        .to({
            camX: initialCameraPosition.x,
            camY: initialCameraPosition.y,
            camZ: initialCameraPosition.z,
            targetX: initialTarget.x,
            targetY: initialTarget.y,
            targetZ: initialTarget.z,
            intensity: initialSunlightIntensity  
        }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .start();
  });

  // about me button
  aboutMeButton.onclick = function() {
    if (activeButton === 'mercury') return;
    activeButton = 'mercury';
    enableOrbiting = false;
    updateContent('aboutMe');
    displayContent = false;
    manageContentDisplay(); 
    const mercuryPosition = new THREE.Vector3();
    mercury.getWorldPosition(mercuryPosition); 

    const initialCameraPosition = camera.position.clone();
    const initialTarget = orbit.target.clone();
    const offset = new THREE.Vector3(0, 10, 25);
    const finalCameraPosition = mercuryPosition.clone().add(offset);

    const tweenObject = {
        camX: initialCameraPosition.x,
        camY: initialCameraPosition.y,
        camZ: initialCameraPosition.z,
        targetX: initialTarget.x,
        targetY: initialTarget.y,
        targetZ: initialTarget.z,
        intensity: sunLight.intensity
    };

    new TWEEN.Tween(tweenObject)
        .to({
            camX: finalCameraPosition.x,
            camY: finalCameraPosition.y,
            camZ: finalCameraPosition.z,
            targetX: mercuryPosition.x,
            targetY: mercuryPosition.y,
            targetZ: mercuryPosition.z,
            intensity: finalIntensity
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          displayContent = true;
          manageContentDisplay();
        })
        .start();
  };

  //experience button
  experinceButton.onclick = function() {
    if (activeButton === 'earth') return;
    activeButton = 'earth';
    updateContent('experience');
    enableOrbiting = false;
    displayContent = false;
    manageContentDisplay(); 
    const earthPosition = new THREE.Vector3();
    earth.getWorldPosition(earthPosition); 

    const initialCameraPosition = camera.position.clone();
    const initialTarget = orbit.target.clone();
    const offset = new THREE.Vector3(0, 10, 40);
    const finalCameraPosition = earthPosition.clone().add(offset);

    const tweenObject = {
        camX: initialCameraPosition.x,
        camY: initialCameraPosition.y,
        camZ: initialCameraPosition.z,
        targetX: initialTarget.x,
        targetY: initialTarget.y,
        targetZ: initialTarget.z,
        intensity: sunLight.intensity
    };

    new TWEEN.Tween(tweenObject)
        .to({
            camX: finalCameraPosition.x,
            camY: finalCameraPosition.y,
            camZ: finalCameraPosition.z,
            targetX: earthPosition.x,
            targetY: earthPosition.y,
            targetZ: earthPosition.z,
            intensity: finalIntensity
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          displayContent = true;
          manageContentDisplay();
       })
        .start();
  };

  // skills button
  skillsButton.onclick = function() {
    if (activeButton === 'saturn') return;
    activeButton = 'saturn';
    updateContent('skills');
    enableOrbiting = false;
    displayContent = false;
    manageContentDisplay(); 
    const saturnPosition = new THREE.Vector3();
    saturn.getWorldPosition(saturnPosition); 

    const initialCameraPosition = camera.position.clone();
    const initialTarget = orbit.target.clone();
    const offset = new THREE.Vector3(0, 20, 75);
    const finalCameraPosition = saturnPosition.clone().add(offset);

    const tweenObject = {
        camX: initialCameraPosition.x,
        camY: initialCameraPosition.y,
        camZ: initialCameraPosition.z,
        targetX: initialTarget.x,
        targetY: initialTarget.y,
        targetZ: initialTarget.z,
        intensity: sunLight.intensity
    };

    new TWEEN.Tween(tweenObject)
        .to({
            camX: finalCameraPosition.x,
            camY: finalCameraPosition.y,
            camZ: finalCameraPosition.z,
            targetX: saturnPosition.x,
            targetY: saturnPosition.y,
            targetZ: saturnPosition.z,
            intensity: saturnIntensity
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          displayContent = true;
          manageContentDisplay();
       })
        .start();
  };

  //contact Button
  contactButton.onclick = function() {
    if (activeButton === 'neptune') return;
    activeButton = 'neptune';
    updateContent('contact');
    enableOrbiting = false;
    displayContent = false;
    manageContentDisplay(); 
    const neptunePosition = new THREE.Vector3();
    neptune.getWorldPosition(neptunePosition); 

    const initialCameraPosition = camera.position.clone();
    const initialTarget = orbit.target.clone();
    const offset = new THREE.Vector3(0, 20, 55);
    const finalCameraPosition = neptunePosition.clone().add(offset);

    const tweenObject = {
        camX: initialCameraPosition.x,
        camY: initialCameraPosition.y,
        camZ: initialCameraPosition.z,
        targetX: initialTarget.x,
        targetY: initialTarget.y,
        targetZ: initialTarget.z,
        intensity: sunLight.intensity
    };

    new TWEEN.Tween(tweenObject)
        .to({
            camX: finalCameraPosition.x,
            camY: finalCameraPosition.y,
            camZ: finalCameraPosition.z,
            targetX: neptunePosition.x,
            targetY: neptunePosition.y,
            targetZ: neptunePosition.z,
            intensity: saturnIntensity
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          displayContent = true;
          manageContentDisplay();
       })
        .start();
  };

  // real view toggle
  realViewButton.onclick = function() {
      this.classList.toggle('active');
      ambientLight.intensity = this.classList.contains('active') ? 0.5 : 0;
  };

  // show path toggle
  showPathButton.onclick = function() {
      this.classList.toggle('active');
      path_of_planets.forEach(dpath => {
          dpath.visible = this.classList.contains('active');
      });
  };

});