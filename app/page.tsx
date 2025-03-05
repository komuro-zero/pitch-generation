"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

    // Create Marching Cubes Lava Lamp Effect
    const resolution = 60;
    const material = new THREE.MeshPhysicalMaterial({
      color: "#ff4500", // Deep lava red-orange
      emissive: "#ff6347", // Soft glowing effect
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      transmission: 0.9, // Simulating liquid-like effect
      thickness: 2,
    });

    const lavaLamp = new MarchingCubes(
      resolution,
      material,
      true,
      true,
      100000
    );
    lavaLamp.scale.set(0.8, 1.8, 0.8); // Lava lamp shape (taller)
    scene.add(lavaLamp);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff8888, 3, 10);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Lava Motion Animation (Slow & Continuous Blob)
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.04; // Very slow movement for a smooth lava effect

      lavaLamp.reset();

      const strength = 2.5; // Stronger influence to merge into one blob
      const subtract = 10;

      // Create a slow morphing lava effect
      for (let i = 0; i < 3; i++) {
        const ballx = 0.5 + 0.2 * Math.sin(time + i * 1.5);
        const bally = 0.5 + 0.4 * Math.cos(time * 0.5 + i * 0.8);
        const ballz = 0.5 + 0.2 * Math.sin(time * 0.4 + i * 1.2);

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
    <main className="relative w-screen h-screen bg-gradient-to-br flex">
      {/* 3D Lava Lamp Animation - Left Side */}
      <div className="w-1/2 flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* SaaS Hero Text - Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-start pl-16 pr-10 text-black">
        <h1 className="text-5xl font-bold leading-tight">
          Boost Your Productivity
        </h1>
        <p className="text-lg mt-4 text-gray-700">
          Experience a revolutionary platform to manage tasks, automate
          workflows, and enhance collaboration.
        </p>
        <button
          className="mt-6 px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-lg transition text-lg font-medium"
          onClick={() => router.push("/search")}
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
