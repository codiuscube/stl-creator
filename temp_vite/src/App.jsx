import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PROJECTS, PROJECT_LIST } from './projects';

const FILAMENT_COLORS = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#f5f5f5' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Orange', hex: '#ea580c' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Green', hex: '#16a34a' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Purple', hex: '#9333ea' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Wood', hex: '#92400e' },
    { name: 'Gold', hex: '#d97706' },
];

// Reference Objects for Size Comparison (dimensions in cm, matching model scale)
const REFERENCE_OBJECTS = [
    {
        id: 'soda-can',
        name: 'Soda Can',
        description: '330ml standard',
        dimensions: { diameter: 6.6, height: 12.2 },
        color: '#dc2626',
        createMesh: () => {
            const geo = new THREE.CylinderGeometry(3.3, 3.3, 12.2, 32);
            const mat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.3, metalness: 0.6 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 6.1;
            return mesh;
        }
    },
    {
        id: 'iphone',
        name: 'iPhone',
        description: '~15cm tall',
        dimensions: { width: 7.1, height: 14.7, depth: 0.8 },
        color: '#1f2937',
        createMesh: () => {
            const geo = new THREE.BoxGeometry(0.8, 14.7, 7.1);
            const mat = new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.2, metalness: 0.8 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 7.35;
            return mesh;
        }
    },
    {
        id: 'credit-card',
        name: 'Credit Card',
        description: '8.5 x 5.4cm',
        dimensions: { width: 8.5, height: 5.4, depth: 0.1 },
        color: '#2563eb',
        createMesh: () => {
            const geo = new THREE.BoxGeometry(0.1, 5.4, 8.5);
            const mat = new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.3, metalness: 0.5 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 2.7;
            return mesh;
        }
    },
    {
        id: 'golf-ball',
        name: 'Golf Ball',
        description: '4.3cm diameter',
        dimensions: { diameter: 4.3 },
        color: '#f5f5f5',
        createMesh: () => {
            const geo = new THREE.SphereGeometry(2.15, 32, 32);
            const mat = new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.6, metalness: 0.1 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 2.15;
            return mesh;
        }
    },
    {
        id: 'aa-battery',
        name: 'AA Battery',
        description: '5cm tall',
        dimensions: { diameter: 1.4, height: 5 },
        color: '#eab308',
        createMesh: () => {
            const geo = new THREE.CylinderGeometry(0.7, 0.7, 5, 32);
            const mat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.4, metalness: 0.3 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 2.5;
            return mesh;
        }
    },
    {
        id: 'tennis-ball',
        name: 'Tennis Ball',
        description: '6.7cm diameter',
        dimensions: { diameter: 6.7 },
        color: '#84cc16',
        createMesh: () => {
            const geo = new THREE.SphereGeometry(3.35, 32, 32);
            const mat = new THREE.MeshStandardMaterial({ color: '#84cc16', roughness: 0.8, metalness: 0.0 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 3.35;
            return mesh;
        }
    },
    {
        id: 'coffee-mug',
        name: 'Coffee Mug',
        description: '~10cm tall',
        dimensions: { diameter: 8, height: 9.5 },
        color: '#f5f5f5',
        createMesh: () => {
            const geo = new THREE.CylinderGeometry(4, 3.5, 9.5, 32);
            const mat = new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.5, metalness: 0.1 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 4.75;
            return mesh;
        }
    },
    {
        id: 'banana',
        name: 'Banana',
        description: '~18cm long',
        dimensions: { length: 18, diameter: 3.5 },
        color: '#facc15',
        createMesh: () => {
            const geo = new THREE.CapsuleGeometry(1.75, 14, 16, 32);
            const mat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.7, metalness: 0.0 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.rotation.z = Math.PI / 12;
            mesh.position.y = 5;
            return mesh;
        }
    }
];

const Icons = {
    Box: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    ),
    Download: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    ),
    Settings: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Ruler: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path>
            <path d="m7.5 10.5 2 2"></path>
            <path d="m10.5 7.5 2 2"></path>
            <path d="m13.5 4.5 2 2"></path>
            <path d="m4.5 13.5 2 2"></path>
        </svg>
    ),
    Copy: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
    ),
    Check: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
};

const Header = ({ onExport, currentProject, onProjectChange, isOutOfBounds }) => (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-20 relative">
        <div className="flex items-center gap-3">
            <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">
                <Icons.Box className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Studio 3D</h1>
            <span className="text-gray-300">|</span>
            <select
                value={currentProject}
                onChange={(e) => onProjectChange(e.target.value)}
                className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border-none outline-none focus:ring-2 focus:ring-blue-500"
            >
                {PROJECT_LIST.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                ))}
            </select>
        </div>
        <button
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm ${
                isOutOfBounds
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer active:scale-95'
            }`}
            onClick={isOutOfBounds ? undefined : onExport}
            disabled={isOutOfBounds}
            title={isOutOfBounds ? 'Model exceeds build plate - reduce size to export' : 'Export STL file'}
        >
            <Icons.Download className="w-4 h-4" />
            {isOutOfBounds ? 'Too Large' : 'Export STL'}
        </button>
    </header>
);

const ControlGroup = ({ title, children }) => (
    <div className="mb-8 last:mb-0">
        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">{title}</h3>
        <div className="space-y-5">{children}</div>
    </div>
);

const RangeControl = ({ label, value, min, max, step, onChange, unit = "mm" }) => (
    <div className="group">
        <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{label}</label>
            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 rounded">{value}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
        />
    </div>
);

const ColorControl = ({ label, value, onChange }) => (
    <div className="group">
        <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{label}</label>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
        </div>
        <div className="flex flex-wrap gap-2">
            {FILAMENT_COLORS.map((color) => (
                <button
                    key={color.hex}
                    onClick={() => onChange(color.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${value === color.hex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                />
            ))}
        </div>
    </div>
);

const ColorPopover = ({ position, partName, currentColor, onColorChange, onClose }) => {
    if (!position) return null;
    return (
        <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64"
            style={{ left: position.x, top: position.y, transform: 'translate(-50%, -100%) translateY(-10px)' }}
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-800 capitalize">{partName} Color</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div className="flex flex-wrap gap-2">
                {FILAMENT_COLORS.map((color) => (
                    <button
                        key={color.hex}
                        onClick={() => { onColorChange(color.hex); onClose(); }}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${currentColor === color.hex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                    />
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
                <label className="text-xs text-gray-500 mb-1 block">Custom Color</label>
                <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => { onColorChange(e.target.value); onClose(); }}
                    className="w-full h-8 rounded cursor-pointer border border-gray-200"
                />
            </div>
        </div>
    );
};

// Scale options for model and reference objects
const SCALE_OPTIONS = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
];

// Model Scale Control
const ModelScaleControl = ({ scale, onScaleChange }) => (
    <div className="group">
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Model Scale</label>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                {SCALE_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onScaleChange(opt.value)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                            scale === opt.value
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">Scale your model for size comparison</p>
    </div>
);

// Reference Objects Control for size comparison
const ReferenceObjectsControl = ({ visibleObjects, onToggle, scale, onScaleChange }) => (
    <div className="group">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Icons.Ruler className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Compare Size With</label>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                {SCALE_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onScaleChange(opt.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                            scale === opt.value
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            {REFERENCE_OBJECTS.map((obj) => (
                <button
                    key={obj.id}
                    onClick={() => onToggle(obj.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                        visibleObjects.includes(obj.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: obj.color }}
                    />
                    <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{obj.name}</div>
                        <div className="text-[10px] opacity-70 truncate">{obj.description}</div>
                    </div>
                </button>
            ))}
        </div>
        {visibleObjects.length > 0 && (
            <button
                onClick={() => visibleObjects.forEach(id => onToggle(id))}
                className="mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
                Clear all reference objects
            </button>
        )}
    </div>
);

const Viewer = ({ project, settings, partColors, modelRef, onPartClick, visibleReferenceObjects = [], referenceScale = 1, onOutOfBoundsChange }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const referenceGroupRef = useRef(null);

    const handleClick = (event) => {
        if (!mountRef.current || !cameraRef.current || !modelRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycasterRef.current.setFromCamera(mouse, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(modelRef.current.children, true);
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            if (clickedMesh.name && onPartClick) {
                onPartClick(clickedMesh.name, event.clientX, event.clientY);
            }
        }
    };

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf1f5f9);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 30);
        camera.lookAt(0, 10, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 25, 10);
        dirLight.castShadow = true;
        scene.add(dirLight);
        const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.4);
        fillLight.position.set(-10, 10, -10);
        scene.add(fillLight);

        // Bambu Lab A1 build plate: 256 x 256 mm, max height: 256mm
        const buildPlateSizeMM = 256;
        const buildPlateUnits = buildPlateSizeMM / 10; // Convert to scene units (cm)

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(buildPlateUnits, buildPlateUnits),
            new THREE.ShadowMaterial({ opacity: 0.1 })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);

        // Build plate grid
        const grid = new THREE.GridHelper(buildPlateUnits, buildPlateSizeMM / 10, 0xcbd5e1, 0xe2e8f0);
        grid.position.y = 0.01;
        scene.add(grid);

        // Permanent vertical mm ruler (1 unit = 1cm = 10mm)
        // Bambu Lab A1 max height: 256mm
        const rulerGroup = new THREE.Group();
        rulerGroup.position.set(-12, 0, 0); // Position to the left of the model

        const rulerHeightMM = 256; // Bambu Lab A1 max height
        const rulerHeightUnits = rulerHeightMM / 10; // Convert to scene units (cm)
        const rulerMaterial = new THREE.MeshBasicMaterial({
            color: 0x64748b,
            transparent: true,
            opacity: 0.5
        });

        // Main ruler bar
        const rulerBar = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, rulerHeightUnits, 0.05),
            rulerMaterial
        );
        rulerBar.position.y = rulerHeightUnits / 2;
        rulerGroup.add(rulerBar);

        // Add tick marks every 10mm (1 unit) - cleaner look
        for (let mm = 0; mm <= rulerHeightMM; mm += 10) {
            const y = mm / 10; // Convert mm to scene units
            const is50mm = mm % 50 === 0;
            const is100mm = mm % 100 === 0;

            // Tick mark - different sizes
            const tickWidth = is100mm ? 1.0 : is50mm ? 0.6 : 0.3;
            const tickGeo = new THREE.BoxGeometry(tickWidth, 0.05, 0.05);
            const tick = new THREE.Mesh(tickGeo, rulerMaterial);
            tick.position.set(tickWidth / 2 + 0.08, y, 0);
            rulerGroup.add(tick);

            // Labels every 100mm
            if (is100mm && mm > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#64748b';
                ctx.font = 'bold 52px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${mm}`, 64, 48);

                const texture = new THREE.CanvasTexture(canvas);
                const labelMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.6
                });
                const label = new THREE.Sprite(labelMaterial);
                label.position.set(2, y, 0);
                label.scale.set(2, 1, 1);
                rulerGroup.add(label);

                // Laser line across the scene at every 100mm
                const laserLineMaterial = new THREE.MeshBasicMaterial({
                    color: 0x94a3b8,
                    transparent: true,
                    opacity: 0.15
                });
                const laserLine = new THREE.Mesh(
                    new THREE.PlaneGeometry(buildPlateUnits, 0.03),
                    laserLineMaterial
                );
                laserLine.position.set(buildPlateUnits / 2 - 12, y, 0); // Center it across the build plate
                laserLine.renderOrder = -1; // Render behind other objects
                scene.add(laserLine);
            }
        }

        // "mm" label at top
        const mmCanvas = document.createElement('canvas');
        mmCanvas.width = 64;
        mmCanvas.height = 64;
        const mmCtx = mmCanvas.getContext('2d');
        mmCtx.fillStyle = '#64748b';
        mmCtx.font = 'bold 36px Arial';
        mmCtx.textAlign = 'center';
        mmCtx.fillText('mm', 32, 44);
        const mmTexture = new THREE.CanvasTexture(mmCanvas);
        const mmMaterial = new THREE.SpriteMaterial({
            map: mmTexture,
            transparent: true,
            opacity: 0.6
        });
        const mmLabel = new THREE.Sprite(mmMaterial);
        mmLabel.position.set(0.08, rulerHeightUnits + 1, 0);
        mmLabel.scale.set(1.2, 1.2, 1);
        rulerGroup.add(mmLabel);

        scene.add(rulerGroup);

        // Reference Objects Group (separate from exportable model)
        const referenceGroup = new THREE.Group();
        referenceGroup.name = 'referenceObjects';
        scene.add(referenceGroup);
        referenceGroupRef.current = referenceGroup;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 10;
        controls.maxDistance = 60;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.target.set(0, 10, 0);

        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            controls.dispose();
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!sceneRef.current) return;
        if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
        }
        const newModel = project.createGeometry(settings, partColors);

        // Check if model exceeds build plate bounds (256mm = 25.6 units)
        const buildLimitUnits = 25.6;
        const halfPlate = buildLimitUnits / 2; // 12.8 units from center

        const box = new THREE.Box3().setFromObject(newModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Check if model exceeds any dimension
        const exceedsHeight = size.y > buildLimitUnits;
        const exceedsWidth = size.x > buildLimitUnits || Math.abs(center.x) + size.x / 2 > halfPlate;
        const exceedsDepth = size.z > buildLimitUnits || Math.abs(center.z) + size.z / 2 > halfPlate;
        const isOutOfBounds = exceedsHeight || exceedsWidth || exceedsDepth;

        // Notify parent of bounds state
        if (onOutOfBoundsChange) {
            onOutOfBoundsChange(isOutOfBounds);
        }

        // Apply "Little Mac wireframe" effect if out of bounds
        if (isOutOfBounds) {
            // Collect meshes first to avoid modifying during traversal
            const meshes = [];
            newModel.traverse((child) => {
                if (child.isMesh) meshes.push(child);
            });

            meshes.forEach((mesh) => {
                // Store original material for reference
                const originalColor = mesh.material.color.clone();

                // Create wireframe overlay
                const wireframeMaterial = new THREE.MeshBasicMaterial({
                    color: originalColor,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.8
                });

                // Make the solid material very transparent
                mesh.material.transparent = true;
                mesh.material.opacity = 0.15;
                mesh.material.depthWrite = false;

                // Add wireframe mesh as sibling
                const wireframeMesh = new THREE.Mesh(mesh.geometry, wireframeMaterial);
                wireframeMesh.position.copy(mesh.position);
                wireframeMesh.rotation.copy(mesh.rotation);
                wireframeMesh.scale.copy(mesh.scale);
                wireframeMesh.name = mesh.name + '_wireframe';
                newModel.add(wireframeMesh);
            });
        }

        sceneRef.current.add(newModel);
        modelRef.current = newModel;
    }, [project, settings, partColors]);

    // Update reference objects when visibility or scale changes
    useEffect(() => {
        if (!referenceGroupRef.current) return;

        // Clear existing reference objects
        while (referenceGroupRef.current.children.length > 0) {
            const child = referenceGroupRef.current.children[0];
            referenceGroupRef.current.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        }

        // Add visible reference objects positioned outside the build plate
        // Build plate is 25.6 units (256mm) centered at origin, so edge is at 12.8
        let currentX = 15; // Start position outside the build plate

        visibleReferenceObjects.forEach((objId) => {
            const refObj = REFERENCE_OBJECTS.find(o => o.id === objId);
            if (refObj) {
                const mesh = refObj.createMesh();

                // Apply scale
                mesh.scale.set(referenceScale, referenceScale, referenceScale);

                // Calculate object width for positioning (scaled)
                const objWidth = (refObj.dimensions.diameter || refObj.dimensions.width || refObj.dimensions.length || 5) * referenceScale;

                // Position the object (adjust Y position for scale)
                mesh.position.x = currentX + objWidth / 2;
                mesh.position.y *= referenceScale;
                mesh.position.z = 0;

                // Add slight transparency to distinguish from main model
                if (mesh.material) {
                    mesh.material.transparent = true;
                    mesh.material.opacity = 0.85;
                }

                referenceGroupRef.current.add(mesh);

                // Update position for next object
                currentX += objWidth + 2;
            }
        });
    }, [visibleReferenceObjects, referenceScale]);

    return <div ref={mountRef} onClick={handleClick} className="absolute inset-0 cursor-pointer" />;
};

const estimatePrintTime = (volumeCm3) => {
    // Bambu A1 estimate: ~40 cm³/hour at typical settings (20% infill, 0.2mm layer)
    // This accounts for travel, retractions, and cooling
    const printRateCm3PerHour = 40;
    const totalMinutes = Math.round((volumeCm3 / printRateCm3PerHour) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
        return `~${minutes}m`;
    }
    return `~${hours}h ${minutes}m`;
};

const estimateFilamentCost = (volumeCm3) => {
    // PLA density: ~1.24 g/cm³
    // Cost: $50 for 4kg = $12.50/kg = $0.0125/g
    const plaDensity = 1.24; // g/cm³
    const costPerGram = 50 / 4000; // $0.0125/g
    const weightGrams = volumeCm3 * plaDensity;
    const cost = weightGrams * costPerGram;
    return { weight: weightGrams, cost };
};

function ProjectEditor() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Validate project exists, default to headphone if not
    const validProjectId = PROJECTS[projectId] ? projectId : 'headphone';
    const project = PROJECTS[validProjectId];

    const [settings, setSettings] = useState(project.defaultSettings);
    const [partColors, setPartColors] = useState(project.defaultColors);
    const [selectedPart, setSelectedPart] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState(null);
    const [visibleReferenceObjects, setVisibleReferenceObjects] = useState([]);
    const [referenceScale, setReferenceScale] = useState(1);
    const [modelScale, setModelScale] = useState(1);
    const [isOutOfBounds, setIsOutOfBounds] = useState(false);
    const [copied, setCopied] = useState(false);
    const modelRef = useRef(null);

    const closePopover = () => {
        setSelectedPart(null);
        setPopoverPosition(null);
    };

    // Reset settings when project changes via URL
    useEffect(() => {
        if (PROJECTS[projectId]) {
            setSettings(PROJECTS[projectId].defaultSettings);
            setPartColors(PROJECTS[projectId].defaultColors);
            setModelScale(1);
            closePopover();
        }
    }, [projectId]);

    const toggleReferenceObject = (objectId) => {
        setVisibleReferenceObjects(prev =>
            prev.includes(objectId)
                ? prev.filter(id => id !== objectId)
                : [...prev, objectId]
        );
    };

    const handleProjectChange = (newProjectId) => {
        navigate(`/${newProjectId}`);
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleColorChange = (color) => {
        const newColors = {};
        Object.keys(partColors).forEach(key => {
            newColors[key] = color;
        });
        setPartColors(newColors);
    };

    const handlePartClick = (partName, x, y) => {
        setSelectedPart(partName);
        setPopoverPosition({ x, y });
    };

    const handlePartColorChange = (color) => {
        if (selectedPart) {
            setPartColors(prev => ({ ...prev, [selectedPart]: color }));
        }
    };

    // Create scaled settings - multiplies all numeric dimensions by modelScale
    const scaledSettings = Object.fromEntries(
        Object.entries(settings).map(([key, value]) => [key, typeof value === 'number' ? value * modelScale : value])
    );

    // Copy settings function - must be after scaledSettings is defined
    const copySettingsToClipboard = async () => {
        console.log('=== COPY BUTTON CLICKED ===');
        console.log('Base settings:', settings);
        console.log('Model scale:', modelScale);
        console.log('Scaled settings:', scaledSettings);

        // Use scaled settings (the actual values being used)
        const formatted = JSON.stringify(scaledSettings, null, 4)
            .replace(/"(\w+)":/g, '$1:'); // Remove quotes from keys
        const codeBlock = `defaultSettings: ${formatted},`;

        console.log('Formatted code block:', codeBlock);

        try {
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                console.log('Using navigator.clipboard.writeText...');
                await navigator.clipboard.writeText(codeBlock);
                console.log('Clipboard write successful!');
            } else {
                console.log('Clipboard API not available, using fallback...');
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = codeBlock;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                console.log('Fallback copy successful!');
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed with error:', err);
            console.log('=== COPY THESE SETTINGS MANUALLY ===\n', codeBlock);
            alert('Copied to console (check developer tools)');
        }
    };

    const volume = project.calculateVolume(scaledSettings);
    const printTime = estimatePrintTime(volume);
    const { weight: filamentWeight, cost: filamentCost } = estimateFilamentCost(volume);

    // Export binary STL with per-facet colors (Magics/Materialise format)
    // Uses BGR byte order which is supported by PrusaSlicer, Cura, etc.
    const exportBinarySTLWithColors = (group) => {
        const meshes = [];
        group.traverse((child) => {
            if (child.isMesh) meshes.push(child);
        });

        let totalTriangles = 0;
        meshes.forEach((mesh) => {
            const geo = mesh.geometry;
            totalTriangles += geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3;
        });

        const buffer = new ArrayBuffer(84 + totalTriangles * 50);
        const view = new DataView(buffer);

        const header = 'Binary STL with color';
        for (let i = 0; i < 80; i++) view.setUint8(i, i < header.length ? header.charCodeAt(i) : 0);
        view.setUint32(80, totalTriangles, true);

        let offset = 84;
        const normal = new THREE.Vector3();
        const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();

        meshes.forEach((mesh) => {
            const geo = mesh.geometry.clone();
            geo.applyMatrix4(mesh.matrixWorld);

            const color = mesh.material.color;
            // BGR format (Magics) - swap red and blue for correct slicer display
            const r = Math.round(color.r * 31) & 0x1F;
            const g = Math.round(color.g * 31) & 0x1F;
            const b = Math.round(color.b * 31) & 0x1F;
            const colorValue = 0x8000 | (b << 10) | (g << 5) | r;

            const positions = geo.attributes.position;
            const indices = geo.index;
            const count = indices ? indices.count : positions.count;

            for (let i = 0; i < count; i += 3) {
                const a = indices ? indices.getX(i) : i;
                const bIdx = indices ? indices.getX(i + 1) : i + 1;
                const c = indices ? indices.getX(i + 2) : i + 2;

                vA.fromBufferAttribute(positions, a);
                vB.fromBufferAttribute(positions, bIdx);
                vC.fromBufferAttribute(positions, c);

                const cb = new THREE.Vector3().subVectors(vC, vB);
                const ab = new THREE.Vector3().subVectors(vA, vB);
                normal.crossVectors(cb, ab).normalize();

                [normal, vA, vB, vC].forEach(v => {
                    view.setFloat32(offset, v.x, true); offset += 4;
                    view.setFloat32(offset, v.y, true); offset += 4;
                    view.setFloat32(offset, v.z, true); offset += 4;
                });
                view.setUint16(offset, colorValue, true); offset += 2;
            }
        });
        return buffer;
    };

    const handleExport = () => {
        if (!modelRef.current) {
            alert('No model to export');
            return;
        }
        const stlBuffer = exportBinarySTLWithColors(modelRef.current);
        const blob = new Blob([stlBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = project.exportFilename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const firstColorKey = Object.keys(partColors)[0];
    const currentColor = partColors[firstColorKey];

    return (
        <div className="flex flex-col h-screen font-sans">
            <Header onExport={handleExport} currentProject={validProjectId} onProjectChange={handleProjectChange} isOutOfBounds={isOutOfBounds} />
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto z-10 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] flex flex-col">
                    <div className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-gray-900">
                                <Icons.Settings className="w-5 h-5 text-gray-500" />
                                <h2 className="text-lg font-bold">Configuration</h2>
                            </div>
                            <button
                                onClick={copySettingsToClipboard}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    copied
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }`}
                                title="Copy current settings as code"
                            >
                                {copied ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied!' : 'Copy Settings'}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">Customize your {project.name.toLowerCase()}.</p>
                    </div>
                    <div className="flex-1 p-8 pt-4 space-y-8">
                        <ModelScaleControl scale={modelScale} onScaleChange={setModelScale} />
                        {project.controls.map(group => (
                            <ControlGroup key={group.group} title={group.group}>
                                {group.items.map(control => (
                                    <RangeControl
                                        key={control.key}
                                        label={control.label}
                                        value={parseFloat((settings[control.key] * modelScale * 10).toFixed(1))}
                                        min={parseFloat((control.min * modelScale * 10).toFixed(1))}
                                        max={parseFloat((control.max * modelScale * 10).toFixed(1))}
                                        step={parseFloat((control.step * modelScale * 10).toFixed(2))}
                                        unit={control.unit ?? 'mm'}
                                        onChange={(v) => updateSetting(control.key, v / modelScale / 10)}
                                    />
                                ))}
                            </ControlGroup>
                        ))}
                        <ControlGroup title="Appearance">
                            <ColorControl label="Default Color" value={currentColor} onChange={handleColorChange} />
                            <p className="text-xs text-gray-400 mt-2">Click on parts in the 3D view to customize individual colors.</p>
                        </ControlGroup>
                        <ControlGroup title="Size Reference">
                            <ReferenceObjectsControl
                                visibleObjects={visibleReferenceObjects}
                                onToggle={toggleReferenceObject}
                                scale={referenceScale}
                                onScaleChange={setReferenceScale}
                            />
                        </ControlGroup>
                    </div>
                </aside>
                <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-200 relative">
                    <Viewer project={project} settings={scaledSettings} partColors={partColors} modelRef={modelRef} onPartClick={handlePartClick} visibleReferenceObjects={visibleReferenceObjects} referenceScale={referenceScale} onOutOfBoundsChange={setIsOutOfBounds} />
                    <div className={`absolute bottom-6 left-6 backdrop-blur-md border p-4 rounded-xl shadow-lg ${isOutOfBounds ? 'bg-red-50/90 border-red-200' : 'bg-white/80 border-white/50'}`}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {isOutOfBounds ? 'Out of Bounds' : 'View Stats'}
                        </div>
                        <div className={`text-sm font-medium ${isOutOfBounds ? 'text-red-600' : 'text-gray-700'}`}>
                            Volume: {volume.toFixed(1)} cm³
                        </div>
                        <div className={`text-sm font-medium ${isOutOfBounds ? 'text-red-600' : 'text-gray-700'}`}>
                            Filament: {filamentWeight.toFixed(0)}g · ${filamentCost.toFixed(2)}
                        </div>
                        <div className={`text-sm font-medium ${isOutOfBounds ? 'text-red-600' : 'text-gray-700'}`}>
                            Print Time: {isOutOfBounds ? 'N/A' : printTime}
                        </div>
                        {isOutOfBounds && (
                            <div className="mt-2 text-xs text-red-500">
                                Reduce size to fit 256x256x256mm
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {selectedPart && (
                <ColorPopover
                    position={popoverPosition}
                    partName={selectedPart}
                    currentColor={partColors[selectedPart]}
                    onColorChange={handlePartColorChange}
                    onClose={closePopover}
                />
            )}
        </div>
    );
}

// Wrapper to force remount when project changes
function ProjectEditorWrapper() {
    const { projectId } = useParams();
    return <ProjectEditor key={projectId} />;
}

function App() {
    return (
        <Routes>
            <Route path="/:projectId" element={<ProjectEditorWrapper />} />
            <Route path="/" element={<Navigate to="/headphone" replace />} />
        </Routes>
    );
}

export default App;
