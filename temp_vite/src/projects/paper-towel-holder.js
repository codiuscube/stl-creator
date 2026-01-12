import * as THREE from 'three';

export const paperTowelHolderProject = {
    id: 'paper-towel-holder',
    name: 'Paper Towel Holder',

    // Traditional under-cabinet paper towel holder - MULTI-PIECE DESIGN
    // Prints as 3 separate pieces: 2 brackets + 1 rod
    // Dimensions in cm - standard paper towel roll is ~28cm wide
    defaultSettings: {
        rodLength: 30,          // Length of horizontal rod (paper towel width + clearance)
        rodDiameter: 2.0,       // Diameter of the rod
        armHeight: 5,           // Height of the support arms
        armWidth: 4,            // Width of support arms
        armThickness: 1.2,      // Thickness of arms
        mountWidth: 6,          // Width of mounting plate
        mountDepth: 6,          // Depth of mounting plate
        mountThickness: 0.6,    // Thickness of mounting plate
        holeDiameter: 0.45,     // Screw hole diameter
        holeInset: 1.2,         // Distance from edge to screw hole center
        socketDepth: 1.5,       // How deep the rod inserts into bracket
        tolerance: 0.15         // Fit tolerance for rod-to-socket connection
    },

    defaultColors: {
        mount: '#475569',
        arms: '#475569',
        rod: '#64748b'
    },

    controls: [
        {
            group: 'Rod', items: [
                { key: 'rodLength', label: 'Rod Length', min: 25, max: 35, step: 0.5 },
                { key: 'rodDiameter', label: 'Rod Diameter', min: 1.5, max: 3, step: 0.1 }
            ]
        },
        {
            group: 'Arms', items: [
                { key: 'armHeight', label: 'Arm Height', min: 3, max: 8, step: 0.5 },
                { key: 'armWidth', label: 'Arm Width', min: 3, max: 6, step: 0.5 },
                { key: 'armThickness', label: 'Arm Thickness', min: 1, max: 2, step: 0.1 }
            ]
        },
        {
            group: 'Mounting', items: [
                { key: 'mountWidth', label: 'Mount Width', min: 4, max: 10, step: 0.5 },
                { key: 'mountDepth', label: 'Mount Depth', min: 4, max: 10, step: 0.5 },
                { key: 'mountThickness', label: 'Mount Thickness', min: 0.4, max: 1.2, step: 0.1 },
                { key: 'holeDiameter', label: 'Screw Hole Diameter', min: 0.3, max: 0.6, step: 0.05 }
            ]
        },
        {
            group: 'Assembly', items: [
                { key: 'socketDepth', label: 'Socket Depth', min: 1, max: 2.5, step: 0.1 },
                { key: 'tolerance', label: 'Fit Tolerance', min: 0.1, max: 0.3, step: 0.05 }
            ]
        }
    ],

    createGeometry: (settings, partColors) => {
        const group = new THREE.Group();

        const mountMaterial = new THREE.MeshStandardMaterial({
            color: partColors.mount,
            roughness: 0.4,
            metalness: 0.1
        });
        const armMaterial = new THREE.MeshStandardMaterial({
            color: partColors.arms,
            roughness: 0.4,
            metalness: 0.1
        });
        const rodMaterial = new THREE.MeshStandardMaterial({
            color: partColors.rod,
            roughness: 0.3,
            metalness: 0.2
        });

        // Layout pieces on build plate - spread apart for visualization
        const spacing = 3; // Gap between pieces

        // === LEFT BRACKET ===
        const leftBracket = createBracketWithSocket(settings, mountMaterial, armMaterial, false);
        leftBracket.position.set(-10, 0, -5);
        leftBracket.name = 'mount';
        group.add(leftBracket);

        // === RIGHT BRACKET ===
        const rightBracket = createBracketWithSocket(settings, mountMaterial, armMaterial, true);
        rightBracket.position.set(10, 0, -5);
        rightBracket.name = 'mount';
        group.add(rightBracket);

        // === ROD (with insertion pegs) ===
        const rod = createRodWithPegs(settings, rodMaterial);
        rod.position.set(0, settings.rodDiameter / 2, 8);
        rod.name = 'rod';
        group.add(rod);

        return group;
    },

    calculateVolume: (settings) => {
        // Mount plates (2)
        const mountVol = settings.mountWidth * settings.mountDepth * settings.mountThickness * 2;
        // Screw hole subtraction (4 holes per bracket = 8 total)
        const holeVol = Math.PI * Math.pow(settings.holeDiameter / 2, 2) * settings.mountThickness * 8;
        // Arms (2)
        const armVol = settings.armWidth * settings.armHeight * settings.armThickness * 2;
        // Socket holes subtraction
        const socketVol = Math.PI * Math.pow(settings.rodDiameter / 2, 2) * settings.socketDepth * 2;
        // Rod
        const rodVol = Math.PI * Math.pow(settings.rodDiameter / 2, 2) * settings.rodLength;
        // Insertion pegs on rod
        const pegRadius = settings.rodDiameter / 2 - settings.tolerance;
        const pegVol = Math.PI * Math.pow(pegRadius, 2) * settings.socketDepth * 2;

        return mountVol - holeVol + armVol - socketVol + rodVol + pegVol;
    },

    exportFilename: 'paper-towel-holder.stl'
};

// Creates a bracket with socket hole for rod insertion
function createBracketWithSocket(settings, mountMaterial, armMaterial, isRight) {
    const bracket = new THREE.Group();

    // === MOUNTING PLATE ===
    const plateShape = new THREE.Shape();
    const pw = settings.mountWidth;
    const pd = settings.mountDepth;
    const radius = 0.3;

    // Rounded rectangle
    plateShape.moveTo(-pw / 2 + radius, -pd / 2);
    plateShape.lineTo(pw / 2 - radius, -pd / 2);
    plateShape.quadraticCurveTo(pw / 2, -pd / 2, pw / 2, -pd / 2 + radius);
    plateShape.lineTo(pw / 2, pd / 2 - radius);
    plateShape.quadraticCurveTo(pw / 2, pd / 2, pw / 2 - radius, pd / 2);
    plateShape.lineTo(-pw / 2 + radius, pd / 2);
    plateShape.quadraticCurveTo(-pw / 2, pd / 2, -pw / 2, pd / 2 - radius);
    plateShape.lineTo(-pw / 2, -pd / 2 + radius);
    plateShape.quadraticCurveTo(-pw / 2, -pd / 2, -pw / 2 + radius, -pd / 2);

    // Screw holes at corners
    const holeRadius = settings.holeDiameter / 2;
    const holeX = pw / 2 - settings.holeInset;
    const holeZ = pd / 2 - settings.holeInset;

    [[-holeX, -holeZ], [holeX, -holeZ], [-holeX, holeZ], [holeX, holeZ]].forEach(([x, z]) => {
        const hole = new THREE.Path();
        hole.absarc(x, z, holeRadius, 0, Math.PI * 2);
        plateShape.holes.push(hole);
    });

    const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
        depth: settings.mountThickness,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2
    });

    // Plate lies flat on build plate (XZ plane at Y=0)
    plateGeo.rotateX(-Math.PI / 2);
    const plate = new THREE.Mesh(plateGeo, mountMaterial);
    plate.position.y = settings.mountThickness / 2;
    plate.name = 'mount';
    bracket.add(plate);

    // === SUPPORT ARM ===
    const armGeo = new THREE.BoxGeometry(
        settings.armWidth,
        settings.armHeight,
        settings.armThickness
    );
    const arm = new THREE.Mesh(armGeo, armMaterial);
    arm.name = 'arms';
    arm.position.set(
        0,
        settings.mountThickness + settings.armHeight / 2,
        pd / 2 - settings.armThickness / 2
    );
    bracket.add(arm);

    // === SOCKET RING (ring/tube shape with hole for rod) ===
    // Create a ring using a shape with a hole, then extrude
    const socketOuterRadius = settings.rodDiameter / 2 + 0.5; // Wall thickness
    const socketInnerRadius = settings.rodDiameter / 2 + settings.tolerance; // Hole for rod
    const socketLength = settings.socketDepth + 0.3;

    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, socketOuterRadius, 0, Math.PI * 2, false);
    const ringHole = new THREE.Path();
    ringHole.absarc(0, 0, socketInnerRadius, 0, Math.PI * 2, true);
    ringShape.holes.push(ringHole);

    const socketGeo = new THREE.ExtrudeGeometry(ringShape, {
        depth: socketLength,
        bevelEnabled: false
    });

    // Rotate so the hole points along X axis (inward toward center)
    socketGeo.rotateY(Math.PI / 2);

    const socket = new THREE.Mesh(socketGeo, armMaterial);
    socket.name = 'arms';

    // Position at bottom of arm
    const socketY = settings.mountThickness + settings.armHeight - socketOuterRadius - 0.3;
    const socketZ = pd / 2 - settings.armThickness / 2;
    // Position so socket extends inward from the arm
    const socketX = isRight ? 0 : -socketLength;

    socket.position.set(socketX, socketY, socketZ);
    bracket.add(socket);

    // Mirror the right bracket
    if (isRight) {
        bracket.scale.x = -1;
    }

    return bracket;
}

// Creates the rod with insertion pegs on each end
function createRodWithPegs(settings, material) {
    const rod = new THREE.Group();

    // Main rod body
    const mainLength = settings.rodLength - (settings.socketDepth * 2);
    const rodGeo = new THREE.CylinderGeometry(
        settings.rodDiameter / 2,
        settings.rodDiameter / 2,
        mainLength,
        32
    );
    rodGeo.rotateZ(Math.PI / 2); // Horizontal along X axis
    const mainRod = new THREE.Mesh(rodGeo, material);
    mainRod.name = 'rod';
    rod.add(mainRod);

    // Insertion pegs (slightly smaller diameter for fit)
    const pegRadius = settings.rodDiameter / 2 - settings.tolerance;
    const pegLength = settings.socketDepth;

    // Left peg
    const leftPegGeo = new THREE.CylinderGeometry(pegRadius, pegRadius, pegLength, 32);
    leftPegGeo.rotateZ(Math.PI / 2);
    const leftPeg = new THREE.Mesh(leftPegGeo, material);
    leftPeg.name = 'rod';
    leftPeg.position.x = -(mainLength / 2 + pegLength / 2);
    rod.add(leftPeg);

    // Right peg
    const rightPegGeo = new THREE.CylinderGeometry(pegRadius, pegRadius, pegLength, 32);
    rightPegGeo.rotateZ(Math.PI / 2);
    const rightPeg = new THREE.Mesh(rightPegGeo, material);
    rightPeg.name = 'rod';
    rightPeg.position.x = mainLength / 2 + pegLength / 2;
    rod.add(rightPeg);

    return rod;
}
