import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Antigravity3DScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Perfectly Framed Wide Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Multi-Point Studio Radiant Lighting Array (Vibrant & Sparkling)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
    scene.add(ambientLight);

    const lightViolet = new THREE.PointLight(0x8b5cf6, 4.5, 55);
    lightViolet.position.set(-14, 16, 12);
    scene.add(lightViolet);

    const lightCyan = new THREE.PointLight(0x06b6d4, 4.2, 55);
    lightCyan.position.set(15, 14, 12);
    scene.add(lightCyan);

    const lightMagenta = new THREE.PointLight(0xf43f5e, 3.4, 45);
    lightMagenta.position.set(-12, -15, 10);
    scene.add(lightMagenta);

    const lightEmerald = new THREE.PointLight(0x10b981, 3.4, 45);
    lightEmerald.position.set(12, -14, 10);
    scene.add(lightEmerald);

    const lightAmber = new THREE.PointLight(0xf59e0b, 3.0, 40);
    lightAmber.position.set(0, 18, 9);
    scene.add(lightAmber);

    // Interactive Cursor Spotlight
    const cursorLight = new THREE.PointLight(0x6366f1, 5.0, 45);
    cursorLight.position.set(0, 0, 12);
    scene.add(cursorLight);

    // 4. World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    const nonCollidingObjects = [];

    // Factory: Ultra-Clean Crystalline Glass Material
    const createVibrantGlassMaterial = (tintColorHex = 0xffffff, emissiveHex = 0x000000, emissiveIntensity = 0.22) => {
      return new THREE.MeshPhysicalMaterial({
        color: tintColorHex,
        emissive: emissiveHex,
        emissiveIntensity: emissiveIntensity,
        metalness: 0.1,
        roughness: 0.03,
        transmission: 0.9,
        thickness: 2.0,
        transparent: true,
        opacity: 0.96,
        reflectivity: 0.99,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        ior: 1.52,
      });
    };

    // Factory: Luminous Metallic Core Material
    const createLuminousCoreMaterial = (colorHex) => {
      return new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.55,
        metalness: 0.85,
        roughness: 0.08,
        transparent: true,
        opacity: 0.98,
      });
    };

    // 5. Dynamic Canvas Textures for 3D Holographic Resume Cards
    const createVibrantResumeTexture = (title, badgeText, scoreText, gradStart, gradEnd, accentColor) => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 512;
      texCanvas.height = 700;
      const tCtx = texCanvas.getContext('2d');

      tCtx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      tCtx.beginPath();
      tCtx.roundRect(0, 0, 512, 700, 36);
      tCtx.fill();

      const headerGrad = tCtx.createLinearGradient(0, 0, 512, 0);
      headerGrad.addColorStop(0, gradStart);
      headerGrad.addColorStop(1, gradEnd);
      tCtx.fillStyle = headerGrad;
      tCtx.beginPath();
      tCtx.roundRect(0, 0, 512, 24, [36, 36, 0, 0]);
      tCtx.fill();

      tCtx.fillStyle = headerGrad;
      tCtx.beginPath();
      tCtx.roundRect(36, 44, 190, 38, 19);
      tCtx.fill();

      tCtx.fillStyle = '#FFFFFF';
      tCtx.font = 'bold 15px Inter, sans-serif';
      tCtx.fillText(badgeText, 52, 69);

      tCtx.fillStyle = '#0F172A';
      tCtx.font = '900 28px Inter, sans-serif';
      tCtx.fillText(title, 36, 128);

      tCtx.fillStyle = accentColor;
      tCtx.font = 'bold 15px Inter, sans-serif';
      tCtx.fillText('★ ATS Precision Screened', 36, 156);

      const blockYs = [205, 245, 285, 335, 375, 415, 455, 505, 545, 585, 625];
      blockYs.forEach((y, idx) => {
        const isHeading = idx === 0 || idx === 3 || idx === 7;
        const width = isHeading ? 200 + (idx * 25) % 80 : 350 + (idx * 30) % 90;
        tCtx.fillStyle = isHeading ? accentColor : 'rgba(148, 163, 184, 0.4)';
        tCtx.beginPath();
        tCtx.roundRect(36, y, width, isHeading ? 14 : 10, 6);
        tCtx.fill();
      });

      tCtx.strokeStyle = accentColor;
      tCtx.lineWidth = 7;
      tCtx.beginPath();
      tCtx.arc(430, 72, 30, 0, Math.PI * 2);
      tCtx.stroke();

      tCtx.fillStyle = '#0F172A';
      tCtx.font = '900 17px Inter, sans-serif';
      tCtx.textAlign = 'center';
      tCtx.fillText(scoreText, 430, 78);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.anisotropy = 8;
      return texture;
    };

    // 6. Dynamic Canvas Textures for 3D Floating Skill Badge Chips
    const createVibrantSkillChipTexture = (label, category, gradStart, gradEnd, textColor) => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 400;
      texCanvas.height = 150;
      const tCtx = texCanvas.getContext('2d');

      tCtx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      tCtx.beginPath();
      tCtx.roundRect(4, 4, 392, 142, 30);
      tCtx.fill();

      const borderGrad = tCtx.createLinearGradient(0, 0, 400, 0);
      borderGrad.addColorStop(0, gradStart);
      borderGrad.addColorStop(1, gradEnd);
      tCtx.strokeStyle = borderGrad;
      tCtx.lineWidth = 5;
      tCtx.beginPath();
      tCtx.roundRect(4, 4, 392, 142, 30);
      tCtx.stroke();

      tCtx.fillStyle = borderGrad;
      tCtx.beginPath();
      tCtx.roundRect(24, 22, 130, 28, 14);
      tCtx.fill();

      tCtx.fillStyle = '#FFFFFF';
      tCtx.font = 'bold 13px Inter, sans-serif';
      tCtx.fillText(category, 36, 41);

      tCtx.fillStyle = '#0F172A';
      tCtx.font = '900 28px Inter, sans-serif';
      tCtx.fillText(label, 24, 88);

      tCtx.fillStyle = textColor;
      tCtx.font = 'bold 16px Inter, sans-serif';
      tCtx.fillText('✦ 99% PRECISION', 24, 122);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.anisotropy = 8;
      return texture;
    };

    // 7. Dynamic Canvas Texture for 3D Tech Data Cubes
    const createTechCubeTexture = (iconText, titleText, colorHex) => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 256;
      texCanvas.height = 256;
      const tCtx = texCanvas.getContext('2d');

      tCtx.fillStyle = 'rgba(255, 255, 255, 0.97)';
      tCtx.beginPath();
      tCtx.roundRect(0, 0, 256, 256, 32);
      tCtx.fill();

      tCtx.strokeStyle = colorHex;
      tCtx.lineWidth = 8;
      tCtx.beginPath();
      tCtx.roundRect(0, 0, 256, 256, 32);
      tCtx.stroke();

      tCtx.fillStyle = colorHex;
      tCtx.font = '900 48px Inter, sans-serif';
      tCtx.textAlign = 'center';
      tCtx.fillText(iconText, 128, 105);

      tCtx.fillStyle = '#0F172A';
      tCtx.font = 'bold 22px Inter, sans-serif';
      tCtx.fillText(titleText, 128, 165);

      tCtx.fillStyle = '#64748B';
      tCtx.font = 'bold 14px Inter, sans-serif';
      tCtx.fillText('AI VERIFIED', 128, 195);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.anisotropy = 8;
      return texture;
    };

    // Helper: Add 3D Resume Card
    const addResumeCard = (x, y, z, rotX, rotY, rotZ, scale, title, badge, score, gStart, gEnd, accent) => {
      const texture = createVibrantResumeTexture(title, badge, score, gStart, gEnd, accent);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: texture,
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.88,
        thickness: 1.8,
        transparent: true,
        opacity: 0.97,
        reflectivity: 0.98,
        clearcoat: 1.0,
      });

      const geo = new THREE.BoxGeometry(2.6 * scale, 3.5 * scale, 0.12 * scale);
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(x, y, z);
      mesh.rotation.set(rotX, rotY, rotZ);

      mesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: 0.002,
        rotSpeedY: 0.003,
        rotSpeedZ: 0.0015,
        floatFreqX: 0.45,
        floatFreqY: 0.55,
        floatAmp: 0.25,
        phase: Math.random() * Math.PI * 2,
      };

      worldGroup.add(mesh);
      nonCollidingObjects.push(mesh);
    };

    // Helper: Add 3D Skill Chip
    const addSkillChip = (x, y, z, rotX, rotY, rotZ, label, category, gStart, gEnd, textColor) => {
      const texture = createVibrantSkillChipTexture(label, category, gStart, gEnd, textColor);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: texture,
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.88,
        thickness: 1.4,
        transparent: true,
        opacity: 0.97,
        clearcoat: 1.0,
      });

      const geo = new THREE.BoxGeometry(2.9, 1.2, 0.1);
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(x, y, z);
      mesh.rotation.set(rotX, rotY, rotZ);

      mesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: 0.0025,
        rotSpeedY: 0.0035,
        rotSpeedZ: 0.0015,
        floatFreqX: 0.5,
        floatFreqY: 0.6,
        floatAmp: 0.22,
        phase: Math.random() * Math.PI * 2,
      };

      worldGroup.add(mesh);
      nonCollidingObjects.push(mesh);
    };

    // Helper: Add 3D Tech Data Cube
    const addTechDataCube = (x, y, z, size, iconText, titleText, colorHex) => {
      const texture = createTechCubeTexture(iconText, titleText, colorHex);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: texture,
        metalness: 0.08,
        roughness: 0.04,
        transmission: 0.88,
        thickness: 1.5,
        transparent: true,
        opacity: 0.97,
        clearcoat: 1.0,
      });

      const geo = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(x, y, z);

      mesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: 0.004,
        rotSpeedY: 0.006,
        rotSpeedZ: 0.0025,
        floatFreqX: 0.4,
        floatFreqY: 0.5,
        floatAmp: 0.2,
        phase: Math.random() * Math.PI * 2,
      };

      worldGroup.add(mesh);
      nonCollidingObjects.push(mesh);
    };

    // Helper: Add 3D Diamond Octahedron Crystal
    const addDiamondOctahedron = (x, y, z, radius, colorHex, emissiveHex) => {
      const group = new THREE.Group();

      const outerGeo = new THREE.OctahedronGeometry(radius, 0);
      const outerMat = createVibrantGlassMaterial(colorHex, emissiveHex, 0.32);
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      group.add(outerMesh);

      const innerGeo = new THREE.OctahedronGeometry(radius * 0.45, 0);
      const innerMat = createLuminousCoreMaterial(emissiveHex);
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);

      group.position.set(x, y, z);

      group.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: 0.005,
        rotSpeedY: 0.008,
        rotSpeedZ: 0.003,
        floatFreqX: 0.45,
        floatFreqY: 0.55,
        floatAmp: 0.22,
        phase: Math.random() * Math.PI * 2,
        innerMesh: innerMesh,
      };

      worldGroup.add(group);
      nonCollidingObjects.push(group);
    };

    // Helper: Add 3D Quantum Dodecahedron Crystal
    const addQuantumDodecahedron = (x, y, z, radius, colorHex, emissiveHex) => {
      const group = new THREE.Group();

      const outerGeo = new THREE.DodecahedronGeometry(radius, 0);
      const outerMat = createVibrantGlassMaterial(colorHex, emissiveHex, 0.3);
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      group.add(outerMesh);

      const innerGeo = new THREE.TetrahedronGeometry(radius * 0.45, 0);
      const innerMat = createLuminousCoreMaterial(emissiveHex);
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);

      group.position.set(x, y, z);

      group.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: 0.004,
        rotSpeedY: 0.007,
        rotSpeedZ: 0.0025,
        floatFreqX: 0.4,
        floatFreqY: 0.5,
        floatAmp: 0.2,
        phase: Math.random() * Math.PI * 2,
        innerMesh: innerMesh,
      };

      worldGroup.add(group);
      nonCollidingObjects.push(group);
    };

    // Helper: Add 3D Pyramid Tetrahedron Gem
    const addPyramidGem = (x, y, z, radius, colorHex, emissiveHex) => {
      const geo = new THREE.TetrahedronGeometry(radius, 0);
      const mat = createVibrantGlassMaterial(colorHex, emissiveHex, 0.35);
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(x, y, z);

      mesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: 0.006,
        rotSpeedY: 0.008,
        rotSpeedZ: 0.003,
        floatFreqX: 0.5,
        floatFreqY: 0.6,
        floatAmp: 0.22,
        phase: Math.random() * Math.PI * 2,
      };

      worldGroup.add(mesh);
      nonCollidingObjects.push(mesh);
    };

    // ════════════════════════════════════════════════════════════════════════
    // 🛡️ CLEAN, ZERO-COLLISION SPATIAL ZONES (PRISTINE & PERFECTLY SPACED)
    // ════════════════════════════════════════════════════════════════════════

    // ── Upper Tier (Above & flanking headline) ──
    addResumeCard(-12.8, 6.2, -3.5, 0.14, 0.22, -0.05, 1.0, 'Full-Stack Lead', '✓ ATS VERIFIED', '99%', '#4F46E5', '#8B5CF6', '#4F46E5');
    addResumeCard(12.8, 6.0, -3.8, -0.15, -0.22, 0.06, 1.0, 'Lead AI Engineer', '⚡ 98% MATCH', '98%', '#06B6D4', '#3B82F6', '#06B6D4');

    // Top Centered Cubes
    addTechDataCube(-5.5, 8.8, -3.2, 1.4, '⚡', 'AI ENGINE', '#8B5CF6');
    addTechDataCube(5.5, 8.8, -3.4, 1.4, '✦', 'NLP CORE', '#06B6D4');

    // ── Mid Tier (Flanking the Bento upload cards) ──
    addSkillChip(-12.2, 0.8, -2.8, 0.1, 0.18, -0.03, 'React 19 & Next.js', 'FRONTEND', '#4F46E5', '#06B6D4', '#4F46E5');
    addSkillChip(12.2, 0.8, -3.0, -0.1, -0.18, 0.03, 'Python & FastAPI', 'BACKEND', '#06B6D4', '#10B981', '#06B6D4');

    // Mid Decorative Gems
    addPyramidGem(-8.8, -2.5, -3.5, 1.05, 0xec4899, 0xdb2777);
    addQuantumDodecahedron(8.8, -2.5, -3.5, 1.15, 0xf59e0b, 0xd97706);

    // ── Lower Mid Tier ──
    addSkillChip(-12.0, -5.8, -3.0, 0.12, -0.15, -0.03, 'TypeScript & Redux', 'WEB CORE', '#2563EB', '#8B5CF6', '#2563EB');
    addSkillChip(12.0, -5.8, -3.2, -0.12, 0.15, 0.04, 'AWS & Kubernetes', 'CLOUD & K8S', '#10B981', '#06B6D4', '#10B981');

    // ── Lower Tier (Flanking bottom action buttons) ──
    addResumeCard(-11.5, -11.5, -3.6, 0.12, -0.14, -0.04, 0.95, 'Cloud Architect', '✦ STAR BULLETS', '96%', '#10B981', '#06B6D4', '#10B981');
    addResumeCard(11.5, -11.5, -3.8, -0.12, 0.14, 0.05, 0.95, 'Data Scientist', '★ NLP MATCHED', '97%', '#F43F5E', '#F59E0B', '#F43F5E');

    // Bottom Decorative Diamonds
    addDiamondOctahedron(-5.0, -13.0, -3.8, 1.35, 0x8b5cf6, 0x7c3aed);
    addDiamondOctahedron(5.0, -13.0, -4.0, 1.35, 0x06b6d4, 0x0891b2);
    addTechDataCube(0, -13.5, -3.5, 1.4, '✓', 'PRECISION', '#10B981');

    // 5. Ambient Star Dust
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const NEBULA_PALETTE = [
      new THREE.Color(0x8b5cf6), // Neon Purple
      new THREE.Color(0x4f46e5), // Electric Indigo
      new THREE.Color(0x06b6d4), // Radiant Cyan
      new THREE.Color(0x10b981), // Emerald Green
      new THREE.Color(0xf43f5e), // Hot Magenta/Rose
      new THREE.Color(0xf59e0b), // Golden Amber
      new THREE.Color(0x3b82f6), // Sky Blue
      new THREE.Color(0xec4899), // Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const c = NEBULA_PALETTE[Math.floor(Math.random() * NEBULA_PALETTE.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. Mouse & Scroll Tracking
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    let scrollY = 0;
    let targetScrollY = 0;
    let clickImpulse = 0;

    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      targetScrollY = (window.scrollY / maxScroll) * 8;
    };

    const handleClick = () => {
      clickImpulse = 1.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 7. Butter-Smooth 60fps Animation Loop
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse & scroll damping
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Click shockwave decay
      clickImpulse *= 0.93;

      // Smooth 3D Camera Orbit & Scroll Parallax
      camera.position.x = mouse.x * 2.2;
      camera.position.y = mouse.y * 1.5 - scrollY;
      camera.lookAt(0, -scrollY * 0.8, 0);

      // Shifting Multi-Color Lighting Animation
      lightViolet.position.x = -14 + Math.cos(elapsedTime * 0.6) * 2.0;
      lightViolet.position.y = 16 + Math.sin(elapsedTime * 0.6) * 2.0;

      lightCyan.position.x = 15 + Math.sin(elapsedTime * 0.7) * 2.0;
      lightCyan.position.y = 14 + Math.cos(elapsedTime * 0.7) * 2.0;

      lightMagenta.position.x = -12 + Math.sin(elapsedTime * 0.5) * 2.0;
      lightEmerald.position.x = 12 + Math.cos(elapsedTime * 0.5) * 2.0;

      // Cursor light tracking
      cursorLight.position.x = mouse.x * 12;
      cursorLight.position.y = mouse.y * 10 - scrollY;
      cursorLight.position.z = 9 + Math.sin(elapsedTime * 1.8) * 2;

      // Animate 3D Objects
      for (let i = 0; i < nonCollidingObjects.length; i++) {
        const item = nonCollidingObjects[i];
        const data = item.userData;
        if (!data) continue;

        // Smooth 3D multi-axis rotation
        item.rotation.x += data.rotSpeedX + clickImpulse * 0.02;
        item.rotation.y += data.rotSpeedY + clickImpulse * 0.025;
        item.rotation.z += data.rotSpeedZ;

        // Controlled harmonic zero-gravity buoyancy within dedicated safe boundary
        item.position.x = data.baseX + Math.cos(elapsedTime * data.floatFreqX + data.phase) * data.floatAmp;
        item.position.y = data.baseY + Math.sin(elapsedTime * data.floatFreqY + data.phase) * (data.floatAmp + clickImpulse * 0.4);
        item.position.z = data.baseZ + Math.sin(elapsedTime * 0.3 + data.phase) * 0.15;

        // Rotate inner core if present
        if (data.innerMesh) {
          data.innerMesh.rotation.x -= 0.02;
          data.innerMesh.rotation.y += 0.025;
        }
      }

      // Rotate Colorful Nebula Star Dust
      particleSystem.rotation.y = elapsedTime * 0.015 + mouse.x * 0.1;
      particleSystem.rotation.x = mouse.y * 0.06;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.98 }}
    />
  );
}
