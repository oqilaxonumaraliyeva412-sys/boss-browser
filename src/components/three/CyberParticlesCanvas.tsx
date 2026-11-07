import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AccentColor } from '../../types';

interface CyberParticlesCanvasProps {
  accentColor: AccentColor;
  animationLevel?: 'high' | 'medium' | 'low' | 'off';
}

const ACCENT_HEX_MAP: Record<AccentColor, number[]> = {
  purple: [0x8B5CF6, 0x3B82F6, 0xA855F7],
  cyan: [0x06B6D4, 0x00F5FF, 0x3B82F6],
  blue: [0x3B82F6, 0x2563EB, 0x60A5FA],
  emerald: [0x10B981, 0x059669, 0x34D399],
  gold: [0xF59E0B, 0xD97706, 0xFBBF24],
  rose: [0xF43F5E, 0xE11D48, 0xFB7185]
};

export const CyberParticlesCanvas: React.FC<CyberParticlesCanvasProps> = ({
  accentColor,
  animationLevel = 'high'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationLevel === 'off' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090C, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 400;
    camera.position.y = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: animationLevel === 'high',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, animationLevel === 'high' ? 2 : 1));
    container.appendChild(renderer.domElement);

    // Particle Count based on animation quality
    const particleCount = animationLevel === 'high' ? 1400 : animationLevel === 'medium' ? 700 : 300;
    const colors = ACCENT_HEX_MAP[accentColor] || ACCENT_HEX_MAP.purple;

    // 1. Particle Cloud
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const c1 = new THREE.Color(colors[0]);
    const c2 = new THREE.Color(colors[1]);
    const c3 = new THREE.Color(colors[2]);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

      // Color interpolation
      const mixRatio = Math.random();
      const chosenColor = mixRatio < 0.5 ? c1.clone().lerp(c2, mixRatio * 2) : c2.clone().lerp(c3, (mixRatio - 0.5) * 2);

      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;

      scales[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Cyber Wave Grid
    const gridGeometry = new THREE.PlaneGeometry(1600, 1600, 40, 40);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: colors[0],
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2.3;
    grid.position.y = -220;
    scene.add(grid);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.2;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 0.5;
      camera.position.y = 50 + -targetY * 0.3;
      camera.lookAt(0, 0, 0);

      // Rotate particles
      particles.rotation.y = time * 0.03;
      particles.rotation.x = Math.sin(time * 0.02) * 0.05;

      // Animate wave on grid
      const gridPos = gridGeometry.attributes.position;
      for (let i = 0; i < gridPos.count; i++) {
        const u = i % 41;
        const v = Math.floor(i / 41);
        const z = Math.sin(u * 0.4 + time * 1.5) * 12 + Math.cos(v * 0.4 + time * 1.2) * 12;
        gridPos.setZ(i, z);
      }
      gridGeometry.computeVertexNormals();
      gridPos.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
    };
  }, [accentColor, animationLevel]);

  if (animationLevel === 'off') {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131726] via-[#0B0D14] to-[#08090C] pointer-events-none -z-10" />
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
    />
  );
};

