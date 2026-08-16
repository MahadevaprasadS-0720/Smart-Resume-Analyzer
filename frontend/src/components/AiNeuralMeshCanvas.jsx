import React, { useEffect, useRef } from 'react';

export default function AiNeuralMeshCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High DPI Support for crisp lines
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
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Mouse Tracking
    const mouse = {
      x: width / 2,
      y: height * 0.35,
      targetX: width / 2,
      targetY: height * 0.35,
      radius: 190,
      active: false,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = width / 2;
      mouse.targetY = height * 0.35;
    };

    // Click pulse waves
    let energyPulses = [];
    const handleClick = (e) => {
      energyPulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 260,
        speed: 6,
        alpha: 0.9,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Premium Color Palette for AI Neural Nodes
    const NODE_COLORS = [
      '#4F46E5', // Indigo
      '#2563EB', // Royal Blue
      '#06B6D4', // Cyan
      '#8B5CF6', // Purple
      '#10B981', // Emerald
      '#F43F5E', // Rose
    ];

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseVx = (Math.random() - 0.5) * 0.7;
        this.baseVy = (Math.random() - 0.5) * 0.7;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.radius = 2.5 + Math.random() * 2.5;
        this.color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
        this.baseAlpha = 0.4 + Math.random() * 0.4;
        this.alpha = this.baseAlpha;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulseAngle += 0.03;
        const pulse = Math.sin(this.pulseAngle) * 0.5 + 0.5;

        // Base floating motion
        this.x += this.vx;
        this.y += this.vy;

        // Soft bounce at edges
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > width) { this.x = width; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > height) { this.y = height; this.vy *= -1; }

        // Natural damping back to base speed
        this.vx += (this.baseVx - this.vx) * 0.03;
        this.vy += (this.baseVy - this.vy) * 0.03;

        // Mouse interaction
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (1 - dist / mouse.radius);
          // Gentle magnetic push & orbit
          const pushX = (dx / dist) * force * 4.5;
          const pushY = (dy / dist) * force * 4.5;
          this.vx += pushX;
          this.vy += pushY;
          this.alpha = Math.min(1, this.baseAlpha + force * 0.5);
        } else {
          this.alpha = this.baseAlpha + pulse * 0.15;
        }

        // Energy pulses from clicks
        for (let i = 0; i < energyPulses.length; i++) {
          const ep = energyPulses[i];
          const edx = this.x - ep.x;
          const edy = this.y - ep.y;
          const edist = Math.sqrt(edx * edx + edy * edy);
          const diff = Math.abs(edist - ep.radius);

          if (diff < 35) {
            const pForce = (1 - diff / 35) * 8 * (1 - ep.radius / ep.maxRadius);
            this.vx += (edx / (edist || 1)) * pForce;
            this.vy += (edy / (edist || 1)) * pForce;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Soft outer node glow
        const glowRadius = this.radius * 3.5;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Solid core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    let nodes = [];
    const initNodes = () => {
      nodes = [];
      const nodeCount = Math.floor((width * height) / 14000);
      const count = Math.min(Math.max(nodeCount, 55), 110);
      for (let i = 0; i < count; i++) {
        nodes.push(new Node());
      }
    };

    initNodes();

    // Line drawing with gradient between nodes
    const drawConnections = () => {
      const maxConnectDist = 135;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const opacity = (1 - dist / maxConnectDist) * 0.35;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = '#6366F1';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Connect nodes to mouse beacon
        if (mouse.active) {
          const mdx = a.x - mouse.x;
          const mdy = a.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouse.radius) {
            const mOpacity = (1 - mDist / mouse.radius) * 0.55;
            ctx.save();
            ctx.globalAlpha = mOpacity;

            const lineGrad = ctx.createLinearGradient(mouse.x, mouse.y, a.x, a.y);
            lineGrad.addColorStop(0, '#06B6D4');
            lineGrad.addColorStop(1, a.color);

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 1.4;

            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    // Draw mouse beacon halo
    const drawMouseBeacon = () => {
      if (!mouse.active) return;
      ctx.save();
      const haloGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 70);
      haloGrad.addColorStop(0, 'rgba(79, 70, 229, 0.18)');
      haloGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      haloGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Main animation loop
    const animate = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Update and draw energy pulses
      for (let i = energyPulses.length - 1; i >= 0; i--) {
        const ep = energyPulses[i];
        ep.radius += ep.speed;
        ep.alpha = Math.max(0, 1 - ep.radius / ep.maxRadius);

        ctx.save();
        ctx.globalAlpha = ep.alpha * 0.4;
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, ep.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (ep.radius >= ep.maxRadius) {
          energyPulses.splice(i, 1);
        }
      }

      drawMouseBeacon();
      drawConnections();

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
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
      style={{ opacity: 0.85 }}
    />
  );
}
