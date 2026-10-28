
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const planets = [
  {
    name: 'عطارد', en: 'MERCURY', color: '#a6a39f',
    radius: .48, orbit: 5.2, speed: 1.60,
    year: '88 روز', diameter: '4,879 km',
    distance: '57.9 میلیون', day: '58.6 روز',
    desc: 'نزدیک‌ترین سیاره به خورشید و کوچک‌ترین سیاره منظومه شمسی است. سطح آن پر از دهانه‌های برخوردی است.'
  },
  {
    name: 'زهره', en: 'VENUS', color: '#e8bd88',
    radius: .78, orbit: 7.3, speed: 1.17,
    year: '225 روز', diameter: '12,104 km',
    distance: '108.2 میلیون', day: '243 روز',
    desc: 'زهره جو بسیار غلیظی دارد و به دلیل اثر گلخانه‌ای شدید، داغ‌ترین سیاره منظومه شمسی است.'
  },
  {
    name: 'زمین', en: 'EARTH', color: '#4a9cff',
    radius: .84, orbit: 9.6, speed: 1,
    year: '365.25 روز', diameter: '12,742 km',
    distance: '149.6 میلیون', day: '23 ساعت و 56 دقیقه',
    desc: 'خانه ما؛ سیاره‌ای با آب مایع فراوان روی سطح، جو محافظ و تنها جهانی که وجود حیات در آن تأیید شده است.'
  },
  {
    name: 'مریخ', en: 'MARS', color: '#e87855',
    radius: .65, orbit: 12, speed: .80,
    year: '687 روز', diameter: '6,779 km',
    distance: '227.9 میلیون', day: '24 ساعت و 37 دقیقه',
    desc: 'سیاره سرخ، دارای آتشفشان‌های عظیم و شواهدی از آب مایع در گذشته است.'
  },
  {
    name: 'مشتری', en: 'JUPITER', color: '#d9b18b',
    radius: 1.75, orbit: 16, speed: .43,
    year: '11.86 سال زمینی', diameter: '139,820 km',
    distance: '778.6 میلیون', day: '9 ساعت و 56 دقیقه',
    desc: 'بزرگ‌ترین سیاره منظومه شمسی؛ غول گازی با طوفان عظیم لکه سرخ.'
  },
  {
    name: 'زحل', en: 'SATURN', color: '#e4d1a2',
    radius: 1.48, orbit: 21, speed: .32,
    year: '29.45 سال زمینی', diameter: '116,460 km',
    distance: '1,433.5 میلیون', day: '10 ساعت و 42 دقیقه',
    desc: 'غول گازی معروف به حلقه‌های درخشانش که از یخ، سنگ و غبار تشکیل شده‌اند.'
  },
  {
    name: 'اورانوس', en: 'URANUS', color: '#8bdde1',
    radius: 1.10, orbit: 26, speed: .23,
    year: '84 سال زمینی', diameter: '50,724 km',
    distance: '2,872.5 میلیون', day: '17 ساعت و 14 دقیقه',
    desc: 'غول یخی با رنگ آبی‌ـ‌سبز و محور چرخشی بسیار کج.'
  },
  {
    name: 'نپتون', en: 'NEPTUNE', color: '#527aff',
    radius: 1.07, orbit: 31, speed: .18,
    year: '164.8 سال زمینی', diameter: '49,244 km',
    distance: '4,495.1 میلیون', day: '16 ساعت و 6 دقیقه',
    desc: 'دورترین سیاره منظومه شمسی؛ دنیایی سرد با بادهایی بسیار سریع در جو.'
  }
];

const host = document.getElementById('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#070a16');

const camera = new THREE.PerspectiveCamera(48, 1, .1, 500);
camera.position.set(0, 35, 55);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
host.prepend(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = .06;
controls.minDistance = 14;
controls.maxDistance = 100;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0x7184bb, 1.5));

const sunLight = new THREE.PointLight(0xffd4a0, 1600, 180, 1.4);
scene.add(sunLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0xffc768 })
);
scene.add(sun);

function makeGlowTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64,64,1,64,64,64);

  gradient.addColorStop(0, color);
  gradient.addColorStop(.18, color + 'aa');
  gradient.addColorStop(1, '#00000000');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
}

const sunGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: makeGlowTexture('#ffad48'),
    color: 0xffc878,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
sunGlow.scale.set(12, 12, 1);
scene.add(sunGlow);

// ستاره‌های پس‌زمینه
const starPositions = [];

for (let i = 0; i < 2400; i++) {
  starPositions.push(
    (Math.random() - .5) * 180,
    (Math.random() - .5) * 130,
    (Math.random() - .5) * 180
  );
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xc7d9ff,
    size: .13,
    transparent: true,
    opacity: .8
  })
);
scene.add(stars);

function makePlanetTexture(base, type) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 256);

  for (let i = 0; i < 180; i++) {
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > .5
      ? 'rgba(255,255,255,.10)'
      : 'rgba(0,0,0,.12)';

    ctx.fillRect(0, y, 512, 1 + Math.random() * 12);
  }

  if (type === 'jupiter' || type === 'saturn') {
    for (let y = 0; y < 256; y += 13) {
      ctx.fillStyle = y % 26 === 0
        ? 'rgba(70,45,35,.20)'
        : 'rgba(255,240,215,.16)';
      ctx.fillRect(0, y, 512, 5 + Math.random() * 6);
    }

    if (type === 'jupiter') {
      ctx.fillStyle = '#b76e55';
      ctx.beginPath();
      ctx.ellipse(350, 165, 35, 15, -.12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'earth') {
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = '#4ba879';
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 512,
        Math.random() * 256,
        10 + Math.random() * 30,
        5 + Math.random() * 17,
        Math.random() * 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;

  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 27px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eaf1ff';
  ctx.shadowColor = '#7e9fff';
  ctx.shadowBlur = 12;
  ctx.fillText(text, 128, 40);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthWrite: false
    })
  );

  sprite.scale.set(4.5, 1.1, 1);
  return sprite;
}

const planetObjects = [];
const pickables = [];
const labelGroup = new THREE.Group();
scene.add(labelGroup);

planets.forEach((p, i) => {
  const orbitCurve = new THREE.EllipseCurve(
    0, 0, p.orbit, p.orbit, 0, Math.PI * 2, false, 0
  );

  const points = orbitCurve.getPoints(180).map(
    point => new THREE.Vector3(point.x, 0, point.y)
  );

  const orbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: 0x7288bd,
      transparent: true,
      opacity: .26
    })
  );
  scene.add(orbitLine);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius, 40, 32),
    new THREE.MeshStandardMaterial({
      map: makePlanetTexture(p.color, p.en.toLowerCase()),
      roughness: .88,
      metalness: .02
    })
  );

  mesh.userData.index = i;
  scene.add(mesh);
  pickables.push(mesh);

  if (p.en === 'SATURN' || p.en === 'URANUS') {
    const isSaturn = p.en === 'SATURN';

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(
        p.radius * (isSaturn ? 1.35 : 1.4),
        p.radius * (isSaturn ? 2.15 : 1.75),
        96
      ),
      new THREE.MeshStandardMaterial({
        color: isSaturn ? 0xd9c7a3 : 0x9be6e7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSaturn ? .78 : .36,
        roughness: 1
      })
    );

    ring.rotation.x = Math.PI / 2.3;
    mesh.add(ring);
  }

  const label = createLabel(p.name);
  labelGroup.add(label);

  planetObjects.push({
    mesh,
    orbit: p.orbit,
    speed: p.speed,
    phase: i * .85,
    label,
    data: p
  });
});

// انتخاب سیاره و نمایش اطلاعات
let selected = 2;
let paused = false;
let showLabels = true;
let speedFactor = 1;
let orbitScale = 1;

function selectPlanet(i) {
  selected = i;
  const p = planets[i];

  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailEn').textContent = p.en;
  document.getElementById('year').textContent = p.year;
  document.getElementById('diameter').textContent = p.diameter;
  document.getElementById('distance').textContent = p.distance;
  document.getElementById('day').textContent = p.day;
  document.getElementById('description').textContent = p.desc;

  const visual = document.getElementById('detailPlanet');
  visual.style.background =
    `radial-gradient(circle at 30% 25%, ${p.color}, #10152a)`;

  document.querySelectorAll('.planet-btn').forEach((button, j) => {
    button.classList.toggle('active', j === i);
  });

  const object = planetObjects[i];
  controls.target.copy(object.mesh.position);
}

// ساخت فهرست سیاره‌ها
const list = document.getElementById('planetList');

planets.forEach((p, i) => {
  const button = document.createElement('button');
  button.className = 'planet-btn';

  button.innerHTML = `
    <span class="planet-dot"
      style="background:radial-gradient(circle at 30% 25%,${p.color},#12182b)">
    </span>
    <span>
      <span class="planet-name">${p.name}</span><br>
      <span class="planet-en">${p.en}</span>
    </span>
    <span class="planet-arrow">↙</span>
  `;

  button.addEventListener('click', () => selectPlanet(i));
  list.appendChild(button);
});

// کلیک روی سیاره داخل صحنه
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener('click', event => {
  const rect = renderer.domElement.getBoundingClientRect();

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(pickables, false);

  if (hits.length) {
    selectPlanet(hits[0].object.userData.index);
  }
});

// کنترل سرعت
document.getElementById('speed').addEventListener('input', event => {
  speedFactor = Number(event.target.value);

  document.getElementById('speedValue').textContent =
    speedFactor.toFixed(1) + '×';
});

// کنترل فاصله مدارها
document.getElementById('orbitScale').addEventListener('input', event => {
  orbitScale = Number(event.target.value);
});

// توقف و ادامه
document.getElementById('pause').addEventListener('click', event => {
  paused = !paused;

  event.currentTarget.textContent =
    paused ? '▶ ادامه حرکت' : 'Ⅱ توقف حرکت';

  document.getElementById('modeLabel').textContent =
    paused ? 'SIMULATION PAUSED' : 'LIVE SIMULATION';
});

// نمایش و مخفی‌کردن برچسب‌ها
document.getElementById('labels').addEventListener('click', event => {
  showLabels = !showLabels;
  labelGroup.visible = showLabels;

  event.currentTarget.textContent =
    showLabels ? 'مخفی کردن نام‌ها' : 'نمایش نام‌ها';
});

// کنترل دوربین
document.getElementById('resetView').addEventListener('click', () => {
  camera.position.set(0, 35, 55);
  controls.target.set(0, 0, 0);
  controls.update();
});

document.getElementById('zoomIn').addEventListener('click', () => {
  camera.position.multiplyScalar(.85);
});

document.getElementById('zoomOut').addEventListener('click', () => {
  camera.position.multiplyScalar(1.15);
});

// تغییر اندازه صحنه هنگام تغییر ابعاد پنجره
function resize() {
  const width = host.clientWidth;
  const height = host.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

new ResizeObserver(resize).observe(host);
resize();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), .05);

  if (!paused) {
    planetObjects.forEach(object => {
      object.phase += dt * object.speed * speedFactor * .32;

      const radius = object.orbit * orbitScale;

      object.mesh.position.set(
        Math.cos(object.phase) * radius,
        Math.sin(object.phase * .7) * .12,
        Math.sin(object.phase) * radius
      );

      object.mesh.rotation.y += dt * .25;

      object.label.position.copy(object.mesh.position);
      object.label.position.y += object.data.radius + .65;
    });

    sun.rotation.y += dt * .06;
  }

  controls.update();
  renderer.render(scene, camera);
}

selectPlanet(selected);
animate();
