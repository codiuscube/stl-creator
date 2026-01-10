# STL Creator Project Guide

This specific repository is optimized for creating generative 3D models for the **Bambu Lab A1** 3D printer. Before starting any new project, you must adhere to the following constraints and requirements to ensure a successful, high-quality print.

## 🚨 Required Project Constraints

**Printer Manufacturer**: Bambu Lab
**Printer Model**: A1
**Build Plate Volume**: 256mm x 256mm x 256mm

### Quality Print Guidelines
To ensure all generated STLs print successfully on the A1:

1.  **Build Volume Safety Margin**: Keep maximum dimensions within **250mm x 250mm x 250mm** to avoid edge collisions.
2.  **Orientation**: Design parts to print flat on the build plate whenever possible to minimize supports.
3.  **Overhangs**: Avoid angles steeper than 45 degrees without support considerations.
4.  **Tolerances**: For interlocking parts, include a tolerance gap of at least **0.15mm - 0.2mm**.
5.  **Wall Thickness**: distinctive features should generally be at least **0.8mm - 1.2mm** thick (2-3 walls) for structural integrity.

---

## 🛠 Creating a New Project

New generative projects should be added to `temp_vite/src/projects/`. You can copy `cherry.js` or `headphone.js` as a template.

### Project Structure Checklist

Each project file must export a constant object with the following structure:

```javascript
import * as THREE from 'three';

export const myNewProject = {
    // Unique identifier for the project
    id: 'my-project-id', 
    
    // Display name in the UI
    name: 'My Project Name',

    // Default configuration values (dimensions in cm recommended)
    defaultSettings: {
        radius: 5,
        height: 10,
        // ...
    },

    // Default color hex codes for visualization
    defaultColors: {
        part1: '#ffffff',
        part2: '#000000',
    },

    // UI Controls for the user
    // ENSURE MAX VALUES DO NOT EXCEED BUILD VOLUME (25.6 cm)
    controls: [
        { group: 'Dimensions', items: [
            { key: 'radius', label: 'Radius', min: 1, max: 12, step: 0.1 },
            { key: 'height', label: 'Height', min: 1, max: 24, step: 0.5 }
        ]}
    ],

    // Function to generate the Three.js geometry
    createGeometry: (settings, partColors) => {
        const group = new THREE.Group();
        // ... build your mesh ...
        return group;
    },

    // Function to estimate filament usage
    calculateVolume: (settings) => {
        // Return volume in cm³
        return 0; 
    },

    // Default filename for the exported STL
    exportFilename: 'my-project.stl'
};
```

### 3. Registering Your Project

After creating your project file, you must register it in `temp_vite/src/projects/index.js` for it to appear in the application:

1.  Open `temp_vite/src/projects/index.js`.
2.  Import your project:
    ```javascript
    import { myNewProject } from './my-new-project';
    ```
3.  Add it to the `PROJECTS` export:
    ```javascript
    export const PROJECTS = {
        // ... existing projects
        myNewProject: myNewProject
    };
    ```
