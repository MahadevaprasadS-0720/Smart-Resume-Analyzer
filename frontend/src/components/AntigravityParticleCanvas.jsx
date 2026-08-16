import React, { useEffect, useRef } from 'react';

export default function AntigravityParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High DPI Support
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking with smooth interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 180,
      isHovered: false,
      speed: 0,
      lastX: width / 2,
      lastY: height / 2,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height * 0.35;
    };

    // Click burst ripple effect
    let ripples = [];
    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 280,
        strength: 25,
        opacity: 0.8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Premium Color Palette matching Google Antigravity & Modern SaaS
    const PALETTE = [
      '#4F46E5', // Electric Indigo
      '#2563EB', // Royal Blue
      '#06B6D4', // Neon Cyan
      '#10B981', // Emerald Green
      '#F43F5E', // Coral Rose
      '#F59E0B', // Amber
      '#8B5CF6', // Purple
      '#EC4899', // Pink
    ];

    // Particle class for Spiral / Orbiting Vortex Physics
    class Particle {
      constructor(index, total) {
        this.index = index;
        this.total = total;
        this.reset();
      }

      reset() {
        // Golden ratio spiral distribution from center
        const phi = (this.index * 137.5 * Math.PI) / 180;
        const distRatio = Math.sqrt(this.index / this.total);
        const maxDist = Math.max(width, height) * 0.65;
        this.baseDist = 30 + distRatio * maxDist;
        this.angle = phi;
        this.angularSpeed = (0.0008 + (1 - distRatio) * 0.0015) * (this.index % 2 === 0 ? 1 : 1.1);

        // Center origin (biased slightly towards top hero)
        this.centerX = width / 2;
        this.centerY = height * 0.36;

        this.x = this.centerX + Math.cos(this.angle) * this.baseDist;
        this.y = this.centerY + Math.sin(this.angle) * this.baseDist;

        this.vx = 0;
        this.vy = 0;

        // Visual properties
        this.color = PALETTE[this.index % PALETTE.length];
        this.baseLength = 5 + Math.random() * 7;
        this.width = 2.2 + Math.random() * 1.5;
        this.baseAlpha = 0.35 + Math.random() * 0.45;
        this.alpha = this.baseAlpha;
        this.rotation = this.angle;
      }

      update() {
        // Orbital drift
        this.angle += this.angularSpeed;
        this.centerX = width / 2;
        this.centerY = height * 0.36;

        const targetX = this.centerX + Math.cos(this.angle) * this.baseDist;
        const targetY = this.centerY + Math.sin(this.angle) * this.baseDist;

        // Spring force towards orbit
        const k = 0.04;
        const damping = 0.88;

        const fx = (targetX - this.x) * k;
        const fy = (targetY - this.y) * k;

        this.vx = (this.vx + fx) * damping;
        this.vy = (this.vy + fy) * damping;

        // Mouse Antigravity interaction physics
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (1 - dist / mouse.radius);
          // Swirling repulsive gravity vortex
          const push = force * 14;
          const tangentX = -dy / dist;
          const tangentY = dx / dist;

          this.vx += (dx / dist) * push + tangentX * push * 0.6;
          this.vy += (dy / dist) * push + tangentY * push * 0.6;
          this.alpha = Math.min(1, this.baseAlpha + force * 0.5);
        } else {
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }

        // Ripple blast interaction
        for (let i = 0; i < ripples.length; i++) {
          const r = ripples[i];
          const rdx = this.x - r.x;
          const rdy = this.y - r.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const diff = Math.abs(rDist - r.radius);

          if (diff < 40) {
            const rippleForce = (1 - diff / 40) * (r.strength * (1 - r.radius / r.maxRadius));
            this.vx += (rdx / (rDist || 1)) * rippleForce;
            this.vy += (rdy / (rDist || 1)) * rippleForce;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        // Calculate oriented rotation (tangent to velocity & orbit)
        const velAngle = Math.atan2(this.vy, this.vx);
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.5) {
          this.rotation = velAngle;
        } else {
          this.rotation = this.angle + Math.PI / 2;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw elegant pill/dash particle matching Antigravity design
        const halfLen = this.baseLength / 2;
        const r = this.width / 2;
        ctx.roundRect(-halfLen, -r, this.baseLength, this.width, r);
        ctx.fill();

        ctx.restore();
      }
    }

    let particles = [];
    const initParticles = () => {
      particles = [];
      const count = width < 768 ? 140 : 260; // dense, beautiful particle swarm
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(i, count));
      }
    };

    initParticles();

    // Main animation loop
    const animate = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 5.5;
        r.opacity = Math.max(0, 1 - r.radius / r.maxRadius);

        if (r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}
