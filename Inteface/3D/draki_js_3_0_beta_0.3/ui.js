import * as THREE from 'three';
// Import Game factory and the new ScriptComponent
import { Game, ScriptComponent, animax } from './draki3d.js'; // Import Game factory, ScriptComponent, and animax
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'; // Import TransformControls for type checking

let editorInstance = null;

// Desktop UI Elements
const hierarchyList = document.getElementById('scene-graph');
const inspectorContent = document.getElementById('inspector-content');

// Mobile UI Elements
const hierarchyListMobile = document.getElementById('scene-graph-mobile');
const inspectorContentMobile = document.getElementById('inspector-content-mobile');

// New Play/Stop Buttons
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');

// Script Editor Elements
const loadScriptModal = new bootstrap.Modal(document.getElementById('loadScriptModal'));
// Changed from textarea to div for CodeMirror
const loadScriptEditorDiv = document.getElementById('load-script-editor'); 
let loadScriptCodeMirror; // CodeMirror instance

const updateScriptModal = new bootstrap.Modal(document.getElementById('updateScriptModal'));
// Changed from textarea to div for CodeMirror
const updateScriptEditorDiv = document.getElementById('update-script-editor');
let updateScriptCodeMirror; // CodeMirror instance

const saveLoadScriptButton = document.getElementById('save-load-script-button');
const saveUpdateScriptButton = document.getElementById('save-update-script-button');

// New Save/Load Elements
const saveSceneMenu = document.getElementById('save-scene-menu');
const loadSceneMenu = document.getElementById('load-scene-menu');
const newSceneMenu = document.getElementById('new-scene-menu'); // ADDED

// New Object Script Modal elements
const objectScriptModal = new bootstrap.Modal(document.getElementById('objectScriptModal'));
const objectScriptEditorDiv = document.getElementById('object-script-editor');
let objectScriptCodeMirror; // CodeMirror instance for the object script modal
const saveObjectScriptButton = document.getElementById('save-object-script-button');

// Model Loading Elements
const addGlbMenu = document.getElementById('add-glb-menu');
const addObjMenu = document.getElementById('add-obj-menu');
const modelFileInput = document.getElementById('model-file-input');

// A map to store CodeMirror instances for each object's script component
const scriptEditors = new Map();

export function init(editor) {
    editorInstance = editor;

    // Initialize CodeMirror editors
    loadScriptCodeMirror = CodeMirror(loadScriptEditorDiv, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
    });

    updateScriptCodeMirror = CodeMirror(updateScriptEditorDiv, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
    });
    
    // Initialize the new CodeMirror editor for object scripts
    objectScriptCodeMirror = CodeMirror(objectScriptEditorDiv, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
    });

    // Modified to use editorInstance.createGameObjectFromUI
    document.getElementById('add-cube-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('cube'));
    document.getElementById('add-sphere-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('sphere'));
    document.getElementById('add-plane-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('plane'));
    document.getElementById('add-cylinder-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('cylinder'));
    document.getElementById('add-cone-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('cone'));
    document.getElementById('add-torus-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('torus'));
    document.getElementById('add-ring-menu').addEventListener('click', () => editorInstance.createGameObjectFromUI('ring'));

    // Event listener for New Scene
    newSceneMenu.addEventListener('click', () => editorInstance.newScene());

    // Event listeners for new HUD components
    document.getElementById('add-joystick-menu').addEventListener('click', () => editorInstance.createJoystickFromUI());
    document.getElementById('add-touch-button-menu').addEventListener('click', () => editorInstance.createButtonFromUI(false)); // Touch button
    document.getElementById('add-click-button-menu').addEventListener('click', () => editorInstance.createButtonFromUI(true)); // Click button

    // Event listeners for model loading
    addGlbMenu.addEventListener('click', () => {
        modelFileInput.setAttribute('accept', '.glb,.gltf');
        modelFileInput.click();
    });

    addObjMenu.addEventListener('click', () => {
        modelFileInput.setAttribute('accept', '.obj');
        modelFileInput.click();
    });
    
    // --- Scene Save/Load Event Listeners ---
    saveSceneMenu.addEventListener('click', async () => {
        try {
            // Options are passed here, e.g., externalizeLarge: true
            const blob = await editorInstance.saveScene({ sceneName: 'My Draki Scene', author: 'User' });
            editorInstance.exportSceneFile(blob, 'scene.draki.json');
            alert('Scene preparation complete. Check downloads.');
        } catch (error) {
            console.error('Failed to save scene:', error);
            alert('Error saving scene. See console.');
        }
    });

    loadSceneMenu.addEventListener('click', () => {
        modelFileInput.setAttribute('accept', '.json,.draki.json');
        modelFileInput.click();
    });


    modelFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            // No file selected, reset input and do nothing
            event.target.value = '';
            return;
        }

        const fileName = file.name.toLowerCase();
        
        const resetInput = () => {
             event.target.value = '';
             // Reset accept attribute back to models after processing
             modelFileInput.setAttribute('accept', '.glb,.gltf,.obj');
        }


        if (fileName.endsWith('.json') || fileName.endsWith('.draki.json')) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // Start scene loading. Scripts are not executed unless trusted option is used, but we skip that complex step for now.
                    await editorInstance.loadScene(e.target.result);
                } catch (error) {
                    console.error('Scene Loading Failed:', error);
                    alert(`Failed to load scene: ${error.message}`);
                }
            };
            reader.readAsText(file);
        } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
            editorInstance.loadGLBModel(file);
        } else if (fileName.endsWith('.obj')) {
            editorInstance.loadOBJModel(file);
        } else {
            alert('Unsupported file type. Please select a GLB, GLTF, OBJ, or DRAKI JSON file.');
        }
        
        // Clear the file input value so that selecting the same file again triggers 'change'
        resetInput();
    });

    // Event Listeners for Play/Stop buttons
    playButton.addEventListener('click', () => editorInstance.playGame());
    stopButton.addEventListener('click', () => editorInstance.stopGame());

    // Event listeners for script editors
    document.getElementById('open-load-script-editor').addEventListener('click', () => {
        loadScriptCodeMirror.setValue(editorInstance.loadScript);
        loadScriptCodeMirror.refresh(); // Important for CodeMirror inside modals
    });
    saveLoadScriptButton.addEventListener('click', () => {
        editorInstance.setLoadScript(loadScriptCodeMirror.getValue());
        loadScriptModal.hide();
    });

    document.getElementById('open-update-script-editor').addEventListener('click', () => {
        updateScriptCodeMirror.setValue(editorInstance.updateScript);
        updateScriptCodeMirror.refresh(); // Important for CodeMirror inside modals
    });
    saveUpdateScriptButton.addEventListener('click', () => {
        editorInstance.setUpdateScript(updateScriptCodeMirror.getValue());
        updateScriptModal.hide();
    });

    // Make sure CodeMirror refreshes when the modal is shown
    document.getElementById('loadScriptModal').addEventListener('shown.bs.modal', () => {
        loadScriptCodeMirror.refresh();
    });
    document.getElementById('updateScriptModal').addEventListener('shown.bs.modal', () => {
        updateScriptCodeMirror.refresh();
    });
    document.getElementById('objectScriptModal').addEventListener('shown.bs.modal', () => {
        objectScriptCodeMirror.refresh();
    });

    // Event listener for the new "Save Script" button in the object script modal
    saveObjectScriptButton.addEventListener('click', () => {
        const selectedObject = editorInstance.selectedObject;
        const selectedUIComponent = editorInstance.selectedUIComponent;
        
        let target = null; // The object or config being scripted
        let scriptHolder = null; // Where the script component instance is stored
        
        if (selectedObject) {
            target = selectedObject;
            // For 3D objects, the component is stored in target.userData.components
            scriptHolder = target.userData.components;
        } else if (selectedUIComponent) {
            target = selectedUIComponent.config;
            // For UI components, the script is stored directly on the config object
            scriptHolder = target;
        } else {
            console.error("No object or UI component selected to save script to.");
            objectScriptModal.hide();
            return;
        }


        const scriptText = objectScriptCodeMirror.getValue();
        const scriptKey = 'script'; 
        
        // 1. Determine if we are adding or editing
        if (!scriptHolder || !scriptHolder[scriptKey]) {
            // Adding a new script component
            const newScript = new ScriptComponent(scriptText);
            
            if (target === selectedObject) {
                 // Ensure components object exists for 3D objects
                if (!target.userData.components) {
                    target.userData.components = {};
                }
                target.userData.components[scriptKey] = newScript;
            } else { // UI Component config
                target[scriptKey] = newScript;
            }
        } else {
            // Editing existing script component
            let scriptInstance = target === selectedObject 
                                ? target.userData.components[scriptKey] 
                                : target[scriptKey];
            
            scriptInstance.setScript(scriptText);
        }
        
        // Hide the modal and update the inspector to show the changes
        objectScriptModal.hide();
        // Pass both parameters back to updateInspector to handle context switching properly
        updateInspector(editorInstance.selectedObject, editorInstance.selectedUIComponent);
    });
}

/**
 * Updates the disabled state of the Play/Stop buttons based on the game's running status.
 * @param {boolean} isPlaying True if the game is currently running, false otherwise.
 */
export function setPlayButtonState(isPlaying) {
    playButton.disabled = isPlaying;
    stopButton.disabled = !isPlaying;
}

function getIconForUIComponent(type) {
    if (type === 'button') return 'bi-hand-index';
    if (type === 'joystick') return 'bi-joystick';
    return 'bi-puzzle';
}

function updateHierarchyList(listElement, scene, selectedObject, selectedUIComponent) {
    listElement.innerHTML = '';
    
    // --- 1. List 3D Objects ---
    scene.children.forEach(object => {
        // Exclude editor-internal helpers from the hierarchy list
        // TransformControls, GridHelper, and BoxHelper (used for selectionBox) should not appear here.
        if (object instanceof THREE.GridHelper ||
            object instanceof TransformControls || // Use imported TransformControls for instanceof check
            object instanceof THREE.BoxHelper) {
            return; // Skip this object
        }

        const li = document.createElement('li');
        // Use object's name, or its type, or a generic 'Unnamed Object'
        li.textContent = object.name || object.type || 'Unnamed Object';
        li.dataset.uuid = object.uuid;
        // Basic styling for mobile list
        if (listElement.id === 'scene-graph-mobile') {
            // Removed manual styling lines, now handled by style.css
        }

        // Add icon
        const icon = document.createElement('i');
        icon.className = `bi ${getIconForObject(object)}`;
        li.prepend(icon);

        if (selectedObject && object.uuid === selectedObject.uuid) {
            li.classList.add('selected');
        }

        li.addEventListener('click', () => {
            editorInstance.selectObject(object);
            // Close offcanvas menu on mobile after selection
            const offcanvasElement = document.getElementById('hierarchy-offcanvas');
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
            if (offcanvas) {
                offcanvas.hide();
            }
        });
        listElement.appendChild(li);
    });

    // --- Add a divider if UI elements are present ---
    if (editorInstance && editorInstance.uiComponents.size > 0) {
        const divider = document.createElement('hr');
        divider.className = 'dropdown-divider my-2';
        listElement.appendChild(divider);

        const uiHeader = document.createElement('div');
        uiHeader.className = 'text-muted ms-2 mt-1 mb-1';
        uiHeader.textContent = 'UI Components';
        listElement.appendChild(uiHeader);
    }
    
    // --- 2. List 2D UI Components ---
    if (editorInstance) {
        editorInstance.uiComponents.forEach((component, name) => {
            const li = document.createElement('li');
            li.textContent = name;
            li.dataset.name = name; // Use name as identifier
            
            // Add icon
            const icon = document.createElement('i');
            icon.className = `bi ${getIconForUIComponent(component.type)}`;
            li.prepend(icon);
            
            // Apply selection state
            if (selectedUIComponent && selectedUIComponent.config.name === name) {
                li.classList.add('selected');
            }
            
            li.addEventListener('click', () => {
                editorInstance.selectUIComponent(name);
                // Close offcanvas menu on mobile after selection
                const offcanvasElement = document.getElementById('hierarchy-offcanvas');
                const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvas) {
                    offcanvas.hide();
                }
            });
            listElement.appendChild(li);
        });
    }
}

export function updateHierarchy(scene, selectedObject = null, selectedUIComponent = null) {
    updateHierarchyList(hierarchyList, scene, selectedObject, selectedUIComponent);
    updateHierarchyList(hierarchyListMobile, scene, selectedObject, selectedUIComponent);
}

function getIconForObject(object) {
    if (object.isMesh) {
        if (object.geometry instanceof THREE.BoxGeometry) return 'bi-box';
        if (object.geometry instanceof THREE.SphereGeometry) return 'bi-globe';
        if (object.geometry instanceof THREE.PlaneGeometry) return 'bi-square';
        if (object.geometry instanceof THREE.CylinderGeometry) return 'bi-record-circle';
        // Check for GLTF/OBJ specific common child types if needed, or a generic 3D icon
        return 'bi-bounding-box'; // Generic mesh icon
    }
    if (object.isLight) {
        if (object instanceof THREE.DirectionalLight) return 'bi-brightness-high';
        if (object instanceof THREE.PointLight) return 'bi-lightbulb-fill';
        if (object instanceof THREE.AmbientLight) return 'bi-sun';
        return 'bi-lightbulb'; // Generic light
    }
    if (object.isCamera) {
        if (object instanceof THREE.PerspectiveCamera) return 'bi-camera-video';
        if (object instanceof THREE.OrthographicCamera) return 'bi-camera';
        return 'bi-camera'; // Generic camera
    }
    if (object instanceof THREE.Object3D) {
        // If it's a generic Object3D and has children, it might be a loaded model's root
        if (object.children.length > 0) return 'bi-box-seam'; // Icon for a model group
        return 'bi-app'; // General Object3D (e.g., an empty parent)
    }
    return 'bi-question-diamond'; // Fallback for unknown types
}

function updateInspectorContent(contentElement, object, uiComponent) {
    contentElement.innerHTML = '';
    
    if (object) {
        // --- Transform Component (Always present for any THREE.Object3D) ---
        const transformComponent = createComponent('Transform', true);
        contentElement.appendChild(transformComponent.header);
        contentElement.appendChild(transformComponent.body);
       
        // If object is a mesh, provide texture controls in Appearance section
        if (object.isMesh) {
            // Appearance / Texture controls
            const textureComp = createComponent('Textures', true);
            contentElement.appendChild(textureComp.header);
            contentElement.appendChild(textureComp.body);

            textureComp.body.appendChild(createTextureControls(object));
            
            // --- Material Color Controls (new) ---
            const mat = Array.isArray(object.material) ? object.material[0] : object.material;
            if (mat && mat.color) {
                textureComp.body.appendChild(createColorInput('Material Color', mat.color, (newColor) => {
                    // Apply to all materials if array, otherwise single
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => { if (m.color) m.color.copy(newColor); m.needsUpdate = true; });
                    } else {
                        object.material.color.copy(newColor);
                        object.material.needsUpdate = true;
                    }
                    editorInstance.render();
                }));
            }

            // --- Geometry Size Controls (new) ---
            if (object.geometry instanceof THREE.PlaneGeometry) {
                textureComp.body.appendChild(createNumberInput('Width', object.geometry.parameters.width || 1, (v) => {
                    const h = object.geometry.parameters.height || 1;
                    object.geometry.dispose();
                    object.geometry = new THREE.PlaneGeometry(v, h);
                    editorInstance.render();
                }, 0.1, 0.01));
                textureComp.body.appendChild(createNumberInput('Height', object.geometry.parameters.height || 1, (v) => {
                    const w = object.geometry.parameters.width || 1;
                    object.geometry.dispose();
                    object.geometry = new THREE.PlaneGeometry(w, v);
                    editorInstance.render();
                }, 0.1, 0.01));
            } else if (object.geometry instanceof THREE.BoxGeometry) {
                // For boxes, expose width/height/depth but show two main dims for brevity
                textureComp.body.appendChild(createNumberInput('Width', object.geometry.parameters.width || 1, (v) => {
                    const h = object.geometry.parameters.height || 1;
                    const d = object.geometry.parameters.depth || 1;
                    object.geometry.dispose();
                    object.geometry = new THREE.BoxGeometry(v, h, d);
                    editorInstance.render();
                }, 0.1, 0.01));
                textureComp.body.appendChild(createNumberInput('Height', object.geometry.parameters.height || 1, (v) => {
                    const w = object.geometry.parameters.width || 1;
                    const d = object.geometry.parameters.depth || 1;
                    object.geometry.dispose();
                    object.geometry = new THREE.BoxGeometry(w, v, d);
                    editorInstance.render();
                }, 0.1, 0.01));
            }
        }

        // Name
        transformComponent.body.appendChild(createTextInput('Name', object.name, (value) => {
            object.name = value;
            updateHierarchy(editorInstance.scene, object);
            editorInstance.render(); // Request render for name change
        }));

        // Position, Rotation, Scale
        transformComponent.body.appendChild(createVector3Input('Position', object.position, (axis, value) => {
            object.position[axis] = value;
            editorInstance.render();
        }));
        transformComponent.body.appendChild(createVector3Input('Rotation', object.rotation, (axis, value) => {
            // Ensure rotation is applied correctly, as Euler values are in radians.
            // Input is in degrees for user friendliness.
            object.rotation[axis] = THREE.MathUtils.degToRad(value);
            editorInstance.render();
        }, true)); // is degrees
        transformComponent.body.appendChild(createVector3Input('Scale', object.scale, (axis, value) => {
            // Ensure scale values are not zero to prevent issues
            if (value === 0) value = 0.001; // Prevent scale from being 0
            object.scale[axis] = value;
            editorInstance.render();
        }));

        // --- Ambient Light Component ---
        if (object instanceof THREE.AmbientLight) {
            const ambientLightComp = createComponent('Ambient Light', true);
            contentElement.appendChild(ambientLightComp.header);
            contentElement.appendChild(ambientLightComp.body);

            ambientLightComp.body.appendChild(createColorInput('Color', object.color, (newColor) => {
                object.color.copy(newColor);
                editorInstance.render();
            }));
            ambientLightComp.body.appendChild(createNumberInput('Intensity', object.intensity, (value) => {
                object.intensity = value;
                editorInstance.render();
            }, 0.01, 0)); // Step 0.01, min 0
        }

        // --- Directional Light Component ---
        if (object instanceof THREE.DirectionalLight) {
            const directionalLightComp = createComponent('Directional Light', true);
            contentElement.appendChild(directionalLightComp.header);
            contentElement.appendChild(directionalLightComp.body);

            directionalLightComp.body.appendChild(createColorInput('Color', object.color, (newColor) => {
                object.color.copy(newColor);
                editorInstance.render();
            }));
            directionalLightComp.body.appendChild(createNumberInput('Intensity', object.intensity, (value) => {
                object.intensity = value;
                editorInstance.render();
            }, 0.01, 0)); // Step 0.01, min 0
            directionalLightComp.body.appendChild(createVector3Input('Position', object.position, (axis, value) => {
                object.position[axis] = value;
                editorInstance.render();
            }));
        }

        // --- Animation Component ---
        if (object.userData.animationNames && object.userData.animationNames.length > 0) {
            const animComp = createComponent('Animations', true);
            contentElement.appendChild(animComp.header);
            contentElement.appendChild(animComp.body);
            
            const animationNames = object.userData.animationNames;
            const objectName = object.name;

            const listContainer = document.createElement('div');

            animationNames.forEach(animName => {
                const animItem = document.createElement('div');
                animItem.className = 'd-flex justify-content-between align-items-center p-2 mb-1 rounded';
                animItem.style.backgroundColor = 'var(--bg-dark-3)';
                animItem.style.fontSize = '0.9em';

                const nameSpan = document.createElement('span');
                nameSpan.textContent = animName;
                animItem.appendChild(nameSpan);

                const playButton = document.createElement('button');
                playButton.className = 'btn btn-sm btn-outline-success';
                playButton.innerHTML = '<i class="bi bi-play-fill"></i>';
                playButton.title = `Play ${animName}`;
                
                playButton.addEventListener('click', () => {
                    if (!editorInstance.isGameRunning) {
                        alert("Start the game (Play button) before playing animations.");
                        return;
                    }
                    
                    // Use the globally available animax imported from draki3d.js
                    animax.play(objectName, animName);
                });

                animItem.appendChild(playButton);
                listContainer.appendChild(animItem);
            });

            // Add a Stop All button
            const stopAllButton = document.createElement('button');
            stopAllButton.className = 'btn btn-sm btn-outline-secondary w-100 mt-2';
            stopAllButton.innerHTML = '<i class="bi bi-stop-fill me-2"></i>Stop Animations';
            stopAllButton.addEventListener('click', () => {
                if (!editorInstance.isGameRunning) {
                     alert("Start the game (Play button) before stopping animations.");
                     return;
                }
                animax.stop(objectName);
            });
            
            animComp.body.appendChild(listContainer);
            animComp.body.appendChild(stopAllButton);
        }
        
        // --- Script Component ---
        if (object.userData.components?.script) {
            const scriptComp = createComponent('Script', true);
            contentElement.appendChild(scriptComp.header);
            contentElement.appendChild(scriptComp.body);

            const scriptInstance = object.userData.components.script;

            // --- Script Preview ---
            const previewLabel = document.createElement('label');
            previewLabel.textContent = 'Script Preview';
            previewLabel.className = 'form-label';
            const scriptPreview = document.createElement('textarea');
            scriptPreview.className = 'script-preview';
            scriptPreview.value = scriptInstance.scriptText;
            scriptPreview.readOnly = true;
            scriptComp.body.appendChild(previewLabel);
            scriptComp.body.appendChild(scriptPreview);
            
            // Error display area
            const errorDisplay = document.createElement('div');
            errorDisplay.className = 'alert alert-danger p-2 mt-2';
            errorDisplay.style.fontSize = '0.8em';
            errorDisplay.style.display = 'none'; // Hidden by default
            if (scriptInstance.lastError) {
                errorDisplay.textContent = `Error: ${scriptInstance.lastError}`;
                errorDisplay.style.display = 'block';
            }
            scriptComp.body.appendChild(errorDisplay);

            // --- Buttons ---
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'd-flex gap-2 mt-2';

            // Edit Script Button
            const editScriptButton = document.createElement('button');
            editScriptButton.className = 'btn btn-outline-primary flex-grow-1';
            editScriptButton.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Script';
            editScriptButton.addEventListener('click', () => {
                // Populate the modal's editor with the current script and show it
                objectScriptCodeMirror.setValue(scriptInstance.scriptText);
                objectScriptModal.show();
            });
            buttonGroup.appendChild(editScriptButton);

            // Remove Script Button
            const removeScriptButton = document.createElement('button');
            removeScriptButton.className = 'btn btn-outline-danger';
            removeScriptButton.title = 'Remove Script Component';
            removeScriptButton.innerHTML = '<i class="bi bi-trash"></i>';
            removeScriptButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove this script component?')) {
                    delete object.userData.components.script;
                    // If the components object is now empty, remove it too
                    if (Object.keys(object.userData.components).length === 0) {
                        delete object.userData.components;
                    }
                    updateInspector(object); // Refresh the inspector
                }
            });
            buttonGroup.appendChild(removeScriptButton);

            scriptComp.body.appendChild(buttonGroup);
        }
        
        // --- Add Component Button ---
        const componentButtonContainer = document.createElement('div');
        componentButtonContainer.className = 'mt-3';
        
        // For now, only one component type is available, "Script"
        // We only show the button if a script component doesn't already exist.
        if (!object.userData.components?.script) {
             const addScriptButton = document.createElement('button');
            addScriptButton.className = 'btn btn-outline-secondary w-100';
            addScriptButton.innerHTML = '<i class="bi bi-file-earmark-code me-2"></i>Add Script Component';
            addScriptButton.addEventListener('click', () => {
                // Set default script text in the modal editor
                const defaultScript = '// Use `self` to access this object\n// Example: self.rotation.y += 0.01;';
                objectScriptCodeMirror.setValue(defaultScript);
                
                // Show the modal
                objectScriptModal.show();
            });
            componentButtonContainer.appendChild(addScriptButton);
        }
        
        contentElement.appendChild(componentButtonContainer);

        // --- Add a Delete button for all selectable objects ---
        // Exclude special editor objects from being deleted, e.g., Ambient Light, Directional Light, Ground
        const isDeletable = !(object instanceof THREE.AmbientLight) &&
                           !(object instanceof THREE.DirectionalLight) &&
                           object.name !== "Ground"; // Assuming "Ground" is its assigned name
    
        if (isDeletable) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger w-100 mt-3'; // Bootstrap styling
            deleteButton.innerHTML = '<i class="bi bi-trash-fill me-2"></i>Delete Object';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${object.name}"?`)) {
                    editorInstance.deleteSelectedObject();
                }
            });
            
            // --- Clone Button (new) ---
            const cloneButton = document.createElement('button');
            cloneButton.className = 'btn btn-outline-secondary w-100 mt-2';
            cloneButton.innerHTML = '<i class="bi bi-files me-2"></i>Clone Object';
            cloneButton.addEventListener('click', () => {
                // Deep clone object (geometry/materials duplicated where possible)
                const clone = object.clone(true);
                clone.name = object.name + ' (Clone)';
                
                // Try to clone geometries/materials to avoid shared references
                clone.traverse(node => {
                    if (node.isMesh) {
                        if (node.geometry) node.geometry = node.geometry.clone();
                        if (Array.isArray(node.material)) {
                            node.material = node.material.map(m => m.clone());
                        } else if (node.material) {
                            node.material = node.material.clone();
                        }
                    }
                });
                
                // Slight offset to avoid exact overlap — copy into existing position (don't reassign the property)
                if (object.position && clone.position) {
                    clone.position.copy(object.position);
                    clone.position.x += 0.5;
                }
                editorInstance.addObject(clone);
            });

            contentElement.appendChild(cloneButton);
            contentElement.appendChild(deleteButton);
        }
    } else if (uiComponent) {
        // --- 2D UI Component Inspection Logic ---
        
        const name = uiComponent.config.name;
        const config = uiComponent.config;
        
        // --- Header/Name Component ---
        const headerComp = createComponent(name, true);
        contentElement.appendChild(headerComp.header);
        contentElement.appendChild(headerComp.body);
        
        headerComp.body.appendChild(createTextInput('Component Type', uiComponent.type.charAt(0).toUpperCase() + uiComponent.type.slice(1), () => {}, true)); // Read-only

        // --- Target Control Component ---
        const targetComp = createComponent('Target Control', true);
        contentElement.appendChild(targetComp.header);
        contentElement.appendChild(targetComp.body);
        
        // Name input for the target 3D object
        targetComp.body.appendChild(createTextInput('Target Object Name (3D)', config.targetObjectName || '', (value) => {
            config.targetObjectName = value || null; // Store null if empty string
            editorInstance.render();
        }));

        // --- UI Transform Component (Position and Size/Radius) ---
        const transformComp = createComponent('UI Transform (Pixels)', true);
        contentElement.appendChild(transformComp.header);
        contentElement.appendChild(transformComp.body);
        
        transformComp.body.appendChild(createNumberInput('X Position', config.x, (value) => {
            config.x = value;
            editorInstance.render();
        }, 1, 0));
        
        transformComp.body.appendChild(createNumberInput('Y Position', config.y, (value) => {
            config.y = value;
            editorInstance.render();
        }, 1, 0));
        
        if (uiComponent.type === 'button') {
            transformComp.body.appendChild(createNumberInput('Width', config.width, (value) => {
                config.width = value;
                editorInstance.render();
            }, 1, 10));
            
            transformComp.body.appendChild(createNumberInput('Height', config.height, (value) => {
                config.height = value;
                editorInstance.render();
            }, 1, 10));
        }
        
        if (uiComponent.type === 'joystick') {
             transformComp.body.appendChild(createNumberInput('Radius', config.radius, (value) => {
                config.radius = value;
                editorInstance.render();
            }, 1, 10));
        }

        // --- Appearance Component ---
        const appearanceComp = createComponent('Appearance', true);
        contentElement.appendChild(appearanceComp.header);
        contentElement.appendChild(appearanceComp.body);
        
        // Background Color
        appearanceComp.body.appendChild(createHexColorInput('Color', config.color, (newColor) => {
            config.color = newColor;
            editorInstance.render();
        }));
        
        // Border Color
        appearanceComp.body.appendChild(createHexColorInput('Border Color', config.border, (newColor) => {
            config.border = newColor;
            editorInstance.render();
        }));

        
        // --- Script Component for UI ---
        if (config.script) {
            const scriptComp = createComponent('Script', true);
            contentElement.appendChild(scriptComp.header);
            contentElement.appendChild(scriptComp.body);

            const scriptInstance = config.script;

            // --- Script Preview ---
            const previewLabel = document.createElement('label');
            previewLabel.textContent = 'Script Preview';
            previewLabel.className = 'form-label';
            const scriptPreview = document.createElement('textarea');
            scriptPreview.className = 'script-preview';
            scriptPreview.value = scriptInstance.scriptText;
            scriptPreview.readOnly = true;
            scriptComp.body.appendChild(previewLabel);
            scriptComp.body.appendChild(scriptPreview);
            
            // Error display area
            const errorDisplay = document.createElement('div');
            errorDisplay.className = 'alert alert-danger p-2 mt-2';
            errorDisplay.style.fontSize = '0.8em';
            errorDisplay.style.display = 'none'; // Hidden by default
            if (scriptInstance.lastError) {
                errorDisplay.textContent = `Error: ${scriptInstance.lastError}`;
                errorDisplay.style.display = 'block';
            }
            scriptComp.body.appendChild(errorDisplay);

            // --- Buttons ---
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'd-flex gap-2 mt-2';

            // Edit Script Button
            const editScriptButton = document.createElement('button');
            editScriptButton.className = 'btn btn-outline-primary flex-grow-1';
            editScriptButton.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Script';
            editScriptButton.addEventListener('click', () => {
                // Populate the modal's editor with the current script and show it
                objectScriptCodeMirror.setValue(scriptInstance.scriptText);
                objectScriptModal.show();
            });
            buttonGroup.appendChild(editScriptButton);

            // Remove Script Button
            const removeScriptButton = document.createElement('button');
            removeScriptButton.className = 'btn btn-outline-danger';
            removeScriptButton.title = 'Remove Script Component';
            removeScriptButton.innerHTML = '<i class="bi bi-trash"></i>';
            removeScriptButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove this script component?')) {
                    config.script = null; // Remove script from UI component config
                    updateInspector(editorInstance.selectedObject, editorInstance.selectedUIComponent); // Refresh the inspector
                }
            });
            buttonGroup.appendChild(removeScriptButton);

            scriptComp.body.appendChild(buttonGroup);
        }
        
        // --- Add Component Button (Script) ---
        const componentButtonContainer = document.createElement('div');
        componentButtonContainer.className = 'mt-3';
        
        if (!config.script) {
             const addScriptButton = document.createElement('button');
            addScriptButton.className = 'btn btn-outline-secondary w-100';
            addScriptButton.innerHTML = '<i class="bi bi-file-earmark-code me-2"></i>Add Script Component';
            addScriptButton.addEventListener('click', () => {
                // Set default script text in the modal editor
                let defaultScript;
                if (uiComponent.type === 'joystick') {
                    // If it's a joystick, suggest movement relative to the vector property
                    defaultScript = '// Joystick Script: Runs every frame while playing.\n// self contains properties like: name, x, y, radius, vector, targetObjectName.\n\n// NOTE: If targetObjectName is set, a default movement script is automatically applied in draki3d.js using camera-relative movement.\n// Use this editor to write custom logic, for example:\n\n// self.vector.x: Strafe (-1 to 1)\n// self.vector.y: Forward/Backward (-1 to 1, POSITIVE = Forward)\n\nif (self.targetObjectName && (self.vector.x !== 0 || self.vector.y !== 0)) {\n    const target = drak(self.targetObjectName).object();\n    // Example: Rotate target object based on X vector input\n    if (target) {\n        target.rotation.y += self.vector.x * 0.05;\n    }\n}';
                } else if (uiComponent.type === 'button') {
                    // If it's a button, suggest rotation
                    defaultScript = '// Button Script: Runs every frame while playing.\n// self contains properties like: name, x, y, width, height, targetObjectName.\n\n// Example: Rotate target object while game is running\nif (self.targetObjectName) {\n    drak(self.targetObjectName).set("rotation.y", drak(self.targetObjectName).get("rotation.y") + 0.01);\n}';
                } else {
                     defaultScript = '// Use `self` to access the UI config (x, y, targetObjectName, etc.)\n// Example: if (self.targetObjectName) drak(self.targetObjectName).set("position.x", self.x / 100);';
                }
                
                objectScriptCodeMirror.setValue(defaultScript);
                
                // Show the modal
                objectScriptModal.show();
            });
            componentButtonContainer.appendChild(addScriptButton);
        }
        
        contentElement.appendChild(componentButtonContainer);

        
        // --- Delete button ---
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger w-100 mt-3';
        deleteButton.innerHTML = '<i class="bi bi-trash-fill me-2"></i>Delete UI Component';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
                editorInstance.deleteUIComponent(name);
            }
        });
        contentElement.appendChild(deleteButton);


    } else {
        // Nothing selected
        contentElement.innerHTML = '<p class="text-secondary p-2">Select an object to inspect its properties.</p>';
    }
}

export function updateInspector(object, uiComponent = null) {
    updateInspectorContent(inspectorContent, object, uiComponent);
    updateInspectorContent(inspectorContentMobile, object, uiComponent);
    // Close offcanvas menu on mobile after selection
    const offcanvasElement = document.getElementById('inspector-offcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide();
    }
}

function createComponent(name, isOpen = true) {
    const header = document.createElement('div');
    header.className = 'component-header';
    header.textContent = name;

    const body = document.createElement('div');
    body.className = 'component-body';
    body.style.display = isOpen ? 'block' : 'none';

    header.addEventListener('click', () => {
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    return { header, body };
}

function createTextInput(label, value, onChange, readOnly = false) {
    const group = document.createElement('div');
    group.className = 'property-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.readOnly = readOnly;
    
    if (!readOnly) {
        input.addEventListener('change', (e) => onChange(e.target.value));
        input.addEventListener('keyup', (e) => onChange(e.target.value)); // For more immediate feedback
        // Prevent clicks on inputs from bubbling to parent handlers (e.g., selection/drag)
        input.addEventListener('pointerdown', (e) => e.stopPropagation());
        input.addEventListener('mousedown', (e) => e.stopPropagation());
        input.addEventListener('touchstart', (e) => e.stopPropagation());
    } else {
        input.style.backgroundColor = 'var(--bg-dark-3)';
    }

    group.appendChild(labelEl);
    group.appendChild(input);
    return group;
}

function createNumberInput(label, value, onChange, step = 0.1, min = -Infinity, max = Infinity) {
    const group = document.createElement('div');
    group.className = 'property-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = value;
    input.step = step;
    input.min = min;
    input.max = max;
    input.addEventListener('change', (e) => onChange(parseFloat(e.target.value)));
    input.addEventListener('input', (e) => onChange(parseFloat(e.target.value))); // For live updates

    // Prevent input interactions from bubbling and being intercepted by other UI handlers
    input.addEventListener('pointerdown', (e) => e.stopPropagation());
    input.addEventListener('mousedown', (e) => e.stopPropagation());
    input.addEventListener('touchstart', (e) => e.stopPropagation());

    group.appendChild(labelEl);
    group.appendChild(input);
    return group;
}

function createColorInput(label, color, onChange) {
    const group = document.createElement('div');
    group.className = 'property-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    group.appendChild(labelEl);

    const input = document.createElement('input');
    input.type = 'color';
    // Convert THREE.Color to hex string (e.g., #RRGGBB)
    input.value = '#' + color.getHexString();

    input.addEventListener('input', (e) => {
        // Parse hex string and update THREE.Color
        color.set(e.target.value);
        onChange(color);
    });
    group.appendChild(input);
    return group;
}

// Helper for Hex Color input (since HUD colors are hex strings, not THREE.Color)
function createHexColorInput(label, hexValue, onChange) {
    const group = document.createElement('div');
    group.className = 'property-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    group.appendChild(labelEl);

    // Extract RRGGBB and AA components
    const baseHex = hexValue.length >= 7 ? hexValue.substring(0, 7) : hexValue;
    const alphaHex = hexValue.length === 9 ? hexValue.substring(7) : 'ff';
    const initialAlphaPercent = Math.round(parseInt(alphaHex, 16) / 2.55);

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '10px';
    container.style.alignItems = 'flex-end';
    
    // 1. Color Picker
    const colorGroup = document.createElement('div');
    colorGroup.style.flex = 2;
    colorGroup.style.position = 'relative';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = baseHex;
    colorInput.style.width = '100%';
    colorInput.style.height = '36px';
    colorInput.style.padding = '2px';
    colorInput.style.backgroundColor = 'transparent';
    colorInput.style.border = '1px solid var(--border-color)';
    colorInput.style.borderRadius = '4px';
    colorGroup.appendChild(colorInput);
    
    // 2. Alpha Input
    const alphaContainer = document.createElement('div');
    alphaContainer.style.flex = 1;

    const alphaLabel = document.createElement('label');
    alphaLabel.className = 'd-block mb-1';
    alphaLabel.style.fontSize = '0.85em';
    alphaLabel.style.color = 'var(--text-dark)';
    alphaLabel.style.fontWeight = '500';
    alphaLabel.textContent = 'Alpha (%)';

    const alphaInputWrapper = document.createElement('div');
    alphaInputWrapper.style.display = 'flex';
    alphaInputWrapper.style.alignItems = 'center';
    alphaInputWrapper.style.backgroundColor = 'var(--bg-dark-1)';
    alphaInputWrapper.style.border = '1px solid var(--border-color)';
    alphaInputWrapper.style.borderRadius = '4px';

    const alphaInput = document.createElement('input');
    alphaInput.type = 'number';
    alphaInput.min = 0;
    alphaInput.max = 100;
    alphaInput.step = 1;
    alphaInput.value = initialAlphaPercent;
    alphaInput.style.padding = '5px';
    alphaInput.style.width = '100%';
    
    alphaInputWrapper.appendChild(alphaInput);
    alphaContainer.appendChild(alphaLabel);
    alphaContainer.appendChild(alphaInputWrapper);


    const updateCombinedColor = () => {
        const newBaseHex = colorInput.value;
        let newAlphaPercent = parseFloat(alphaInput.value);
        newAlphaPercent = Math.min(100, Math.max(0, newAlphaPercent || 0));
        
        // Convert percentage (0-100) to hex (00-FF)
        const hexAlpha = Math.round(newAlphaPercent * 2.55).toString(16).padStart(2, '0');
        
        onChange(newBaseHex + hexAlpha);
    };

    colorInput.addEventListener('input', updateCombinedColor);
    alphaInput.addEventListener('change', updateCombinedColor);
    alphaInput.addEventListener('input', updateCombinedColor);

    container.appendChild(colorGroup);
    container.appendChild(alphaContainer);
    
    group.appendChild(container);
    return group;
}


function createVector3Input(label, vector3, onChange, isDegrees = false) {
    const group = document.createElement('div');
    group.className = 'property-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    group.appendChild(labelEl);

    const container = document.createElement('div');
    container.className = 'vector3-input';

    ['x', 'y', 'z'].forEach(axis => {
        const axisWrapper = document.createElement('div');
        const axisLabel = document.createElement('span');
        axisLabel.textContent = axis.toUpperCase();

        const input = document.createElement('input');
        input.type = 'number';
        
        let displayValue = vector3[axis];
        if (isDegrees) {
            displayValue = THREE.MathUtils.radToDeg(vector3[axis]);
        }

        input.step = isDegrees ? 1 : 0.1;
        input.value = displayValue.toFixed(isDegrees ? 1 : 2);

        // Update on 'change' (when input loses focus or Enter is pressed) and 'input' (for live updates)
        input.addEventListener('change', (e) => onChange(axis, parseFloat(e.target.value)));
        input.addEventListener('input', (e) => onChange(axis, parseFloat(e.target.value)));

        // Prevent pointer/mouse events from bubbling so the input can be focused and typed
        input.addEventListener('pointerdown', (e) => e.stopPropagation());
        input.addEventListener('mousedown', (e) => e.stopPropagation());
        input.addEventListener('touchstart', (e) => e.stopPropagation());

        axisWrapper.appendChild(axisLabel);
        axisWrapper.appendChild(input);
        container.appendChild(axisWrapper);
    });

    group.appendChild(container);
    return group;
}

function createTextureControls(object) {
    const container = document.createElement('div');
    container.className = 'property-group';
    
    // Show current texture info
    const currentLabel = document.createElement('label');
    currentLabel.textContent = 'Albedo / Base Map';
    container.appendChild(currentLabel);

    const info = document.createElement('div');
    info.style.display = 'flex';
    info.style.gap = '8px';
    info.style.alignItems = 'center';

    const thumb = document.createElement('div');
    thumb.style.width = '48px';
    thumb.style.height = '48px';
    thumb.style.border = '1px solid var(--border-color)';
    thumb.style.backgroundSize = 'cover';
    thumb.style.backgroundPosition = 'center';
    thumb.style.backgroundColor = 'rgba(255,255,255,0.02)';
    info.appendChild(thumb);

    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.flexDirection = 'column';
    btnGroup.style.gap = '6px';
    btnGroup.style.flex = '1';

    // Upload button (uses dynamic file input)
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'btn btn-outline-secondary';
    uploadBtn.textContent = 'Upload Texture';
    uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg, image/webp';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                // Apply as map to material
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => {
                        m.map = new THREE.Texture(img);
                        m.map.needsUpdate = true;
                        m.needsUpdate = true;
                    });
                } else {
                    object.material.map = new THREE.Texture(img);
                    object.material.map.needsUpdate = true;
                    object.material.needsUpdate = true;
                }
                thumb.style.backgroundImage = `url(${url})`;
                // free object URL when no longer needed
            };
            img.src = url;
        };
        input.click();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline-danger';
    removeBtn.textContent = 'Remove Texture';
    removeBtn.addEventListener('click', () => {
        if (Array.isArray(object.material)) {
            object.material.forEach(m => {
                if (m.map) { m.map.dispose && m.map.dispose(); m.map = null; m.needsUpdate = true; }
            });
        } else if (object.material.map) {
            object.material.map.dispose && object.material.map.dispose();
            object.material.map = null;
            object.material.needsUpdate = true;
        }
        thumb.style.backgroundImage = '';
    });

    btnGroup.appendChild(uploadBtn);
    btnGroup.appendChild(removeBtn);

    info.appendChild(btnGroup);
    container.appendChild(info);

    // Initialize thumbnail if texture exists
    const mat = Array.isArray(object.material) ? object.material[0] : object.material;
    if (mat && mat.map && mat.map.image && mat.map.image.src) {
        thumb.style.backgroundImage = `url(${mat.map.image.src})`;
    }

    return container;
}