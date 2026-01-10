const { useState, useEffect, useRef } = React;

// --- Icons Component ---
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
    )
};

// --- UI Components ---
const Header = () => (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-20 relative">
        <div className="flex items-center gap-3">
            <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">
                <Icons.Box className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Studio 3D <span className="text-gray-400 font-normal">| Headphone Stand</span></h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95" onClick={() => alert('Exporting to STL... (Feature stub)')}>
            <Icons.Download className="w-4 h-4" />
            Export STL
        </button>
    </header>
);

const ControlGroup = ({ title, children }) => (
    <div className="mb-8 last:mb-0">
        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">{title}</h3>
        <div className="space-y-5">
            {children}
        </div>
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

// --- 3D Viewer Component ---
const Viewer = ({ settings }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const standRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf1f5f9); // Match 'slate-100/infinite-gray' feel
        scene.fog = new THREE.Fog(0xf1f5f9, 20, 90);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(25, 20, 25);
        camera.lookAt(0, 10, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 25, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.bias = -0.001;
        scene.add(dirLight);
        
        // Fill light to soften shadows
        const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.4);
        fillLight.position.set(-10, 10, -10);
        scene.add(fillLight);

        // Floor (Invisible Shadow Catcher)
        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);

        // Grid (Subtle)
        const gridHelper = new THREE.GridHelper(100, 50, 0xcbd5e1, 0xe2e8f0);
        gridHelper.position.y = 0.01; // Avoid Z-fighting with shadow plane
        scene.add(gridHelper);

        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 10;
        controls.maxDistance = 60;
        controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
        controls.target.set(0, 10, 0);

        // Animation Loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize Handler
        const handleResize = () => {
             if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Initial Geometry
        updateStand(settings);

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

    // Update geometry when settings change
    useEffect(() => {
        if (sceneRef.current) {
            updateStand(settings);
        }
    }, [settings]);

    const updateStand = (params) => {
        if (standRef.current) {
            sceneRef.current.remove(standRef.current);
            // Dispose of old geometries and materials to avoid leaks (simplified for this demo)
            standRef.current.traverse((child) => {
                if(child.isMesh) {
                    child.geometry.dispose();
                    if(Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            });
        }

        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3b82f6,
            roughness: 0.2,
            metalness: 0.1,
        });

        const darkMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1e3a8a,
            roughness: 0.3, 
            metalness: 0.2 
        });

        const group = new THREE.Group();

        // Base
        const baseGeo = new THREE.CylinderGeometry(params.baseRadius, params.baseRadius, params.baseHeight, 64);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = params.baseHeight / 2;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Stem
        // Calculate smooth connection if possible, for now just simple cylinder
        const stemGeo = new THREE.CylinderGeometry(params.stemRadius, params.stemRadius, params.height, 32);
        const stem = new THREE.Mesh(stemGeo, material);
        stem.position.y = params.baseHeight + (params.height / 2);
        stem.castShadow = true;
        stem.receiveShadow = true;
        group.add(stem);

        // Holder (Top)
        const holderWidth = params.holderWidth;
        const holderDepth = 4; 
        const holderHeight = 1.5;
        const curveSegments = 16;
        
        // Creating a curved holder using a slightly bent Box or Tube would be better,
        // but let's stick to primitives for simplicity in this file-based repair
        
        const topBarGeo = new THREE.BoxGeometry(holderWidth, holderHeight, holderDepth);
        const topBar = new THREE.Mesh(topBarGeo, material);
        topBar.position.y = params.baseHeight + params.height;
        topBar.castShadow = true;
        topBar.receiveShadow = true;
        group.add(topBar);

        // Stoppers (Darker accents)
        const stopperHeight = 2;
        const stopperWidth = 0.8;
        const stopperGeo = new THREE.BoxGeometry(stopperWidth, stopperHeight, holderDepth + 0.5);
        
        const leftStopper = new THREE.Mesh(stopperGeo, darkMaterial);
        leftStopper.position.set(-holderWidth/2 - stopperWidth/2 + 0.2, params.baseHeight + params.height + stopperHeight/2 - 0.5, 0);
        leftStopper.castShadow = true;
        group.add(leftStopper);

        const rightStopper = new THREE.Mesh(stopperGeo, darkMaterial);
        rightStopper.position.set(holderWidth/2 + stopperWidth/2 - 0.2, params.baseHeight + params.height + stopperHeight/2 - 0.5, 0);
        rightStopper.castShadow = true;
        group.add(rightStopper);

        standRef.current = group;
        sceneRef.current.add(group);
    };

    return <div ref={mountRef} className="w-full h-full cursor-move" />;
};

// --- Main App ---
const App = () => {
    const [settings, setSettings] = useState({
        height: 25,
        baseRadius: 6,
        baseHeight: 1.5,
        stemRadius: 1.2,
        holderWidth: 12
    });

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-screen font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto z-10 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] flex flex-col">
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-900">
                            <Icons.Settings className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-bold">Configuration</h2>
                        </div>
                        <p className="text-sm text-gray-500">Tune the dimensions of your stand.</p>
                    </div>

                    <div className="flex-1 p-8 pt-4 space-y-8">
                        <ControlGroup title="Dimensions">
                             <RangeControl 
                                label="Total Height" 
                                value={settings.height} 
                                min={15} max={40} step={0.5} 
                                onChange={(v) => updateSetting('height', v)} 
                            />
                            <RangeControl 
                                label="Stem Thickness" 
                                value={settings.stemRadius} 
                                min={0.5} max={3} step={0.1} 
                                onChange={(v) => updateSetting('stemRadius', v)} 
                            />
                        </ControlGroup>

                        <ControlGroup title="Base">
                            <RangeControl 
                                label="Base Radius" 
                                value={settings.baseRadius} 
                                min={4} max={12} step={0.5} 
                                onChange={(v) => updateSetting('baseRadius', v)} 
                            />
                            <RangeControl 
                                label="Base Height" 
                                value={settings.baseHeight} 
                                min={0.5} max={5} step={0.1} 
                                onChange={(v) => updateSetting('baseHeight', v)} 
                            />
                        </ControlGroup>

                        <ControlGroup title="Holder">
                            <RangeControl 
                                label="Holder Width" 
                                value={settings.holderWidth} 
                                min={8} max={20} step={0.5} 
                                onChange={(v) => updateSetting('holderWidth', v)} 
                            />
                        </ControlGroup>
                    </div>
                    
                    <div className="p-8 pt-0">
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-800">
                            <div className="flex gap-2 items-start">
                                <span className="text-lg">💡</span>
                                <div>
                                    <p className="font-bold mb-1">Design Tip</p>
                                    <p className="opacity-90 leading-relaxed">Ensure the base radius is at least 30% of the total height for optimal stability.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 3D Viewport */}
                <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-200 relative">
                   <Viewer settings={settings} />
                   
                   {/* Overlay Info */}
                   <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-lg">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">View Stats</div>
                        <div className="text-sm font-medium text-gray-700">Volume: Example cm³</div>
                        <div className="text-sm font-medium text-gray-700">Print Time: ~4h 20m</div>
                   </div>
                </main>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
