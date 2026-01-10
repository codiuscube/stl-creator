import * as THREE from 'three';

export const headphoneProject = {
    id: 'headphone',
    name: 'Headphone Stand',

    // Headphone stand dimensions (in cm) - fits Bambu Lab A1 (256x256x256mm)
    // Total height ~25cm, base ~12cm diameter, fits over-ear headphones
    defaultSettings: {
        height: 22,
        baseRadius: 6,
        baseHeight: 1.2,
        stemRadius: 1.5,
        holderWidth: 14
    },

    defaultColors: {
        base: '#475569',
        stem: '#475569',
        holder: '#475569',
        stoppers: '#334155'
    },

    // Max values constrained to Bambu Lab A1 build volume (256mm)
    controls: [
        { group: 'Dimensions', items: [
            { key: 'height', label: 'Total Height', min: 10, max: 24, step: 0.5 },
            { key: 'stemRadius', label: 'Stem Thickness', min: 0.5, max: 3, step: 0.1 }
        ]},
        { group: 'Base', items: [
            { key: 'baseRadius', label: 'Base Radius', min: 4, max: 12, step: 0.5 },
            { key: 'baseHeight', label: 'Base Height', min: 0.5, max: 3, step: 0.1 }
        ]},
        { group: 'Holder', items: [
            { key: 'holderWidth', label: 'Holder Width', min: 8, max: 24, step: 0.5 }
        ]}
    ],

    createGeometry: (settings, partColors) => {
        const group = new THREE.Group();

        const baseMaterial = new THREE.MeshStandardMaterial({ color: partColors.base, roughness: 0.4, metalness: 0.1 });
        const stemMaterial = new THREE.MeshStandardMaterial({ color: partColors.stem, roughness: 0.4, metalness: 0.1 });
        const holderMaterial = new THREE.MeshStandardMaterial({ color: partColors.holder, roughness: 0.4, metalness: 0.1 });
        const stopperMaterial = new THREE.MeshStandardMaterial({ color: partColors.stoppers, roughness: 0.4, metalness: 0.1 });

        // Base
        const baseGeo = new THREE.CylinderGeometry(settings.baseRadius, settings.baseRadius, settings.baseHeight, 64);
        const base = new THREE.Mesh(baseGeo, baseMaterial);
        base.name = 'base';
        base.position.y = settings.baseHeight / 2;
        group.add(base);

        // Stem
        const stemGeo = new THREE.CylinderGeometry(settings.stemRadius, settings.stemRadius, settings.height, 32);
        const stem = new THREE.Mesh(stemGeo, stemMaterial);
        stem.name = 'stem';
        stem.position.y = settings.baseHeight + (settings.height / 2);
        group.add(stem);

        // Holder (Top)
        const topBarGeo = new THREE.BoxGeometry(settings.holderWidth, 1.5, 4);
        const topBar = new THREE.Mesh(topBarGeo, holderMaterial);
        topBar.name = 'holder';
        topBar.position.y = settings.baseHeight + settings.height;
        group.add(topBar);

        // Stoppers
        const stopperGeo = new THREE.BoxGeometry(0.8, 2, 4.5);
        const leftStopper = new THREE.Mesh(stopperGeo, stopperMaterial);
        leftStopper.name = 'stoppers';
        leftStopper.position.set(-settings.holderWidth / 2 - 0.2, settings.baseHeight + settings.height + 0.5, 0);
        group.add(leftStopper);

        const rightStopper = new THREE.Mesh(stopperGeo, stopperMaterial.clone());
        rightStopper.name = 'stoppers';
        rightStopper.position.set(settings.holderWidth / 2 + 0.2, settings.baseHeight + settings.height + 0.5, 0);
        group.add(rightStopper);

        return group;
    },

    calculateVolume: (settings) => {
        // All values in cm, result in cm³
        const baseVolume = Math.PI * Math.pow(settings.baseRadius, 2) * settings.baseHeight;
        const stemVolume = Math.PI * Math.pow(settings.stemRadius, 2) * settings.height;
        const topBarVolume = settings.holderWidth * 1.5 * 4;
        const stopperVolume = 0.8 * 2 * 4.5 * 2;
        return baseVolume + stemVolume + topBarVolume + stopperVolume;
    },

    exportFilename: 'headphone-stand.stl'
};
