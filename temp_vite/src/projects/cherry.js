import * as THREE from 'three';

export const cherryProject = {
    id: 'cherry',
    name: 'Cherry Ornament',

    // Cherry ornament dimensions (in cm) - fits Bambu Lab A1 (256x256x256mm)
    // Real cherries are ~2-3cm diameter, ornament ~6-8cm total height
    defaultSettings: {
        cherryRadius: 0.85,
        cherrySpacing: 1.5,
        stemLength: 1.875,
        stemThickness: 0.11249999999999999,
        capRadius: 0.375,
        capHeight: 0.30000000000000004,
        loopSize: 0.30000000000000004
    },

    defaultColors: {
        cherry: '#8B0000',
        stem: '#2d5016',
        cap: '#d4af37',
        loop: '#d4af37'
    },

    controls: [
        {
            group: 'Cherries', items: [
                { key: 'cherryRadius', label: 'Cherry Size', min: 0.8, max: 2.5, step: 0.1 },
                { key: 'cherrySpacing', label: 'Cherry Spacing', min: 1, max: 4, step: 0.1 }
            ]
        },
        {
            group: 'Stems', items: [
                { key: 'stemLength', label: 'Stem Length', min: 1.5, max: 5, step: 0.1 },
                { key: 'stemThickness', label: 'Stem Thickness', min: 0.08, max: 0.3, step: 0.02 }
            ]
        },
        {
            group: 'Ornament Cap', items: [
                { key: 'capRadius', label: 'Cap Size', min: 0.3, max: 1, step: 0.05 },
                { key: 'capHeight', label: 'Cap Height', min: 0.2, max: 0.8, step: 0.05 },
                { key: 'loopSize', label: 'Hanging Loop', min: 0.2, max: 0.8, step: 0.05 }
            ]
        }
    ],

    createGeometry: (settings, partColors) => {
        const group = new THREE.Group();

        const cherryMaterial = new THREE.MeshStandardMaterial({
            color: partColors.cherry,
            roughness: 0.15,
            metalness: 0.1
        });

        const stemMaterial = new THREE.MeshStandardMaterial({
            color: partColors.stem,
            roughness: 0.6,
            metalness: 0
        });

        const capMaterial = new THREE.MeshStandardMaterial({
            color: partColors.cap,
            roughness: 0.3,
            metalness: 0.8
        });

        const loopMaterial = new THREE.MeshStandardMaterial({
            color: partColors.loop,
            roughness: 0.3,
            metalness: 0.8
        });

        const halfSpacing = settings.cherrySpacing / 2;

        // Left cherry
        const cherry1Geo = new THREE.SphereGeometry(settings.cherryRadius, 32, 32);
        const cherry1 = new THREE.Mesh(cherry1Geo, cherryMaterial);
        cherry1.name = 'cherry';
        cherry1.position.set(-halfSpacing, settings.cherryRadius, 0);
        group.add(cherry1);

        // Left cherry dimple
        const dimple1Geo = new THREE.SphereGeometry(settings.cherryRadius * 0.12, 16, 16);
        const dimple1 = new THREE.Mesh(dimple1Geo, cherryMaterial);
        dimple1.name = 'cherry';
        dimple1.position.set(-halfSpacing, settings.cherryRadius * 0.08, 0);
        dimple1.scale.y = 0.3;
        group.add(dimple1);

        // Right cherry
        const cherry2Geo = new THREE.SphereGeometry(settings.cherryRadius, 32, 32);
        const cherry2 = new THREE.Mesh(cherry2Geo, cherryMaterial);
        cherry2.name = 'cherry';
        cherry2.position.set(halfSpacing, settings.cherryRadius, 0);
        group.add(cherry2);

        // Right cherry dimple
        const dimple2Geo = new THREE.SphereGeometry(settings.cherryRadius * 0.12, 16, 16);
        const dimple2 = new THREE.Mesh(dimple2Geo, cherryMaterial);
        dimple2.name = 'cherry';
        dimple2.position.set(halfSpacing, settings.cherryRadius * 0.08, 0);
        dimple2.scale.y = 0.3;
        group.add(dimple2);

        // Stem junction point (where both stems meet)
        const junctionY = settings.cherryRadius * 2 + settings.stemLength;

        // Left stem - curves from left cherry to center junction
        const stem1Curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-halfSpacing, settings.cherryRadius * 2, 0),
            new THREE.Vector3(-halfSpacing * 0.7, settings.cherryRadius * 2 + settings.stemLength * 0.3, 0),
            new THREE.Vector3(-halfSpacing * 0.3, settings.cherryRadius * 2 + settings.stemLength * 0.6, 0),
            new THREE.Vector3(0, junctionY, 0)
        ]);
        const stem1Geo = new THREE.TubeGeometry(stem1Curve, 20, settings.stemThickness, 8, false);
        const stem1 = new THREE.Mesh(stem1Geo, stemMaterial);
        stem1.name = 'stem';
        group.add(stem1);

        // Right stem - curves from right cherry to center junction
        const stem2Curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(halfSpacing, settings.cherryRadius * 2, 0),
            new THREE.Vector3(halfSpacing * 0.7, settings.cherryRadius * 2 + settings.stemLength * 0.3, 0),
            new THREE.Vector3(halfSpacing * 0.3, settings.cherryRadius * 2 + settings.stemLength * 0.6, 0),
            new THREE.Vector3(0, junctionY, 0)
        ]);
        const stem2Geo = new THREE.TubeGeometry(stem2Curve, 20, settings.stemThickness, 8, false);
        const stem2 = new THREE.Mesh(stem2Geo, stemMaterial);
        stem2.name = 'stem';
        group.add(stem2);

        // Main stem going up from junction
        const mainStemCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, junctionY, 0),
            new THREE.Vector3(0, junctionY + settings.stemLength * 0.3, 0)
        ]);
        const mainStemGeo = new THREE.TubeGeometry(mainStemCurve, 8, settings.stemThickness, 8, false);
        const mainStem = new THREE.Mesh(mainStemGeo, stemMaterial);
        mainStem.name = 'stem';
        group.add(mainStem);

        // Cap position
        const capY = junctionY + settings.stemLength * 0.3;

        // Main cap cylinder
        const capGeo = new THREE.CylinderGeometry(
            settings.capRadius * 0.7,
            settings.capRadius,
            settings.capHeight,
            16
        );
        const cap = new THREE.Mesh(capGeo, capMaterial);
        cap.name = 'cap';
        cap.position.y = capY + settings.capHeight / 2;
        group.add(cap);

        // Decorative ring around cap base
        const ringGeo = new THREE.TorusGeometry(settings.capRadius * 1.1, settings.capRadius * 0.15, 8, 24);
        const ring = new THREE.Mesh(ringGeo, capMaterial);
        ring.name = 'cap';
        ring.rotation.x = Math.PI / 2;
        ring.position.y = capY;
        group.add(ring);

        // Top decorative ring
        const topRingGeo = new THREE.TorusGeometry(settings.capRadius * 0.5, settings.capRadius * 0.1, 8, 24);
        const topRing = new THREE.Mesh(topRingGeo, capMaterial);
        topRing.name = 'cap';
        topRing.rotation.x = Math.PI / 2;
        topRing.position.y = capY + settings.capHeight;
        group.add(topRing);

        // Hanging loop
        const loopGeo = new THREE.TorusGeometry(settings.loopSize, settings.loopSize * 0.2, 8, 24);
        const loop = new THREE.Mesh(loopGeo, loopMaterial);
        loop.name = 'loop';
        loop.position.y = capY + settings.capHeight + settings.loopSize;
        group.add(loop);

        // Connector between cap and loop
        const connectorGeo = new THREE.CylinderGeometry(
            settings.loopSize * 0.15,
            settings.loopSize * 0.2,
            settings.loopSize * 0.5,
            8
        );
        const connector = new THREE.Mesh(connectorGeo, loopMaterial);
        connector.name = 'loop';
        connector.position.y = capY + settings.capHeight + settings.loopSize * 0.25;
        group.add(connector);

        return group;
    },

    calculateVolume: (settings) => {
        // All values in cm, result in cm³
        // Two cherry spheres
        const cherryVolume = 2 * (4 / 3) * Math.PI * Math.pow(settings.cherryRadius, 3);

        // Stems (approximate)
        const stemVolume = 3 * Math.PI * Math.pow(settings.stemThickness, 2) * settings.stemLength;

        // Cap
        const capVolume = Math.PI * Math.pow(settings.capRadius * 0.85, 2) * settings.capHeight;

        // Loop
        const loopVolume = 2 * Math.PI * Math.PI * Math.pow(settings.loopSize * 0.2, 2) * settings.loopSize;

        return cherryVolume + stemVolume + capVolume + loopVolume;
    },

    exportFilename: 'new-braunfels-cherry-ornament.stl'
};
