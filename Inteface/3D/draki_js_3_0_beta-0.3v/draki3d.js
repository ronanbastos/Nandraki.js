import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as UI from './ui.js';

// --- Scene Serialization and Asset Management Constants ---
const MAX_ASSET_SIZE = 50 * 1024 * 1024; // 50 MB
const CONCURRENT_LOADS = 3;
const ENGINE_VERSION = "0.1.0"; // Define engine version
const PLACEHOLDER_MESH = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1), 
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
PLACEHOLDER_MESH.name = "Placeholder";


// Default script for joystick movement. This runs every frame while the game is playing.
// This script implements camera-relative movement on the XZ plane to prevent inverted controls.
const DEFAULT_JOYSTICK_SCRIPT = `
// self = UI component config (including self.vector and self.targetObjectName)
// drak = global drak wrapper
// THREE = Three.js library

if (self.targetObjectName && drak(self.targetObjectName)) {
    const target = drak(self.targetObjectName).object();
    
    // Check if the object exists and has position property
    if (target && target.position) {
        // Movement speed scale, adjust as needed
        const speed = 0.05; 
        
        // Get normalized joystick input
        const vx = self.vector.x; // Strafe input (Left/Right)
        const vy = self.vector.y; // Forward/Backward input (Up/Down, Positive = Up/Forward)
        
        // --- Calculate Camera-Relative Movement on XZ plane ---
        
        // 1. Get the camera used for rendering
        const camera = drak().camera();
        
        // 2. Get the camera's forward direction vector (in world space)
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        
        // 3. Project onto XZ plane and normalize (assuming Y is 'up')
        forward.y = 0;
        forward.normalize();
        
        // 4. Calculate the camera's right vector (orthogonal to forward, on XZ plane)
        // Cross product with World UP (0, 1, 0)
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));
        
        // 5. Calculate total movement vector
        const moveVector = new THREE.Vector3();
        
        // Forward/Backward movement: 
        // Joystick UP results in positive vy. To move forward (along 'forward' vector), we use +vy.
        moveVector.addScaledVector(forward, vy); 
        
        // Strafe movement: 
        // Joystick RIGHT results in positive vx. To move right (along 'right' vector), we use vx.
        moveVector.addScaledVector(right, vx);
        
        // 6. Apply final scaled movement to the target object's position
        target.position.x += moveVector.x * speed;
        target.position.z += moveVector.z * speed;
    }
}
`;


// --- New Script Component Class ---
export class ScriptComponent {
    constructor(scriptText = '// Use `self` to access this object\n// Example: self.rotation.y += 0.01;') {
        this.scriptText = scriptText;
        this.update = null;
        this.lastError = null;
        this.compile();
    }

    setScript(scriptText) {
        this.scriptText = scriptText;
        this.compile();
    }

    compile() {
        try {
            // The user script has access to 'self' (the object it's attached to),
            // and other globals like drak, hud, THREE, and animax.
            const scriptFunction = new Function('self', 'drak', 'hud', 'THREE', 'animax', this.scriptText);
            
            // The component's update method will call this compiled function.
            this.update = (object) => {
                scriptFunction(object, drak, hud, THREE, animax);
            };
            this.lastError = null; // Clear last error on successful compile
        } catch (e) {
            console.error("Error compiling object script:", e);
            this.lastError = e.message;
            this.update = () => {}; // If script has errors, the update function does nothing.
        }
    }
}

// --- Asset Worker Manager ---
class AssetWorkerManager {
    constructor() {
        // Create the worker from a blob URL for easy inlining
        const workerCode = `
            self.onmessage = async function(e) {
                const { id, type, data, hash, chunkSize } = e.data;

                if (type === 'DECODE_AND_VALIDATE') {
                    try {
                        // data is the base64 string
                        const buffer = decodeBase64(data);
                        
                        const calculatedHash = await calculateHash(buffer);
                        
                        if (hash && calculatedHash !== hash) {
                             throw new Error(\`Hash mismatch: Expected \${hash}, got \${calculatedHash}\`);
                        }

                        // Transfer decoded buffer back to main thread
                        self.postMessage({ id, status: 'complete', buffer }, [buffer]);
                    } catch (error) {
                        self.postMessage({ id, status: 'error', message: error.message });
                    }
                } else if (type === 'CALCULATE_HASH') {
                     try {
                        // data is the ArrayBuffer
                        const calculatedHash = await calculateHash(data);
                        // Transfer buffer ownership back (though it might be consumed by calculateHash depending on implementation)
                        self.postMessage({ id, status: 'complete', hash: calculatedHash }); 
                     } catch (error) {
                         self.postMessage({ id, status: 'error', message: error.message });
                     }
                }
            };

            async function calculateHash(buffer) {
                if (typeof crypto === 'undefined' || !crypto.subtle) {
                    throw new Error("Crypto API not available.");
                }
                const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return \`sha256:\${hashHex}\`;
            }

            function decodeBase64(base64) {
                const binaryString = atob(base64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
            }
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        
        this.taskQueue = new Map(); // Maps taskId to resolve/reject functions
        this.taskIdCounter = 0;

        this.worker.onmessage = (e) => {
            const { id, status, buffer, hash, message } = e.data;
            const task = this.taskQueue.get(id);
            if (!task) return;

            if (status === 'complete') {
                if (buffer) {
                    task.resolve({ buffer });
                } else if (hash) {
                    task.resolve({ hash });
                }
            } else if (status === 'error') {
                task.reject(new Error(message || 'Worker processing failed.'));
            }
            this.taskQueue.delete(id);
        };
        
        this.worker.onerror = (e) => {
             console.error("Worker error:", e);
        }
    }
    
    /** 
     * Posts a task to the worker. Handles buffer transfer ownership.
     * @param {string} type 
     * @param {*} data ArrayBuffer or string
     * @param {string} [hash=null] Expected hash for validation
     * @returns {Promise<{buffer?: ArrayBuffer, hash?: string}>}
     */
    _postTask(type, data, hash = null) {
        const id = this.taskIdCounter++;
        return new Promise((resolve, reject) => {
            this.taskQueue.set(id, { resolve, reject });
            
            let transferables = [];
            if (data instanceof ArrayBuffer) {
                transferables = [data]; // Transfer buffer ownership
            }
            
            this.worker.postMessage({ id, type, data, hash }, transferables);
        });
    }

    /** Calculates SHA-256 hash of a buffer. Transfers ownership of the buffer. */
    calculateHash(buffer) {
        return this._postTask('CALCULATE_HASH', buffer);
    }
    
    /** Decodes base64 string, validates hash, and returns ArrayBuffer. */
    decodeBase64AndValidate(base64Data, hash) {
        return this._postTask('DECODE_AND_VALIDATE', base64Data, hash);
    }
}

const workerManager = new AssetWorkerManager();

/**
 * Responsible for identifying and serializing/deserializing asset data (geometry, textures, models).
 */
class AssetManager {
    constructor() {
        // Key: hash (sha256:...), Value: { assetId, buffer/url, type, mimeType, ...}
        this.assetIndex = new Map(); 
        
        // Load management
        this.activeLoads = new Set(); // Tracks active asset loading promises
        this.loadQueue = [];
        this.concurrentLoads = CONCURRENT_LOADS;
        
        // Internal cache for loaded resources (THREE objects)
        this.loadedResources = new Map(); // Key: assetId, Value: THREE.Object3D | THREE.Texture | THREE.Material
        
        this.assetIdCounter = 0;
    }
    
    clear() {
        this.assetIndex.clear();
        this.loadedResources.clear();
        this.loadQueue = [];
        this.activeLoads.clear();
        this.assetIdCounter = 0;
    }

    /**
     * Determines the asset data and registers it in the index, waiting for hashing.
     * @param {string} mimeType
     * @param {ArrayBuffer} buffer
     * @param {string} externalUrl Optional URL for external assets
     * @returns {Promise<{assetId: string, hash: string, size: number, mode: 'embedded'|'external'}>}
     */
    async registerAssetFromBuffer(mimeType, buffer, externalUrl = null, assetIdHint = null) {
        const size = buffer.byteLength;

        // 1. Calculate Hash in Worker (must copy buffer for transfer)
        const bufferCopy = buffer.slice(0); 
        const { hash } = await workerManager.calculateHash(bufferCopy);
        
        // 2. Deduplicate
        if (this.assetIndex.has(hash)) {
            const existing = this.assetIndex.get(hash);
            return { assetId: existing.assetId, hash, size, mode: existing.url ? 'external' : 'embedded' };
        }

        // 3. Create new entry
        const assetId = assetIdHint || `asset_${this.assetIdCounter++}`;
        
        let mode;
        let data = null;
        let url = null;
        
        if (externalUrl) {
            mode = 'external';
            url = externalUrl;
        } else if (size > MAX_ASSET_SIZE) {
             // Force externalization warning
             mode = 'embedded'; // We still embed locally for now, but log warning
             console.warn(`Asset ${assetId} size (${size} bytes) exceeds MAX_ASSET_SIZE (${MAX_ASSET_SIZE}). Embedding anyway.`);
             // Fall through to embedding logic
        } else {
             mode = 'embedded';
        }
        
        // If embedded, convert ArrayBuffer to Base64
        if (mode === 'embedded') {
             const binary = Array.prototype.map.call(new Uint8Array(buffer), (byte) => 
                 String.fromCharCode(byte)
             ).join('');
             data = btoa(binary);
        }

        const descriptor = {
            assetId,
            mimeType,
            hash,
            size,
            url: url,
            data: data, // Base64 data for embedded
        };
        
        this.assetIndex.set(hash, descriptor);
        
        return { assetId, hash, size, mode: mode };
    }
    
    // --- Load Process Management ---

    /**
     * Queues an asset for loading and returns a promise for the loaded resource.
     */
    queueAssetLoad(descriptor) {
        const { assetId } = descriptor;
        
        if (this.loadedResources.has(assetId)) {
            return Promise.resolve(this.loadedResources.get(assetId));
        }

        return new Promise((resolve, reject) => {
            this.loadQueue.push({ assetId, descriptor, resolve, reject, startTime: Date.now() });
            this.processLoadQueue();
        });
    }

    processLoadQueue() {
        if (this.activeLoads.size >= this.concurrentLoads || this.loadQueue.length === 0) {
            return;
        }

        const task = this.loadQueue.shift();
        const { assetId, descriptor, resolve, reject } = task;

        const loadPromise = this._loadAsset(descriptor)
            .then(resource => {
                this.loadedResources.set(assetId, resource);
                resolve(resource);
            })
            .catch(error => {
                // Emit onAssetError here
                reject(error);
            })
            .finally(() => {
                this.activeLoads.delete(loadPromise);
                this.processLoadQueue();
            });
            
        this.activeLoads.add(loadPromise);
    }
    
    async _loadAsset(descriptor) {
        const { assetId, mimeType, hash, size, external, encoding, data } = descriptor;
        let buffer = null;

        if (external) {
            const url = external;
            // Fetch external URL (30s timeout)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); 
            
            let response;
            try {
                response = await fetch(url, { signal: controller.signal });
            } catch (e) {
                if (e.name === 'AbortError') {
                    throw new Error(`Asset loading timed out (${assetId})`);
                }
                throw e;
            } finally {
                clearTimeout(timeoutId);
            }
            
            if (!response.ok) throw new Error(`Failed to fetch external asset: ${response.statusText}`);
            buffer = await response.arrayBuffer();
            
            // Validate hash after fetch (transfer copy to worker)
            const { hash: calculatedHash } = await workerManager.calculateHash(buffer.slice(0));
            if (calculatedHash !== hash) {
                throw new Error(`Hash mismatch for external asset: ${assetId}`);
            }

        } else if (encoding === 'base64' && data) {
            // Decode embedded Base64 in Worker and validate hash
            if (size > MAX_ASSET_SIZE) {
                throw new Error(`Embedded asset ${assetId} exceeds MAX_ASSET_SIZE (${size} > ${MAX_ASSET_SIZE}). Refusing to load.`);
            }
            const { buffer: decodedBuffer } = await workerManager.decodeBase64AndValidate(data, hash);
            buffer = decodedBuffer;
        } else {
             throw new Error(`Asset ${assetId} is malformed.`);
        }

        // 2. Parse Buffer into THREE.js Resource based on mimeType
        const blob = new Blob([buffer], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        
        try {
            if (mimeType.includes('gltf')) {
                const loader = new GLTFLoader();
                const gltf = await new Promise((res, rej) => loader.load(blobUrl, res, undefined, rej));
                gltf.scene.name = assetId; 
                
                if (gltf.animations && gltf.animations.length > 0) {
                    animax.add(gltf.scene, gltf.animations);
                    gltf.scene.userData.animationNames = gltf.animations.map(clip => clip.name);
                }
                
                return gltf.scene;

            } else if (mimeType.includes('obj')) {
                 const loader = new OBJLoader();
                 // OBJLoader requires text or URL; loading from Blob URL is safest
                 const object = await new Promise((res, rej) => loader.load(blobUrl, res, undefined, rej));
                 object.name = assetId;
                 
                 object.traverse((child) => {
                    if (child.isMesh && !child.material) {
                        child.material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
                    }
                 });
                 return object;
            } 

            throw new Error(`Unsupported MIME type: ${mimeType}`);
        } finally {
            URL.revokeObjectURL(blobUrl);
        }
    }
}


// Singleton responsável por configurar e manter a cena 3D principal com Three.js
class ThreeCore {
  constructor() {
    if (ThreeCore.instance) return ThreeCore.instance;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x444444);

    // Initial camera setup, will be updated/overridden by DrakiEditor's camera for rendering
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(5, 5, 5);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    ThreeCore.instance = this;
  }

  // Modified init to take container and editor instance
  init(container, editorInstance) {
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
    // Set renderer size based on container initially
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.editorInstance = editorInstance; // Store editor instance for camera/selectionBox access

    this._animate(); // Start the main animation loop
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    // Get deltaTime regardless, but only apply it to game logic if running
    const deltaTime = animax.clock.getDelta();

    if (this.editorInstance.isGameRunning) {
        for (const mixer of animax.mixers.values()) {
            mixer.update(deltaTime);
        }

        this.scene.traverse(obj => {
            // Executa scripts simples
            if (obj.userData.scripts) {
                obj.userData.scripts.forEach(fn => fn(obj));
            }

            // Executa componentes com método update
            const comps = obj.userData.components || {};
            for (let key in comps) {
                const comp = comps[key];
                if (typeof comp.update === 'function') {
                    comp.update(obj);
                }
            }
        });
        
        // Execute 2D UI Component scripts
        for (const component of this.editorInstance.uiComponents.values()) {
            if (component.config.script && typeof component.config.script.update === 'function') {
                // Pass the UI config object as 'self'
                component.config.script.update(component.config);
            }
        }

        // Execute global update script if present
        if (this.editorInstance.updateScript) {
            try {
                // Provide drak, hud, THREE, animax, and editor instance to the script context
                const userUpdateFunction = new Function('drak', 'hud', 'THREE', 'animax', 'editor', this.editorInstance.updateScript);
                userUpdateFunction(drak, hud, THREE, animax, this.editorInstance);
            } catch (error) {
                console.error("Error executing global update script:", error);
                // Optionally, stop the game if a continuous error occurs
                this.editorInstance.stopGame();
            }
        }
    }

    // Editor-specific updates (always run)
    if (this.editorInstance && this.editorInstance.selectionBox) {
        this.editorInstance.selectionBox.update();
    }
    // Render using the editor's camera
    if (this.editorInstance) {
        this.renderer.render(this.scene, this.editorInstance.camera);
    } else {
        this.renderer.render(this.scene, this.camera); // Fallback if no editor instance
    }
    // Render HUD after 3D scene
    hud.draw(deltaTime);
  }
}

// Abstract Factory
class ThreeFactory {
  createLight(color = 0xffffff, intensity = 1) {
    const light = new THREE.PointLight(color, intensity);
    light.name = `PointLight`;
    return light;
  }

  createCube(size = 1, color = 0x00ff00) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Cube`;
    return mesh;
  }
  
  createCylinder(radiusTop = 0.5, radiusBottom = 0.5, height = 1, radialSegments = 16, color = 0xffaa00) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Cylinder`;
    return mesh;
  }

  createCone(radius = 0.5, height = 1, radialSegments = 16, color = 0xff66aa) {
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Cone`;
    return mesh;
  }

  createSphere(radius = 0.5, segments = 32, color = 0x0000ff) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Sphere`;
    return mesh;
  }

  createTorus(radius = 0.8, tube = 0.3, radialSegments = 16, tubularSegments = 100, color = 0x66ccff) {
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Torus`;
    return mesh;
  }

  createRing(innerRadius = 0.5, outerRadius = 1, thetaSegments = 8, color = 0x999999) {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    const material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Ring`;
    return mesh;
  }

  createPlane(width = 5, height = 5, color = 0xaaaaaa) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Plane`;
    return mesh;
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.name = `Camera`;
    return camera;
  }
}

// Builder para criar entidades compostas
class EntityBuilder {
  constructor() {
    this.entity = new THREE.Object3D();
    this.entity.name = `NewEntity`;
  }

  addMesh(mesh) {
    this.entity.add(mesh);
    return this;
  }

  setPosition(x, y, z) {
    this.entity.position.set(x, y, z);
    return this;
  }

  build() {
    return this.entity;
  }
}

// Fábrica de Protótipos
class PrototypeFactory {
  constructor() {
    this.prototypes = {};
  }

  register(name, object3D) {
    this.prototypes[name] = object3D;
  }

  clone(name) {
    return this.prototypes[name]?.clone() ?? null;
  }
}

// Registro global de componentes reutilizáveis
class ComponentRegistry {
  static components = {};

  static register(name, ComponentClass) {
    this.components[name] = ComponentClass;
  }

  static instantiate(name, ...args) {
    const Comp = this.components[name];
    return Comp ? new Comp(...args) : null;
  }
}

// Sistema de Tags
const TagSystem = {
  add(object, tag) {
    if (!object.userData.tags) object.userData.tags = new Set();
    object.userData.tags.add(tag);
  },

  has(object, tag) {
    return object.userData.tags?.has(tag) ?? false;
  },

  remove(object, tag) {
    object.userData.tags?.delete(tag);
  },

  getAll(tag) {
    const core = new ThreeCore(); // This will get the singleton instance
    const found = [];
    core.scene.traverse(obj => {
      if (obj.userData.tags?.has(tag)) {
        found.push(obj);
      }
    });
    return found;
  }
};

// Factory com nome automático
class Game {
  static create(type, name = null) {
    const factory = new ThreeFactory();

    const methodMap = {
      cube: 'createCube',
      sphere: 'createSphere',
      plane: 'createPlane',
      camera: 'createCamera',
      light: 'createLight',
      torus: 'createTorus',
      ring: 'createRing',
      cylinder: 'createCylinder',
      cone: 'createCone'
    };

    const methodName = methodMap[type];
    if (!methodName || typeof factory[methodName] !== 'function') {
      throw new Error(`Tipo de objeto desconhecido: "${type}"`);
    }

    const obj = factory[methodName]();
    if (name) obj.name = name; // Override default name if provided
    return obj;
  }
}

const drak = (function () {
  const core = new ThreeCore(); // This gets the singleton instance
  const _cache = {}; // cache privado

  function wrapper(objectName = null) {
    // Global drak functions when no specific object is targeted
    if (objectName === null || typeof objectName === 'undefined' || objectName === '') {
      return {
        cache: {
          set(key, value) {
            _cache[key] = value;
          },
          get(key) {
            return _cache[key];
          }
        },
        byTag(tag) {
          const found = [];
          core.scene.traverse(obj => {
            if (obj.userData.tags?.has(tag)) {
              found.push(wrapper(obj.name));
            }
          });
          return found;
        },
        add(object) {
            core.scene.add(object);
            UI.updateHierarchy(core.scene);
            core.editorInstance?.selectObject(object); // Select the added object if editor exists
        },
        remove(object) {
            core.scene.remove(object);
            if (core.editorInstance?.selectedObject === object) {
                core.editorInstance?.selectObject(null); // Deselect if removed
            }
            UI.updateHierarchy(core.scene);
            core.editorInstance?.disposeObject(object); // Dispose resources
        },
        getAllObjects() {
            const allObjects = [];
            core.scene.traverse(obj => {
                // Exclude the scene itself, lights, cameras, grid, ground, helpers from this list
                if (obj !== core.scene && !(obj instanceof THREE.Light) && !(obj instanceof THREE.Camera) && !(obj instanceof THREE.GridHelper) && obj.name !== "Ground") {
                    allObjects.push(wrapper(obj.name));
                }
            });
            return allObjects;
        },
        camera() { // New global function to access the active camera used by the editor/game
            return core.editorInstance?.camera ?? core.camera; 
        }
      };
    }

    const target = core.scene.getObjectByName(objectName);
    if (!target) {
      console.warn(`Objeto "${objectName}" não encontrado`);
      return null;
    }

    return {
      set(path, value) {
        const parts = path.split('.');
        let obj = target;
        while (parts.length > 1) {
            if (!obj[parts[0]]) {
                obj[parts[0]] = {}; // Create intermediate objects if they don't exist
            }
            obj = obj[parts.shift()];
        }
        obj[parts[0]] = value;
        // Trigger render if a property that affects visuals is changed
        core.editorInstance?.render();
      },

      get(path) {
        const parts = path.split('.');
        let obj = target;
        for (let part of parts) {
            if (obj === undefined || obj === null) return undefined; // Prevent error if path is broken
            obj = obj[part];
        }
        return obj;
      },

      script(fn) {
        if (!target.userData.scripts) target.userData.scripts = [];
        target.userData.scripts.push(fn);
      },

      component(name) {
        return target.userData?.components?.[name] ?? null;
      },

      addComponent(name, instance) {
        if (!target.userData.components) target.userData.components = {};
        target.userData.components[name] = instance;
      },

      removeComponent(name) {
        if (target.userData.components) delete target.userData.components[name];
      },

      addTag(tag) {
        TagSystem.add(target, tag);
      },

      removeTag(tag) {
        TagSystem.remove(target, tag);
      },

      hasTag(tag) {
        return TagSystem.has(target, tag);
      },

      echo() {
        console.log(target);
      },

      eye() {
        if (target.material?.color) {
          if (!target.userData.originalColor) {
            target.userData.originalColor = target.material.color.clone();
          }
          target.material.color.set(0xffff00);
          core.editorInstance?.render(); // Render immediately
          setTimeout(() => {
            if (target.material && target.userData.originalColor) {
              target.material.color.copy(target.userData.originalColor);
              core.editorInstance?.render(); // Render after color reset
            }
          }, 1000);
        }
      },

      callTo(name) {
        const obj = core.scene.getObjectByName(name);
        if (obj) console.log(`Chamado:`, obj);
      },

      touch(name) {
        const obj = core.scene.getObjectByName(name);
        if (obj?.userData.scripts) {
          obj.userData.scripts.forEach(fn => fn(obj));
        }
      },

      ref(key) {
        return target.userData?.[key] ?? null;
      },

      link(name) {
        const obj = core.scene.getObjectByName(name);
        if (obj) obj.add(target);
        core.editorInstance?.render();
      },

      pointTo(name) {
        const obj = core.scene.getObjectByName(name);
        if (obj?.position) {
          target.lookAt(obj.position);
        }
        core.editorInstance?.render();
      },

      hook(fn) {
        if (typeof fn !== 'function') {
          console.warn(`hook: argumento não é uma função válida`);
          return;
        }
        try {
          return fn(target);
        } catch (e) {
          console.error(`hook: erro ao executar função para "${target.name}"`, e);
        }
      },
      object() { // Expose the raw THREE.Object3D instance
        return target;
      }
    };
  }

  return wrapper;
})();

class HUD {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none"; // Managed by DrakiEditor based on game state
    this.canvas.style.zIndex = "1000";
    this.canvas.style.background = "transparent";
    this.canvas.style.touchAction = "none"; // ADDED: Prevents default touch actions (scrolling/panning)

    // document.body.appendChild(this.canvas); // Removed: appended to viewport by DrakiEditor

    this.items = new Map();
    this.images = [];

    this.buttons = new Map();
    this.downMap = new Map();
    this.upMap = new Map();
    
    // New structure to manage all UI components (buttons, joysticks, etc.)
    this.uiComponents = new Map(); // Key: name, Value: { type: 'button'|'joystick', config: {...} }

    this.activeTouches = new Set();
    // Maps pointerId to { config: jConfig, pointerId: e.pointerId } for active fixed joysticks
    this.activeJoysticks = new Map(); 

    // Removed window resize listener and initial resize call

    this.canvas.addEventListener("pointerdown", (e) => this.handleDown(e));
    this.canvas.addEventListener("pointermove", (e) => this.handleMove(e)); // ADDED
    this.canvas.addEventListener("pointerup", (e) => this.handleUp(e));
    this.canvas.addEventListener("pointercancel", (e) => this.handleUp(e));
  }

  init(viewportElement) {
      viewportElement.appendChild(this.canvas);
      this.resize(viewportElement.clientWidth, viewportElement.clientHeight);
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  // Texto HUD
  add(key, value, x = 10, y = 10, color = "#ffffff", font = "16px monospace") {
    this.items.set(key, { value, x, y, color, font });
  }

  update(key, newValue) {
    if (this.items.has(key)) {
      this.items.get(key).value = newValue;
    }
  }

  img(src, x, y, width, height) {
    const image = new Image();
    image.onload = () => {
      this.images.push({ image, x, y, width, height });
    };
    image.src = src;
  }

  // Botão
  touch(name, x, y, width, height, style = {}) {
    const config = {
        name, x, y, width, height,
        color: style.color || "#ffffff22",
        border: style.border || "#ffffff55",
        script: null, // Initialize script property
        targetObjectName: null, // Initialize target object name
    };
    
    // Register in buttons map for interaction logic compatibility
    this.buttons.set(name, config);
    
    // Register as a UI component for drawing and configuration tracking
    this.uiComponents.set(name, {
        type: 'button',
        config: config
    });

    // this.canvas.style.pointerEvents = "auto"; // Removed, controlled by DrakiEditor during Play mode
    return this;
  }
  
  /**
   * Creates a Joystick control area.
   * @param {string} name Unique name
   * @param {number} x Center X position (in pixels)
   * @param {number} y Center Y position (in pixels)
   * @param {number} radius Radius of the base circle
   */
  joystick(name, x, y, radius = 50, style = {}) {
      const config = { 
          name, x, y, radius, 
          color: style.color || "#ffffff22", 
          border: style.border || "#ffffff55", 
          vector: { x: 0, y: 0 },
          stickPos: { x: x, y: y }, // Current stick pixel position (initialized to editor center)
          isReturning: false, // State for smooth return (kept for configuration, but disabled in logic)
          script: new ScriptComponent(DEFAULT_JOYSTICK_SCRIPT), // ADD DEFAULT SCRIPT
          targetObjectName: null, // Initialize target object name
      };
      
      this.uiComponents.set(name, {
          type: 'joystick',
          config: config
      });
      
      // this.canvas.style.pointerEvents = "auto"; // Removed, controlled by DrakiEditor during Play mode
      return this;
  }

  onDown(name, fn) {
    if (typeof fn === "function") this.downMap.set(name, fn);
    return this;
  }

  onUp(name, fn) {
    if (typeof fn === "function") this.upMap.set(name, fn);
    return this;
  }
  
  // Helper to get local coordinates relative to the canvas
  _getLocalCoords(e) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
  }
  
  _updateJoystick(jConfig, currentX, currentY) {
    const centerX = jConfig.x;
    const centerY = jConfig.y;
    
    // Displacement from the fixed center (centerX, centerY)
    const dxFromCenter = currentX - centerX;
    const dyFromCenter = currentY - centerY;

    const effectiveDistance = Math.sqrt(dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter);

    const DEADZONE_THRESHOLD = 0.1; 

    if (effectiveDistance > DEADZONE_THRESHOLD) {

        // Determine input vector magnitude (clamped to 1)
        const inputMagnitude = Math.min(1, effectiveDistance / jConfig.radius);

        // Calculate normalized direction vector components
        const dx_norm = dxFromCenter / effectiveDistance;
        const dy_norm = dyFromCenter / effectiveDistance;

        // 1. Set Game Input Vector 
        jConfig.vector.x = dx_norm * inputMagnitude;
        jConfig.vector.y = -(dy_norm * inputMagnitude); // Invert Y for game space (Screen Y down -> Game Y forward/up)

        // 2. Determine Visual Stick Position
        // Calculate the visual displacement magnitude (clamped by radius)
        const visualDistance = effectiveDistance > jConfig.radius ? jConfig.radius : effectiveDistance;

        // Position stick based on normalized direction * visual distance
        jConfig.stickPos.x = centerX + dx_norm * visualDistance;
        jConfig.stickPos.y = centerY + dy_norm * visualDistance; 

    } else {
        // Reset vector and stick position if displacement is negligible
        jConfig.vector.x = 0;
        jConfig.vector.y = 0;
        jConfig.stickPos.x = centerX;
        jConfig.stickPos.y = centerY;
    }
  }

  handleDown(e) {
    const { x, y } = this._getLocalCoords(e);
    
    // 1. Check for button hits
    for (const btn of this.buttons.values()) {
      if (
        x >= btn.x && x <= btn.x + btn.width &&
        y >= btn.y && y <= btn.y + btn.height
      ) {
        // Handle button down
        this.activeTouches.add(btn.name);
        this.canvas.setPointerCapture(e.pointerId);

        const downFn = this.downMap.get(btn.name);
        if (downFn) downFn();
        e.preventDefault(); // Claim interaction and prevent default touch behavior (e.g., scrolling)
        return; // Button interaction takes precedence
        }
    }

    // 2. Handle Joystick Activation (Fixed Base)

    // Check if this pointer is already tracking a joystick 
    if (this.activeJoysticks.has(e.pointerId)) return;

    let jConfigToActivate = null;

    // Find if the touch is within the radius of any defined joystick
    for (const component of this.uiComponents.values()) {
        if (component.type === 'joystick') {
            const j = component.config;
            const dx = x - j.x;
            const dy = y - j.y;

            // Check if pointer is within joystick base radius AND not already being used by another pointer
            if (dx * dx + dy * dy <= j.radius * j.radius) {
                const isConfigInUse = Array.from(this.activeJoysticks.values()).some(active => active.config.name === j.name);
                
                if (!isConfigInUse) {
                    jConfigToActivate = j;
                    
                    // Stop smooth return immediately if we grab it
                    jConfigToActivate.isReturning = false;
                    
                    break;
                }
            }
        }
    }

    if (jConfigToActivate) {
        // Activate fixed joystick
        const activeState = {
            config: jConfigToActivate,
            pointerId: e.pointerId
        };

        this.activeJoysticks.set(e.pointerId, activeState);
        this.canvas.setPointerCapture(e.pointerId);

        // Initial movement calculation (stick starts at touch location, clamped to radius)
        this._updateJoystick(jConfigToActivate, x, y);
        e.preventDefault(); // Claim interaction and prevent default touch behavior (e.g., scrolling)
    }
  }

  handleMove(e) {
    // Handle joystick movement
    if (this.activeJoysticks.has(e.pointerId)) {
        const activeState = this.activeJoysticks.get(e.pointerId);
        const jConfig = activeState.config;

        const { x, y } = this._getLocalCoords(e);
        this._updateJoystick(jConfig, x, y);
        e.preventDefault(); // Prevent scrolling/zooming during drag
    }
  }

  handleUp(e) {
    const { x, y } = this._getLocalCoords(e);
    
    // 1. Handle joystick release
    if (this.activeJoysticks.has(e.pointerId)) {
        const activeState = this.activeJoysticks.get(e.pointerId);
        const jConfig = activeState.config;
        
        // Reset stick position and vector instantly (Removing smooth return/auto centro)
        jConfig.stickPos.x = jConfig.x;
        jConfig.stickPos.y = jConfig.y;
        jConfig.vector.x = 0;
        jConfig.vector.y = 0;
        jConfig.isReturning = false;

        this.activeJoysticks.delete(e.pointerId);
    }

    // 2. Handle button release
    // Note: This relies on the button being added to `activeTouches` in handleDown.
    // It is still rudimentary for complex multitouch scenarios, but better than clearing all touches.
    for (const btnName of Array.from(this.activeTouches)) {
        const btn = this.buttons.get(btnName);
        if (btn) {
            // Check if release is over the button area (optional for pointer events, but retained for logic)
            if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
                const upFn = this.upMap.get(btnName);
                if (upFn) upFn();
            }
            // Remove the active state regardless, since the pointer is up
            this.activeTouches.delete(btnName); 
        }
    }
    
    // Release pointer capture if it was captured
    if (this.canvas.hasPointerCapture(e.pointerId)) {
        this.canvas.releasePointerCapture(e.pointerId);
    }
  }

  style(css = {}) {
    Object.assign(this.canvas.style, css);
  }

  ctxStyle(key) {
    const item = this.items.get(key);
    if (!item) return this.ctx;
    this.ctx.fillStyle = item.color;
    this.ctx.font = item.font;
    return this.ctx;
  }

  /**
 * Runs every frame to draw HUD and handle smooth movements.
 * @param {number} deltaTime Time elapsed since last frame (in seconds).
 */
  draw(deltaTime) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const { image, x, y, width, height } of this.images) {
      this.ctx.drawImage(image, x, y, width, height);
    }

    for (const [key, { value, x, y, color, font }] of this.items) {
      this.ctx.fillStyle = color;
      this.ctx.font = font;
      this.ctx.fillText(`${key}: ${value}`, x, y);
    }
    
    // Unified drawing loop for UI components (buttons and joysticks)
    for (const component of this.uiComponents.values()) {
        if (component.type === 'button') {
            const btn = component.config;
            this.ctx.fillStyle = btn.color;
            this.ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
            this.ctx.strokeStyle = btn.border;
            this.ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
        } else if (component.type === 'joystick') {
            const j = component.config;
            const centerDrawX = j.x;
            const centerDrawY = j.y;
            const stickRadius = j.radius * 0.4;
            
            // Base circle
            this.ctx.beginPath();
            this.ctx.arc(centerDrawX, centerDrawY, j.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = j.color;
            this.ctx.fill();
            this.ctx.strokeStyle = j.border;
            this.ctx.stroke();
            
            // Stick (drawn based on j.stickPos, which snaps instantly to center when released)
            this.ctx.beginPath();
            this.ctx.arc(j.stickPos.x, j.stickPos.y, stickRadius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = '#ffffffaa'; // Use a slightly more visible color
            this.ctx.fill();
            this.ctx.strokeStyle = j.border;
            this.ctx.stroke();
        }
    }
  }
}

class Animax {
  constructor() {
    if (Animax.instance) {
      return Animax.instance;
    }

    this.mixers = new Map(); // Armazena os mixers por nome do modelo
    this.actions = new Map(); // Armazena as actions por nome do modelo e da animação
    this.currentActions = new Map(); // Armazena a ação atual por nome do modelo
    this.clock = new THREE.Clock();

    Animax.instance = this;
  }

  add(model, animations) {
    const name = model.name;
    if (!name) {
      console.error("Animax: O modelo precisa de um nome para ser adicionado.");
      return;
    }

    const mixer = new THREE.AnimationMixer(model);
    this.mixers.set(name, mixer);

    const modelActions = new Map();
    animations.forEach(clip => {
      modelActions.set(clip.name, mixer.clipAction(clip));
    });
    this.actions.set(name, modelActions);
    
    console.log(`Animax: Registered ${animations.length} animations for model ${name}`);
  }
  
  removeMixer(modelName) {
    this.mixers.delete(modelName);
    this.actions.delete(modelName);
    this.currentActions.delete(modelName);
    console.log(`Animax: Removed mixer for model ${modelName}`);
  }

  play(modelName, animName, transition = 0.3) {
    const modelActions = this.actions.get(modelName);
    if (!modelActions) return;

    const newAction = modelActions.get(animName);
    if (!newAction) {
      console.warn(`Animax: Animação "${animName}" não encontrada para o modelo "${modelName}".`);
      return;
    }

    const currentAction = this.currentActions.get(modelName);
    if (currentAction === newAction) return;

    if (currentAction) {
      currentAction.fadeOut(transition);
    }

    newAction.reset().setLoop(THREE.LoopRepeat).fadeIn(transition).play();
    this.currentActions.set(modelName, newAction);
  }

  playOnce(modelName, animName, onFinishCallback) {
    const modelActions = this.actions.get(modelName);
    const mixer = this.mixers.get(modelName);
    if (!modelActions || !mixer) return;

    const newAction = modelActions.get(animName);
    if (!newAction) {
      console.warn(`Animax: Animação "${animName}" não encontrada para o modelo "${modelName}".`);
      return;
    }

    const currentAction = this.currentActions.get(modelName);
    if (currentAction) {
      currentAction.fadeOut(0.3);
    }

    newAction.reset().setLoop(THREE.LoopOnce).fadeIn(0.3).play();
    newAction.clampWhenFinished = true; // Mantém no último frame
    this.currentActions.set(modelName, newAction);

    const listener = (event) => {
      if (event.action === newAction) {
        mixer.removeEventListener('finished', listener); // Limpa o listener
        this.currentActions.set(modelName, null);
        if (onFinishCallback) {
          onFinishCallback();
        }
      }
    };
    mixer.addEventListener('finished', listener);
  }

  stop(modelName, transition = 0.3) {
    const currentAction = this.currentActions.get(modelName);
    if (currentAction) {
      currentAction.fadeOut(transition);
      this.currentActions.set(modelName, null);
    }
  }

  start() {
    this._update();
  }

  _update() {
    // Note: The actual mixer.update(deltaTime) call is moved to ThreeCore._animate
    // to ensure it only runs when isGameRunning is true.
    // This _update loop is just for consistency if Animax needed to run its own raf.
    // For now, it mainly ensures the clock is running.
    requestAnimationFrame(() => this._update());
    this.clock.getDelta(); // Advance clock even if not used immediately
  }
}

const animax = new Animax();
const core = new ThreeCore();
const hud = new HUD(); // Instantiate HUD here after ThreeCore is available

// Renamed Editor to DrakiEditor and updated to use ThreeCore and other utilities
export class DrakiEditor {
    constructor() {
        this.viewport = document.getElementById('viewport');

        this.core = core; // Use the singleton core instance
        this.scene = this.core.scene; // DrakiEditor's scene is ThreeCore's scene

        // DrakiEditor maintains its own camera for specific editor control needs
        this.camera = new THREE.PerspectiveCamera(75, this.viewport.clientWidth / this.viewport.clientHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 5);

        this.renderer = this.core.renderer; // DrakiEditor uses ThreeCore's renderer

        // Game state flag
        this.isGameRunning = false;
        
        // Global scripts for Load and Update phases
        this.loadScript = '';
        this.updateScript = '';

        // Initialize core with editor's viewport and this DrakiEditor instance
        this.core.init(this.viewport, this);
        // Start Animax update loop (its internal clock)
        animax.start();
        
        // Initialize HUD context for the viewport
        hud.init(this.viewport); // <--- ADDED

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', () => this.render());

        // Initialize TransformControls
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.setSpace('local'); // Set space to local to ensure movement aligns with object rotation
        this.transformControls.addEventListener('change', () => {
            this.render();
            // Update inspector with new transform values for the selected object
            if (this.selectedObject) {
                UI.updateInspector(this.selectedObject);
            }
        });
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.controls.enabled = !event.value; // Disable orbit controls when transforming
        });
        this.transformControls.userData.isSelectable = false; // Mark TransformControls as non-selectable
        this.scene.add(this.transformControls); // Add to scene, but it will be hidden by default

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.selectedObject = null;
        this.selectedUIComponent = null; // New: Selected 2D UI component
        this.selectionBox = null;
        
        // Reference the map from the singleton HUD
        this.uiComponents = hud.uiComponents; 
        
        // --- Asset Management ---
        this.assetManager = new AssetManager(); // NEW: Asset Manager instance

        this.initScene();
        this.initListeners();

        // Pass this editor instance to UI so it can interact with the scene/selection
        UI.init(this);
        UI.updateHierarchy(this.scene);

        // Initial render, the main loop is handled by ThreeCore.
        this.render();
    }

    initScene() {
        // Initialize scene defaults
        this.initSceneDefaults();

        // Add an initial cube using the new Game factory
        const initialCube = Game.create('cube', 'Initial Cube');
        initialCube.position.set(0, 0.5, 0);
        this.addObject(initialCube);
    }
    
    /** Clears the current scene, resets state, and sets up defaults. */
    newScene() {
        this.clearScene();
        this.initSceneDefaults(); // Re-add lights/grid
        
        // Add a default cube for a basic starting scene
        const initialCube = Game.create('cube', 'Initial Cube');
        initialCube.position.set(0, 0.5, 0);
        this.addObject(initialCube);
        
        // Reset global scripts
        this.loadScript = '';
        this.updateScript = '';
        
        // Clear editor selection and UI
        this.selectObject(null);
        UI.updateHierarchy(this.scene);
        UI.updateInspector(null);
        this.render();
        console.log("New Scene initialized.");
    }

    /** Re-adds default scene elements (lights, grid, ground). */
    initSceneDefaults() {
        // Lights and helpers are added to the core scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        ambientLight.name = "Ambient Light"; // Give a name for selection/inspector
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.name = "Directional Light"; // Give a name for selection/inspector
        this.scene.add(directionalLight);

        const gridHelper = new THREE.GridHelper(100, 100);
        gridHelper.userData.isSelectable = false; // Mark GridHelper as non-selectable
        gridHelper.name = "Grid";
        this.scene.add(gridHelper);

        const ground = Game.create('plane', 'Ground');
        ground.scale.set(20, 20, 20); // Make it larger
        ground.rotation.x = -Math.PI / 2;
        ground.userData.isSelectable = false; // Make ground not selectable
        this.scene.add(ground);
    }

    initListeners() {
        // Use ResizeObserver for more reliable viewport resizing
        const resizeObserver = new ResizeObserver(() => this.onWindowResize());
        resizeObserver.observe(this.viewport);
        
        this.viewport.addEventListener('pointerdown', this.onPointerDown.bind(this));
    }

    onWindowResize() {
        if (!this.viewport) return;

        const width = this.viewport.clientWidth;
        const height = this.viewport.clientHeight;

        if (this.renderer.domElement.width !== width || this.renderer.domElement.height !== height) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            hud.resize(width, height); // Update HUD size
            this.render(); // Request a render after resize
        }
    }

    onPointerDown(event) {
        // If TransformControls are currently being hovered over or are active (dragging),
        // let them handle the click/interaction. This prevents unwanted object selection/deselection.
        if (this.transformControls.dragging || this.transformControls.pointerHovered) {
             return;
        }

        const rect = this.renderer.domElement.getBoundingClientRect();
        // Calculate pointer coordinates relative to the viewport top-left
        const pointerXRelative = event.clientX - rect.left;
        const pointerYRelative = event.clientY - rect.top;

        // 1. Check for UI component selection ONLY if game is not running (Edit Mode)
        if (!this.isGameRunning) {
            const uiComponentHit = this.checkUIComponentClick(pointerXRelative, pointerYRelative);
            if (uiComponentHit) {
                this.selectUIComponent(uiComponentHit.config.name);
                return; // Stop processing 3D selection
            }
        }

        // 2. If not a UI selection, proceed with 3D selection
        this.pointer.x = ((pointerXRelative) / rect.width) * 2 - 1;
        this.pointer.y = -((pointerYRelative) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const firstIntersect = intersects[0].object;
            // Traverse up the parent chain until we find the top-level object added to the scene
            let selectableObject = firstIntersect;
            while (selectableObject && selectableObject.parent !== this.scene && selectableObject.parent !== null) {
                selectableObject = selectableObject.parent;
            }
            
            // Only select if the object is explicitly marked as selectable (or not explicitly unselectable)
            // and is not one of the editor's internal helpers (TransformControls, BoxHelper etc.)
            if (selectableObject && selectableObject.userData.isSelectable !== false) {
                 this.selectObject(selectableObject);
            } else {
                 this.selectObject(null);
            }
        } else {
            this.selectObject(null);
        }
    }

    /**
     * Helper to check if a click hits a 2D UI component.
     * Assumes coordinates (x, y) are relative to the viewport top-left.
     */
    checkUIComponentClick(x, y) {
        for (const component of this.uiComponents.values()) {
            const config = component.config;
            if (component.type === 'button') {
                if (x >= config.x && x <= config.x + config.width &&
                    y >= config.y && y <= config.y + config.height) {
                    return component;
                }
            } else if (component.type === 'joystick') {
                // Check distance from center
                const dx = x - config.x;
                const dy = y - config.y;
                if (dx * dx + dy * dy <= config.radius * config.radius) {
                    return component;
                }
            }
        }
        return null;
    }

    addObject(object) {
        // Game.create already assigns a base name (e.g., 'Cube').
        // This ensures unique naming by appending a number if necessary.
        let baseName = object.name || (object.type || 'Object');
        let counter = 0;
        let uniqueName = baseName;
        while(this.scene.getObjectByName(uniqueName)) {
            counter++;
            uniqueName = `${baseName} ${counter}`;
        }
        object.name = uniqueName;

        this.scene.add(object);
        UI.updateHierarchy(this.scene);
        this.selectObject(object);
        this.render();
    }
    
    // New method for UI to call to create objects via Game factory
    createGameObjectFromUI(type) {
        const newObject = Game.create(type);
        // Give it a random position to make it visible
        newObject.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() * 5) + 0.5,
            (Math.random() - 0.5) * 10
        );
        // Special rotation for plane
        if (type === 'plane') {
            newObject.rotation.x = -Math.PI / 2;
        }
        this.addObject(newObject);
    }
    
    selectObject(object) {
        if (this.selectedObject === object) return;

        // Deselect UI component if a 3D object is selected or deselected
        this.selectedUIComponent = null;
        
        // Remove previous selection helper
        if (this.selectionBox) {
            this.scene.remove(this.selectionBox);
            // BoxHelper does not have a .dispose() method.
            // We need to dispose of its geometry and material to free up GPU resources.
            if (this.selectionBox.geometry) this.selectionBox.geometry.dispose();
            if (this.selectionBox.material) this.selectionBox.material.dispose();
            this.selectionBox = null;
        }

        // Detach transform controls from previous object
        if (this.transformControls.object) {
            this.transformControls.detach();
        }

        this.selectedObject = object;

        if (this.selectedObject) {
            this.selectionBox = new THREE.BoxHelper(this.selectedObject, 0x00aaff);
            this.selectionBox.userData.isSelectable = false; // Mark BoxHelper as non-selectable
            this.scene.add(this.selectionBox);
            this.transformControls.attach(this.selectedObject); // Attach to new object
        } else {
            // If no object is selected, ensure transformControls is detached
            this.transformControls.detach();
        }

        // Pass selectedUIComponent (which is null here) to UI updates
        UI.updateHierarchy(this.scene, this.selectedObject, this.selectedUIComponent);
        UI.updateInspector(this.selectedObject, this.selectedUIComponent);
        this.render();
    }
    
    // New methods for UI component management
    
    /**
     * Creates a new Joystick UI component.
     */
    createJoystickFromUI() {
        let baseName = 'Joystick';
        let counter = 1;
        let uniqueName = baseName;
        while(this.uiComponents.has(uniqueName)) {
            counter++;
            uniqueName = `${baseName}_${counter}`;
        }
        
        // Default position: Bottom Left quadrant, absolute pixel coordinates
        const x = 100;
        const y = this.viewport.clientHeight - 100;
        const radius = 50;
        
        hud.joystick(uniqueName, x, y, radius);
        this.selectUIComponent(uniqueName);
    }
    
    /**
     * Creates a new Touch or Click Button UI component.
     */
    createButtonFromUI(isClick = false) {
        let baseName = isClick ? 'ClickButton' : 'TouchButton';
        let counter = 1;
        let uniqueName = baseName;
        while(this.uiComponents.has(uniqueName)) {
            counter++;
            uniqueName = `${baseName}_${counter}`;
        }
        
        // Default position: Bottom Right quadrant, absolute pixel coordinates
        const width = 80;
        const height = 80;
        const x = this.viewport.clientWidth - width - 50;
        const y = this.viewport.clientHeight - height - 50;

        hud.touch(uniqueName, x, y, width, height); 
        
        this.selectUIComponent(uniqueName);
    }
    
    /**
     * Selects a 2D UI component by name.
     */
    selectUIComponent(name) {
        const component = this.uiComponents.get(name);
        if (!component || this.selectedUIComponent === component) {
            return;
        }

        // Ensure 3D selection is cleared
        this.selectObject(null); // This clears this.selectedObject and this.selectionBox

        this.selectedUIComponent = component;
        
        UI.updateHierarchy(this.scene, this.selectedObject, this.selectedUIComponent); 
        UI.updateInspector(this.selectedObject, this.selectedUIComponent); 
        this.render(); // Request HUD redraw
    }

    /**
     * Deletes a 2D UI component by name.
     */
    deleteUIComponent(name) {
        if (!this.uiComponents.has(name)) return;
        
        // Remove from HUD interaction maps (only buttons are currently in buttons/downMap/upMap)
        hud.buttons.delete(name);
        hud.downMap.delete(name);
        hud.upMap.delete(name);
        
        this.uiComponents.delete(name); // Remove from main map
        
        if (this.selectedUIComponent && this.selectedUIComponent.config.name === name) {
            this.selectedUIComponent = null;
        }
        
        UI.updateHierarchy(this.scene, this.selectedObject, this.selectedUIComponent); 
        UI.updateInspector(this.selectedObject, this.selectedUIComponent); 
        this.render(); // Request HUD redraw
        console.log(`UI Component "${name}" deleted.`);
    }

    // New method to delete the currently selected object
    deleteSelectedObject() {
        if (!this.selectedObject) {
            console.warn("No object selected to delete.");
            return;
        }

        const objectToDelete = this.selectedObject;

        // Deselect the object first
        this.selectObject(null); // This clears this.selectedObject and this.selectionBox

        // Remove from scene
        this.scene.remove(objectToDelete);

        // Dispose of its resources
        this.disposeObject(objectToDelete);

        // Update UI
        UI.updateHierarchy(this.scene);
        UI.updateInspector(null); // Clear inspector since no object is selected
        this.render();
        console.log(`Object "${objectToDelete.name}" deleted.`);
    }

    // Helper to dispose of geometries, materials, and textures
    disposeObject(object) {
        if (!object) return;

        // Remove animation mixer if present
        if (object.userData.animationNames) {
            animax.removeMixer(object.name);
        }

        object.traverse((node) => {
            if (node.isMesh) {
                if (node.geometry) {
                    node.geometry.dispose();
                    console.log(`Disposed geometry for: ${node.name || node.uuid}`);
                }
                if (node.material) {
                    // Dispose materials and their textures
                    if (Array.isArray(node.material)) {
                        node.material.forEach(material => this._disposeMaterial(material));
                    } else {
                        this._disposeMaterial(node.material);
                    }
                }
            }
        });
    }

    _disposeMaterial(material) {
        if (!material) return;

        for (const key in material) {
            if (material.hasOwnProperty(key)) {
                const value = material[key];
                if (value && typeof value.dispose === 'function') {
                    value.dispose();
                    // console.log(`Disposed ${key} for material.`);
                }
            }
        }
        material.dispose();
        // console.log(`Disposed material.`);
    }

    // New methods for game state
    playGame() {
        if (this.isGameRunning) return; // Prevent multiple starts

        // Enable HUD interaction for game input
        hud.canvas.style.pointerEvents = "auto"; // Enable HUD for interaction

        // Execute load script once at the beginning of play
        if (this.loadScript) {
            try {
                // Provide drak, hud, THREE, animax, and editor instance to the script context
                const userLoadFunction = new Function('drak', 'hud', 'THREE', 'animax', 'editor', this.loadScript);
                userLoadFunction(drak, hud, THREE, animax, this);
                console.log("Global Load Script executed.");
            } catch (error) {
                console.error("Error executing global load script:", error);
                // Optionally, stop the game if load script fails
                this.stopGame();
                return;
            }
        }

        this.isGameRunning = true;
        this.controls.enabled = false; // Disable orbit controls during play
        this.transformControls.enabled = false; // Disable transform controls during play
        UI.setPlayButtonState(true); // Update UI buttons
        console.log("Game Started!");
    }

    stopGame() {
        if (!this.isGameRunning) return; // Prevent multiple stops

        // Disable HUD interaction for editor clicks/3D selection
        hud.canvas.style.pointerEvents = "none"; // Disable HUD interaction

        this.isGameRunning = false;
        this.controls.enabled = true; // Re-enable orbit controls
        this.transformControls.enabled = true; // Re-enable transform controls
        UI.setPlayButtonState(false); // Update UI buttons
        console.log("Game Stopped!");
    }

    // Methods to set global scripts from UI
    setLoadScript(scriptString) {
        this.loadScript = scriptString;
        console.log("Load script updated.");
    }

    setUpdateScript(scriptString) {
        this.updateScript = scriptString;
        console.log("Update script updated.");
    }

    // This render method is for direct, on-demand renders (e.g., after controls change, UI updates)
    // The main animation loop and its rendering call are in ThreeCore._animate.
    render() {
        // The selectionBox update is handled in ThreeCore._animate, but we call it here
        // for immediate feedback in editor-specific events like selection change.
        if (this.selectionBox) {
            this.selectionBox.update();
        }
        // Explicitly render when controls change or an object is selected/modified through UI
        // to ensure immediate visual feedback. This is a direct render call, not part of the main loop.
        this.renderer.render(this.scene, this.camera);
    }
    
    // --- Scene Persistence Methods ---

    /**
     * Converts an HTML Image element to a Blob and registers it as an asset.
     * @param {HTMLImageElement} image
     * @param {THREE.Texture} texture
     * @returns {Promise<{assetId: string, hash: string}>} A promise that resolves to the asset registration details.
     */
    async _registerTexture(image, texture) {
        // If texture already has an assetId, ensure it's in the index before proceeding.
        if (texture.userData.assetId) {
            // NOTE: We rely on hash lookup for deduplication, finding by assetId is slow but ensures consistency if assetId was set manually.
            const existingAsset = Array.from(this.assetManager.assetIndex.values()).find(d => d.assetId === texture.userData.assetId);
            if (existingAsset) {
                return existingAsset;
            }
        }
        
        // Function to perform canvas conversion and registration
        const performRegistration = (mimeType, extension) => new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                // Use natural dimensions if available, fallback to default
                canvas.width = image.naturalWidth || 512;
                canvas.height = image.naturalHeight || 512;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw image onto canvas

                // Use the inferred mimeType
                canvas.toBlob(async (blob) => {
                    if (!blob) return reject(new Error("Failed to create texture blob."));
                    
                    const buffer = await blob.arrayBuffer();
                    const assetRegistration = await this.assetManager.registerAssetFromBuffer(
                        blob.type, 
                        buffer, 
                        null, 
                        `texture_${THREE.MathUtils.generateUUID()}.${extension}`
                    );
                    
                    texture.userData.assetId = assetRegistration.assetId; // Update texture object with persistent ID
                    resolve(assetRegistration);
                }, mimeType);

            } catch (e) {
                reject(e);
            }
        });

        if (image.src.startsWith('blob:') || image.src.startsWith('data:')) {
            // Determine MimeType based on file extension heuristic for saving purposes
            let mimeType = 'image/png'; 
            let extension = 'png';
            return performRegistration(mimeType, extension);
        } else {
            // External textures (non-blob/data URL sources, e.g., web URLs) are not serialized as base64.
            return null;
        }
    }


    /**
     * Converts the current scene and its assets into a serializable JSON object.
     * @param {{sceneName: string, author: string, trusted: boolean}} options 
     * @returns {Promise<Blob>} A promise that resolves to a Blob containing the serialized scene data.
     */
    async saveScene(options = {}) {
        const sceneData = {
            manifest: {
                sceneId: THREE.MathUtils.generateUUID(),
                name: options.sceneName || "Untitled Scene",
                engineVersion: ENGINE_VERSION,
                timestamp: new Date().toISOString(),
                author: options.author || "Draki User",
                trusted: options.trusted ?? true,
                compress: false, 
            },
            assets: [], 
            objects: [],
            uiComponents: [],
            globalScripts: {
                load: this.loadScript,
                update: this.updateScript,
            },
        };

        const textureRegistrationPromises = []; 

        // 1. Serialize 3D Objects 
        this.scene.traverse(obj => {
            // Exclude editor helpers like TransformControls, GridHelper, BoxHelper
            if (obj instanceof TransformControls || obj instanceof THREE.BoxHelper) return;
            // Exclude non-user-editable scene defaults
            if (obj.userData.isSelectable === false && obj.name !== "Ground" && obj.name !== "Grid" && 
                obj.name !== "Ambient Light" && obj.name !== "Directional Light") return; 

            const { serializedObj, texturePromise } = this._serializeObject(obj);
            if (serializedObj) {
                sceneData.objects.push(serializedObj);
                if (texturePromise) {
                     textureRegistrationPromises.push(texturePromise);
                }
            }
        });
        
        // Wait for all texture conversions and registrations to complete
        await Promise.all(textureRegistrationPromises);
        
        // 2. Serialize UI Components
        for (const component of this.uiComponents.values()) {
             sceneData.uiComponents.push(this._serializeUIComponent(component));
        }
        
        // 3. Collect assets list (if any were registered during model loading OR texture serialization)
        sceneData.assets = Array.from(this.assetManager.assetIndex.values()).map(desc => ({
            assetId: desc.assetId,
            mimeType: desc.mimeType,
            hash: desc.hash,
            size: desc.size,
            encoding: desc.data ? 'base64' : undefined,
            data: desc.data,
            external: desc.url,
        }));

        const jsonString = JSON.stringify(sceneData, null, 2);
        return new Blob([jsonString], { type: 'application/json' });
    }
    
    /**
     * Helper to create the required object schema for serialization.
     * @param {THREE.Object3D} object
     * @returns {{serializedObj: object, texturePromise: Promise<any>|null}}
     */
    _serializeObject(object) {
        if (!object.name || object.name.includes("Helper")) return { serializedObj: null, texturePromise: null };
        
        const transform = {
            pos: object.position.toArray(),
            // THREE.Euler order is XYZ. We serialize only the first three components.
            rot: object.rotation.toArray().slice(0, 3).map(r => THREE.MathUtils.radToDeg(r)), 
            scale: object.scale.toArray(),
        };

        const serializedObj = {
            id: object.uuid,
            name: object.name,
            type: object.type,
            assetRef: object.userData.assetRefId || null, // Reference to external asset if present
            transform: transform,
            components: {},
            props: {},
        };
        
        let texturePromise = null;
        
        // 1. Determine Object Type and Props & Handle Textures
        if (object.isMesh) {
            const geometry = object.geometry;
            
            // --- Geometry Properties ---
            if (geometry instanceof THREE.BoxGeometry) {
                serializedObj.type = 'Box';
                serializedObj.props.width = geometry.parameters.width;
                serializedObj.props.height = geometry.parameters.height;
                serializedObj.props.depth = geometry.parameters.depth;
            } else if (geometry instanceof THREE.SphereGeometry) {
                serializedObj.type = 'Sphere';
                serializedObj.props.radius = geometry.parameters.radius;
            } else if (geometry instanceof THREE.PlaneGeometry) {
                serializedObj.type = 'Plane';
                serializedObj.props.width = geometry.parameters.width;
                serializedObj.props.height = geometry.parameters.height;
            } else if (geometry instanceof THREE.CylinderGeometry) {
                serializedObj.type = 'Cylinder';
                serializedObj.props.radiusTop = geometry.parameters.radiusTop;
                serializedObj.props.radiusBottom = geometry.parameters.radiusBottom;
                serializedObj.props.height = geometry.parameters.height;
                serializedObj.props.radialSegments = geometry.parameters.radialSegments;
            } else if (geometry instanceof THREE.ConeGeometry) {
                serializedObj.type = 'Cone';
                serializedObj.props.radius = geometry.parameters.radius;
                serializedObj.props.height = geometry.parameters.height;
                serializedObj.props.radialSegments = geometry.parameters.radialSegments;
            } else if (geometry instanceof THREE.TorusGeometry) {
                serializedObj.type = 'Torus';
                serializedObj.props.radius = geometry.parameters.radius;
                serializedObj.props.tube = geometry.parameters.tube;
                serializedObj.props.radialSegments = geometry.parameters.radialSegments;
                serializedObj.props.tubularSegments = geometry.parameters.tubularSegments;
            } else if (geometry instanceof THREE.RingGeometry) {
                serializedObj.type = 'Ring';
                serializedObj.props.innerRadius = geometry.parameters.innerRadius;
                serializedObj.props.outerRadius = geometry.parameters.outerRadius;
                serializedObj.props.thetaSegments = geometry.parameters.thetaSegments;
            } else {
                serializedObj.type = 'Mesh';
            }
            
            // Serialize Material Color and Textures (focusing on map)
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            const material = materials.find(m => m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshBasicMaterial);
            
            if (material) {
                
                const materialData = {
                    type: material.type.replace('Material', ''), // e.g., 'MeshStandard'
                    color: material.color?.getHexString(),
                    textureMapId: material.map?.userData.assetId || null // BUG FIX: Initialize with existing assetId
                };

                // Check for Texture Map (Albedo)
                if (material.map && material.map.image) {
                     // Register texture asynchronously, but continue synchronous serialization using a placeholder
                     texturePromise = this._registerTexture(material.map.image, material.map)
                         .then(registration => {
                             if (registration) {
                                 // Update the serialized object's components definition in place (side effect)
                                 const currentMaterialData = serializedObj.components.material;
                                 if (currentMaterialData) {
                                     currentMaterialData.textureMapId = registration.assetId;
                                 }
                             }
                             return registration;
                         })
                         .catch(err => {
                             console.error("Texture registration failed:", err);
                             return null;
                         });
                    
                }
                serializedObj.components.material = materialData;
            }

        } else if (object instanceof THREE.DirectionalLight) {
            serializedObj.type = 'DirectionalLight';
            serializedObj.props.color = object.color.getHexString();
            serializedObj.props.intensity = object.intensity;
        } else if (object instanceof THREE.AmbientLight) {
            serializedObj.type = 'AmbientLight';
            serializedObj.props.color = object.color.getHexString();
            serializedObj.props.intensity = object.intensity;
        } else if (object instanceof THREE.PerspectiveCamera) {
            serializedObj.type = 'Camera';
        } else if (object.userData.animationNames) {
            // Object is a root of an animated model
            serializedObj.type = 'ModelRoot';
            serializedObj.props.animationNames = object.userData.animationNames;
        } else if (object.type === 'Object3D') {
             serializedObj.type = 'Object3D';
        }
        
        // 2. Serialize Components (ScriptComponent)
        if (object.userData.components?.script instanceof ScriptComponent) {
            serializedObj.components.logic = { 
                type: 'Script',
                scriptText: object.userData.components.script.scriptText,
            };
        }
        
        // 3. Serialize Tags (if any)
        if (object.userData.tags) {
             serializedObj.props.tags = Array.from(object.userData.tags);
        }

        return { serializedObj, texturePromise };
    }
    
    /**
     * Helper to serialize a UI component configuration.
     */
    _serializeUIComponent(component) {
        const config = component.config;
        const serializedConfig = {
            name: config.name,
            type: component.type,
            x: config.x,
            y: config.y,
            color: config.color,
            border: config.border,
            targetObjectName: config.targetObjectName || null,
        };
        
        if (component.type === 'button') {
            serializedConfig.width = config.width;
            serializedConfig.height = config.height;
        } else if (component.type === 'joystick') {
            serializedConfig.radius = config.radius;
        }
        
        // Serialize Script Component
        if (config.script instanceof ScriptComponent) {
            serializedConfig.script = {
                scriptText: config.script.scriptText
            };
        }
        
        return serializedConfig;
    }

    /**
     * Initiates the download of the scene Blob.
     * @param {Blob} blob 
     * @param {string} filename 
     */
    exportSceneFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Loads a scene from a JSON string.
     * @param {string} jsonString The scene data in JSON format.
     */
    async loadScene(jsonString) {
        let sceneData;
        try {
            sceneData = JSON.parse(jsonString);
        } catch (e) {
            throw new Error("Invalid scene file: failed to parse JSON.");
        }
        
        if (!sceneData.manifest || sceneData.manifest.engineVersion !== ENGINE_VERSION) {
            throw new Error(`Incompatible engine version. Scene requires ${sceneData.manifest?.engineVersion}, current is ${ENGINE_VERSION}.`);
        }
        
        // 1. Clear current scene and state
        this.clearScene();
        
        // 2. Register Assets
        if (sceneData.assets && Array.isArray(sceneData.assets)) {
            sceneData.assets.forEach(asset => {
                if (asset.hash) {
                    this.assetManager.assetIndex.set(asset.hash, {
                         assetId: asset.assetId,
                         mimeType: asset.mimeType,
                         hash: asset.hash,
                         size: asset.size,
                         url: asset.external,
                         data: asset.data,
                         encoding: asset.encoding,
                         external: !!asset.external, 
                    });
                }
            });
        }
        
        // 3. Load Global Scripts
        this.loadScript = sceneData.globalScripts?.load || '';
        this.updateScript = sceneData.globalScripts?.update || '';
        
        // 4. Create 3D Objects
        for (const objData of sceneData.objects) {
            const object = this._createObject(objData);
            // Objects are added to the scene within _createObject if they are placeholders or simple primitives
            if (object && object !== PLACEHOLDER_MESH) { 
                this.scene.add(object);
            }
        }
        
        // 5. Create UI Components
        if (sceneData.uiComponents) {
            for (const uiData of sceneData.uiComponents) {
                this._createUIComponent(uiData);
            }
        }
        
        // 6. Re-add scene basics (Lights, Grid, Ground)
        this.initSceneDefaults(); 
        
        // 7. Final UI refresh
        this.selectObject(null);
        UI.updateHierarchy(this.scene);
        this.render();
        
        console.log(`Scene '${sceneData.manifest.name}' loaded successfully.`);
    }

    /** 
     * Internal helper to create a THREE object from serialized data.
     */
    _createObject(data) {
        let object = null;
        let material = null;
        
        // Material Handling
        if (data.components?.material?.type === 'Standard' || data.components?.material?.type === 'MeshStandard') {
            material = new THREE.MeshStandardMaterial({ 
                color: parseInt(data.components.material.color || 'ffffff', 16) 
            });
        }
        
        // Geometry/Type Handling (Enhanced to handle primitive geometry sizes)
        if (data.type === 'Box') {
            const w = data.props?.width || 1;
            const h = data.props?.height || 1;
            const d = data.props?.depth || 1;
            object = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material || Game.create('cube').material);
        } else if (data.type === 'Sphere') {
            const radius = data.props?.radius || 0.5;
            object = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), material || Game.create('sphere').material);
        } else if (data.type === 'Plane') {
            const width = data.props?.width || 5;
            const height = data.props?.height || 5;
            object = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material || Game.create('plane').material);
        } else if (data.type === 'Cylinder') {
            const rt = data.props?.radiusTop || 0.5;
            const rb = data.props?.radiusBottom || 0.5;
            const h = data.props?.height || 1;
            const rs = data.props?.radialSegments || 16;
            object = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, rs), material || Game.create('cylinder').material);
        } else if (data.type === 'Cone') {
            const r = data.props?.radius || 0.5;
            const h = data.props?.height || 1;
            const rs = data.props?.radialSegments || 16;
            object = new THREE.Mesh(new THREE.ConeGeometry(r, h, rs), material || Game.create('cone').material);
        } else if (data.type === 'Torus') {
            const r = data.props?.radius || 0.8;
            const t = data.props?.tube || 0.3;
            const rs = data.props?.radialSegments || 16;
            const ts = data.props?.tubularSegments || 100;
            object = new THREE.Mesh(new THREE.TorusGeometry(r, t, rs, ts), material || Game.create('torus').material);
        } else if (data.type === 'Ring') {
            const ir = data.props?.innerRadius || 0.5;
            const or = data.props?.outerRadius || 1;
            const ts = data.props?.thetaSegments || 8;
            object = new THREE.Mesh(new THREE.RingGeometry(ir, or, ts), material || Game.create('ring').material);
        } else if (data.type === 'AmbientLight') {
            object = new THREE.AmbientLight(
                parseInt(data.props?.color || 'ffffff', 16), 
                data.props?.intensity || 0.5
            );
        } else if (data.type === 'DirectionalLight') {
            object = new THREE.DirectionalLight(
                parseInt(data.props?.color || 'ffffff', 16), 
                data.props?.intensity || 0.8
            );
        } else if (data.type === 'Camera' || data.type === 'PerspectiveCamera') {
            object = Game.create('camera');
        } else if (data.assetRef) {
            // For complex models, we need asset loading
            const assetDesc = Array.from(this.assetManager.assetIndex.values()).find(a => a.assetId === data.assetRef);
            
            if (assetDesc) {
                // Placeholder while loading
                object = PLACEHOLDER_MESH.clone();
                object.name = data.name + " (Loading...)";
                object.userData.assetRefId = data.assetRef;
                
                // Queue actual asset loading and replacement logic
                this.assetManager.queueAssetLoad(assetDesc)
                    .then(loadedResource => {
                        // Remove placeholder object from scene
                        if (object.parent) object.parent.remove(object);
                        this.disposeObject(object); // Clean up placeholder resources
                        
                        // Preserve original transform and name from serialized data
                        loadedResource.name = data.name; 
                        
                        loadedResource.position.set(data.transform.pos[0], data.transform.pos[1], data.transform.pos[2]);
                        loadedResource.rotation.set(
                            THREE.MathUtils.degToRad(data.transform.rot[0]),
                            THREE.MathUtils.degToRad(data.transform.rot[1]),
                            THREE.MathUtils.degToRad(data.transform.rot[2])
                        );
                        loadedResource.scale.set(data.transform.scale[0], data.transform.scale[1], data.transform.scale[2]);
                        
                        // Handle animations if present in model
                        if (data.props?.animationNames) {
                            loadedResource.userData.animationNames = data.props.animationNames;
                        }

                        this.scene.add(loadedResource);
                        
                        this.render();
                        UI.updateHierarchy(this.scene, this.selectedObject, this.selectedUIComponent);
                    })
                    .catch(err => {
                        console.error(`Failed to load asset ${data.assetRef}:`, err);
                        object.material.color.set(0xff00ff); 
                        object.name = data.name + " (LOAD ERROR)";
                        this.render();
                        UI.updateHierarchy(this.scene, this.selectedObject, this.selectedUIComponent);
                    });
            } else {
                console.error(`Asset reference ${data.assetRef} not found in manifest.`);
                object = PLACEHOLDER_MESH.clone();
                object.name = data.name + " (REF ERROR)";
            }
            // If we returned a placeholder, we apply its UUID now and return it immediately.
            if (object) {
                object.uuid = data.id;
            }
            return object; 
        } else if (data.type === 'Object3D') {
             object = new THREE.Object3D(); 
        }
        
        if (object) {
            object.uuid = data.id;
            object.name = data.name;
            
            // Apply Transform
            object.position.set(data.transform.pos[0], data.transform.pos[1], data.transform.pos[2]);
            object.rotation.set(
                THREE.MathUtils.degToRad(data.transform.rot[0]),
                THREE.MathUtils.degToRad(data.transform.rot[1]),
                THREE.MathUtils.degToRad(data.transform.rot[2])
            );
            object.scale.set(data.transform.scale[0], data.transform.scale[1], data.transform.scale[2]);

            // Load and apply Texture if reference exists
            const textureMapId = data.components?.material?.textureMapId;
            if (textureMapId && object.isMesh) {
                const assetDesc = Array.from(this.assetManager.assetIndex.values()).find(a => a.assetId === textureMapId);

                if (assetDesc) {
                    this.assetManager.queueAssetLoad(assetDesc)
                        .then(texture => {
                            if (texture instanceof THREE.Texture) {
                                // Store assetId on the texture object itself for future saving/cloning
                                texture.userData.assetId = assetDesc.assetId; 

                                const materials = Array.isArray(object.material) ? object.material : [object.material];
                                materials.forEach(m => { 
                                    if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshBasicMaterial) {
                                        m.map = texture; 
                                        m.needsUpdate = true;
                                    }
                                });
                                this.render();
                                // If the object is currently selected, refresh inspector to show texture data
                                if (this.selectedObject === object) {
                                     UI.updateInspector(object);
                                }
                            } else {
                                throw new Error("Loaded asset was not a THREE.Texture.");
                            }
                        })
                        .catch(err => {
                            console.error(`Failed to load/apply texture ${textureMapId}:`, err);
                        });
                }
            }


            // Apply Components (Scripts)
            if (data.components?.logic?.type === 'Script' && data.components.logic.scriptText) {
                const scriptComponent = new ScriptComponent(data.components.logic.scriptText);
                if (!object.userData.components) object.userData.components = {};
                object.userData.components.script = scriptComponent;
            }
            
            // Apply Tags
            if (data.props?.tags) {
                data.props.tags.forEach(tag => TagSystem.add(object, tag));
            }
        }
        
        return object;
    }
    
    /**
     * Internal helper to create a UI component from serialized data.
     */
    _createUIComponent(data) {
        const style = { color: data.color, border: data.border };

        let config;
        if (data.type === 'button') {
            hud.touch(data.name, data.x, data.y, data.width, data.height, style);
            config = this.uiComponents.get(data.name).config;
        } else if (data.type === 'joystick') {
            hud.joystick(data.name, data.x, data.y, data.radius, style);
            config = this.uiComponents.get(data.name).config;
        } else {
            return null;
        }
        
        config.targetObjectName = data.targetObjectName;

        if (data.script && data.script.scriptText) {
            config.script = new ScriptComponent(data.script.scriptText);
        } else if (data.type !== 'joystick') {
             config.script = null;
        }

        return config;
    }

    /** Clears all user-defined scene objects, UI components, and resets asset index. */
    clearScene() {
        // Clear 3D objects
        const objectsToDispose = [];
        this.scene.traverse((object) => {
            // Only consider top-level objects added directly to the scene, excluding the scene itself
            if (object.parent === this.scene && object !== this.scene) {
                // Exclude editor helpers and permanent scene defaults
                if (object.name !== "Ambient Light" && object.name !== "Directional Light" && 
                    object.name !== "Ground" && object.name !== "Grid" &&
                    !(object instanceof TransformControls)) {
                    objectsToDispose.push(object);
                }
            }
        });
        
        objectsToDispose.forEach(obj => {
            this.scene.remove(obj);
            this.disposeObject(obj);
        });
        
        // Reset editor selection
        this.selectObject(null);
        this.selectedUIComponent = null;

        // Clear UI components
        this.uiComponents.clear();
        hud.buttons.clear();
        hud.items.clear();
        
        // Clear assets 
        this.assetManager.clear();

        // Remove default objects/lights so they can be re-added by initSceneDefaults later, preventing duplicates.
        ["Ambient Light", "Directional Light", "Ground", "Grid"].forEach(name => {
            const obj = this.scene.getObjectByName(name);
            if (obj) this.scene.remove(obj);
        });
    }

    /**
     * Loads a GLB/GLTF model from a File object.
     * @param {File} file The GLB/GLTF file.
     */
    async loadGLBModel(file) {
        // Read file content
        const buffer = await file.arrayBuffer();
        const modelName = file.name.split('.').slice(0, -1).join('.');
        const mimeType = file.name.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json';
        
        // 1. Register asset synchronously (calculate hash, get assetId)
        const assetRegistration = await this.assetManager.registerAssetFromBuffer(
            mimeType, 
            buffer.slice(0), // Registering requires a copy since Buffer is used in parse later
            null, // No external URL
            modelName.replace(/[^a-zA-Z0-9_]/g, '_') // Clean name for assetId hint
        );
        
        const loader = new GLTFLoader();
        
        // 2. Load the model from the buffer
        loader.parse(buffer, '', (gltf) => {
            gltf.scene.name = modelName || 'GLTF_Model'; 
            
            // Link the object to the registered asset
            gltf.scene.userData.assetRefId = assetRegistration.assetId; 
            
            this.addObject(gltf.scene);
            
            // --- Animation Handling ---
            if (gltf.animations && gltf.animations.length > 0) {
                animax.add(gltf.scene, gltf.animations);
                gltf.scene.userData.animationNames = gltf.animations.map(clip => clip.name);
            }

            console.log(`GLB model '${gltf.scene.name}' loaded and registered as ${assetRegistration.assetId}.`);
        }, (error) => {
            console.error('Error loading GLB model:', error);
            alert('Error loading GLB model. Check console for details.');
        });
    }

    /**
     * Loads an OBJ model from a File object.
     * @param {File} file The OBJ file.
     */
    async loadOBJModel(file) {
        // Read file content as text for OBJLoader.parse
        const text = await file.text();
        
        // Convert text back to ArrayBuffer for hashing/serialization consistency
        const encoder = new TextEncoder();
        const buffer = encoder.encode(text).buffer; 
        
        const modelName = file.name.split('.').slice(0, -1).join('.');
        const mimeType = 'text/x-wavefront-obj';
        
        // 1. Register asset synchronously
        const assetRegistration = await this.assetManager.registerAssetFromBuffer(
            mimeType, 
            buffer.slice(0), // Registering requires a copy
            null,
            modelName.replace(/[^a-zA-Z0-9_]/g, '_')
        );

        const loader = new OBJLoader();
        try {
            const object = loader.parse(text);
            object.name = modelName || 'OBJ_Model'; 
            
            // Link the object to the registered asset
            object.userData.assetRefId = assetRegistration.assetId;
            
            // Apply a default material if no materials are found (e.g., no .mtl was loaded)
            object.traverse((child) => {
                if (child.isMesh && !child.material) {
                    child.material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
                }
            });
            this.addObject(object);
            console.log(`OBJ model '${object.name}' loaded and registered as ${assetRegistration.assetId}.`);
        } catch (error) {
            console.error('Error parsing OBJ model:', error);
            alert('Error parsing OBJ model. Check console for details.');
        }
    }
}

// Export the necessary components for UI or other modules
export { Game, HUD, animax, drak };