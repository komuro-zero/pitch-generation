"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes";

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Marching Cubes for Lava Lamp
    const resolution = 50;
    const material = new THREE.MeshStandardMaterial({
      color: 0xff3b3b, // Lava red
      emissive: 0xff6b6b, // Soft glow
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.95,
    });

    const lavaLamp = new MarchingCubes(
      resolution,
      material,
      true,
      true,
      100000
    );
    lavaLamp.scale.set(1, 2, 1); // Tall and stretched for a lava lamp shape
    scene.add(lavaLamp);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff8888, 3, 10);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Lava Motion Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;

      lavaLamp.reset();

      const numBlobs = 5; // Number of moving lava blobs
      const strength = 1.2 / ((Math.sqrt(numBlobs) - 1) / 4 + 1);
      const subtract = 12;

      for (let i = 0; i < numBlobs; i++) {
        const ballx =
          Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.3 +
          0.5;
        const bally =
          Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) *
          0.8;
        const ballz =
          Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.3 +
          0.5;

        lavaLamp.addBall(ballx, bally, ballz, strength, subtract);
      }

      lavaLamp.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resizing
    const handleResize = () => {
      const width = window.innerWidth / 2;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <main className="relative w-screen h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-600 flex">
      {/* 3D Lava Lamp Animation - Left Side */}
      <div className="w-1/2 flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* SaaS Hero Text - Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-start pl-16 pr-10 text-white">
        <h1 className="text-5xl font-bold leading-tight">
          Boost Your Productivity
        </h1>
        <p className="text-lg mt-4 text-gray-300">
          Experience a revolutionary platform to manage tasks, automate
          workflows, and enhance collaboration.
        </p>
        <button className="mt-6 px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-lg transition text-lg font-medium">
          Get Started
        </button>
      </div>
    </main>
  );
}
