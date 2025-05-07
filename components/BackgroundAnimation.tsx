'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

class ParticleSystem {
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private clock: THREE.Clock = new THREE.Clock();
  private isDisposed: boolean = false;
  private container: HTMLElement;
  private animationFrame: number | null = null;
  private isInitialized: boolean = false;
  private scrollIndicator: THREE.Points | null = null;
  private initialY = -15;

  constructor(container: HTMLElement) {
    this.container = container;
    
    try {
      this.initScene();
      this.initCamera();
      this.initRenderer();
      
      if (!this.renderer || !this.renderer.domElement) {
        throw new Error('Failed to initialize renderer');
      }
      
      this.initParticles();
      this.initScrollIndicator();
      this.initEvents();
      
      this.isInitialized = true;
      
      requestAnimationFrame(() => {
        if (this.isInitialized && !this.isDisposed) {
          this.animate();
        }
      });
    } catch (error) {
      console.error('Failed to initialize ParticleSystem:', error);
      this.dispose();
    }
  }

  private initScene(): void {
    // Make the scene background transparent
    this.scene.background = null;
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 100;
  }

  private initRenderer(): void {
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      
      if (!this.renderer) {
        throw new Error('Failed to create WebGLRenderer');
      }
      
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.appendChild(this.renderer.domElement);
    } catch (error) {
      console.error('Error initializing renderer:', error);
      throw error;
    }
  }

  private initParticles(): void {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // Random position in a sphere
      const radius = 50 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Soft white color with slight variations
      const colorBase = 0.5 + Math.random() * 0.2;
      colors[i3] = colorBase;
      colors[i3 + 1] = colorBase;
      colors[i3 + 2] = colorBase + Math.random() * 0.1;

      sizes[i] = 1.0 + Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float time;
        uniform float pixelRatio;
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Gentle floating animation
          pos.y += sin(time * 0.3 + position.x * 0.1) * 0.5;
          pos.x += cos(time * 0.3 + position.y * 0.1) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.5);
          gl_FragColor = vec4(vColor, strength * 0.5);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  private initScrollIndicator(): void {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 5;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Create a vertical line of particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = this.initialY + (i * 0.5); // Spread particles vertically
      positions[i3 + 2] = 0;

      // Gradient from bright to dim
      const brightness = 1 - (i / particleCount);
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.scrollIndicator = new THREE.Points(geometry, material);
    this.scene.add(this.scrollIndicator);
  }

  private updateScrollIndicator(): void {
    if (!this.scrollIndicator) return;

    const time = this.clock.getElapsedTime();
    const positions = this.scrollIndicator.geometry.attributes.position.array as Float32Array;
    const colors = this.scrollIndicator.geometry.attributes.color.array as Float32Array;

    // Animate particles moving down and fading
    for (let i = 0; i < positions.length; i += 3) {
      // Oscillate y position
      positions[i + 1] = this.initialY + (i / 3 * 0.5) + Math.sin(time * 2 + i) * 0.2;
      
      // Pulse opacity through color
      const brightness = (Math.sin(time * 2 + i) + 1) * 0.5;
      colors[i] = brightness;
      colors[i + 1] = brightness;
      colors[i + 2] = brightness;
    }

    this.scrollIndicator.geometry.attributes.position.needsUpdate = true;
    this.scrollIndicator.geometry.attributes.color.needsUpdate = true;
  }

  private initEvents(): void {
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = (): void => {
    if (this.isDisposed) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.particles.material instanceof THREE.ShaderMaterial) {
      this.particles.material.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
  };

  private animate = (): void => {
    if (!this.isInitialized || this.isDisposed) return;

    try {
      if (this.particles?.material instanceof THREE.ShaderMaterial) {
        this.particles.material.uniforms.time.value = this.clock.getElapsedTime();
        this.particles.rotation.y += 0.0005;
      }

      this.updateScrollIndicator();

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      
      this.animationFrame = requestAnimationFrame(this.animate);
    } catch (error) {
      console.error('Animation error:', error);
      this.dispose();
    }
  };

  public dispose(): void {
    this.isDisposed = true;
    
    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize);
    
    // Clean up animation frame
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Clean up Three.js resources
    if (this.particles) {
      this.particles.geometry.dispose();
      if (this.particles.material instanceof THREE.Material) {
        this.particles.material.dispose();
      }
      this.scene.remove(this.particles);
    }
    
    if (this.scrollIndicator) {
      this.scrollIndicator.geometry.dispose();
      if (this.scrollIndicator.material instanceof THREE.Material) {
        this.scrollIndicator.material.dispose();
      }
      this.scene.remove(this.scrollIndicator);
    }
    
    // Clean up renderer
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}

const ThreeDAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      particleSystemRef.current = new ParticleSystem(containerRef.current);
    } catch (error) {
      console.error('Failed to initialize ParticleSystem:', error);
      setHasError(true);
    }

    return () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }
    };
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#000814] to-[#001440] opacity-70">
        {/* Fallback dark background */}
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ThreeDAnimation;
