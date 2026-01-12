
import * as THREE from 'three';

export const masterSwordStandProject = {
    id: 'master-sword-stand',
    name: 'Master Sword Phone Stand',

    defaultSettings: {
        // Phone dimensions
        phoneWidth: 8,
        phoneDepth: 1.2,
        // Stand settings
        standAngle: 70, // degrees from horizontal
        standWidth: 10,
        standDepth: 8,
        standHeight: 12,
        lipHeight: 1.5,
        // Sword slot
        swordSlotWidth: 0.8,
        // Print settings
        printLayout: false,
        printPiece: 'all'
    },

    defaultColors: {
        stand: '#4a4a4a',
        lip: '#4a4a4a',
        triforce: '#ffd700',
        sword_blade: '#c0c0c0',
        sword_hilt: '#4b0082',
        sword_guard: '#ffd700'
    },

    controls: [
        {
            group: 'Layout', items: [
                { key: 'printLayout', label: 'Print Layout (Flat)', type: 'boolean' },
                {
                    key: 'printPiece', label: 'Piece to Print', type: 'select', options: [
                        { value: 'all', label: 'All Pieces' },
                        { value: 'stand', label: 'Stand Only' },
                        { value: 'sword', label: 'Sword Only' }
                    ]
                }
            ]
        },
        {
            group: 'Phone Size', items: [
                { key: 'phoneWidth', label: 'Phone Width', min: 6, max: 12, step: 0.5, disabledWhen: { printPiece: 'sword' } },
                { key: 'phoneDepth', label: 'Phone Thickness', min: 0.8, max: 2, step: 0.1, disabledWhen: { printPiece: 'sword' } }
            ]
        },
        {
            group: 'Stand', items: [
                { key: 'standAngle', label: 'Viewing Angle', min: 50, max: 85, step: 5, unit: '°', disabledWhen: { printPiece: 'sword' } },
                { key: 'standWidth', label: 'Stand Width', min: 8, max: 14, step: 0.5, disabledWhen: { printPiece: 'sword' } },
                { key: 'standDepth', label: 'Stand Depth', min: 6, max: 12, step: 0.5, disabledWhen: { printPiece: 'sword' } },
                { key: 'lipHeight', label: 'Lip Height', min: 1, max: 3, step: 0.25, disabledWhen: { printPiece: 'sword' } }
            ]
        }
    ],

    createGeometry: (settings, partColors) => {
        const group = new THREE.Group();

        // Materials
        const standMat = new THREE.MeshStandardMaterial({ color: partColors.stand, roughness: 0.7 });
        const lipMat = new THREE.MeshStandardMaterial({ color: partColors.lip, roughness: 0.7 });
        const triforceMat = new THREE.MeshStandardMaterial({ color: partColors.triforce, metalness: 0.6, roughness: 0.3 });
        const bladeMat = new THREE.MeshStandardMaterial({ color: partColors.sword_blade, metalness: 0.7, roughness: 0.2 });
        const hiltMat = new THREE.MeshStandardMaterial({ color: partColors.sword_hilt, roughness: 0.5 });
        const guardMat = new THREE.MeshStandardMaterial({ color: partColors.sword_guard, metalness: 0.6, roughness: 0.3 });

        const angleRad = (settings.standAngle * Math.PI) / 180;
        const showStand = settings.printPiece === 'all' || settings.printPiece === 'stand';
        const showSword = settings.printPiece === 'all' || settings.printPiece === 'sword';

        // --- 1. THE STAND ---
        const standGroup = new THREE.Group();

        if (showStand) {
            const baseThickness = 1.2;
            const backThickness = 1.5;
            const width = settings.standWidth;
            const depth = settings.standDepth;

            // Base plate
            const baseGeo = new THREE.BoxGeometry(width, baseThickness, depth);
            const base = new THREE.Mesh(baseGeo, standMat);
            base.position.set(0, baseThickness / 2, 0);
            base.name = 'stand';
            standGroup.add(base);

            // Back support (angled)
            const backHeight = settings.standHeight;
            const backGeo = new THREE.BoxGeometry(width, backHeight, backThickness);
            const back = new THREE.Mesh(backGeo, standMat);

            // Position and rotate the back support
            const backZ = -depth / 2 + backThickness / 2;
            back.position.set(0, baseThickness + backHeight / 2 * Math.sin(angleRad), backZ + backHeight / 2 * Math.cos(angleRad) * 0.3);
            back.rotation.x = -(Math.PI / 2 - angleRad);
            back.name = 'stand';
            standGroup.add(back);

            // Front lip to hold phone
            const lipWidth = width;
            const lipDepth = settings.phoneDepth + 1.5;
            const lipGeo = new THREE.BoxGeometry(lipWidth, settings.lipHeight, lipDepth);
            const lip = new THREE.Mesh(lipGeo, lipMat);
            lip.position.set(0, baseThickness + settings.lipHeight / 2, depth / 2 - lipDepth / 2 + 0.5);
            lip.name = 'lip';
            standGroup.add(lip);

            // Phone rest channel (carved into base)
            const channelWidth = settings.phoneWidth + 0.5;
            const channelDepth = settings.phoneDepth + 0.3;
            const channelGeo = new THREE.BoxGeometry(channelWidth, 0.5, channelDepth);
            const channelMat = new THREE.MeshStandardMaterial({ color: partColors.stand, roughness: 0.9 });
            const channel = new THREE.Mesh(channelGeo, channelMat);
            channel.position.set(0, baseThickness + 0.25, depth / 2 - lipDepth + channelDepth / 2 + 0.5);
            standGroup.add(channel);

            // Sword slot in the back (for removable sword)
            const slotWidth = settings.swordSlotWidth + 0.2;
            const slotHeight = 3;
            const slotDepth = backThickness + 0.5;

            // Triforce decoration on the front lip
            const triSize = Math.min(width * 0.25, 2);
            const createTriangle = (size) => {
                const shape = new THREE.Shape();
                shape.moveTo(0, size);
                shape.lineTo(-size * 0.866, -size * 0.5);
                shape.lineTo(size * 0.866, -size * 0.5);
                shape.closePath();
                return shape;
            };

            const triGeo = new THREE.ExtrudeGeometry(createTriangle(triSize * 0.45), { depth: 0.3, bevelEnabled: false });

            // Top triangle
            const tri1 = new THREE.Mesh(triGeo, triforceMat);
            tri1.rotation.x = Math.PI / 2;
            tri1.position.set(0, baseThickness + settings.lipHeight / 2 + triSize * 0.35, depth / 2 + 0.2);
            tri1.name = 'triforce';
            standGroup.add(tri1);

            // Bottom left triangle
            const tri2 = new THREE.Mesh(triGeo, triforceMat);
            tri2.rotation.x = Math.PI / 2;
            tri2.position.set(-triSize * 0.45, baseThickness + settings.lipHeight / 2 - triSize * 0.15, depth / 2 + 0.2);
            tri2.name = 'triforce';
            standGroup.add(tri2);

            // Bottom right triangle
            const tri3 = new THREE.Mesh(triGeo, triforceMat);
            tri3.rotation.x = Math.PI / 2;
            tri3.position.set(triSize * 0.45, baseThickness + settings.lipHeight / 2 - triSize * 0.15, depth / 2 + 0.2);
            tri3.name = 'triforce';
            standGroup.add(tri3);
        }

        // --- 2. THE REMOVABLE SWORD ---
        const swordGroup = new THREE.Group();

        if (showSword) {
            // Sword dimensions - designed to slot into the stand
            const bladeLength = 10;
            const bladeWidth = 1.2;
            const bladeThick = 0.3;
            const hiltLength = 2.5;
            const hiltRadius = 0.3;
            const guardWidth = 3;
            const guardHeight = 0.6;
            const guardDepth = 0.8;
            const pegLength = 2;
            const pegWidth = settings.swordSlotWidth;

            // Insertion peg (goes into the stand slot)
            const pegGeo = new THREE.BoxGeometry(pegWidth, pegLength, pegWidth);
            const peg = new THREE.Mesh(pegGeo, hiltMat);
            peg.position.set(0, -pegLength / 2, 0);
            peg.name = 'sword_hilt';
            swordGroup.add(peg);

            // Guard (cross-guard)
            const guardGeo = new THREE.BoxGeometry(guardWidth, guardHeight, guardDepth);
            const guard = new THREE.Mesh(guardGeo, guardMat);
            guard.position.set(0, guardHeight / 2, 0);
            guard.name = 'sword_guard';
            swordGroup.add(guard);

            // Guard wings (pointed ends)
            const wingGeo = new THREE.ConeGeometry(guardDepth / 2, 0.8, 4);
            const wingL = new THREE.Mesh(wingGeo, guardMat);
            wingL.rotation.z = Math.PI / 2;
            wingL.position.set(-guardWidth / 2 - 0.3, guardHeight / 2, 0);
            wingL.name = 'sword_guard';
            swordGroup.add(wingL);

            const wingR = new THREE.Mesh(wingGeo, guardMat);
            wingR.rotation.z = -Math.PI / 2;
            wingR.position.set(guardWidth / 2 + 0.3, guardHeight / 2, 0);
            wingR.name = 'sword_guard';
            swordGroup.add(wingR);

            // Hilt (handle)
            const hiltGeo = new THREE.CylinderGeometry(hiltRadius, hiltRadius, hiltLength, 8);
            const hilt = new THREE.Mesh(hiltGeo, hiltMat);
            hilt.position.set(0, guardHeight + hiltLength / 2, 0);
            hilt.name = 'sword_hilt';
            swordGroup.add(hilt);

            // Pommel
            const pommelGeo = new THREE.SphereGeometry(hiltRadius * 1.5, 8, 8);
            const pommel = new THREE.Mesh(pommelGeo, guardMat);
            pommel.position.set(0, guardHeight + hiltLength + hiltRadius, 0);
            pommel.name = 'sword_guard';
            swordGroup.add(pommel);

            // Blade
            const bladeShape = new THREE.Shape();
            bladeShape.moveTo(0, 0);
            bladeShape.lineTo(-bladeWidth / 2, 0);
            bladeShape.lineTo(-bladeWidth / 2, bladeLength * 0.85);
            bladeShape.lineTo(0, bladeLength);
            bladeShape.lineTo(bladeWidth / 2, bladeLength * 0.85);
            bladeShape.lineTo(bladeWidth / 2, 0);
            bladeShape.closePath();

            const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: bladeThick, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
            const blade = new THREE.Mesh(bladeGeo, bladeMat);
            blade.rotation.x = -Math.PI / 2;
            blade.position.set(0, -bladeLength - guardHeight / 2, bladeThick / 2);
            blade.name = 'sword_blade';
            swordGroup.add(blade);

            // Blade center ridge
            const ridgeGeo = new THREE.BoxGeometry(0.15, bladeLength * 0.8, bladeThick + 0.1);
            const ridge = new THREE.Mesh(ridgeGeo, bladeMat);
            ridge.position.set(0, -bladeLength * 0.45 - guardHeight / 2, 0);
            ridge.name = 'sword_blade';
            swordGroup.add(ridge);

            // Small triforce on the blade
            const miniTriSize = 0.3;
            const miniTriShape = new THREE.Shape();
            miniTriShape.moveTo(0, miniTriSize);
            miniTriShape.lineTo(-miniTriSize * 0.866, -miniTriSize * 0.5);
            miniTriShape.lineTo(miniTriSize * 0.866, -miniTriSize * 0.5);
            miniTriShape.closePath();

            const miniTriGeo = new THREE.ExtrudeGeometry(miniTriShape, { depth: 0.1, bevelEnabled: false });
            const miniTri = new THREE.Mesh(miniTriGeo, triforceMat);
            miniTri.position.set(0, -2, bladeThick / 2 + 0.1);
            miniTri.name = 'triforce';
            swordGroup.add(miniTri);
        }

        // --- 3. ASSEMBLY ---
        if (settings.printLayout) {
            // Print layout: pieces laid flat
            if (showStand) {
                standGroup.rotation.x = -Math.PI / 2;
                standGroup.position.set(showSword ? -8 : 0, settings.standDepth / 2, 0);
                group.add(standGroup);
            }
            if (showSword) {
                // Sword laid flat
                swordGroup.rotation.z = Math.PI / 2;
                swordGroup.position.set(showStand ? 6 : 0, 0.3, 0);
                group.add(swordGroup);
            }
        } else {
            // Display mode: assembled view
            if (showStand) {
                standGroup.position.set(0, 0, 0);
                group.add(standGroup);
            }
            if (showSword) {
                // Sword inserted in stand slot (pointing down, blade faces front)
                const slotY = 1.2 + settings.standHeight * 0.7;
                const slotZ = -settings.standDepth / 2 + 1;
                swordGroup.position.set(0, slotY, slotZ);
                swordGroup.rotation.x = Math.PI; // Flip so blade points down behind stand
                group.add(swordGroup);
            }
        }

        return group;
    },

    calculateVolume: (settings) => {
        const baseVol = settings.standWidth * 1.2 * settings.standDepth;
        const backVol = settings.standWidth * settings.standHeight * 1.5 * 0.5;
        const lipVol = settings.standWidth * settings.lipHeight * (settings.phoneDepth + 1.5);
        const swordVol = 15; // Approximate
        return baseVol + backVol + lipVol + swordVol;
    },

    exportFilename: 'master-sword-stand.stl'
};
