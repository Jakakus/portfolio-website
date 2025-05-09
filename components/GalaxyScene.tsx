'use client';

import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import { useEffect, useRef, useState } from 'react';

class Galaxy {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private galaxy: THREE.Points;
  private dataStreams: THREE.Points[] = [];
  private container: HTMLElement;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private mousePosition = { x: 0, y: 0 };
  private targetRotation = { x: Math.PI * 0.2, y: 0 };
  private currentRotation = { x: Math.PI * 0.2, y: 0 };
  private baseRotationSpeed = 0.0003; // Default rotation speed
  private currentSpeed = 0.0003; // Current rotation speed
  private targetSpeed = 0.0003; // Target rotation speed
  private maxSpeed = 0.005; // Maximum speed when hovered
  private speedLerpFactor = 0.02; // How quickly speed changes
  private isHovered = false;
  private isMobile: boolean;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.isMobile = window.innerWidth <= 640;

    try {
      // Try to create a WebGL renderer to check support
      try {
        const testRenderer = new WebGLRenderer();
        testRenderer.dispose();
      } catch {
        throw new Error('WebGL is not supported in this browser');
      }

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(25, 10, 25);
      this.camera.lookAt(0, 0, 0);

      // Renderer setup with mobile optimizations
      this.renderer = new THREE.WebGLRenderer({
        antialias: !this.isMobile, // Disable antialiasing on mobile
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      container.appendChild(this.renderer.domElement);

      // Create galaxy
      this.galaxy = this.createGalaxy();
      this.scene.add(this.galaxy);

      // Add interaction listeners
      container.addEventListener('mousemove', this.handleMouseMove);
      container.addEventListener('mouseenter', this.handleMouseEnter);
      container.addEventListener('mouseleave', this.handleMouseLeave);
      container.addEventListener('touchmove', this.handleTouchMove);
      container.addEventListener('touchstart', () => this.isHovered = true);
      container.addEventListener('touchend', () => this.isHovered = false);

      // Start animation
      this.animate();
      window.addEventListener('resize', this.handleResize);
    } catch (error) {
      console.error('Failed to initialize Galaxy:', error);
      throw error;
    }
  }

  private handleMouseEnter = () => {
    this.isHovered = true;
    this.targetSpeed = this.maxSpeed; // Start accelerating
  };

  private handleMouseLeave = () => {
    this.isHovered = false;
    this.targetSpeed = this.baseRotationSpeed; // Start decelerating
    this.targetRotation.x = Math.PI * 0.2;
    this.targetRotation.y = 0;
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isHovered) return;
    
    const rect = this.container.getBoundingClientRect();
    this.mousePosition.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mousePosition.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    // Extremely gentle rotation response
    this.targetRotation.y = this.mousePosition.x * 0.02;
    this.targetRotation.x = Math.PI * 0.2 + this.mousePosition.y * 0.01;
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (!this.isHovered || event.touches.length === 0) return;
    
    const rect = this.container.getBoundingClientRect();
    this.mousePosition.x = ((event.touches[0].clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mousePosition.y = -((event.touches[0].clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    this.targetRotation.y = this.mousePosition.x * 0.02;
    this.targetRotation.x = Math.PI * 0.2 + this.mousePosition.y * 0.01;
  };

  private createGalaxy(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const particleCount = this.isMobile ? 15000 : 50000; // Reduce particles on mobile
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const coreColor = new THREE.Color('#4F9CF9');
    const outerColor = new THREE.Color('#000033');
    
    const arms = 3;
    const spiralFactor = 1.2;
    const diskRadius = 12;
    const verticalScatter = 0.5;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * diskRadius;
      const spinAngle = radius * spiralFactor;
      const branchAngle = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * verticalScatter;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixRatio = radius / diskRadius;
      const color = coreColor.clone().lerp(outerColor, mixRatio);
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = Math.PI * 0.2;
    return points;
  }

  private handleResize = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = () => {
    if (!this.renderer.domElement.parentElement) return; // Stop animation if element is not in DOM
    
    const time = this.clock.getElapsedTime();
    
    // Smooth speed interpolation with reduced calculations on mobile
    if (!this.isMobile || this.isHovered) {
      this.currentSpeed += (this.targetSpeed - this.currentSpeed) * this.speedLerpFactor;
      const rotationLerpFactor = this.isHovered ? 0.001 : 0.0003;
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * rotationLerpFactor;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * rotationLerpFactor;
    } else {
      // Simpler rotation for mobile
      this.galaxy.rotation.y += this.baseRotationSpeed;
    }
    
    // Apply rotations
    this.galaxy.rotation.x = this.currentRotation.x;
    this.galaxy.rotation.y += this.currentSpeed;

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate);
  };

  public dispose() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('mouseenter', this.handleMouseEnter);
    this.container.removeEventListener('mouseleave', this.handleMouseLeave);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('resize', this.handleResize);

    this.galaxy.geometry.dispose();
    (this.galaxy.material as THREE.Material).dispose();
    
    this.renderer.dispose();

    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

interface GalaxySceneProps {
  className?: string;
  style?: React.CSSProperties;
}

const GalaxyScene: React.FC<GalaxySceneProps> = ({ className = "", style = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<Galaxy | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const isMobile = () => window.innerWidth <= 640;
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      galaxyRef.current = new Galaxy(containerRef.current);
    } catch (error) {
      console.error("Failed to initialize Galaxy scene:", error);
      setHasError(true);
    }

    return () => {
      if (galaxyRef.current) {
        galaxyRef.current.dispose();
      }
    };
  }, [mobile]);

  // Fallback background if Three.js fails
  if (hasError) {
    return (
      <div 
        className={`w-full h-full bg-gradient-to-br from-[#00072D] to-[#000C52] ${className}`}
        style={style}
      >
        {/* Simple darkened background without requiring an image */}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ ...style, cursor: isHovered ? 'pointer' : 'default' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default GalaxyScene; 