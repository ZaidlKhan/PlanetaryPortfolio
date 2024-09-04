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
let jupiter;
let displayContent = false;
let enableOrbiting = true;

const contentTemplates = {
  'aboutMe': `
      <h2>About Me-rcury</h2>
        <div class="textdiv">
        <div class="panel-thumb">
        </div> 
          <img src="./image/profilepic.png" alt="About Me Image" class="profile-pic">
          <p>Hi! I'm Zaid, a third-year student at the University of British Columbia, where I am pursuing a Bachelor's degree in Computer Science and Public Health. My academic journey is dedicated to blending cutting-edge technology with healthcare to improve systems and patient outcomes.<p>
          <p>I am deeply passionate about using my skills in software development to create innovative solutions to real world problems. Outside of my studies, I am fascinated by space exploration and enjoy spending time with my cat, Binoo, who often keeps me company while I code or catch up on the latest tech news.</p>
        </div>
  `,
  'experience': `
      <h2>Experiences on Earth</h2>
      <div class="experience">
          <div class="panel-thumb">
            </div> 
            <div class="textdiv"> 
            <h3>Provincial Health Services Authority</h3>
            <p>Aug 2024 - Present<br>
            Developed and maintained Web APIs using ASP.NET Web API, SharePoint REST API, SQL Server, and Entity Framework to ensure seamless integration, high-performance database management, and effective content collaboration within clinical applications.<p>
            <h3>Data Engineering Intern at Qiniq</h3>
            <p>Apr 2024 - Aug 2024<br>Developed and implemented a robust data automation pipeline using Python and Azure cloud services to <span class="highlight"><strong>extract and transform data from the Starlink API</strong></span>, facilitating real-time network usage tracking in Nunavut. This included designing interactive Power BI dashboards that provided actionable insights to support strategic business decisions.<p>
            </div>
      </div>
  `,
  'skills': `
      <h2>Saturnian Skill Set</h2>
      <div class="experience"> 
      <div class="panel-thumb">
      </div> 
      <h3>Languages and Databases</h3>
      <p>Python, Java, HTML/CSS, C/C++, JavaScript, Swift, Oracle, MySQL, MongoDB<p>
      <h3>Frameworks and Libraries</h3>
      <p>Numpy, Pandas, Flask, Node.js, Express.js, React.js, Tensorflow, Scikit-learn<p>
      <h3>Developer Tools</h3>
      <p>Git, VScode, Microsoft Azure, AWS, Jupyter<p>
      <h3>Technical Proficiencies</h3>
      <p>Data Structures & Algorithms, Operating Systems, Machine Learning, Object-Oriented Programming, Computer Networking, Relational Databases, Unit Testing, Debugging & Troubleshooting</p>
      </div>
  `,

  'contact': `
      <h2>Neptunian Networks</h2>
      <div class="experience"> 
      <h3>Email</h3>
      <p>zkhan07@student.ubc.ca<p>
      <h3>Mobile</h3>
      <p>1-604-313-8533<p>
      <h3>Social Links</h3>
      <a href="https://www.linkedin.com/in/zaid-k-2b71b629a/" target="_blank">LinkedIn</a><br>
      <a href="https://github.com/ZaidlKhan" target="_blank">Github</a>
  `,

  'projects': `
      <h2>Jupiter Project Journals</h2>
      <div class="textdiv"> 
      <div class="project-container">
      <div class="project-card" data-title="Instagram Messaging App" 
                                data-description="JustChat is an innovative real-time messaging application designed to streamline the management of Instagram Direct Messages (DMs). Currently in development, this app provides a focused solution for users who wish to stay connected via Instagram DMs without the distraction of browsing the main Instagram feed. The concept for JustChat was inspired by a personal challenge: my close friend and I found ourselves spending excessive time scrolling through Instagram, yet we could not afford to uninstall the app due to the necessity of staying updated with our DMs, such as managing group projects organized through Instagram. JustChat aims to empower students and other users to maintain essential communications on Instagram efficiently, without the need to engage with the full platform.
                                &lt;br&gt; I am using React Native for the frontend and Express.js and Node.js for the backend. We have so much more planned for this app, I am thrilled to be a part of it!" 
                                data-techStack="React Native, Node.js, Express.js" 
                                data-githubUrl="https://github.com/jchatapp">
          <img src="./image/justchat.png" alt="Project Image">
          <div class="overlay">Instagram Messaging App</div>
      </div>

        <div class="project-card" data-title="Planetary Portfolio" 
                                  data-description="Welcome to My Planetary Portfolio—the website you are currently exploring! Driven by my passion for space exploration, I decided to create a truly unique and meaningful portfolio represented through a solar system theme. This project presented a significant challenge as I initially had no familiarity with Three.js, the technology that enabled me to render this website in 3D. After dedicating considerable time to mastering Three.js, I succeeded in developing a site that not only showcases my technical skills but also my creativity. I am thrilled with the final outcome and believe it effectively highlights my capabilities.
                                  &lt;br&gt; I will keep updating the website with my most up-to-date projects and experience and will continue development for mobile support." 
                                  data-techStack="Three.js, HTML, CSS" 
                                  data-githubUrl="https://github.com/ZaidlKhan/PlanetaryPortfolio">
            <img src="./image/saturn-pro.jpg" alt="Project Image">
            <div class="overlay">Planetary Portfolio</div>
        </div>

        <div class="project-card" data-title="UBC Science Chatbot" 
                                  data-description="Developed a specialized chatbot service for UBC undergraduate science students to address academic queries and concerns effectively. Leveraging OpenAI's API, I crafted a custom assistant designed to provide tailored support. The frontend was built using React.js, creating a user-friendly and responsive interface. On the backend, I designed and implemented a REST API using Node.js and Express.js, which handles all communications between the frontend and the server. 
                                  &lt;br&gt;This was my first published full-stack project, from which I gained valuble insights into both front-end and back-end development. It was a challenging yet rewarding experience that significantly improved my development skills." 
                                  data-techStack="OpenAI API, Node.js, React.js, Express.js, MongoDB, HTML/CSS"
                                  data-githubUrl="https://github.com/ZaidlKhan/ubc_chatbot_frontend1">
            <img src="./image/chatbot.png" alt="Project Image">
            <div class="overlay">UBC Science Chatbot</div>
        </div>

        <div class="project-card" data-title="Basketball League Database" 
                                  data-description="This project was developed for CPSC 304: Introduction to Relational Databases, where I had to build a full stack application with an Oracle database to manage various aspects of a basketball league including player statistics, team management, and game schedules. 
                                  &lt;br&gt;As a huge basketball fan, this project was particularly exciting as it allowed me to apply the fundamentals of relational databases to something I am passionate about. I gained hands-on experience in constructing and querying databases, which enhanced my understanding of database design principles and SQL." 
                                  data-techStack="Java, SQL, Oracle" 
                                  data-githubUrl="https://github.com/ZaidlKhan/basketball_database">
            <img src="./image/ball.webp" alt="Project Image">
            <div class="overlay">Basketball League Database</div>
        </div>

        <div class="project-card" data-title="Greek Alphabet Recognition" 
                                  data-description="For this project, I developed a deep learning application designed to recognize Greek letters using TensorFlow. This application not only allows users to test their knowledge of Greek letters but also enables them to contribute to enhancing the model by adding more data. Through this initiative, I acquired hands-on experience in constructing neural networks and deepened my understanding of fundamental machine learning concepts." 
                                  data-techStack="Python, JavaScript, Flask, TensorFlow, Scikit-learn" 
                                  data-githubUrl="https://github.com/ZaidlKhan/greek_alphabet_recognition">
            <img src="./image/greek.webp" alt="Project Image">
            <div class="overlay">Greek Handwriting Recognition</div>
        </div>
      </div>
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

var modal = document.getElementById("projectModal");

var span = document.getElementsByClassName("close")[0];

document.querySelectorAll('.project-card').forEach(item => {
    item.addEventListener('click', function() {
        modal.style.display = "block";
    });
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
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
    ...generatePlanet(3.4, venusTexture, 70),
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
  if (index === 4) {  
    jupiter = planet.planet;
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
    case "jupiter":
      return jupiter
  }
}

//update box content
function updateContent(sectionKey) {
  const template = contentTemplates[sectionKey];
  if (template) {
      aboutPanel.innerHTML = template;
      aboutPanel.style.display = 'block';
      if (sectionKey == "projects") {
        setupProjectListeners();
      } 
  } else {
      aboutPanel.style.display = 'none';
  }
}

let currentProjectIndex = 0; 
let projects = []; 

function setupProjectListeners() {
    projects = Array.from(document.querySelectorAll('.project-card')).map(card => ({
        title: card.getAttribute('data-title'),
        description: card.getAttribute('data-description'),
        techStack: card.getAttribute('data-techStack'),
        githubUrl: card.getAttribute('data-githubUrl')
    }));

    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.removeEventListener('click', handleProjectClick);
        card.addEventListener('click', () => handleProjectClick(index));
    });
}

function handleProjectClick(index) {
    currentProjectIndex = index;
    openModal(projects[index]);
}

function openModal(project) {
  updateNavArrows();
  const modalContent = document.getElementById('projectModal');
  const modalDetails = document.querySelector('.modal-content');

  function updateDetails() {
      document.getElementById('projectTitle').textContent = project.title;
      document.getElementById('projectDescription').innerHTML = project.description.replace(/&lt;br&gt;/g, '<br>');
      document.getElementById('projectTechStack').textContent = project.techStack;
      document.getElementById('projectLink').href = project.githubUrl;
      modalDetails.style.opacity = '1';
  }

  if (modalContent.style.display === "flex") {
      modalDetails.style.opacity = '0';

      modalDetails.addEventListener('transitionend', function handleFadeOut() {
          updateDetails();
          modalDetails.removeEventListener('transitionend', handleFadeOut);
      }, {once: true});
  } else {
      modalContent.style.display = "flex"; 
      updateDetails();
  }
}


document.querySelector('.nav-arrow.left').addEventListener('click', () => {
  if (currentProjectIndex > 0) {
      currentProjectIndex -= 1;
      openModal(projects[currentProjectIndex]);
  }
});

document.querySelector('.nav-arrow.right').addEventListener('click', () => {
  if (currentProjectIndex < projects.length - 1) {
      currentProjectIndex += 1;
      openModal(projects[currentProjectIndex]);
  }
});

function updateNavArrows() {
  const leftArrow = document.querySelector('.nav-arrow.left');
  const rightArrow = document.querySelector('.nav-arrow.right');
  if (currentProjectIndex === 0) {
      leftArrow.style.display = 'none';
  } else {
      leftArrow.style.display = 'block';
  }
  if (currentProjectIndex === projects.length - 1) {
      rightArrow.style.display = 'none';
  } else {
      rightArrow.style.display = 'block';
  }
}

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
      verticalLineStartY = currentPlanet.y - 20; 
      verticalLineEndY = currentPlanet.y - 60;
      break; 
    case "earth": 
      verticalLineStartY = currentPlanet.y - 33; 
      verticalLineEndY = currentPlanet.y - 70;
      break;
    case "saturn": 
      verticalLineStartY = currentPlanet.y - 40; 
      verticalLineEndY = currentPlanet.y - 80;
      break;
    case "neptune": 
      verticalLineStartY = currentPlanet.y - 30; 
      verticalLineEndY = currentPlanet.y - 70;
      break;
    case "jupiter": 
      verticalLineStartY = currentPlanet.y - 50; 
      verticalLineEndY = currentPlanet.y - 100;
      break;  

    default:
      break;
  }
  verticalLine.setAttribute('x1', currentPlanet.x);
  verticalLine.setAttribute('y1', verticalLineStartY);
  verticalLine.setAttribute('x2', currentPlanet.x);
  verticalLine.setAttribute('y2', verticalLineEndY);
  verticalLine.setAttribute("z", 100)

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
  const controlPanel = document.querySelector('.control-panel');
  const isSmallScreen = window.innerWidth <= 800;

  if (isSmallScreen) {
    // Hide the control panel
    if (controlPanel) {
      controlPanel.style.display = 'none';
    }
    // Slide up the about panel
    aboutPanel.classList.toggle('show', displayContent);
  } else {
    // Show the control panel
    if (controlPanel) {
      controlPanel.style.display = 'flex';
    }
    if (displayContent) {
      aboutPanel.style.display = 'block';
      document.getElementById('verticalLine').style.visibility = 'visible';
      document.getElementById('diagonalLine').style.visibility = 'visible';
      updateLine();
    } else {
      aboutPanel.style.display = 'none';
      document.getElementById('verticalLine').style.visibility = 'hidden';
      document.getElementById('diagonalLine').style.visibility = 'hidden';
    }
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
  const showOrbitsCheckbox = document.getElementById('showOrbitsCheckbox');
  const realLightingCheckbox = document.getElementById('realLightingCheckbox');
  const homeButton = document.getElementById('homeButton')
  const aboutMeButton = document.getElementById('aboutMeButton');
  const experinceButton = document.getElementById('experinceButton');
  const skillsButton = document.getElementById('skillsButton');
  const contactButton = document.getElementById('contactButton');
  const projectsButton = document.getElementById('projectsButton');
  updateNavArrows();

  const finalIntensity = 0.8;
  const saturnIntensity = 0.65; 
  const initialSunlightIntensity = 3; 
  sunLight.intensity = initialSunlightIntensity; 

  //Home Button (reset)
  homeButton.addEventListener('click', function() {
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
        }, 1000)
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
            homeButton.disabled = true;
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          homeButton.disabled = false;
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
            homeButton.disabled = true;
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          homeButton.disabled = false;
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
            homeButton.disabled = true;
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          homeButton.disabled = false;
          displayContent = true;
          manageContentDisplay();
       })
        .start();
  };

  //project button
  projectsButton.onclick = function() {
    if (activeButton === 'jupiter') return;
    activeButton = 'jupiter';
    updateContent('projects');
    enableOrbiting = false;
    displayContent = false;
    manageContentDisplay(); 
    const jupiterPosition = new THREE.Vector3();
    jupiter.getWorldPosition(jupiterPosition); 

    const initialCameraPosition = camera.position.clone();
    const initialTarget = orbit.target.clone();
    const offset = new THREE.Vector3(0, 20, 75);
    const finalCameraPosition = jupiterPosition.clone().add(offset);

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
            targetX: jupiterPosition.x,
            targetY: jupiterPosition.y,
            targetZ: jupiterPosition.z,
            intensity: saturnIntensity
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            homeButton.disabled = true;
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          homeButton.disabled = false;
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
            homeButton.disabled = true;
            camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
            orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
            camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
            sunLight.intensity = tweenObject.intensity; 
            orbit.update();
        })
        .onComplete(() => {
          homeButton.disabled = false;
          displayContent = true;
          manageContentDisplay();
       })
        .start();
  };

  // show path toggle
  showOrbitsCheckbox.addEventListener('change', function() {
    path_of_planets.forEach(dpath => {
        dpath.visible = this.checked; 
    });
  });

  realLightingCheckbox.addEventListener('change', function() {
    this.classList.toggle('active');
    ambientLight.intensity = this.classList.contains('active') ? 0.5 : 0;
});

});


function handlePlanetButtonClick(planetName, contentKey, cameraOffset, finalIntensity) {
  activeButton = planetName;
  enableOrbiting = false;
  updateContent(contentKey);
  displayContent = false;
  manageContentDisplay();

  const planetPosition = new THREE.Vector3();
  getPlanetByName(planetName).getWorldPosition(planetPosition);

  const initialCameraPosition = camera.position.clone();
  const initialTarget = orbit.target.clone();

  // Adjust Y offset for smaller screens
  let adjustedCameraOffset = cameraOffset.clone();
  const isSmallScreen = window.innerWidth <= 800;  // Define screen size threshold
  if (isSmallScreen) {
    adjustedCameraOffset.y += 20;  // Move the camera up more for small screens
  }

  const finalCameraPosition = planetPosition.clone().add(adjustedCameraOffset);

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
      targetX: planetPosition.x,
      targetY: planetPosition.y,
      targetZ: planetPosition.z,
      intensity: finalIntensity
    }, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      homeButton.disabled = true;
      camera.position.set(tweenObject.camX, tweenObject.camY, tweenObject.camZ);
      orbit.target.set(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ);
      camera.lookAt(new THREE.Vector3(tweenObject.targetX, tweenObject.targetY, tweenObject.targetZ));
      sunLight.intensity = tweenObject.intensity; 
      orbit.update();
    })
    .onComplete(() => {
      homeButton.disabled = false;
      displayContent = true;
      manageContentDisplay();
    })
    .start();
}

aboutMeButton.onclick = function() {
  handlePlanetButtonClick('mercury', 'aboutMe', new THREE.Vector3(0, 10, 25), finalIntensity);
};

experinceButton.onclick = function() {
  handlePlanetButtonClick('earth', 'experience', new THREE.Vector3(0, 10, 40), finalIntensity);
};

skillsButton.onclick = function() {
  handlePlanetButtonClick('saturn', 'skills', new THREE.Vector3(0, 20, 75), saturnIntensity);
};

projectsButton.onclick = function() {
  handlePlanetButtonClick('jupiter', 'projects', new THREE.Vector3(0, 20, 75), saturnIntensity);
};

contactButton.onclick = function() {
  handlePlanetButtonClick('neptune', 'contact', new THREE.Vector3(0, 20, 55), saturnIntensity);
};

window.addEventListener('resize', manageContentDisplay);



document.addEventListener('DOMContentLoaded', function() {
  const dropdownToggle = document.getElementById('dropdownToggle');
  const buttonContainer = document.querySelector('.button-container');
  const menuItems = buttonContainer.querySelectorAll('.button');

  dropdownToggle.addEventListener('click', () => {
    buttonContainer.classList.toggle('show');
  });

  // Close dropdown menu on selection
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      buttonContainer.classList.remove('show');
    });
  });
});
