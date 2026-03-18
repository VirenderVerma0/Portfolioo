"use client";
import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    RoundedBox,
    ContactShadows,
    Environment,
    Html,
    PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

function useMonitorTexture({ width = 1600, height = 900 } = {}) {
    return useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#2d2d30";
        ctx.fillRect(0, 0, width, 40);
        ctx.fillStyle = "#cccccc";
        ctx.font = "18px Inter, monospace";
        ctx.fillText("about.jsx", 20, 28);

        const sidebarW = Math.floor(width * 0.18);
        ctx.fillStyle = "#252526";
        ctx.fillRect(0, 40, sidebarW, height - 40);
        ctx.fillStyle = "#cccccc";
        ctx.font = "16px monospace";
        ctx.fillText("EXPLORER", 10, 70);
        const files = ["portfolio.jsx", "index.js", "about.jsx", "projects.jsx", "contact.jsx"];
        files.forEach((f, i) => {
            ctx.fillStyle = i === 2 ? "#ffffff" : "#a1a1a1";
            ctx.font = (i === 2 ? "bold " : "") + "15px monospace";
            ctx.fillText((i === 2 ? "› " : "  ") + f, 10, 100 + i * 30);
        });

        const editorX = sidebarW;
        const editorW = width - editorX;
        const lnW = 40;
        const codeX = editorX + lnW + 10;
        const codeLines = [
            "import React from 'react'",
            "// A single-file component for Virender Verma's portfolio",
            "function HeroSection() {",
            "  return (",
            "    <div className='hero-card'>",
            "      <h1 className='text-3xl text-white'>Hi, I'm</h1>",
            "      <h2 className='text-6xl text-purple-400'>Virender Verma</h2>",
            "      <p className='text-lg text-gray-400'>A professional Front-end Web Developer</p>",
            "    </div>",
            "  );",
            "}",
            "function App() {",
            "  return (",
            "    <main className='portfolio-page'>",
            "      <HeroSection />",
            "    </main>",
            "  );",
            "}",
            "export default App;",
        ];

        ctx.fillStyle = "#5c5c5c";
        ctx.font = "14px monospace";
        for (let i = 0; i < codeLines.length; i++) {
            ctx.fillText(String(i + 1), editorX + 10, 70 + i * 26);
        }

        codeLines.forEach((line, i) => {
            const y = 70 + i * 26;
            let color = "#d4d4d4";
            if (line.includes("import") || line.includes("from") || line.includes("export")) color = "#c586c0";
            if (line.includes("//")) color = "#6a9955";
            if (line.includes("<") && line.includes(">")) color = "#86c3ff";
            if (line.includes("className") || line.includes("title")) color = "#9cdcfe";
            if (line.includes("'") || line.includes('"')) color = "#ce9178";

            ctx.fillStyle = color;
            ctx.fillText(line.trim(), codeX, y);
        });

        const heroW = Math.floor(editorW * 0.45);
        const heroX = editorX + editorW - heroW - 10;
        const heroY = 60;
        const heroH = height * 0.6;

        ctx.fillStyle = "#161b24";
        ctx.fillRect(heroX, heroY, heroW, heroH);

        ctx.textAlign = 'left';
        ctx.fillStyle = "#e6e6e6";
        ctx.font = "24px Inter, sans-serif";
        ctx.fillText("Front-end Developer", heroX + 25, heroY + 50);

        ctx.fillStyle = "#ffffff";
        ctx.font = "36px Inter, sans-serif";
        ctx.fillText("Hi, I'm", heroX + 25, heroY + 130);

        ctx.fillStyle = "#a78bfa";
        ctx.font = "56px Inter, sans-serif";
        ctx.fillText("Virender Verma ", heroX + 25, heroY + 200);

        ctx.fillStyle = "#a1a1a1";
        ctx.font = "20px Inter, sans-serif";
        ctx.fillText("A professional Front-end Web", heroX + 25, heroY + 240);
        ctx.fillText("Developer", heroX + 25, heroY + 270);

        ctx.fillStyle = "#007acc";
        ctx.fillRect(0, height - 30, width, 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Inter, monospace";
        ctx.fillText("  > Terminal   Problems 0   Warnings 0", 10, height - 10);
        ctx.textAlign = 'right';
        ctx.fillText("Ln 8, Col 12  JavaScript/JSX  4 Spaces  LF  UTF-8", width - 10, height - 10);
        ctx.textAlign = 'left';

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        return texture;
    }, []);
}

function Monitor() {
    const myName = process.env.NEXT_PUBLIC_NAME;
    const tex = useMonitorTexture();
    return (
        <group position={[0, 0.8, 0.7]}>
            <RoundedBox args={[3.6, 2.1, 0.15]} radius={0.03}>
                <meshStandardMaterial
                    color="#0b0b0d"
                    metalness={0.9}
                    roughness={0.2}
                    emissive="#151515"
                    emissiveIntensity={0.2}
                />
            </RoundedBox>

            <mesh position={[0, 0, 0.08]}>
                <planeGeometry args={[3.2, 1.8]} />
                <meshPhysicalMaterial map={tex} toneMapped={false} />
            </mesh>

            <RoundedBox args={[0.08, 0.8, 0.08]} radius={0.01} position={[0, -1.0, 0.0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </RoundedBox>

            <RoundedBox args={[0.8, 0.08, 0.8]} radius={0.02} position={[0, -1.45, 0.0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </RoundedBox>

            <Html position={[0, -1.35, 0.08]} distanceFactor={3.5}>
                <div className="text-[6px] font-bold text-gray-400 tracking-wider">{myName}</div>
            </Html>
        </group>
    );
}

function DeskSpeaker({ position = [0, 0, 0], hueOffset = 0 }) {
    const bodyMaterialRef = useRef();
    const ringMaterialRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.5;
        const hue = ((t * 60 + hueOffset) % 360) / 360;
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5);

        if (bodyMaterialRef.current && ringMaterialRef.current) {
            bodyMaterialRef.current.emissive.copy(color);
            bodyMaterialRef.current.color.copy(color).multiplyScalar(0.1);
            ringMaterialRef.current.emissive.copy(color);
        }
    });

    return (
        <group position={position}>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.5, 32]} />
                <meshStandardMaterial ref={bodyMaterialRef} color="#0b0d10" metalness={0.7} roughness={0.4} emissive="#00ff00" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.1, 32]} />
                <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.14, 0.01, 16, 32]} />
                <meshStandardMaterial ref={ringMaterialRef} emissive="#00ff00" emissiveIntensity={6} />
            </mesh>
        </group>
    );
}

function TallSpeaker({ position = [0, 0, 0], hueOffset = 0 }) {
    const ringMaterialRef = useRef();
    const height = 1.6;

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.5;
        const hue = ((t * 60 + hueOffset) % 360) / 360;
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5);

        if (ringMaterialRef.current) {
            ringMaterialRef.current.emissive.copy(color);
        }
    });

    return (
        <group position={position}>
            <RoundedBox args={[0.4, height, 0.4]} radius={0.02} position={[0, height / 2, 0]}>
                <meshStandardMaterial color="#0b0d10" metalness={0.8} roughness={0.3} />
            </RoundedBox>

            <mesh position={[0, 0.3, 0.205]} rotation={[0, 0, 0]}>
                <circleGeometry args={[0.15, 32]} />
                <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.3, 0.205]} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.17, 0.01, 16, 32]} />
                <meshStandardMaterial ref={ringMaterialRef} emissive="#00ff00" emissiveIntensity={6} />
            </mesh>

            <mesh position={[0, 0.8, 0.205]} rotation={[0, 0, 0]}>
                <circleGeometry args={[0.1, 32]} />
                <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.8, 0.205]} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.12, 0.01, 16, 32]} />
                <meshStandardMaterial emissive="#ff00ff" emissiveIntensity={5} />
            </mesh>

            <mesh position={[0, 1.3, 0.205]} rotation={[0, 0, 0]}>
                <circleGeometry args={[0.05, 32]} />
                <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.3} />
            </mesh>

            <RoundedBox args={[0.5, 0.05, 0.5]} radius={0.01} position={[0, -0.025, 0]}>
                <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
            </RoundedBox>
        </group>
    );
}

function FloorSpeakers() {
    return (
        <group position={[2.6, -0.8, 0.9]}>
            <TallSpeaker position={[-0.3, 0, 0]} hueOffset={0} />
            <TallSpeaker position={[0.3, 0, 0]} hueOffset={180} />
        </group>
    );
}

function Key({ position, hueOffset = 0, size = [0.095, 0.02, 0.07] }) {
    const materialRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.8;
        const wave = Math.sin(t * 2 + position[0] * 8 + position[1] * 10);
        const hue = ((t * 60 + hueOffset + wave * 20) % 360) / 360;
        const saturation = 0.9;
        const lightness = 0.5 + wave * 0.1;
        const emissiveColor = new THREE.Color().setHSL(hue, saturation, lightness);

        if (materialRef.current) {
            materialRef.current.emissive.copy(emissiveColor);
            materialRef.current.emissiveIntensity = 4 + Math.sin(t * 5 + position[0] * 10) * 1.5;
        }
    });

    return (
        <RoundedBox args={size} radius={0.005} position={position}>
            <meshStandardMaterial ref={materialRef} color="#0b0b0b" emissive="#ff0000" emissiveIntensity={3} roughness={0.5} />
        </RoundedBox>
    );
}

function Keyboard() {
    const keys = [];
    const rows = 5;
    const cols = 15;
    const keySpacing = 0.11;
    const startX = -1.15;
    const startY = -0.02;
    const startZ = 0.04;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            keys.push(
                <Key
                    key={`${r}-${c}`}
                    position={[
                        startX + c * keySpacing,
                        startY - r * 0.065,
                        startZ
                    ]}
                    hueOffset={(r * cols + c) * 10}
                />
            );
        }
    }

    return (
        <group position={[-0.8, -0.75, 1.0]} rotation={[-0.06, 0, 0]}>
            <mesh position={[0, -0.02, 0]}>
                <RoundedBox args={[cols * keySpacing + 0.1, 0.08, rows * 0.065 + 0.15]} radius={0.02}>
                    <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
                </RoundedBox>
            </mesh>
            {keys}
        </group>
    );
}

function MouseAndPad() {
    const padMaterialRef = useRef();
    const scrollMaterialRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.8;
        const hue = (t * 40 % 360) / 360;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        if (padMaterialRef.current && scrollMaterialRef.current) {
            padMaterialRef.current.emissive.copy(color);
            scrollMaterialRef.current.emissive.copy(color);
            scrollMaterialRef.current.color.copy(color);
        }
    });

    return (
        <group position={[1.3, -0.82, 1.05]}>
            <RoundedBox args={[1.2, 0.01, 0.9]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial
                    ref={padMaterialRef}
                    color="#0a0a0a"
                    roughness={0.7}
                    emissive="#8b00ff"
                    emissiveIntensity={1.5}
                />
            </RoundedBox>

            <RoundedBox args={[0.2, 0.07, 0.35]} radius={0.02} position={[0, 0.04, 0.1]}>
                <meshStandardMaterial color="#0b0b0b" metalness={0.9} roughness={0.1} emissive="#333333" emissiveIntensity={0.5} />
            </RoundedBox>

            <mesh position={[0, 0.08, 0.2]}>
                <cylinderGeometry args={[0.01, 0.01, 0.03, 16]} />
                <meshStandardMaterial ref={scrollMaterialRef} emissive="#ff0000" emissiveIntensity={8} color="#ff0000" />
            </mesh>
        </group>
    );
}

function SceneContent() {
    const groupRef = useRef();
    const shadowGroupRef = useRef();
    
    useFrame(({ clock }) => {
        if (groupRef.current && shadowGroupRef.current) {
            const time = clock.getElapsedTime();
            const rotationSpeed = 0.3;
            const smoothRotation = time * rotationSpeed;
            
            groupRef.current.rotation.y = smoothRotation;
            shadowGroupRef.current.rotation.y = smoothRotation;
            
            const floatOffset = 
                Math.sin(time * 0.8) * 0.08 + 
                Math.sin(time * 1.2) * 0.03 +
                Math.cos(time * 0.5) * 0.02;
            
            groupRef.current.position.y = 0.2 + floatOffset;
            shadowGroupRef.current.position.y = -1.0;
        }
    });

    return (
        <>
            <group ref={groupRef} position={[0, 0.2, 0]}>
                <mesh position={[0, -1.0, 0]} receiveShadow>
                    <boxGeometry args={[8, 0.12, 3.8]} />
                    <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.2} />
                </mesh>
                <Monitor />
                <FloorSpeakers />
                <Keyboard />
                <DeskSpeaker position={[-1.7, -0.75, 0.7]} hueOffset={0} />
                <DeskSpeaker position={[1.7, -0.75, 0.7]} hueOffset={180} />
                <MouseAndPad />
            </group>

            <group ref={shadowGroupRef} position={[0, -1.0, 0]}>
                <ContactShadows 
                    opacity={0.6} 
                    scale={12} 
                    blur={3} 
                    far={12}
                    rotation={[0, 0, 0]}
                />
            </group>
        </>
    );
}

// Note: HDR environment loading was removed to avoid HEAD requests for '/model/kiara_1_dawn_1k.hdr'
// If you want to re-enable an HDR, place the file at `public/model/kiara_1_dawn_1k.hdr`
// and re-add an Environment component here.

export default function ThreePCShowcase() {
    return (
        <div className="w-full h-full relative overflow-hidden px-4">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] p-2 rounded-2xl overflow-auto">
                <Canvas
                    gl={{
                        alpha: true,
                        antialias: true,
                        powerPreference: "high-performance"
                    }}
                    shadows
                    camera={{ position: [0, 0.5, 11], fov: 45 }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0.5, 11]} fov={45} />

                    <ambientLight intensity={0.6} color="#555555" />

                    <directionalLight
                        position={[5, 8, 5]}
                        intensity={1.2}
                        color="#ffccaa"
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-far={20}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10}
                    />

                    <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#aaccff" />
                    <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" distance={10} />

                    <pointLight position={[-3, 3, 3]} intensity={20} color="#ff00ff" distance={8} decay={2} />
                    <pointLight position={[3, 3, 3]} intensity={20} color="#00ffff" distance={8} decay={2} />
                    <pointLight position={[0, 2, -2]} intensity={15} color="#ffff00" distance={6} decay={2} />

                    <Suspense fallback={
                        <Html center>
                            <div className="text-white text-xl">Loading 3D Scene...</div>
                        </Html>
                    }>
                        <SceneContent />
                    </Suspense>

                    <OrbitControls
                        target={[0, 0.5, 0]}
                        maxPolarAngle={Math.PI / 2.1}
                        minPolarAngle={Math.PI / 6}
                        maxDistance={15}
                        minDistance={8}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={-4}
                    />
                </Canvas>

                {/* <div className="absolute  left-1/2 transform -translate-x-1/2 text-center hidden sm:block">
                    <div className="bg-black/60 backdrop-blur-sm text-white/80 text-sm px-4 py-1 rounded-full border border-white/20">
                        🖱️ Drag to rotate • 🔍 Scroll to zoom • 🔄 Auto-rotating
                    </div>
                </div> */}
            </div>
        </div>
    );
}
