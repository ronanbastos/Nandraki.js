import * as THREE from 'three'; // Import the THREE object
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * @class ComponentRegistry
 * @classdesc Um registro global para armazenar e instanciar classes de componentes reutilizáveis.
 * Permite que componentes sejam registrados com um nome e depois instanciados sob demanda.
 */
class ComponentRegistry {
    static components = {};

    /**
     * Registra uma classe de componente com um nome específico.
     * @param {string} name - O nome do componente.
     * @param {Function} ComponentClass - A classe do componente a ser registrada.
     */
    static register(name, ComponentClass) {
        this.components[name] = ComponentClass;
    }

    /**
     * Cria uma nova instância de um componente registrado.
     * @param {string} name - O nome do componente a ser instanciado.
     * @param {...any} args - Argumentos para passar ao construtor do componente.
     * @returns {object|null} Uma nova instância do componente, ou nulo se não for encontrado.
     */
    static instantiate(name, ...args) {
        const Comp = this.components[name];
        return Comp ? new Comp(...args) : null;
    }
}

/**
 * @namespace TagSystem
 * @description Um sistema para adicionar, remover e consultar tags em objetos da cena.
 * As tags são úteis para agrupar e encontrar objetos com características semelhantes.
 */
const TagSystem = {
    /**
     * Adiciona uma tag a um objeto.
     * @param {THREE.Object3D} object - O objeto ao qual a tag será adicionada.
     * @param {string} tag - A tag a ser adicionada.
     */
    add(object, tag) {
        if (!object.userData.tags) object.userData.tags = new Set();
        object.userData.tags.add(tag);
    },

    /**
     * Verifica se um objeto possui uma determinada tag.
     * @param {THREE.Object3D} object - O objeto a ser verificado.
     * @param {string} tag - A tag a ser procurada.
     * @returns {boolean} `true` se o objeto tiver a tag, `false` caso contrário.
     */
    has(object, tag) {
        return object.userData.tags?.has(tag) ?? false;
    },

    /**
     * Remove uma tag de um objeto.
     * @param {THREE.Object3D} object - O objeto do qual a tag será removida.
     * @param {string} tag - A tag a ser removida.
     */
    remove(object, tag) {
        object.userData.tags?.delete(tag);
    },

    /**
     * Encontra todos os objetos na cena que possuem uma determinada tag.
     * @param {string} tag - A tag a ser procurada.
     * @returns {THREE.Object3D[]} Um array de objetos que possuem a tag.
     */
    getAll(tag) {
        const core = new ThreeCore();
        const found = [];
        core.scene.traverse(obj => {
            if (obj.userData.tags?.has(tag)) {
                found.push(obj);
            }
        });
        return found;
    }
};

/**
 * Global functions for tag management.
 * These wrap the TagSystem methods for direct object manipulation.
 */
window.setTag = TagSystem.add.bind(TagSystem);
window.removeTag = TagSystem.remove.bind(TagSystem);
window.hasTag = TagSystem.has.bind(TagSystem);

/**
 * @class ThreeFactory
 * @classdesc (Abstract Factory) Uma fábrica para criar objetos básicos do Three.js.
 * Simplifica a criação de geometrias, materiais e luzes comuns.
 */
class ThreeFactory {
    /** Cria um cubo com geometria e material padrão. */
    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        return mesh;
    }
    /** Cria uma esfera com geometria e material padrão. */
    createSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        return mesh;
    }
    /** Cria um cilindro com geometria e material padrão. */
    createCylinder() {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        return mesh;
    }
    /** Cria uma luz do tipo PointLight. */
    createPointLight() {
        return new THREE.PointLight(0xffffff, 1, 100);
    }
    /** Cria uma luz do tipo DirectionalLight. */
    createDirectionalLight() {
        return new THREE.DirectionalLight(0xffffff, 0.5);
    }
    /** Cria uma câmera perspectiva. */
    createCamera() {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 5); // Default position for new cameras
        return camera;
    }
    /** Cria uma plataforma que recebe sombras. */
    createPlatform() {
        const geometry = new THREE.BoxGeometry(10, 0.5, 10);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.position.set(0, -1, 0);
        return mesh;
    }
    /** Alias legado para createPointLight, para compatibilidade. */
    createLight() {
        return this.createPointLight();
    }
}

/**
 * @class EntityBuilder
 * @classdesc (Builder) Constrói entidades complexas (Object3D) de forma incremental.
 * Permite a composição de objetos complexos passo a passo.
 */
class EntityBuilder {
    constructor() {
        this.entity = new THREE.Object3D();
    }

    /** Adiciona uma malha (mesh) à entidade. */
    addMesh(mesh) {
        this.entity.add(mesh);
        return this;
    }

    /** Define a posição da entidade. */
    setPosition(x, y, z) {
        this.entity.position.set(x, y, z);
        return this;
    }

    /** Retorna a entidade construída. */
    build() {
        return this.entity;
    }
}

/**
 * @class PrototypeFactory
 * @classdesc (Prototype) Uma fábrica que cria novos objetos clonando protótipos pré-registrados.
 * Útil para criar cópias de objetos complexos de forma eficiente.
 */
class PrototypeFactory {
    constructor() {
        this.prototypes = {};
    }

    /** Registra um objeto 3D como um protótipo. */
    register(name, object3D) {
        this.prototypes[name] = object3D;
    }

    /** Clona um protótipo registrado. */
    clone(name) {
        return this.prototypes[name]?.clone() ?? null;
    }
}

/**
 * @class Game
 * @classdesc Uma classe de fábrica simplificada para criar objetos de jogo.
 * Fornece um método estático `create` para instanciar objetos por tipo.
 */
class Game {
    /**
     * Cria um objeto de jogo com base no tipo especificado.
     * @static
     * @param {string} type - O tipo de objeto a ser criado (ex: 'cube', 'sphere', 'point-light').
     * @param {string|null} [name=null] - Um nome opcional para o objeto.
     * @returns {THREE.Object3D} O objeto Three.js criado.
     * @throws {Error} Se o tipo de objeto for desconhecido.
     */
    static create(type, name = null) {
        const factory = new ThreeFactory();
        const methodMap = {
            'cube': 'createCube',
            'sphere': 'createSphere',
            'cylinder': 'createCylinder',
            'point-light': 'createPointLight',
            'directional-light': 'createDirectionalLight',
            'platform': 'createPlatform',
            'camera': 'createCamera',
            'light': 'createLight', // Alias Legado
        };
        const methodName = methodMap[type];
        if (!methodName || typeof factory[methodName] !== 'function') {
            throw new Error(`Tipo de objeto desconhecido: "${type}"`);
        }
        const obj = factory[methodName]();
        if (name) obj.name = name;
        return obj;
    }
}

/**
 * @class ThreeCore
 * @classdesc (Singleton) Classe principal do motor, responsável por gerenciar a cena 3D,
 * o renderer, a câmera, os controles e o loop de animação principal.
 */
class ThreeCore {
    /**
     * @constructor
     * Cria ou retorna a instância única de ThreeCore.
     */
    constructor() {
        if (ThreeCore.instance) return ThreeCore.instance;

        /** @property {THREE.Scene} scene - A cena principal do Three.js. */
        this.scene = new THREE.Scene();

        /** @property {THREE.PerspectiveCamera} camera - A câmera da cena. */
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.name = "EditorCamera"; // Give a name to distinguish it.

        /** @property {THREE.WebGLRenderer} renderer - O renderizador WebGL. */
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        /** @property {I18nManager} i18n - The internationalization manager. */
        this.i18n = i18n;

        /** @property {OrbitControls} orbitControls - Controles de órbita da câmera. */
        this.orbitControls = null;
        /** @property {TransformControls} transformControls - Controles para transformar objetos (mover, rotacionar, escalar). */
        this.transformControls = null;

        /** @property {THREE.Raycaster} raycaster - Usado para detectar cliques em objetos. */
        this.raycaster = new THREE.Raycaster();
        /** @property {THREE.Plane} dragPlane - Um plano auxiliar para arrastar objetos. */
        this.dragPlane = new THREE.Plane();
        /** @property {THREE.Vector3} dragOffset - O deslocamento ao arrastar um objeto. */
        this.dragOffset = new THREE.Vector3();
        /** @property {boolean} isDraggingObject - Flag que indica se um objeto está sendo arrastado. */
        this.isDraggingObject = false;
        /** @property {THREE.Object3D|null} selectedObject - O objeto atualmente selecionado no editor. */
        this.selectedObject = null;
        /** @property {boolean} isGameRunning - Flag que indica se o modo de simulação (jogo) está ativo e rodando scripts. */
        this.isGameRunning = false;
        /** @property {object|null} savedSceneState - Armazena o estado dos objetos antes de iniciar a simulação. */
        this.savedSceneState = null;
        /** @property {boolean} isSceneStateSaved - Flag que indica se o estado da cena foi salvo (está em play ou paused). */
        this.isSceneStateSaved = false;
        /** @property {THREE.Object3D|null} activeGameCamera - A câmera da cena que está sendo usada durante o jogo. */
        this.activeGameCamera = null;
        /** @property {object|null} savedEditorCameraState - Armazena o estado da câmera do editor antes de entrar no modo de jogo. */
        this.savedEditorCameraState = null;

        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        this.setupLights();

        ThreeCore.instance = this;
    }

    /**
     * Inicializa o núcleo do motor 3D, adicionando o canvas ao container e configurando os controles.
     * @param {HTMLElement} container - O elemento DOM onde o canvas do Three.js será inserido.
     */
    init(container) {
        container.appendChild(this.renderer.domElement);
        this.setupControls(container);
        this.animate();
    }

    /**
     * Configura as luzes padrão da cena (ambiente e direcional).
     */
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    /**
     * Configura os controles de câmera (OrbitControls) e de transformação de objetos (TransformControls).
     * @param {HTMLElement} container - O elemento container para os eventos dos controles.
     */
    setupControls(container) {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(this.transformControls);

        // Adiciona os botões para trocar o modo de transformação (mover, rotacionar, escalar)
        const modeButtons = document.createElement('div');
        modeButtons.className = 'transform-mode-buttons';
        modeButtons.innerHTML = `
            <button class="transform-mode" data-mode="translate" data-lang="transform.move"></button>
            <button class="transform-mode" data-mode="rotate" data-lang="transform.rotate"></button>
            <button class="transform-mode" data-mode="scale" data-lang="transform.scale"></button>
        `;

        const toolbar = document.getElementById('toolbar');
        toolbar.appendChild(modeButtons);

        // Event listener para os botões de modo
        modeButtons.addEventListener('click', (e) => {
            const modeButton = e.target.closest('.transform-mode');
            if (modeButton) {
                const mode = modeButton.dataset.mode;
                this.setTransformMode(mode, modeButton);
            }
        });

        // Inicia no modo de translação
        const translateButton = modeButtons.querySelector('[data-mode="translate"]');
        this.setTransformMode('translate', translateButton);
    }

    /**
     * Define o modo atual do TransformControls (translate, rotate, scale).
     * @param {string} mode - O modo a ser definido.
     * @param {HTMLElement|null} modeButton - O botão que acionou a mudança, para highlight.
     */
    setTransformMode(mode, modeButton = null) {
        if (this.transformControls) {
            this.transformControls.setMode(mode);

            // Atualiza o estado visual dos botões de modo
            const modeButtons = document.querySelectorAll('.transform-mode');
            modeButtons.forEach(btn => btn.classList.remove('active'));

            if (modeButton) {
                modeButton.classList.add('active');
            } else {
                const activeButton = document.querySelector(`.transform-mode[data-mode="${mode}"]`);
                if (activeButton) activeButton.classList.add('active');
            }
        }
    }

    /**
     * Manipulador de evento para o clique do mouse, usado para selecionar e arrastar objetos.
     * @param {MouseEvent} event - O evento do mouse.
     */
    onObjectMouseDown(event) {
        if (this.isGameRunning) return; // Impede a seleção de objetos durante o modo de jogo
        event.preventDefault();

        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();

        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.camera);

        if (this.transformControls && this.transformControls.dragging) {
            return;
        }

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;

            let isGizmoPart = false;
            let tempObject = clickedObject;
            while (tempObject.parent) {
                if (tempObject === this.transformControls) {
                    isGizmoPart = true;
                    break;
                }
                tempObject = tempObject.parent;
            }

            if (isGizmoPart) {
                // Click foi no gizmo. Deixe o TransformControls lidar com isso.
                return;
            }

            while (clickedObject.parent && !clickedObject.parent.isScene) {
                clickedObject = clickedObject.parent;
            }

            // Apenas interage com objetos arrastáveis
            if (clickedObject.isObject3D && clickedObject.position) {
                this.isDraggingObject = true;

                // Cria um plano na posição do objeto para cálculos de arrasto
                this.dragPlane.setFromNormalAndCoplanarPoint(
                    this.camera.getWorldDirection(new THREE.Vector3()),
                    clickedObject.position
                );

                // Calcula o deslocamento entre o clique do mouse e a posição do objeto
                const intersectPoint = new THREE.Vector3();
                if (this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint)) {
                    this.dragOffset.copy(clickedObject.position).sub(intersectPoint);
                }

                // Seleciona e destaca o objeto
                this.selectObject(clickedObject);
            }
        } else {
            // Deseleciona se clicar em espaço vazio e não estiver arrastando um gizmo
            if (this.selectedObject) {
                this.transformControls.detach();
                this.selectedObject = null;
                document.getElementById('inspector-content').innerHTML = '';
                document.querySelectorAll('.object-item.selected').forEach(item => item.classList.remove('selected'));
            }
        }
    }

    /**
     * Manipulador de evento para o movimento do mouse, usado para arrastar objetos.
     * @param {MouseEvent} event - O evento do mouse.
     */
    onObjectMouseMove(event) {
        if (!this.isDraggingObject || !this.selectedObject) return;
        event.preventDefault();
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        this.raycaster.setFromCamera(mouse, this.camera);
        const intersectPoint = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint)) {
            // Move o objeto
            this.selectedObject.position.copy(intersectPoint.add(this.dragOffset));
        }
    }

    /**
     * Manipulador de evento para a liberação do clique do mouse, finalizando o arrasto.
     * @param {MouseEvent} event - O evento do mouse.
     */
    onObjectMouseUp(event) {
        if (this.isDraggingObject && this.selectedObject) {
            // Atualiza o inspector após o arrasto terminar
            this.updateInspector(this.selectedObject);
        }
        this.isDraggingObject = false;
    }

    /**
     * Configura todos os event listeners da interface do editor.
     */
    setupEventListeners() {
        this.setupMenuBar();
        this.setupToolbarEvents();
        this.setupHierarchyEvents();
        this.setupInspectorEvents();
        this.setupProjectEvents();
        this.setupScriptEvents();
        this.setupObjectInteractions();
        this.setupViewer();
        this.setupScriptingApiModal(); // New: Setup Scripting API Modal
        this.setupTerminal();
    }

    /**
     * Configura a barra de menu superior e suas ações.
     */
    setupMenuBar() {
        const menuBar = document.getElementById('menu-bar');
        if (!menuBar) return;

        const menuItems = menuBar.querySelectorAll('.menu-item');

        const closeAllMenus = () => {
            menuItems.forEach(item => item.classList.remove('open'));
        };

        menuItems.forEach(item => {
            const button = item.querySelector('.menu-button');
            const dropdown = item.querySelector('.menu-dropdown');

            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const isOpen = item.classList.contains('open');
                closeAllMenus();
                if (!isOpen) {
                    item.classList.add('open');
                }
            });

            dropdown.addEventListener('click', (event) => {
                // Fecha o menu após um item ser clicado
                if (event.target.matches('.dropdown-item')) {
                    closeAllMenus();
                }
            });
        });

        document.addEventListener('click', closeAllMenus);

        // --- Ações dos itens do menu ---

        // Arquivo > Nova Cena
        document.getElementById('menu-file-new-scene')?.addEventListener('click', () => {
            if (confirm(this.i18n.t('confirm.new_scene'))) {
                this.createEmptyScene();
            }
        });

        // Arquivo > Salvar Cena
        document.getElementById('menu-file-save-scene')?.addEventListener('click', () => {
            this.saveScene();
        });

        // Arquivo > Carregar Cena
        document.getElementById('menu-file-load-scene')?.addEventListener('click', () => {
            document.getElementById('scene-file-input').click();
        });

        document.getElementById('scene-file-input')?.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.loadScene(file);
            }
            // Reset input so the same file can be loaded again
            event.target.value = '';
        });

        // Arquivo > Importar Modelo
        document.getElementById('menu-file-import')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = ".obj,.gltf,.glb";
            input.multiple = true;
            input.onchange = (event) => {
                Array.from(event.target.files).forEach(file => {
                    this.importProjectFile(file);
                });
            };
            input.click();
        });

        // Ativos > Criar Script
        document.getElementById('menu-assets-create-script')?.addEventListener('click', () => {
            const scriptName = prompt(this.i18n.t('prompt.script_name'));
            if (scriptName) {
                this.createScript(scriptName);
            }
        });

        // Ativos > Criar Pasta
        document.getElementById('menu-assets-create-folder')?.addEventListener('click', () => {
            const folderName = prompt(this.i18n.t('prompt.folder_name'));
            if (folderName) {
                this.createProjectFolder(folderName);
            }
        });

        // GameObject > Criar *
        menuBar.addEventListener('click', (event) => {
            const target = event.target;
            if (target.matches('.dropdown-item') && target.dataset.createObject) {
                const objectType = target.dataset.createObject;
                this.createObject(objectType);
            }
        });

        // Settings > Language (Updated for checklist)
        const languageOptionsContainer = document.getElementById('language-options');
        if (languageOptionsContainer) {
            languageOptionsContainer.addEventListener('click', (event) => {
                const langOptionBtn = event.target.closest('.lang-option');
                if (langOptionBtn) {
                    const langCode = langOptionBtn.dataset.langCode;
                    this.i18n.setLanguage(langCode);

                    // Update active class
                    languageOptionsContainer.querySelectorAll('.lang-option').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    langOptionBtn.classList.add('active');
                }
            });
        }

        // Settings > Script Loading
        document.getElementById('script-loading-strategy')?.addEventListener('change', (event) => {
            const strategy = event.target.value;
            console.log(`Script loading strategy set to: ${strategy}`);
            // Armazena a preferência do usuário se necessário
            // localStorage.setItem('scriptLoadingStrategy', strategy);
        });

        // Settings > Preload Script
        document.getElementById('menu-settings-edit-global-script')?.addEventListener('click', () => {
            this.openViewer('global-script');
        });

        // Ajuda > Sobre
        document.getElementById('menu-help-about')?.addEventListener('click', () => {
            console.log('Draki.js Engine v0.1: Um motor 3D baseado em web interativo.');
        });

        // New: Ajuda > Scripting API
        document.getElementById('menu-help-scripting-api')?.addEventListener('click', () => {
            this.openScriptingApiModal();
        });

        // New: Terminal Button
        const terminalBtn = document.getElementById('terminal-btn');
        if (terminalBtn) {
            terminalBtn.addEventListener('click', () => this.toggleTerminal());
        }
    }

    /**
     * Configura os eventos da barra de ferramentas central (play, pause, stop).
     */
    setupToolbarEvents() {
        const playButton = document.getElementById('play-button');
        const pauseButton = document.getElementById('pause-button');
        const stopButton = document.getElementById('stop-button');

        if (playButton) playButton.addEventListener('click', () => this.play());
        if (pauseButton) pauseButton.addEventListener('click', () => this.pause());
        if (stopButton) stopButton.addEventListener('click', () => this.stop());

        // Add keyboard shortcuts for play controls
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // Don't trigger while typing

            switch (e.key) {
                case 'F5':
                    e.preventDefault();
                    this.play();
                    break;
                case 'F6':
                    e.preventDefault();
                    this.pause();
                    break;
                case 'F8':
                    e.preventDefault();
                    this.stop();
                    break;
            }
        });
    }

    /**
     * Updates the visual state of the Play, Pause, and Stop buttons.
     * @param {string} activeState - 'play', 'pause', or 'stop' to indicate which button should be active.
     */
    updatePlayPauseStopButtons(activeState) {
        const playButton = document.getElementById('play-button');
        const pauseButton = document.getElementById('pause-button');
        const stopButton = document.getElementById('stop-button');

        [playButton, pauseButton, stopButton].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });

        if (activeState === 'play' && playButton) {
            playButton.classList.add('active');
        } else if (activeState === 'pause' && pauseButton) {
            pauseButton.classList.add('active');
        } else if (activeState === 'stop' && stopButton) {
            stopButton.classList.add('active');
        }
    }

    /**
     * Configura os eventos do painel de Hierarquia (criação e seleção de objetos).
     */
    setupHierarchyEvents() {
        const hierarchyContent = document.getElementById('hierarchy-content');
        const addObjectButton = document.getElementById('add-object');

        if (addObjectButton) {
            addObjectButton.addEventListener('click', this.createObjectMenu.bind(this));
        }

        if (hierarchyContent) {
            hierarchyContent.addEventListener('click', this.handleHierarchyItemClick.bind(this));
            hierarchyContent.addEventListener('dblclick', this.handleHierarchyItemDoubleClick.bind(this));

            // DRAG-AND-DROP SCRIPT ATTACHMENT
            hierarchyContent.addEventListener('dragover', (event) => {
                const objectItem = event.target.closest('.object-item[draggable="true"]');
                // Uma simples verificação para ver se estamos arrastando um script
                if (objectItem && event.dataTransfer.types.includes('text/plain')) {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'copy';
                    objectItem.classList.add('drag-over');
                }
            });

            hierarchyContent.addEventListener('dragleave', (event) => {
                const objectItem = event.target.closest('.object-item');
                if (objectItem) {
                    objectItem.classList.remove('drag-over');
                }
            });

            hierarchyContent.addEventListener('drop', (event) => {
                event.preventDefault();
                const objectItem = event.target.closest('.object-item');
                if (objectItem) {
                    objectItem.classList.remove('drag-over');
                    const scriptName = event.dataTransfer.getData('text/plain');
                    // We get the name from the object itself, as the span might be an input field
                    const object = this.scene.children.find(c => c.uuid === objectItem.dataset.uuid);

                    if (object && scriptName) {
                        ScriptManager.attachScriptToObject(object, scriptName);
                        this.refreshViewerIfOpen();
                        // Se o objeto que recebeu o drop estiver selecionado, atualize o inspector
                        if (this.selectedObject === object) {
                            this.updateInspector(object);
                        }
                    }
                }
            });
        }
    }

    /**
     * Cria o menu de contexto para adicionar novos objetos à cena.
     * @param {Event} event - O evento de clique que acionou o menu.
     */
    createObjectMenu(event) {
        const menu = document.createElement('div');
        menu.className = 'object-creation-menu';
        menu.innerHTML = `
            <button class="create-cube" data-type="cube">Cube</button>
            <button class="create-sphere" data-type="sphere">Sphere</button>
            <button class="create-cylinder" data-type="cylinder">Cylinder</button>
            <button class="create-point-light" data-type="point-light">Point Light</button>
            <button class="create-directional-light" data-type="directional-light">Directional Light</button>
            <button class="create-platform" data-type="platform">Platform</button>
            <button class="create-camera" data-type="camera">Camera</button>
        `;

        menu.style.position = 'absolute';
        menu.style.top = `${event.target.offsetHeight}px`;
        menu.style.left = '0';

        document.querySelectorAll('.object-creation-menu').forEach(m => m.remove());

        event.target.appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== event.target) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);

        menu.addEventListener('click', (e) => {
            if (e.target.dataset.type) {
                this.createObject(e.target.dataset.type);
                menu.remove();
            }
        });
    }

    /**
     * Lida com cliques nos itens da hierarquia para selecionar objetos.
     * @param {Event} event - O evento de clique.
     */
    handleHierarchyItemClick(event) {
        const objectItem = event.target.closest('.object-item');
        if (!objectItem) return;

        // Impede a seleção quando interagindo com controles ou editando nome
        if (event.target.closest('.object-controls') || event.target.tagName === 'INPUT') return;

        const object = this.scene.children.find(c => c.uuid === objectItem.dataset.uuid);

        if (object) {
            this.selectObject(object);
        }
    }

    /**
     * Lida com o duplo clique em um item da hierarquia para renomeá-lo.
     * @param {Event} event - O evento de duplo clique.
     */
    handleHierarchyItemDoubleClick(event) {
        const objectNameSpan = event.target.closest('.object-name');
        if (!objectNameSpan) return;

        const objectItem = objectNameSpan.closest('.object-item');
        const object = this.scene.children.find(c => c.uuid === objectItem.dataset.uuid);
        if (!object) return;

        const originalName = object.name;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalName;
        input.className = 'rename-input';

        objectNameSpan.style.display = 'none';
        objectNameSpan.parentNode.insertBefore(input, objectNameSpan);
        input.focus();
        input.select();

        let editingInProgress = true; // Flag to prevent multiple executions

        const cleanupListeners = () => {
            if (!editingInProgress) return; // Ensure cleanup only runs once if called multiple times

            input.removeEventListener('blur', finishEditing);
            input.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('click', clickOutsideHandler, true); // Important: remove with same capture flag

            editingInProgress = false; // Mark editing as finished
        };

        const finishEditing = () => {
            if (!editingInProgress) return; // Exit early if already cleaned up

            const newName = input.value.trim();

            // Revert to original name display if the new name is empty or the same
            if (!newName || newName === originalName) {
                cancelEditing(); // Use cancel logic for reversion
                return;
            }

            // Check if another object already has the new name
            const existingObject = this.scene.getObjectByName(newName);
            if (existingObject && existingObject !== object) {
                console.error(`An object with the name "${newName}" already exists.`);
                return; // User needs to correct, so don't clean up listeners yet
            }

            // Valid name, proceed to cleanup and update
            cleanupListeners(); // This sets editingInProgress to false and removes listeners

            object.name = newName;
            objectNameSpan.textContent = newName;

            if (input.parentNode) { // Check if input is still in DOM before removing
                input.remove();
            }
            objectNameSpan.style.display = '';

            if (this.selectedObject === object) {
                this.updateInspector(object);
            }
        };

        const cancelEditing = () => {
            if (!editingInProgress) return; // Exit early if already cleaned up

            cleanupListeners(); // This sets editingInProgress to false and removes listeners

            // Restore original name text in UI
            objectNameSpan.textContent = originalName;

            if (input.parentNode) { // Check if input is still in DOM before removing
                input.remove();
            }
            objectNameSpan.style.display = '';
        };

        const keydownHandler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent any default form submission behavior
                finishEditing();
            } else if (e.key === 'Escape') {
                cancelEditing();
            }
        };

        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', keydownHandler);

        // Add a temporary listener to handle clicks outside the input field
        const clickOutsideHandler = (e) => {
            // Check if the click target is outside the input and not the objectNameSpan itself
            // And importantly, if editing is still in progress (not cleaned up by keydown/blur already)
            if (!input.contains(e.target) && e.target !== objectNameSpan && editingInProgress) {
                finishEditing();
            }
        };
        // Use capture phase to ensure this runs before other click handlers
        document.addEventListener('click', clickOutsideHandler, true);
    }

    /**
     * Configura os eventos do painel Inspector (mudança de propriedades).
     */
    setupInspectorEvents() {
        const inspectorContent = document.getElementById('inspector-content');
        if (inspectorContent) {
            inspectorContent.addEventListener('change', this.handleInspectorPropertyChange.bind(this));
        }
    }

    /**
     * Lida com a alteração de valores nos inputs do Inspector.
     * @param {Event} event - O evento de 'change'.
     */
    handleInspectorPropertyChange(event) {
        const input = event.target;
        if (input.type !== 'number' && input.type !== 'color') return;

        const propertyGroup = input.closest('.property-group');
        const propertyType = propertyGroup.querySelector('strong').textContent.toLowerCase();
        const axis = input.dataset.originalAxis;

        if (!this.scene) return;

        if (!this.selectedObject) return;

        switch (propertyType) {
            case 'position':
                this.selectedObject.position[axis] = parseFloat(input.value);
                break;
            case 'rotation':
                this.selectedObject.rotation[axis] = THREE.MathUtils.degToRad(parseFloat(input.value));
                break;
            case 'scale':
                this.selectedObject.scale[axis] = parseFloat(input.value);
                break;
            case 'light properties':
                if (input.type === 'color') {
                    this.selectedObject.color.set(input.value);
                } else if (input.name === 'intensity') {
                    this.selectedObject.intensity = parseFloat(input.value);
                }
                break;
        }
    }

    /**
     * Configura os eventos do painel de Projeto (criar pasta, importar arquivo).
     */
    setupProjectEvents() {
        const projectContent = document.getElementById('project-content');
        const createFolderButton = document.getElementById('create-folder');
        const importFileButton = document.getElementById('import-file');

        if (createFolderButton) {
            createFolderButton.addEventListener('click', () => {
                const folderName = prompt(this.i18n.t('prompt.folder_name'));
                if (folderName) {
                    this.createProjectFolder(folderName);
                }
            });
        }

        if (importFileButton) {
            importFileButton.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = (event) => {
                    Array.from(event.target.files).forEach(file => {
                        this.importProjectFile(file);
                    });
                };
                input.click();
            });
        }
    }

    /**
     * Configura os eventos do painel de Scripts (criar script, limpar cache).
     */
    setupScriptEvents() {
        const createScriptButton = document.getElementById('create-script');
        const scriptsContent = document.getElementById('scripts-content');
        const clearScriptCacheButton = document.getElementById('clear-script-cache');

        if (createScriptButton && scriptsContent) {
            createScriptButton.addEventListener('click', () => {
                const scriptName = prompt(this.i18n.t('prompt.script_name')) || `Script-${scriptsContent.children.length + 1}`;
                this.createScript(scriptName);
            });
        }

        if (clearScriptCacheButton) {
            clearScriptCacheButton.addEventListener('click', () => {
                if (confirm(this.i18n.t('confirm.clear_script_cache'))) {
                    ScriptManager.clearScriptCache();
                    this.refreshViewerIfOpen();
                }
            });
        }

        // Event delegation para interações de anexar scripts
        scriptsContent.addEventListener('click', (event) => {
            const scriptItem = event.target.closest('.script-item');
            if (!scriptItem) return;

            const editBtn = event.target.closest('.edit-script');
            const deleteBtn = event.target.closest('.delete-script');

            if (editBtn) {
                const scriptName = editBtn.dataset.scriptName;
                this.openScriptEditor(scriptName);
            }

            if (deleteBtn) {
                const scriptName = deleteBtn.dataset.scriptName;
                if (confirm(this.i18n.t('confirm.delete_script').replace('{scriptName}', scriptName))) {
                    scriptItem.remove();
                    localStorage.removeItem(`script:${scriptName}`);
                    ScriptManager.invalidateCache(scriptName);
                    this.removeScriptFromProject(scriptName); // Use new method
                }
            }
        });

        // DRAG-AND-DROP FOR SCRIPTS
        scriptsContent.addEventListener('dragstart', (event) => {
            const scriptItem = event.target.closest('.script-item[draggable="true"]');
            if (!scriptItem) return;

            const scriptName = scriptItem.querySelector('.script-name').textContent.replace('.js', '');
            event.dataTransfer.setData('text/plain', scriptName);
            event.dataTransfer.effectAllowed = 'copy';
            scriptItem.classList.add('dragging');
        });

        scriptsContent.addEventListener('dragend', (event) => {
            const scriptItem = event.target.closest('.script-item.dragging');
            if (scriptItem) {
                scriptItem.classList.remove('dragging');
            }
        });
    }

    /**
     * Configura as interações com objetos na viewport (clique e arrasto).
     */
    setupObjectInteractions() {
        // Método consolidado para interações de objetos
        const viewportElement = document.getElementById('viewport');
        if (!viewportElement) return;
        viewportElement.addEventListener('mousedown', this.onObjectMouseDown.bind(this));
        viewportElement.addEventListener('mousemove', this.onObjectMouseMove.bind(this));
        viewportElement.addEventListener('mouseup', this.onObjectMouseUp.bind(this));
    }

    /**
     * Configura os eventos e a lógica do Viewer.
     */
    setupViewer() {
        const modal = document.getElementById('viewer-modal');
        const openBtn = document.getElementById('viewer-btn');
        const closeBtn = document.getElementById('close-viewer');
        const searchInput = document.getElementById('viewer-search');
        const tabsContainer = modal?.querySelector('.modal-tabs');
        const globalScriptEditorContainer = document.getElementById('global-script-editor-container');
        const saveGlobalScriptBtn = document.getElementById('save-global-script-btn');
        const refreshFixloadBtn = document.getElementById('refresh-fixload-btn');

        if (!modal || !openBtn || !closeBtn || !tabsContainer || !globalScriptEditorContainer || !saveGlobalScriptBtn || !refreshFixloadBtn) return;

        let globalScriptEditor = null; // To hold the CodeMirror instance
        let sceneScriptEditors = new Map(); // Map to hold CodeMirror instances for scene scripts

        const openModal = (tabToOpen = 'scene-scripts') => {
            this.populateSceneScriptsTab(sceneScriptEditors); // Pass the map to populate function
            this.populateFixloadTab();
            modal.style.display = 'flex';
            this.openViewerTab(tabToOpen);
        };

        const closeModal = () => {
            modal.style.display = 'none';
        };

        // Assign to a window-accessible property so we can call it from the menu
        this.openViewer = openModal;

        openBtn.addEventListener('click', () => openModal());
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        tabsContainer.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.tab-btn');
            if (!tabBtn) return;
            this.openViewerTab(tabBtn.dataset.tab);
        });

        this.openViewerTab = (tabName) => {
            // Update button states
            tabsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = tabsContainer.querySelector(`.tab-btn[data-tab="${tabName}"]`);
            if (activeBtn) activeBtn.classList.add('active');

            // Update content visibility
            modal.querySelectorAll('.tab-content').forEach(content => {
                if (content.id === `tab-content-${tabName}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Special handling for CodeMirror tabs
            if (tabName === 'global-script') {
                if (!globalScriptEditor) {
                    globalScriptEditor = CodeMirror(globalScriptEditorContainer, {
                        value: localStorage.getItem('script:global-preload') || '// Script Global (executa uma vez ao dar play)\n',
                        mode: 'javascript',
                        theme: 'darcula',
                        lineNumbers: true,
                        tabSize: 2,
                    });
                } else {
                    globalScriptEditor.setValue(localStorage.getItem('script:global-preload') || '// Script Global (executa uma vez ao dar play)\n');
                }
                setTimeout(() => globalScriptEditor.refresh(), 1);
            } else if (tabName === 'scene-scripts') {
                // Refresh all CodeMirror instances in the Scene Scripts tab
                sceneScriptEditors.forEach(editor => {
                    setTimeout(() => editor.refresh(), 1);
                });
            }
        };

        saveGlobalScriptBtn.addEventListener('click', () => {
            if (!globalScriptEditor) return;
            const scriptContent = globalScriptEditor.getValue();
            localStorage.setItem('script:global-preload', scriptContent);
            ScriptManager.invalidateCache('global-preload');
            console.log('Global preload script saved.');
            // Optionally give user feedback e.g. a temporary message
        });

        refreshFixloadBtn.addEventListener('click', () => this.populateFixloadTab());

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const objectGroups = document.querySelectorAll('#viewer-list .viewer-entry'); // Changed to viewer-entry as it's the details tag

            objectGroups.forEach(group => {
                const objectNameSummary = group.querySelector('summary')?.textContent.toLowerCase() || '';
                let found = objectNameSummary.includes(searchTerm);

                // Check text content of CodeMirror instances related to this group
                // Note: The key for sceneScriptEditors is "ObjectName-ScriptName"
                sceneScriptEditors.forEach((editor, key) => {
                    // Check if the editor's key starts with the object name, and its content matches
                    if (key.startsWith(group.dataset.objectName + '-') && editor.getValue().toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });

                group.style.display = found ? '' : 'none';
            });
        });
    }

    /**
     * Configura o modal de documentação para Scripting API.
     */
    setupScriptingApiModal() {
        const modal = document.getElementById('scripting-api-modal');
        const closeBtn = document.getElementById('close-scripting-api-modal');
        const contentDiv = document.getElementById('scripting-api-content');

        if (!modal || !closeBtn || !contentDiv) return;

        const openModal = () => {
            modal.style.display = 'flex';
            this.populateScriptingApiContent(contentDiv);
            // Translate the modal header when opened
            this.i18n.translateUI();
        };

        const closeModal = () => {
            modal.style.display = 'none';
        };

        // Assign to a window-accessible property so we can call it from the menu
        this.openScriptingApiModal = openModal;

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    /**
     * Popula o conteúdo do modal de Scripting API.
     * @param {HTMLElement} contentDiv - O div para preencher com o conteúdo.
     */
    populateScriptingApiContent(contentDiv) {
        contentDiv.innerHTML = `
            <p>${this.i18n.t('api_docs.intro')}</p>

            <h3><code>drak(objectName)</code></h3>
            <p>${this.i18n.t('api_docs.drak.description')}</p>
            <ul>
                <li><code>.set(path, value)</code>: ${this.i18n.t('api_docs.drak.set')}</li>
                <li><code>.get(path)</code>: ${this.i18n.t('api_docs.drak.get')}</li>
                <li><code>.script(fn)</code>: ${this.i18n.t('api_docs.drak.script')}</li>
                <li><code>.component(name)</code>: ${this.i18n.t('api_docs.drak.component')}</li>
                <li><code>.addComponent(name, instance)</code>: ${this.i18n.t('api_docs.drak.add_component')}</li>
                <li><code>.removeComponent(name)</code>: ${this.i18n.t('api_docs.drak.remove_component')}</li>
                <li><code>.addTag(tag)</code>: ${this.i18n.t('api_docs.drak.add_tag')}</li>
                <li><code>.removeTag(tag)</code>: ${this.i18n.t('api_docs.drak.remove_tag')}</li>
                <li><code>.hasTag(tag)</code>: ${this.i18n.t('api_docs.drak.has_tag')}</li>
                <li><code>.echo()</code>: ${this.i18n.t('api_docs.drak.echo')}</li>
                <li><code>.eye()</code>: ${this.i18n.t('api_docs.drak.eye')}</li>
                <li><code>.callTo(name)</code>: ${this.i18n.t('api_docs.drak.call_to')}</li>
                <li><code>.touch(name)</code>: ${this.i18n.t('api_docs.drak.touch')}</li>
                <li><code>.ref(key)</code>: ${this.i18n.t('api_docs.drak.ref')}</li>
                <li><code>.link(name)</code>: ${this.i18n.t('api_docs.drak.link')}</li>
                <li><code>.pointTo(name)</code>: ${this.i18n.t('api_docs.drak.point_to')}</li>
                <li><code>.hook(fn)</code>: ${this.i18n.t('api_docs.drak.hook')}</li>
            </ul>

            <h3><code>drak()</code> (no arguments)</h3>
            <p>${this.i18n.t('api_docs.drak_no_args.description')}</p>
            <ul>
                <li><code>.byTag(tagName)</code>: ${this.i18n.t('api_docs.drak_no_args.by_tag')}</li>
            </ul>

            <h3>${this.i18n.t('api_docs.global_tags.title')}</h3>
            <p>${this.i18n.t('api_docs.global_tags.description')}</p>
            <ul>
                <li><code>getByTag(tagName)</code>: ${this.i18n.t('api_docs.global_tags.get_by_tag')}</li>
                <li><code>setTag(obj, tagName)</code>: ${this.i18n.t('api_docs.global_tags.set_tag')}</li>
                <li><code>removeTag(obj, tagName)</code>: ${this.i18n.t('api_docs.global_tags.remove_tag')}</li>
                <li><code>hasTag(obj, tagName)</code>: ${this.i18n.t('api_docs.global_tags.has_tag')}</li>
            </ul>
        `;
    }

    /**
     * Popula a aba "Scripts da Cena" no Viewer.
     * @param {Map<string, CodeMirror>} sceneScriptEditors - Map to store CodeMirror instances.
     */
    populateSceneScriptsTab(sceneScriptEditors) {
        const listContainer = document.getElementById('viewer-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        sceneScriptEditors.clear(); // Clear old instances

        let hasScripts = false;
        this.scene.children.forEach(obj => {
            if (obj.userData.scripts && obj.userData.scripts.length > 0) {
                hasScripts = true;
                const details = document.createElement('details');
                details.className = 'viewer-entry';
                details.dataset.objectName = obj.name || 'Unnamed Object'; // Add object name for filtering
                details.innerHTML = `<summary>Object: ${obj.name || 'Unnamed Object'}</summary>`;

                obj.userData.scripts.forEach((scriptInfo, index) => {
                    const scriptEntry = document.createElement('div');
                    scriptEntry.className = 'script-entry';

                    const isNamed = typeof scriptInfo === 'object' && scriptInfo.name;
                    const scriptName = isNamed ? scriptInfo.name : `Anonymous Function ${index + 1}`;
                    const scriptContent = isNamed
                        ? localStorage.getItem(`script:${scriptInfo.name}`) || '// Script content not found'
                        : "Anonymous function - cannot be edited here.";

                    scriptEntry.innerHTML = `
                        <h4>Script: ${scriptName}${isNamed ? '.js' : ''}</h4>
                        <div class="codemirror-container" data-script-name="${scriptName}" style="height: 200px;"></div>
                        ${isNamed ? '<button class="apply-script-btn" data-lang="viewer.save_apply">Save & Apply</button>' : ''}
                    `;
                    // Translate the new button
                    this.i18n.translateUI(scriptEntry);

                    const cmContainer = scriptEntry.querySelector('.codemirror-container');
                    let cmInstance;

                    if (isNamed) {
                        cmInstance = CodeMirror(cmContainer, {
                            value: scriptContent,
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true,
                            tabSize: 2,
                            readOnly: false // Named scripts are editable
                        });
                        sceneScriptEditors.set(`${obj.name || 'Unnamed Object'}-${scriptName}`, cmInstance); // Store instance with a unique key
                        // Add event listener for apply and update button
                        const applyBtn = scriptEntry.querySelector('.apply-script-btn');
                        if (applyBtn) {
                            applyBtn.addEventListener('click', () => {
                                const newContent = cmInstance.getValue();
                                localStorage.setItem(`script:${scriptInfo.name}`, newContent);
                                ScriptManager.invalidateCache(scriptInfo.name);

                                // Provide visual feedback
                                const originalText = applyBtn.textContent;
                                applyBtn.textContent = 'Saved!'; 
                                applyBtn.disabled = true;
                                setTimeout(() => {
                                    applyBtn.textContent = originalText;
                                    applyBtn.disabled = false;
                                }, 2000);

                                console.log(`Script "${scriptInfo.name}" updated.`);
                            });
                        }
                    } else {
                        // For anonymous functions, we can still use CodeMirror but set it to readOnly
                        cmInstance = CodeMirror(cmContainer, {
                            value: scriptContent,
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true,
                            tabSize: 2,
                            readOnly: true // Anonymous scripts are not editable from here
                        });
                    }

                    details.appendChild(scriptEntry);
                    setTimeout(() => cmInstance.refresh(), 1); // Ensure CodeMirror renders correctly
                });

                listContainer.appendChild(details);
            }
        });

        if (!hasScripts) {
            listContainer.innerHTML = `<p class="no-scripts-msg">${this.i18n.t('viewer.no_scripts_in_scene') || 'No scripts found in the scene.'}</p>`;
        }
    }

    /**
     * Popula a aba de Cache (Fixload) no Viewer, mostrando os scripts compilados.
     */
    populateFixloadTab() {
        const listContainer = document.getElementById('fixload-list');
        if (!listContainer) return;

        listContainer.innerHTML = `<h4>${this.i18n.t('viewer.cached_scripts_title') || 'Compiled Scripts in Cache (Fixload)'}</h4>`;

        const cachedScripts = ScriptManager.getCompiledScripts();

        if (cachedScripts.size === 0) {
            listContainer.innerHTML += `<p class="no-scripts-msg">${this.i18n.t('viewer.no_cached_scripts') || 'No cached scripts. Scripts are added here when run for the first time in Fixload mode.'}</p>`;
            return;
        }

        cachedScripts.forEach((_scriptFunction, scriptName) => {
            const details = document.createElement('details');
            details.className = 'viewer-entry'; // re-using styles
            details.dataset.objectName = scriptName;
            details.innerHTML = `<summary>Script: ${scriptName}.js</summary>`;

            const scriptEntry = document.createElement('div');
            scriptEntry.className = 'script-entry';
            const scriptContent = localStorage.getItem(`script:${scriptName}`) || '// Conteúdo não encontrado';

            // Use a CodeMirror container for cached scripts as well
            const cmContainer = document.createElement('div');
            cmContainer.className = 'codemirror-container';
            cmContainer.style.height = '200px'; // Keep height consistent for readability
            scriptEntry.appendChild(cmContainer);

            const cmInstance = CodeMirror(cmContainer, {
                value: scriptContent,
                mode: 'javascript',
                theme: 'darcula',
                lineNumbers: true,
                tabSize: 2,
                readOnly: true // Cached scripts are not directly editable from here
            });

            details.appendChild(scriptEntry);
            listContainer.appendChild(details);
            setTimeout(() => cmInstance.refresh(), 1); // Refresh CodeMirror
        });
    }

    /**
     * Cria um novo objeto na cena com base no tipo especificado.
     * @param {string} type - O tipo de objeto a ser criado (ex: 'cube', 'sphere').
     * @returns {THREE.Object3D} O objeto criado.
     */
    createObject(type) {
        const objectCount = this.scene.children.filter(
            child => child.name && child.name.toLowerCase().startsWith(type.toLowerCase())
        ).length;

        let object;
        const name = `${type.charAt(0).toUpperCase() + type.slice(1)}-${objectCount + 1}`;

        try {
            object = Game.create(type, name);
        } catch (e) {
            console.warn(`Não foi possível criar objeto do tipo "${type}": ${e.message}`);
            return;
        }

        // Garante posicionamento consistente
        const randomPosition = new THREE.Vector3(
            Math.random() * 4 - 2,
            Math.random() * 2 + 1,
            Math.random() * 4 - 2
        );
        if (type !== 'platform' && type !== 'directional-light') {
            object.position.copy(randomPosition);
        }

        object.userData.type = type;

        if (object) {
            this.scene.add(object);
            this.updateHierarchy();
            this.selectObject(object); // Seleciona o objeto recém-importado
        }
        return object;
    }

    /**
     * Seleciona um objeto na cena, exibindo seus dados no Inspector e ativando os controles de transformação.
     * @param {THREE.Object3D} object - O objeto a ser selecionado.
     */
    selectObject(object) {
        if (!object || !(object instanceof THREE.Object3D)) {
            console.warn('Objeto selecionado inválido');
            return;
        }

        // Safeguard: Never attach transform controls to itself.
        if (object === this.transformControls) {
            console.warn('Attempted to select the TransformControls gizmo. Action prevented.');
            return;
        }

        this.selectedObject = object;

        // Desativa e ativa os controles de transformação
        if (this.transformControls) {
            this.transformControls.detach();
            if (!this.isGameRunning && !this.isSceneStateSaved) { // Only attach if not in play/pause mode
                this.transformControls.attach(object);
            }
        }

        // Atualiza a seleção visual no painel de hierarquia
        document.querySelectorAll('.object-item').forEach(item =>
            item.classList.remove('selected'));

        const objectItems = document.querySelectorAll('.object-item');
        const selectedItem = Array.from(objectItems).find(item => {
            const nameEl = item.querySelector('.object-name');
            return nameEl && nameEl.textContent === object.name;
        });

        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        this.updateInspector(object);

        // Garante que o modo de transformação atual seja aplicado
        if (this.transformControls) {
            const currentMode = document.querySelector('.transform-mode.active')?.dataset.mode || 'translate';
            this.setTransformMode(currentMode);
        }
    }

    /**
     * Remove um objeto da cena.
     * @param {THREE.Object3D} object - O objeto a ser removido.
     */
    deleteObject(object) {
        // If the object has a visual helper (e.g., CameraHelper), remove it too.
        if (object.userData.helper) {
            this.scene.remove(object.userData.helper);
            // Dispose of the helper's geometry and material to free memory
            if (typeof object.userData.helper.dispose === 'function') {
                 object.userData.helper.dispose();
            } else {
                if (object.userData.helper.geometry) object.userData.helper.geometry.dispose();
                if (object.userData.helper.material) object.userData.helper.material.dispose();
            }
        }
        this.scene.remove(object);

        if (this.selectedObject === object) {
            this.transformControls.detach();
            this.selectedObject = null;
            document.getElementById('inspector-content').innerHTML = '';
        }

        this.updateHierarchy();
        this.refreshViewerIfOpen();
    }

    /**
     * Atualiza o painel Inspector para refletir as propriedades atuais do objeto selecionado.
     * @param {THREE.Object3D} object - O objeto cujas propriedades serão exibidas.
     */
    updateInspector(object) {
        const inspectorContent = document.getElementById('inspector-content');
        inspectorContent.innerHTML = '';

        const createOptions = (options) => {
            const select = document.createElement('select');
            options.forEach((option) => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                select.appendChild(optionElement);
            });
            return select;
        };

        const createPropertyGroup = (title, properties) => {
            const group = document.createElement('div');
            group.className = 'property-group';
            group.innerHTML = `<strong>${this.i18n.t(`inspector.${title.toLowerCase().replace(/ /g, '_')}`)}</strong>`; // Translate title

            properties.forEach(prop => {
                const row = document.createElement('div');
                row.className = 'property-row';
                let inputHtml;
                let step = prop.step || "0.01";
                let min = prop.min !== undefined ? `min="${prop.min}"` : '';
                let max = prop.max !== undefined ? `max="${prop.max}"` : '';
                let valueAttribute = prop.value;

                if (prop.type === 'color') {
                    inputHtml = `<input type="color" value="${valueAttribute}" />`;
                } else if (prop.type === 'number') {
                    if (prop.isAngle) {
                        step = "1";
                        valueAttribute = valueAttribute.toFixed(0); // For display as integer degrees
                    } else {
                        valueAttribute = valueAttribute.toFixed(2); // For 2 decimal places display
                    }
                    inputHtml = `<input type="number" step="${step}" ${min} ${max} value="${valueAttribute}" data-original-axis="${prop.axis || ''}" name="${prop.name || ''}" />`;
                } else { // Default to text
                    inputHtml = `<input type="text" value="${valueAttribute}" data-original-axis="${prop.axis || ''}" name="${prop.name || ''}" />`;
                }

                row.innerHTML = `
                    <label>${prop.label}</label>
                    ${inputHtml}
                    <button class="reset-property-btn" 
                            data-property-group="${title.toLowerCase()}" 
                            data-property-name="${prop.name || prop.axis || ''}" 
                            data-default-value="${prop.defaultValue}">Reset</button>
                `;
                const input = row.querySelector('input');
                const resetButton = row.querySelector('.reset-property-btn');

                input.addEventListener('change', () => {
                    let value;
                    if (input.type === 'number') {
                        value = parseFloat(input.value);
                    } else if (input.type === 'color') {
                        value = input.value; // Hex string
                    } else {
                        value = input.value;
                    }
                    prop.onChange(value);
                    // Force refresh of transform controls if position/rotation/scale changed
                    if (['position', 'rotation', 'scale'].includes(title.toLowerCase())) {
                        if (this.transformControls.object === object) {
                             this.transformControls.updateMatrixWorld();
                        }
                    }
                    // For camera, ensure projection matrix and helper update
                    if (object.isCamera && (prop.name === 'fov' || prop.name === 'near' || prop.name === 'far')) {
                        object.updateProjectionMatrix();
                        if (object.userData.helper) {
                            object.userData.helper.update();
                        }
                    }
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const stepVal = parseFloat(input.step || '0.01');
                        let currentValue = parseFloat(input.value);
                        if (isNaN(currentValue)) currentValue = 0;

                        if (e.key === 'ArrowUp') {
                            input.value = (currentValue + stepVal); // Don't fix decimal here, let change event do it
                        } else {
                            input.value = (currentValue - stepVal);
                        }
                        input.dispatchEvent(new Event('change')); // Trigger change to apply and reformat
                    }
                });

                resetButton.addEventListener('click', () => {
                    const defaultValue = resetButton.dataset.defaultValue; // Get as string
                    const propName = resetButton.dataset.propertyName;
                    const propGroup = resetButton.dataset.propertyGroup;

                    if (propGroup === 'rotation') {
                        object.rotation[prop.axis] = THREE.MathUtils.degToRad(parseFloat(defaultValue));
                        input.value = parseFloat(defaultValue).toFixed(0); // Display as integer
                    } else if (propGroup === 'position' || propGroup === 'scale') {
                        object[propGroup][prop.axis] = parseFloat(defaultValue);
                        input.value = parseFloat(defaultValue).toFixed(2);
                    } else if (propGroup === 'light properties') {
                        if (propName === 'color') {
                            object.color.set(defaultValue);
                            input.value = defaultValue; // Should be '#RRGGBB'
                        } else if (propName === 'intensity') {
                            object.intensity = parseFloat(defaultValue);
                            input.value = parseFloat(defaultValue).toFixed(2);
                        }
                    } else if (propGroup === 'camera properties') {
                        if (propName === 'fov') {
                            object.fov = parseFloat(defaultValue);
                            input.value = parseFloat(defaultValue).toFixed(0);
                        } else if (propName === 'near') {
                            object.near = parseFloat(defaultValue);
                            input.value = parseFloat(defaultValue).toFixed(2);
                        } else if (propName === 'far') {
                            object.far = parseFloat(defaultValue);
                            input.value = parseFloat(defaultValue).toFixed(0);
                        }
                        object.updateProjectionMatrix(); // Camera specific
                        if (object.userData.helper) { // Update helper too
                            object.userData.helper.update();
                        }
                    }
                    input.dispatchEvent(new Event('change')); // Trigger change to update the property and UI
                });

                group.appendChild(row);
            });
            return group;
        };

        inspectorContent.appendChild(createPropertyGroup('Position', [
            { label: 'X', axis: 'x', value: object.position.x, onChange: (v) => object.position.x = v, type: 'number', defaultValue: 0 },
            { label: 'Y', axis: 'y', value: object.position.y, onChange: (v) => object.position.y = v, type: 'number', defaultValue: 0 },
            { label: 'Z', axis: 'z', value: object.position.z, onChange: (v) => object.position.z = v, type: 'number', defaultValue: 0 }
        ]));

        inspectorContent.appendChild(createPropertyGroup('Rotation', [
            { label: 'X', axis: 'x', value: THREE.MathUtils.radToDeg(object.rotation.x), onChange: (v) => object.rotation.x = THREE.MathUtils.degToRad(v), type: 'number', isAngle: true, defaultValue: 0 },
            { label: 'Y', axis: 'y', value: THREE.MathUtils.radToDeg(object.rotation.y), onChange: (v) => object.rotation.y = THREE.MathUtils.degToRad(v), type: 'number', isAngle: true, defaultValue: 0 },
            { label: 'Z', axis: 'z', value: THREE.MathUtils.radToDeg(object.rotation.z), onChange: (v) => object.rotation.z = THREE.MathUtils.degToRad(v), type: 'number', isAngle: true, defaultValue: 0 }
        ]));

        inspectorContent.appendChild(createPropertyGroup('Scale', [
            { label: 'X', axis: 'x', value: object.scale.x, onChange: (v) => object.scale.x = v, type: 'number', defaultValue: 1 },
            { label: 'Y', axis: 'y', value: object.scale.y, onChange: (v) => object.scale.y = v, type: 'number', defaultValue: 1 },
            { label: 'Z', axis: 'z', value: object.scale.z, onChange: (v) => object.scale.z = v, type: 'number', defaultValue: 1 }
        ]));

        // Light properties
        if (object.isLight) {
            inspectorContent.appendChild(createPropertyGroup('Light Properties', [
                { label: 'Color', name: 'color', value: `#${object.color.getHexString()}`, onChange: (v) => object.color.set(v), type: 'color', defaultValue: '#ffffff' },
                { label: 'Intensity', name: 'intensity', value: object.intensity, onChange: (v) => object.intensity = v, type: 'number', step: 0.1, min: 0, defaultValue: 1 }
            ]));
        }

        // Camera properties
        if (object.isCamera) {
            if (object.isPerspectiveCamera) {
                inspectorContent.appendChild(createPropertyGroup('Camera Properties', [
                    { label: 'FOV', name: 'fov', value: object.fov, onChange: (v) => object.fov = v, type: 'number', step: 1, min: 1, max: 179, defaultValue: 75 },
                    { label: 'Near', name: 'near', value: object.near, onChange: (v) => object.near = v, type: 'number', step: 0.1, min: 0.01, defaultValue: 0.1 },
                    { label: 'Far', name: 'far', value: object.far, onChange: (v) => object.far = v, type: 'number', step: 1, min: 0.1, defaultValue: 1000 }
                ]));
            }
            // Add OrthographicCamera properties if needed in the future

            // --- NEW FOLLOW TARGET SECTION ---
            const followSection = document.createElement('div');
            followSection.className = 'property-group';
            followSection.innerHTML = `<strong>Follow Target</strong>`;

            const targetSelectorRow = document.createElement('div');
            targetSelectorRow.className = 'property-row';
            
            const label = document.createElement('label');
            label.textContent = "Target";
            label.style.flexBasis = 'auto';
            label.style.minWidth = '50px';
            label.style.marginRight = '10px';

            const select = document.createElement('select');
            select.style.flexGrow = '1';
            select.className = 'dropdown-select';
            select.innerHTML = `<option value="">-- None --</option>`;

            // Populate with scene objects
            this.scene.children.forEach(child => {
                if (child !== object && child.isObject3D && child.name && child.name !== "EditorCamera" && !(child instanceof TransformControls) && !child.isLightHelper && !child.isCameraHelper) {
                    const option = document.createElement('option');
                    option.value = child.uuid;
                    option.textContent = child.name;
                    if (object.userData.followConfig?.targetUUID === child.uuid) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                }
            });

            select.addEventListener('change', (e) => {
                const targetUUID = e.target.value;
                if (targetUUID) {
                    if (!object.userData.followConfig) {
                        object.userData.followConfig = {
                            targetUUID: targetUUID,
                            offset: { x: 0, y: 5, z: 10 },
                            lookAt: true,
                            smoothPosition: false,
                            positionSpeed: 0.1,
                            smoothRotation: false,
                            rotationSpeed: 0.05
                        };
                    } else {
                        object.userData.followConfig.targetUUID = targetUUID;
                    }
                } else {
                    delete object.userData.followConfig;
                }
                this.updateInspector(object); // Refresh inspector to show/hide options
            });
            
            targetSelectorRow.appendChild(label);
            targetSelectorRow.appendChild(select);
            followSection.appendChild(targetSelectorRow);
            inspectorContent.appendChild(followSection);

            if (object.userData.followConfig?.targetUUID) {
                const config = object.userData.followConfig;

                // --- Follow Offset ---
                inspectorContent.appendChild(createPropertyGroup('Follow Offset', [
                    { label: 'X', axis: 'x', value: config.offset.x, onChange: (v) => config.offset.x = v, type: 'number', defaultValue: 0 },
                    { label: 'Y', axis: 'y', value: config.offset.y, onChange: (v) => config.offset.y = v, type: 'number', defaultValue: 5 },
                    { label: 'Z', axis: 'z', value: config.offset.z, onChange: (v) => config.offset.z = v, type: 'number', defaultValue: 10 }
                ]));
                
                // --- Follow Behavior ---
                const behaviorSection = document.createElement('div');
                behaviorSection.className = 'property-group';
                behaviorSection.innerHTML = `
                    <strong>Follow Behavior</strong>
                    
                    <div class="property-row" style="align-items: center;">
                        <label for="follow-lookat-cb" style="flex-grow: 1; cursor: pointer;">Look At Target</label>
                        <input type="checkbox" id="follow-lookat-cb" style="flex-grow: 0;">
                    </div>

                    <div class="property-row" style="align-items: center;">
                        <label for="follow-smooth-pos-cb" style="flex-grow: 1; cursor: pointer;">Smooth Position</label>
                        <input type="checkbox" id="follow-smooth-pos-cb" style="flex-grow: 0;">
                    </div>
                    <div class="property-row" id="follow-pos-speed-row" style="display: none;">
                        <label>Position Speed</label>
                        <input type="number" id="follow-pos-speed" step="0.01" min="0.01" max="1">
                    </div>

                    <div class="property-row" style="align-items: center;">
                        <label for="follow-smooth-rot-cb" style="flex-grow: 1; cursor: pointer;">Smooth Rotation</label>
                        <input type="checkbox" id="follow-smooth-rot-cb" style="flex-grow: 0;">
                    </div>
                    <div class="property-row" id="follow-rot-speed-row" style="display: none;">
                        <label>Rotation Speed</label>
                        <input type="number" id="follow-rot-speed" step="0.01" min="0.01" max="1">
                    </div>
                `;
                inspectorContent.appendChild(behaviorSection);
                
                // Logic for the new behavior controls
                const lookAtCb = document.getElementById('follow-lookat-cb');
                const smoothPosCb = document.getElementById('follow-smooth-pos-cb');
                const smoothRotCb = document.getElementById('follow-smooth-rot-cb');
                const posSpeedRow = document.getElementById('follow-pos-speed-row');
                const rotSpeedRow = document.getElementById('follow-rot-speed-row');
                const posSpeedInput = document.getElementById('follow-pos-speed');
                const rotSpeedInput = document.getElementById('follow-rot-speed');

                // Set initial states from config
                lookAtCb.checked = config.lookAt;
                smoothPosCb.checked = config.smoothPosition;
                smoothRotCb.checked = config.smoothRotation;
                posSpeedInput.value = config.positionSpeed;
                rotSpeedInput.value = config.rotationSpeed;
                posSpeedRow.style.display = config.smoothPosition ? 'flex' : 'none';
                rotSpeedRow.style.display = config.smoothRotation ? 'flex' : 'none';

                // Add event listeners
                lookAtCb.addEventListener('change', () => config.lookAt = lookAtCb.checked);
                smoothPosCb.addEventListener('change', () => {
                    config.smoothPosition = smoothPosCb.checked;
                    posSpeedRow.style.display = config.smoothPosition ? 'flex' : 'none';
                });
                smoothRotCb.addEventListener('change', () => {
                    config.smoothRotation = smoothRotCb.checked;
                    rotSpeedRow.style.display = config.smoothRotation ? 'flex' : 'none';
                });
                posSpeedInput.addEventListener('change', () => config.positionSpeed = parseFloat(posSpeedInput.value));
                rotSpeedInput.addEventListener('change', () => config.rotationSpeed = parseFloat(rotSpeedInput.value));
            }
        }

        const scriptSection = document.createElement('div');
        scriptSection.className = 'property-group script-management-section';
        scriptSection.innerHTML = `
            <strong>${this.i18n.t('inspector.scripts.title')}</strong>
            <div class="script-actions-container">
                <div class="script-quick-actions">
                    <button class="attach-script-btn">
                        <span class="btn-icon">🔗</span>
                        <span>${this.i18n.t('inspector.scripts.attach_existing')}</span>
                    </button>
                </div>
                <div class="script-list-container">
                    <h4>${this.i18n.t('inspector.scripts.attached_scripts')}</h4>
                    <div class="attached-scripts-list">
                        ${object.userData.scripts && object.userData.scripts.length
                            ? object.userData.scripts.map(script => `
                                <div class="script-list-item" data-script-name="${script.name}">
                                    <span class="script-name">${script.name}</span>
                                    <div class="script-actions">
                                        <button class="edit-script" data-script-name="${script.name}">Edit</button>
                                        <button class="remove-script" data-script-name="${script.name}">Remove</button>
                                    </div>
                                </div>
                            `).join('')
                            : `<p class="no-scripts-msg">${this.i18n.t('inspector.scripts.none_attached')}</p>`
                        }
                    </div>
                </div>
            </div>
        `;

        scriptSection.querySelector('.attach-script-btn').addEventListener('click', () => {
            // Find all script keys from localStorage, excluding the global one for this menu
            const existingScripts = Object.keys(localStorage).filter(key => key.startsWith('script:') || key === 'script:global-preload');

            // Filter out scripts that are already attached to the current object
            const attachedScriptNames = (object.userData.scripts || []).map(s => s.name);
            const availableScripts = existingScripts.filter(name => !attachedScriptNames.includes(name.replace('script:', '')));

            if (availableScripts.length === 0) {
                console.log("No unattached scripts available to add.");
                // Optionally show a small message to the user.
                return;
            }

            const scriptMenu = document.createElement('div');
            scriptMenu.className = 'script-selection-menu';
            scriptMenu.innerHTML = `
                <div class="script-selection-header">
                    <h4>${this.i18n.t('inspector.scripts.select_to_attach')}</h4>
                    <button class="close-script-menu">×</button>
                </div>
                <div class="script-selection-list">
                    ${availableScripts.length > 0
                        ? availableScripts.map(scriptName => `
                            <button class="script-selection-item" data-script-name="${scriptName.replace('script:', '')}">
                                ${scriptName.replace('script:', '')}
                            </button>
                        `).join('')
                        : `<p class="no-scripts-msg">All scripts are attached.</p>`
                    }
                </div>
            `;

            document.body.appendChild(scriptMenu);

            const closeMenu = () => {
                if(scriptMenu.parentElement) {
                    scriptMenu.remove();
                }
            };

            scriptMenu.querySelector('.close-script-menu').addEventListener('click', closeMenu);

            scriptMenu.addEventListener('click', (e) => {
                const scriptSelectionItem = e.target.closest('.script-selection-item');
                if (scriptSelectionItem) {
                    const scriptName = scriptSelectionItem.dataset.scriptName;
                    ScriptManager.attachScriptToObject(object, scriptName);
                    this.refreshViewerIfOpen();
                    this.updateInspector(object); // Refresh the inspector to show the new script
                    closeMenu();
                }
            });
        });

        // Use event delegation for the script list
        const scriptsListContainer = scriptSection.querySelector('.attached-scripts-list');
        if (scriptsListContainer) {
            scriptsListContainer.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-script');
                const removeBtn = e.target.closest('.remove-script');

                if (editBtn) {
                    const scriptName = editBtn.dataset.scriptName;
                    this.openScriptEditor(scriptName);
                }

                if (removeBtn) {
                    const scriptName = removeBtn.dataset.scriptName;
                    if (confirm(this.i18n.t('confirm.delete_script').replace('{scriptName}', scriptName))) {
                        ScriptManager.detachScriptFromObject(object, scriptName);
                        this.refreshViewerIfOpen();
                        this.updateInspector(object); // Refresh the inspector
                    }
                }
            });
        }


        inspectorContent.appendChild(scriptSection);
    }

    /**
     * Populates the Scripts panel UI with all scripts found in localStorage.
     */
    populateScriptsPanel() {
        const scriptsContent = document.getElementById('scripts-content');
        if (!scriptsContent) return;

        // Clear existing content to avoid duplicates on re-call, though this is mainly called once on startup.
        scriptsContent.innerHTML = '';

        const scriptKeys = Object.keys(localStorage).filter(key => key.startsWith('script:') || key === 'script:global-preload');

        scriptKeys.forEach(key => {
            const scriptName = key.replace('script:', '');

            // This is a simplified version of createScript's UI part, without creating a new localStorage entry.
            const scriptItem = document.createElement('div');
            scriptItem.className = 'script-item';
            // The global-preload script is special and should not be draggable/deletable from here
            if (scriptName !== 'global-preload') {
                scriptItem.setAttribute('draggable', 'true');
            }
            scriptItem.dataset.scriptName = scriptName;
            scriptItem.innerHTML = `
                <span class="script-name">${scriptName}.js</span>
                <div class="script-item-actions">
                    <button class="edit-script" data-script-name="${scriptName}">Edit</button>
                    ${scriptName !== 'global-preload' ? `<button class="delete-script" data-script-name="${scriptName}">Delete</button>` : ''}
                </div>
            `;

            // Event listeners are now managed by delegation in setupScriptEvents to avoid duplicates.

            scriptsContent.appendChild(scriptItem);
        });
    }

    /**
     * Cria um novo script no localStorage e no painel de Scripts.
     * @param {string} name - O nome do script.
     */
    createScript(name) {
        const scriptsContent = document.getElementById('scripts-content');

        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        scriptItem.setAttribute('draggable', 'true');
        scriptItem.dataset.scriptName = name;
        scriptItem.innerHTML = `
            <span class="script-name">${name}.js</span>
            <div class="script-item-actions">
                <button class="edit-script" data-script-name="${name}">Edit</button>
                <button class="delete-script" data-script-name="${name}">Delete</button>
            </div>
        `;

        // Event listeners are now managed by delegation in setupScriptEvents to avoid duplicates.

        scriptsContent.appendChild(scriptItem);

        ScriptManager.createScript(name);
    }

    /**
     * Abre um editor modal para criar ou editar um script.
     * @param {string|object} scriptItem - O nome do script ou o item do script.
     * @param {Function} onSaveCallback - Callback a ser executado ao salvar.
     */
    openScriptEditor(scriptItem, onSaveCallback) {
        const scriptName = typeof scriptItem === 'string'
            ? scriptItem
            : (scriptItem.name || `Script-${Date.now()}`);

        const scriptEditor = document.createElement('div');
        scriptEditor.className = 'script-editor active';
        scriptEditor.innerHTML = `
            <div class="script-editor-header">
                <span>${scriptName}.js</span>
                <button class="close-script-editor">×</button>
            </div>
            <div class="script-editor-content">
                <div class="codemirror-container"></div>
                <button class="save-script">${this.i18n.t('viewer.save_script')}</button>
            </div>
        `;
        document.body.appendChild(scriptEditor);

        const editorContainer = scriptEditor.querySelector('.codemirror-container');
        const cmInstance = CodeMirror(editorContainer, {
            value: localStorage.getItem(`script:${scriptName}`) || '',
            mode: 'javascript',
            theme: 'darcula',
            lineNumbers: true,
            tabSize: 2,
        });

        // Refresh is needed when the editor is created in a hidden element
        setTimeout(() => cmInstance.refresh(), 1);

        scriptEditor.querySelector('.close-script-editor').addEventListener('click', () => {
            scriptEditor.remove();
        });

        scriptEditor.querySelector('.save-script').addEventListener('click', () => {
            const scriptContent = cmInstance.getValue();
            localStorage.setItem(`script:${scriptName}`, scriptContent);
            ScriptManager.invalidateCache(scriptName);

            if (onSaveCallback) {
                onSaveCallback(scriptContent, scriptName);
            }

            scriptEditor.remove();
        });
    }

    /**
     * Cria um item de folder no painel do Projeto.
     * @param {string} name - O nome da folder.
     */
    createProjectFolder(name) {
        const projectContent = document.getElementById('project-content');

        const folderItem = document.createElement('div');
        folderItem.className = 'project-item folder';
        folderItem.innerHTML = `
            <span class="item-icon">📁</span>
            <span class="item-name">${name}</span>
            <div class="project-controls">
                <button class="delete-folder">×</button>
            </div>
            <div class="nested-items"></div>
        `;

        folderItem.querySelector('.delete-folder').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(this.i18n.t('confirm.delete_folder').replace('{folderName}', name))) {
                folderItem.remove();
            }
        });

        folderItem.querySelector('.item-name').addEventListener('click', () => {
            folderItem.classList.toggle('expanded');
        });

        projectContent.appendChild(folderItem);
    }

    /**
     * Adiciona um item de arquivo importado no painel do Projeto.
     * @param {File} file - O arquivo importado.
     */
    importProjectFile(file) {
        const projectContent = document.getElementById('project-content');

        const fileItem = document.createElement('div');
        fileItem.className = 'project-item file';
        fileItem.innerHTML = `
            <span class="item-icon">📄</span>
            <span class="item-name">${file.name}</span>
            <div class="project-controls">
                <button class="import-to-scene">${this.i18n.t('project.import_to_scene')}</button>
                <button class="delete-file">×</button>
            </div>
        `;

        fileItem.querySelector('.import-to-scene').addEventListener('click', () => {
            this.importFileToScene(file);
        });

        fileItem.querySelector('.delete-file').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(this.i18n.t('confirm.delete_file').replace('{fileName}', file.name))) {
                fileItem.remove();
            }
        });

        projectContent.appendChild(fileItem);
    }

    /**
     * Importa um modelo 3D (OBJ/GLTF/GLB) para a cena.
     * @param {File} file - O arquivo do modelo.
     */
    importFileToScene(file) {
        const loader = file.name.toLowerCase().endsWith('.obj')
            ? new OBJLoader()
            : new GLTFLoader();

        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.name.toLowerCase().endsWith('.gltf') || file.name.toLowerCase().endsWith('.glb')) {
                loader.load(URL.createObjectURL(file), (gltf) => {
                    this.addImportedObject(gltf.scene);
                }, undefined, (error) => {
                    console.error('Erro ao carregar arquivo GLTF/GLB:', error);
                });
            } else if (file.name.toLowerCase().endsWith('.obj')) {
                loader.load(URL.createObjectURL(file), (object) => {
                    this.addImportedObject(object);
                }, undefined, (error) => {
                    console.error('Erro ao carregar arquivo OBJ:', error);
                });
            }
        };
        reader.readAsArrayBuffer(file);
    }

    /**
     * Adiciona um objeto importado à cena e o seleciona.
     * @param {THREE.Object3D} object - O objeto importado.
     */
    addImportedObject(object) {
        // Itera sobre todos os filhos do objeto importado para habilitar sombras
        object.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.scene.add(object);
        this.updateHierarchy();
        this.selectObject(object); // Seleciona o objeto recém-importado
    }

    /**
     * Atualiza o painel de Hierarquia para refletir a estrutura atual da cena.
     */
    updateHierarchy() {
        const hierarchyContent = document.getElementById('hierarchy-content');

        // Limpa o conteúdo existente
        if (hierarchyContent) {
            hierarchyContent.innerHTML = '';
        } else {
            console.warn('Elemento de hierarquia não encontrado');
            return;
        }

        // Percorre a cena e cria os itens de hierarquia
        this.scene.children.forEach(obj => {
            // Display everything except the main editor camera and the transform controls
            if (obj.name !== "EditorCamera" && !(obj instanceof TransformControls) && !obj.isLightHelper && !obj.isCameraHelper) {
                const objectItem = document.createElement('div');
                objectItem.className = 'object-item';
                objectItem.dataset.uuid = obj.uuid; // Adiciona UUID para referência estável

                let icon = '📦'; // Default icon
                if (obj.isLight) {
                    icon = '💡';
                } else if (obj.isCamera) {
                    icon = '📸';
                }

                objectItem.innerHTML = `
                    <span class="toggle-placeholder">${icon}</span>
                    <span class="object-name">${obj.name || 'Objeto Não Nomeado'}</span>
                    <div class="object-controls">
                        <button class="visibility-toggle">👁</button>
                        <button class="delete-object">✖</button>
                    </div>
                `;

                // Alterna a visibilidade
                const visibilityToggle = objectItem.querySelector('.visibility-toggle');
                visibilityToggle.classList.add('active');
                visibilityToggle.addEventListener('click', () => {
                    obj.visible = !obj.visible;
                    visibilityToggle.textContent = obj.visible ? '👁' : '👁‍🗨';
                });

                // Remove o objeto
                const deleteButton = objectItem.querySelector('.delete-object');
                deleteButton.addEventListener('click', () => {
                    if (confirm(this.i18n.t('confirm.delete_object').replace('{objectName}', obj.name))) {
                        this.deleteObject(obj);
                    }
                });

                hierarchyContent.appendChild(objectItem);
            }
        });
    }

    /**
     * Inicia o modo de jogo. Salva o estado atual da cena e começa a executar os scripts.
     */
    play() {
        console.log("Play button pressed. Current state: isGameRunning=", this.isGameRunning, "isSceneStateSaved=", this.isSceneStateSaved);

        if (this.isGameRunning && this.isSceneStateSaved) {
            console.log("Already playing. No action needed.");
            return;
        }

        // Save scene state only if not already playing/paused
        if (!this.isSceneStateSaved) {
            this.savedSceneState = {};
            this.scene.traverse(obj => {
                if (obj.isObject3D) {
                    this.savedSceneState[obj.uuid] = {
                        position: obj.position.clone(),
                        rotation: obj.rotation.clone(),
                        scale: obj.scale.clone(),
                    };
                }
            });
            // Also save the editor camera's state
            this.savedEditorCameraState = {
                position: this.camera.position.clone(),
                rotation: this.camera.rotation.clone(),
                fov: this.camera.fov,
                near: this.camera.near,
                far: this.camera.far,
            };
            this.isSceneStateSaved = true;
            console.log("Scene and editor camera state saved.");
        }

        this.isGameRunning = true;
        this.transformControls.detach(); // Esconde o gizmo de transformação
        this.orbitControls.enabled = false; // Desativa o controle de órbita da câmera
        this.updatePlayPauseStopButtons('play');

        // Find a camera in the scene to use for gameplay
        // Priority: object with 'main_camera' tag, then any camera, then fallback to editor camera.
        this.activeGameCamera = TagSystem.getAll('main_camera').find(obj => obj.isPerspectiveCamera) ||
            this.scene.children.find(obj => obj.isPerspectiveCamera && obj.name !== "EditorCamera") ||
            null;

        if (this.activeGameCamera) {
            console.log(`Active game camera set to: "${this.activeGameCamera.name}"`);
        } else {
            console.log("No game camera found in scene. Using editor camera view.");
        }

        const loadingStrategy = document.getElementById('script-loading-strategy')?.value || 'preload';

        if (loadingStrategy === 'preload') {
            // PRELOAD: Compila todos os scripts no início do jogo.
            ScriptManager.preloadAllScripts();
        } else {
            console.log("Script loading strategy: On Demand (Fixload). Scripts will be compiled on first use.");
        }

        // The global preload script runs once every time the 'Play' button is pressed
        // after a 'Stop' (i.e., a new simulation session begins).
        // It's intended for initial setup of the game environment.
        const globalPreloadScript = ScriptManager.getCompiledScript('global-preload');
        if (globalPreloadScript) {
            try {
                console.log("Executing global preload script...");
                globalPreloadScript.call(null, window.drak, window.getByTag);
            } catch (e) {
                console.error("Error in global preload script:", e);
            }
        }
    }

    /**
     * Pausa o modo de jogo. A execução dos scripts é interrompida.
     */
    pause() {
        console.log("Pause button pressed. Current state: isGameRunning=", this.isGameRunning, "isSceneStateSaved=", this.isSceneStateSaved);

        if (!this.isGameRunning && !this.isSceneStateSaved) {
            console.log("Not currently playing. No action needed.");
            return;
        }

        this.isGameRunning = false;
        this.orbitControls.enabled = true; // Reativa o controle de órbita durante a pausa
        this.updatePlayPauseStopButtons('pause');

        // Re-attach transform controls if an object was selected before pausing
        if (this.selectedObject) {
            this.transformControls.attach(this.selectedObject);
        }
    }

    /**
     * Para o modo de jogo. A execução é interrompida e a cena é restaurada ao estado anterior.
     */
    stop() {
        console.log("Stop button pressed. Current state: isGameRunning=", this.isGameRunning, "isSceneStateSaved=", this.isSceneStateSaved);

        if (!this.isSceneStateSaved) {
            console.log("Nothing to stop. Scene state not saved.");
            return; // Nothing to stop if no state was saved (not playing/paused)
        }

        this.isGameRunning = false;
        this.orbitControls.enabled = true;

        // Restore the scene state
        if (this.savedSceneState) {
            this.scene.traverse(obj => {
                if (this.savedSceneState[obj.uuid]) {
                    const state = this.savedSceneState[obj.uuid];
                    obj.position.copy(state.position);
                    obj.rotation.copy(state.rotation);
                    obj.scale.copy(state.scale);
                }
            });
            this.savedSceneState = null; // Clear the saved state
            this.isSceneStateSaved = false; // Mark state as no longer saved
            console.log("Scene state restored.");
        }

        // Restore editor camera state
        if (this.savedEditorCameraState) {
            this.camera.position.copy(this.savedEditorCameraState.position);
            this.camera.rotation.copy(this.savedEditorCameraState.rotation);
            this.camera.fov = this.savedEditorCameraState.fov;
            this.camera.near = this.savedEditorCameraState.near;
            this.camera.far = this.savedEditorCameraState.far;
            this.camera.updateProjectionMatrix();
            this.savedEditorCameraState = null;
            console.log("Editor camera state restored.");
        }

        // Re-attach transform controls if an object is selected
        if (this.selectedObject) {
            this.transformControls.attach(this.selectedObject);
            this.updateInspector(this.selectedObject); // Atualiza o inspetor
        }
        this.updatePlayPauseStopButtons('stop');
    }

    /**
     * The main animation and rendering loop. Called every frame.
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isGameRunning) { // Only run game logic if in 'play' mode
            // Handle camera follow logic before syncing the main renderer camera
            this.scene.traverse(obj => {
                if (obj.isCamera && obj.userData.followConfig?.targetUUID) {
                    const config = obj.userData.followConfig;
                    const target = this.scene.getObjectByProperty('uuid', config.targetUUID);
                    
                    if (target) {
                        // Calculate desired position
                        const offset = new THREE.Vector3(config.offset.x, config.offset.y, config.offset.z);
                        const targetPosition = target.getWorldPosition(new THREE.Vector3());
                        const desiredPosition = new THREE.Vector3().copy(targetPosition).add(offset);

                        // Position update
                        if (config.smoothPosition) {
                            obj.position.lerp(desiredPosition, config.positionSpeed);
                        } else {
                            obj.position.copy(desiredPosition);
                        }

                        // Rotation update
                        if (config.lookAt) {
                            if (config.smoothRotation) {
                                const targetQuaternion = new THREE.Quaternion();
                                const tempMatrix = new THREE.Matrix4();
                                tempMatrix.lookAt(obj.position, targetPosition, obj.up);
                                targetQuaternion.setFromRotationMatrix(tempMatrix);
                                obj.quaternion.slerp(targetQuaternion, config.rotationSpeed);
                            } else {
                                obj.lookAt(targetPosition);
                            }
                        }
                    }
                }
            });

            // If there's an active game camera from the scene, sync the main camera to it
            if (this.activeGameCamera) {
                this.camera.position.copy(this.activeGameCamera.getWorldPosition(new THREE.Vector3()));
                this.camera.quaternion.copy(this.activeGameCamera.getWorldQuaternion(new THREE.Quaternion()));
                if (this.camera.fov !== this.activeGameCamera.fov) {
                    this.camera.fov = this.activeGameCamera.fov;
                    this.camera.updateProjectionMatrix();
                }
            }

            this.scene.traverse(obj => {
                // Execute object scripts and components
                ScriptManager.executeObjectScripts(obj);

                // Execute the update method of components
                const comps = obj.userData?.components;
                if (comps) {
                    for (let key in comps) {
                        const comp = comps[key];
                        if (typeof comp.update === 'function') {
                            comp.update(obj);
                        }
                    }
                }
            });
        }

        if (this.orbitControls) this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handles window resize events to update camera aspect and renderer size.
     */
    onWindowResize() {
        const viewport = document.getElementById('viewport');
        if (viewport) {
            const width = viewport.clientWidth;
            const height = viewport.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }

    /**
     * Opens the script editor for a specific object.
     * @param {THREE.Object3D} object - The object the script will be associated with.
     */
    openScriptEditorForObject(object) {
        const scriptName = prompt('Enter script name for object') || `${object.name || object.type}-Script`;
        this.openScriptEditor(scriptName, (scriptContent, savedScriptName) => {
            ScriptManager.createScript(savedScriptName, scriptContent);
            ScriptManager.attachScriptToObject(object, savedScriptName);
            this.updateInspector(object);
        });
    }

    /**
     * Configura a lógica de gerenciamento de arquivos e pastas no painel "Project".
     */
    setupProjectManagement() {
        const projectContent = document.getElementById('project-content');
        const createFolderButton = document.getElementById('create-folder');
        const importFileButton = document.getElementById('import-file');

        if (createFolderButton) {
            createFolderButton.addEventListener('click', () => {
                const folderName = prompt('Enter folder name');
                if (folderName) {
                    this.createProjectFolder(folderName);
                }
            });
        }

        if (importFileButton) {
            importFileButton.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = (event) => {
                    Array.from(event.target.files).forEach(file => {
                        this.importProjectFile(file);
                    });
                };
                input.click();
            });
        }
    }

    /**
     * Configura a lógica de gerenciamento de scripts (atualmente vazio, lógica está em outros locais).
     */
    setupScriptManagement() {
        // Adicione a lógica de gerenciamento de scripts aqui se necessário
    }

    /**
     * Configura o switcher de layout da UI.
     */
    setupLayoutSwitcher() {
        const editor = document.getElementById('editor');
        const layoutSwitcher = document.getElementById('layout-switcher');
        if (!editor || !layoutSwitcher) return;

        // Ensure the default layout class is always present
        editor.classList.add('layout-default');

        // Ensure the 'DEF' button is active by default
        const defaultLayoutBtn = layoutSwitcher.querySelector('[data-layout="default"]');
        if (defaultLayoutBtn) {
            defaultLayoutBtn.classList.add('active');
        }

        const updateCanvasSize = () => {
            // Esta função é definida dentro de setupResponsiveRendering, então disparamos um evento de redimensionamento
            window.dispatchEvent(new Event('resize'));
        };

        layoutSwitcher.addEventListener('click', (e) => {
            const button = e.target.closest('.layout-btn');
            if (!button || button.classList.contains('active')) return;

            const layout = button.dataset.layout; // Corrected: Use data-layout instead of data-tab
            if (!layout) return;

            // Remove as classes de layout existentes do editor
            editor.className = editor.className.replace(/\blayout-\w+/g, '').trim();

            // Adiciona a nova classe de layout
            editor.classList.add(`layout-${layout}`);

            // Atualiza o estado ativo dos botões
            layoutSwitcher.querySelectorAll('.layout-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // O tamanho da viewport mudará, então precisamos atualizar o renderizador.
            // Um pequeno atraso garante que a grid CSS tenha sido recalculada pelo navegador.
            setTimeout(updateCanvasSize, 50);
        });
    }

    /**
     * Configures the game terminal.
     */
    setupTerminal() {
        const terminal = document.getElementById('game-terminal');
        const terminalOutput = document.getElementById('terminal-output');
        const terminalInput = document.getElementById('terminal-input');
        const closeTerminalBtn = document.getElementById('close-terminal-btn'); // Get new close button

        if (terminal && terminalOutput && terminalInput && closeTerminalBtn) {
            // Toggle terminal visibility with the single quote key
            window.addEventListener('keydown', (e) => {
                if (e.key === "'") {
                    e.preventDefault();
                    terminal.classList.toggle('open');
                    if (terminal.classList.contains('open')) {
                        terminalInput.focus();
                    }
                }
            });

            // Close terminal with the new button
            closeTerminalBtn.addEventListener('click', () => {
                terminal.classList.remove('open');
            });

            // Handle command input
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && terminalInput.value.trim() !== '') {
                    const command = terminalInput.value;
                    this.executeTerminalCommand(command);
                    terminalInput.value = '';
                }
            });
        }
    }

    /**
     * Executes a command from the terminal and prints the output.
     * @param {string} command - The command string to execute.
     */
    executeTerminalCommand(command) {
        const terminalOutput = document.getElementById('terminal-output');
        if (!terminalOutput) return;

        // Log the command itself
        const inputLog = document.createElement('div');
        inputLog.className = 'log-entry log-input';
        inputLog.textContent = `> ${command}`;
        terminalOutput.appendChild(inputLog);

        try {
            // Using eval() as requested by the user.
            // This grants access to all global functions like drak(), getByTag(), etc.
            const result = eval(command);

            // Log the result
            const outputLog = document.createElement('div');
            outputLog.className = 'log-entry log-output';

            // Pretty print the result
            if (result === undefined) {
                outputLog.textContent = 'undefined';
            } else if (typeof result === 'object' && result !== null) {
                outputLog.textContent = JSON.stringify(result, null, 2);
            } else {
                outputLog.textContent = String(result);
            }

            terminalOutput.appendChild(outputLog);

        } catch (error) {
            // Log errors
            const errorLog = document.createElement('div');
            errorLog.className = 'log-entry log-error';
            errorLog.textContent = error.toString();
            terminalOutput.appendChild(errorLog);
        }

        // Auto-scroll to the bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    /**
     * Removes a script from the project: from localStorage, the Scripts panel, and all objects.
     * @param {string} scriptName The name of the script to remove.
     */
    removeScriptFromProject(scriptName) {
        // Remove from localStorage
        localStorage.removeItem(`script:${scriptName}`);

        // Invalidate cache
        ScriptManager.invalidateCache(scriptName);

        // Remove from UI panel
        const scriptsContent = document.getElementById('scripts-content');
        const scriptItem = scriptsContent.querySelector(`.script-item[data-script-name="${scriptName}"]`);
        if (scriptItem) {
            scriptItem.remove();
        }

        // Detach from all objects in the scene
        this.scene.traverse(obj => {
            if (obj.userData.scripts) {
                const initialCount = obj.userData.scripts.length;
                ScriptManager.detachScriptFromObject(obj, scriptName);
                // If a script was detached and this object is selected, refresh inspector
                if (this.selectedObject === obj && obj.userData.scripts.length < initialCount) {
                    this.updateInspector(obj);
                }
            }
        });

        // Refresh script viewer if it's open
        this.refreshViewerIfOpen();
        console.log(`Script "${scriptName}" has been completely removed from the project.`);
    }

    /**
     * If the Viewer modal is open, refreshes the content of the currently active tab.
     */
    refreshViewerIfOpen() {
        const modal = document.getElementById('viewer-modal');
        if (!modal || modal.style.display === 'none') {
            return;
        }

        const activeOptions = modal.querySelector('.tab-btn.active');
        if (!activeOptions) return;

        const optionsName = activeOptions.dataset.tab;
        if (optionsName === 'scene-scripts') {
            // Need to pass a new value here as this is a full refresh
            this.populateSceneScriptsTab(new Map());
        } else if (optionsName === 'fixload-cache') {
            this.populateFixloadTab();
        }
    }

    /**
     * Clears the current scene, removing all objects except the camera and transform controls.
     */
    createEmptyScene() {
        // Detach transform controls if an object is selected
        if (this.transformControls.object) {
            this.transformControls.detach();
        }
        this.selectedObject = null;
        document.getElementById('inspector-content').innerHTML = '';

        // Remove all objects from the scene
        const objectsToRemove = [];
        this.scene.children.forEach(obj => {
            // Keep the camera and transform controls, remove everything else
            if (obj !== this.camera && obj !== this.transformControls) {
                objectsToRemove.push(obj);
            }
        });

        objectsToRemove.forEach(obj => {
            // Dispose of geometries and materials to free up memory
            if (obj.isMesh) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
            this.scene.remove(obj);
        });

        // Reset play/pause state
        this.isGameRunning = false;
        this.savedSceneState = null;
        this.isSceneStateSaved = false;
        this.updatePlayPauseStopButtons('stop'); // Ensure buttons reflect stopped state

        // Re-add default elements for a fresh scene if needed, or simply update hierarchy
        this.updateHierarchy();
        console.log('New empty scene created.');
    }

    /**
     * Toggles the visibility of the game terminal.
     * @param {'open'|'close'|undefined} [forceState] - Forces the terminal to open, close, or toggle if undefined.
     */
    toggleTerminal(forceState) {
        const terminal = document.getElementById('game-terminal');
        const terminalInput = document.getElementById('terminal-input');
        if (!terminal || !terminalInput) return;

        const shouldBeOpen = forceState === 'open' ? true : forceState === 'close' ? false : !terminal.classList.contains('open');

        if (shouldBeOpen) {
            terminal.classList.add('open');
            terminalInput.focus();
        } else {
            terminal.classList.remove('open');
        }
    }

    /**
     * Serializes the current scene into a JSON object using Three.js's built-in serializer.
     * This method is more robust and handles complex objects like imported models.
     * @returns {object} A JSON-compatible object representing the scene and its scripts.
     */
    serializeScene() {
        // --- Prepare Scene Graph for Serialization ---
        const objectsToSerialize = [];
        this.scene.children.forEach(obj => {
            // Filter out editor-specific objects that shouldn't be saved.
            if (obj.name !== "EditorCamera" && !(obj instanceof TransformControls) && !obj.isLightHelper && !obj.isCameraHelper) {
                objectsToSerialize.push(obj);

                // Convert Set to Array for JSON serialization.
                if (obj.userData.tags instanceof Set) {
                    obj.userData.tags = Array.from(obj.userData.tags);
                }
            }
        });

        const sceneJSON = this.scene.toJSON();

        // After serializing, revert any changes made (like Set to Array).
        objectsToSerialize.forEach(obj => {
            if (Array.isArray(obj.userData.tags)) {
                obj.userData.tags = new Set(obj.userData.tags);
            }
        });

        // Filter the final JSON to exclude editor-specific objects.
        sceneJSON.object.children = sceneJSON.object.children.filter(childJSON => {
            const obj = this.scene.getObjectByProperty('uuid', childJSON.uuid);
            return obj && obj.name !== "EditorCamera" && !(obj instanceof TransformControls) && !obj.isLightHelper && !obj.isCameraHelper;
        });

        // --- Collect all scripts from localStorage ---
        const scripts = {};
        const scriptKeys = Object.keys(localStorage).filter(key => key.startsWith('script:'));
        scriptKeys.forEach(key => {
            const scriptName = key.replace('script:', '');
            scripts[scriptName] = localStorage.getItem(key);
        });

        // --- Combine into a single project data object ---
        const projectData = {
            formatVersion: '1.0',
            scene: sceneJSON,
            scripts: scripts
        };

        return projectData;
    }

    /**
     * Deserializes scene data from a JSON object and reconstructs the scene using Three.js's ObjectLoader.
     * This method handles both new and legacy scene file formats.
     * @param {object} fileContent - The parsed JSON object from the scene file.
     */
    async deserializeScene(fileContent) {
        let sceneJSON;
        let scripts = {}; // Default to empty scripts

        // Determine file format
        if (fileContent.scene && fileContent.scripts) {
            console.log("Loading scene format v1.0 with embedded scripts.");
            sceneJSON = fileContent.scene;
            scripts = fileContent.scripts;
        } else if (fileContent.object && fileContent.metadata) {
            console.warn("Loading legacy scene format. Scripts are not included in this file.");
            sceneJSON = fileContent; // It's an old file, the whole content is the scene data
        } else {
            console.error("Unknown scene file format.");
            alert("Error: The scene file format is not recognized.");
            return;
        }

        // --- Load scripts into localStorage ---
        // This overwrites any existing scripts with the same name.
        Object.keys(scripts).forEach(scriptName => {
            const scriptContent = scripts[scriptName];
            localStorage.setItem(`script:${scriptName}`, scriptContent);
        });
        // Clear any script cache to ensure loaded scripts are re-compiled
        ScriptManager.compiledScripts.clear();
        // Refresh the Scripts panel in the UI to show the newly loaded scripts
        this.populateScriptsPanel();


        // --- Load Scene Objects ---
        this.createEmptyScene(); // Start with a clean slate

        const loader = new THREE.ObjectLoader();
        try {
            const loadedScene = await loader.parseAsync(sceneJSON);

            // Transfer children from the loaded scene to our main scene.
            while (loadedScene.children.length > 0) {
                const child = loadedScene.children[0];
                // The ObjectLoader correctly deserializes userData.
                // We just need to convert our 'tags' array back into a Set.
                if (child.userData.tags && Array.isArray(child.userData.tags)) {
                    child.userData.tags = new Set(child.userData.tags);
                }
                this.scene.add(child);
            }
        } catch (e) {
            console.error("Error parsing scene with ObjectLoader:", e);
            alert("Error: The scene file could not be parsed. It might be corrupted.");
            return;
        }

        this.updateHierarchy();
        console.log("Scene loaded successfully.");
    }

    /**
     * Triggers a file download for the serialized scene.
     */
    saveScene() {
        const sceneData = this.serializeScene();
        const jsonString = JSON.stringify(sceneData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.drakiscene';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("Scene saved to scene.drakiscene");
    }

    /**
     * Reads a scene file and deserializes it.
     * @param {File} file - The .drakiscene file to load.
     */
    loadScene(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const sceneData = JSON.parse(event.target.result);
                this.deserializeScene(sceneData);
            } catch (e) {
                console.error("Failed to parse scene file:", e);
                alert("Error: The selected file is not a valid scene file.");
            }
        };
        reader.onerror = () => {
             console.error("Failed to read scene file.");
             alert("Error: Could not read the selected file.");
        };
        reader.readAsText(file);
    }
}

/**
 * @function drak
 * @description Ferramenta de acesso dinâmico a objetos na cena pelo nome.
 * Permite obter, definir propriedades, adicionar scripts e componentes a um objeto.
 * Se chamado sem argumentos, retorna um objeto com um método `byTag` para busca por tags.
 * @param {string|null} objectName - O nome do objeto a ser encontrado na cena, ou `null` para acessar funções globais.
 * @returns {object|null} Um objeto com métodos para manipular o objeto da cena, ou nulo se não for encontrado.
 */
window.drak = function (objectName = null) {
    const core = new ThreeCore();

    // Se não passar nome, retornar objeto com só o método byTag
    if (!objectName) {
        return {
            byTag(tag) {
                const found = [];
                core.scene.traverse(obj => {
                    if (obj.userData.tags?.has(tag)) {
                        found.push(drak(obj.name)); // Retorna wrapper drak
                    }
                });
                return found;
            }
        };
    }

    const target = core.scene.getObjectByName(objectName);
    if (!target) {
        // Instead of returning null, return a "safe" object that doesn't crash on method calls.
        const safeApi = { _warned: false };
        const methods = [
            'set', 'get', 'script', 'component', 'addComponent', 'removeComponent',
            'addTag', 'removeTag', 'hasTag', 'echo', 'eye', 'callTo', 'touch',
            'ref', 'link', 'pointTo', 'hook'
        ];

        methods.forEach(methodName => {
            safeApi[methodName] = (..._args) => {
                if (!safeApi._warned) {
                    console.warn(`[Draki.js] Object "${objectName}" not found. Any attempts to use it will be ignored.`);
                    safeApi._warned = true;
                }
                // Return a sensible default value to prevent further errors on chained calls.
                if (methodName === 'get' || methodName === 'component' || methodName === 'ref') return undefined;
                if (methodName === 'hasTag') return false;
                return safeApi; // Allow chaining for other methods.
            };
        });
        return safeApi;
    }

    return {
        set(path, value) {
            const parts = path.split('.');
            let obj = target;
            while (parts.length > 1) obj = obj[parts.shift()];
            obj[parts[0]] = value;
        },

        get(path) {
            const parts = path.split('.');
            let obj = target;
            for (let part of parts) obj = obj[part];
            return obj;
        },

        script(fn) {
            if (!target.userData.scripts) {
                target.userData.scripts = [];
            }
            const isDuplicate = target.userData.scripts.some(s => typeof s === 'function' && s.toString() === fn.toString());
            if (!isDuplicate) {
                target.userData.scripts.push(fn);
            } else {
                console.warn(`drak.script: An anonymous function identical to one already attached was provided for object "${objectName}".`);
            }
        },

        component(name) {
            return target.userData?.components?.[name] ?? null;
        },

        addComponent(name, instance) {
            if (!target.userData.components) {
                target.userData.components = {};
            }
            target.userData.components[name] = instance;
        },

        removeComponent(name) {
            if (target.userData.components) {
                delete target.userData.components[name];
            }
        },

        addTag(tag) {
            if (!target.userData.tags) target.userData.tags = new Set();
            target.userData.tags.add(tag);
        },

        removeTag(tag) {
            target.userData.tags?.delete(tag);
        },

        hasTag(tag) {
            return target.userData.tags?.has(tag) ?? false;
        },

        echo() {
            console.log(target);
        },

        eye() {
            if (target.material && target.material.color) {
                if (!target.userData.originalColor) {
                    target.userData.originalColor = target.material.color.clone();
                }
                target.material.color.set(0xffff00);
                setTimeout(() => {
                    if (target.material && target.userData.originalColor) {
                        target.material.color.copy(target.userData.originalColor);
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
                obj.userData.scripts.forEach(scriptInfo => {
                    if (typeof scriptInfo === 'object' && scriptInfo.name) {
                        // Execute named scripts using compiled version if available
                        const compiledScript = ScriptManager.getCompiledScript(scriptInfo.name);
                        if (compiledScript) {
                            try {
                                compiledScript.call(obj, window.drak, window.getByTag);
                            } catch (e) {
                                console.error(`Erro ao executar script "${scriptInfo.name}" por 'touch' no objeto "${obj.name}":`, e);
                            }
                        }
                    } else if (typeof scriptInfo === 'function') { // Handle anonymous functions directly
                        try {
                            scriptInfo.call(obj, obj);
                        } catch (e) {
                            console.error(`Erro ao executar ação anônima por 'touch' no objeto "${obj.name}":`, e);
                        }
                    }
                });
            }
        },

        ref(key) {
            return target.userData?.[key] ?? null;
        },

        link(name) {
            const obj = core.scene.getObjectByName(name);
            if (obj) obj.add(target);
        },

        pointTo(name) {
            const obj = core.scene.getObjectByName(name);
            if (obj && typeof target.lookAt === 'function') {
                target.lookAt(obj.position);
            }
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
        }
    };
};

/**
 * @function getByTag
 * @description Retorna todos os objetos na cena que possuem uma tag específica.
 * @param {string} tag - A tag a ser procurada.
 * @returns {THREE.Object3D[]} Um array com os objetos encontrados.
 */
window.getByTag = function (tag) {
    return TagSystem.getAll(tag);
};

/**
 * @namespace ScriptManager
 * @description Gerencia a criação, anexo e execução de scripts de usuário.
 *              Implementa duas estratégias de carregamento:
 *              - Preload: Compila todos os scripts no início do modo de jogo.
 *              - Fixload (Lazy Load): Compila um script sob demanda na primeira vez que é executado e o armazena em cache.
 */
const ScriptManager = {
    compiledScripts: new Map(),

    /**
     * Retorna um mapa de todos os scripts compilados.
     * @returns {Map<string, Function>}
     */
    getCompiledScripts() {
        return this.compiledScripts;
    },

    /**
     * Invalida o cache de um script compilado, forçando a recompilação na próxima execução.
     * @param {string} scriptName - O nome do script a ser invalidado.
     */
    invalidateCache(scriptName) {
        this.compiledScripts.delete(scriptName);
    },

    /**
     * Força a compilação e o cache de todos os scripts disponíveis no localStorage.
     * Isso é chamado no início do modo de jogo para evitar atrasos de compilação durante a execução.
     */
    preloadAllScripts() {
        console.log('Preloading all available scripts...');
        let preloadedCount = 0;
        const scriptKeys = Object.keys(localStorage).filter(key => key.startsWith('script:') || key === 'script:global-preload');

        for (const key of scriptKeys) {
            const scriptName = key.replace('script:', '');
            // A chamada a getCompiledScript irá compilar e armazenar em cache se ainda não estiver lá.
            if (this.getCompiledScript(scriptName)) {
                preloadedCount++;
            }
        }
        console.log(`${preloadedCount} of ${scriptKeys.length} scripts are ready.`);
    },

    /**
     * Obtém uma função compilada para um script. Usa o cache se disponível, senão compila e armazena.
     * Este é o mecanismo "Fixload" (Lazy Load).
     * @param {string} scriptName - O nome do script.
     * @returns {Function|null} A função compilada ou nulo se não for encontrado ou houver erro.
     */
    getCompiledScript(scriptName) {
        if (this.compiledScripts.has(scriptName)) {
            return this.compiledScripts.get(scriptName);
        }

        const scriptContent = localStorage.getItem(`script:${scriptName}`);
        if (!scriptContent) {
            console.warn(`Script "${scriptName}" not found in localStorage.`);
            return null;
        }

        try {
            // Log a compilação para o modo Fixload
            const loadingStrategy = document.getElementById('script-loading-strategy')?.value || 'preload';
            if (loadingStrategy === 'fixload') {
                console.log(`Fixload: Compiling script "${scriptName}" on demand.`);
            }
            const scriptFunction = new Function('drak', 'getByTag', scriptContent);
            this.compiledScripts.set(scriptName, scriptFunction);
            return scriptFunction;
        } catch (e) {
            console.error(`Error compiling script "${scriptName}":`, e);
            // Cache uma função vazia para evitar recompilar um script com erro a cada frame.
            this.compiledScripts.set(scriptName, () => { });
            return null;
        }
    },

    /**
     * Cria um novo script no localStorage com um conteúdo padrão.
     * @param {string} name - O nome do script.
     * @param {string} [content] - O conteúdo inicial do script.
     */
    createScript(name, content = `// Script for ${name}\n// 'this' refers to the game object.\n// The function also receives the object as the first argument: (obj) => { ... }\n// Example: this.rotation.y += 0.01;`) {
        if (!localStorage.getItem(`script:${name}`)) {
            localStorage.setItem(`script:${name}`, content);
        }
        // Garante que qualquer cache antigo (possivelmente de um script com erro) seja trocado.
        this.invalidateCache(name);
    },

    /**
     * Associa um script nomeado a um objeto.
     * @param {THREE.Object3D} object - O objeto ao qual o script será anexado.
     * @param {string} scriptName - O nome do script a ser anexado.
     */
    attachScriptToObject(object, scriptName) {
        if (!object.userData.scripts) {
            object.userData.scripts = [];
        }
        // Check if the script (by name) is already attached to avoid duplicates
        if (!object.userData.scripts.some(s => typeof s === 'object' && s.name === scriptName)) {
            object.userData.scripts.push({ name: scriptName });
        } else {
            console.warn(`Script "${scriptName}" is already attached to object "${object.name}".`);
        }
    },

    /**
     * Desassocia um script de um objeto.
     * @param {THREE.Object3D} object - O objeto alvo.
     * @param {string} scriptName - O nome do script a ser removido.
     */
    detachScriptFromObject(object, scriptName) {
        if (object.userData.scripts) {
            object.userData.scripts = object.userData.scripts.filter(s => s.name !== scriptName);
        }
    },

    /**
     * Executa uma ação diretamente (usada para ações anônimas).
     * @param {Function} scriptFunction - A ação.
     * @param {THREE.Object3D} object - O objeto ao qual a ação pertence.
     */
    executeScript(scriptFunction, object) {
        try {
            // Chama a ação com 'this' sendo o objeto e também passa o objeto como primeiro argumento.
            // Isso suporta ambos os tipos: function() { this.rotation... } e (obj) => { obj.rotation... }
            scriptFunction.call(object, object);
        } catch (e) {
            console.error(`Erro ao executar ação anônima no objeto "${object.name}":`, e);
        }
    },

    /**
     * Executa todos os scripts (nomeados e anônimos) associados a um objeto.
     * Para scripts anônimos, a ação é chamada com `this` vinculado ao objeto, e o objeto também é passado como o primeiro argumento.
     * Para scripts nomeados, o código é executado com `this` vinculado ao objeto, e as funções `drak` e `getByTag` estão disponíveis.
     * @param {THREE.Object3D} object - O objeto cujos scripts serão executados.
     */
    executeObjectScripts(object) {
        if (!object.userData.scripts || !object.userData.scripts.length) return;

        object.userData.scripts.forEach(scriptInfo => {
            // Lida com scripts anônimos (funções diretas)
            if (typeof scriptInfo === 'function') {
                try {
                    // Chama a ação com 'this' sendo o objeto e também passa o objeto como primeiro argumento.
                    // Isso suporta ambos os tipos: function() { this.rotation... } e (obj) => { obj.rotation... }
                    scriptInfo.call(object, object);
                } catch (e) {
                    console.error(`Erro ao executar ação anônima no objeto "${object.name}":`, e);
                }
            }
            // Lida com scripts nomeados (objetos com uma propriedade 'name')
            else if (scriptInfo && typeof scriptInfo.name === 'string') {
                const compiledScript = this.getCompiledScript(scriptInfo.name);
                if (compiledScript) {
                    try {
                        // Executa a ação do script previamente compilada e cacheada
                        compiledScript.call(object, window.drak, window.getByTag);
                    } catch (e) {
                        console.error(`Erro ao executar script "${scriptInfo.name}" no objeto "${object.name}":`, e);
                    }
                }
            }
        });
    },

    /**
     * Limpa todos os scripts salvos no cache do localStorage.
     */
    removeScriptFromCache(scriptName) {
        localStorage.removeItem(`script:${scriptName}`);
    },
    clearScriptCache() {
        let clearedCount = 0;
        Object.keys(localStorage)
            .filter(key => key.startsWith('script:'))
            .forEach(key => {
                localStorage.removeItem(key);
                clearedCount++;
            });
        this.compiledScripts.clear(); // Limpa todo o cache de funções compiladas
        console.log(`${clearedCount} script(s) cleared from cache.`);
    }
};

/**
 * @class I18nManager
 * @description Manages internationalization, loading translations, and updating the UI.
 */
class I18nManager {
    constructor(translations) {
        this.translations = translations;
        this.currentLanguage = localStorage.getItem('draki_lang') || 'en'; // Defaults to English if no language is saved
        this.updateDocumentLanguage();
    }

    /**
     * Sets the application language and triggers a UI update.
     * @param {string} lang - The language code (e.g., 'en', 'pt').
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem(`draki_lang`, lang);
            this.updateDocumentLanguage();
            this.translateUI();
        } else {
            console.warn(`Language "${lang}" not found.`);
        }
    }

    /**
     * Updates the lang attribute of the html element.
     */
    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
    }

    /**
     * Gets a translation for a specific key in the current language.
     * @param {string} key - The translation key.
     * @returns {string} The translated string or the key itself if not found.
     */
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    /**
     * Traverses the DOM and updates all elements with `data-lang` attributes.
     */
    translateUI() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.dataset.lang;
            element.textContent = this.t(key);
        });

        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.dataset.langPlaceholder;
            element.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-lang-title]').forEach(element => {
            const key = element.dataset.langTitle;
            element.title = this.t(key);
        });
    }
}

/**
 * Translation strings for the application.
 */
const translations = {
    en: {
        'menu.settings': 'Settings',
        'settings.language': 'Language:',
        'settings.language_description': 'Choose the interface language.',
        'settings.script_loading': 'Script Loading:',
        'settings.script_loading.preload': 'Preload on Play',
        'settings.script_loading.fixload': 'On Demand (Fixload)',
        'settings.script_loading_description': 'Determines how object scripts are loaded during play mode. Preload loads all at once, Fixload loads on demand when needed.',
        'settings.edit_global_script': 'Edit Global Script',
        'menu.help': 'Help',
        'menu.help.about': 'About Draki.js',
        'menu.help.scripting_api': 'API de Scripting',
        'viewer.title': 'Visualizador',
        'layout.default': 'Layout Padrão',
        'layout.wide': 'Wide Layout',
        'layout.tall': 'Tall Layout',
        'layout.focus': 'Focus Mode',
        'panel.hierarchy': 'Hierarchy',
        'panel.inspector': 'Inspector',
        'panel.project': 'Project',
        'project.new_folder': 'New Folder',
        'project.import_file': 'Import File',
        'panel.scripts': 'Scripts',
        'scripts.new_script': 'New Script',
        'scripts.clear_cache': 'Clear Script Cache',
        'viewer.tabs.scene_scripts': 'Scene Scripts',
        'viewer.tabs.global_script': 'Global Script (Preload)',
        'viewer.tabs.fixload_cache': 'Cache (Fixload)',
        'viewer.filter_placeholder': '🔍 Filter by name, object, or content...',
        'viewer.global_script.description': 'This script runs once when you press Play (before any object script). You can use `drak` and `getByTag`.',
        'viewer.global_script.save': 'Save Global Script',
        'inspector.position': 'Position',
        'inspector.rotation': 'Rotation',
        'inspector.scale': 'Scale',
        'inspector.light_properties': 'Light Properties',
        'inspector.light.color': 'Color',
        'inspector.light.intensity': 'Intensity',
        'inspector.camera_properties': 'Camera Properties',
        'inspector.camera.fov': 'FOV',
        'inspector.camera.near': 'Near',
        'inspector.camera.far': 'Far',
        'inspector.scripts.title': 'Object Scripts',
        'inspector.scripts.create_new': 'Create New Script',
        'inspector.scripts.attach_existing': 'Attach Existing Script',
        'inspector.scripts.attached_scripts': 'Attached Scripts',
        'inspector.scripts.none_attached': 'No scripts attached',
        'inspector.scripts.select_to_attach': 'Select Script to Attach',
        'transform.move': 'Move',
        'transform.rotate': 'Rotate',
        'transform.scale': 'Scale',
        'transform.reset': 'Reset',
        'prompt.folder_name': 'Enter folder name:',
        'prompt.script_name': 'Enter script name:',
        'prompt.script_name_for_object': 'Enter the script name for the object:',
        'confirm.new_scene': 'Are you sure you want to create a new scene? All unsaved data will be lost.',
        'confirm.script_exists': 'The script "{scriptName}" already exists. Do you want to attach it to this object?',
        'confirm.delete_script': 'Remove script "{scriptName}"?',
        'confirm.delete_object': 'Remove object "{objectName}"?',
        'confirm.delete_folder': 'Remove folder "{folderName}"?',
        'confirm.delete_file': 'Remove file "{fileName}"?',
        'confirm.clear_script_cache': 'Are you sure you want to clear the entire script cache? This cannot be undone.',
        'viewer.no_scripts_in_scene': 'No scripts found in the scene.',
        'viewer.cached_scripts_title': 'Compiled Scripts in Cache (Fixload)',
        'viewer.no_cached_scripts': 'No cached scripts. Scripts are added here when run for the first time in Fixload mode.',
        'api_docs.intro': 'Here\'s an overview of the scripting API available in Draki.js:',
        'api_docs.drak.description': 'Accesses an object in the scene by its name. Returns an object with methods to manipulate the target object. If the object is not found, `null` is returned.',
        'api_docs.drak.set': 'Sets a property value via a dot-separated path (e.g., \'position.x\', \'material.color.r\').',
        'api_docs.drak.get': 'Retrieves a property value via a dot-separated path.',
        'api_docs.drak.script': 'Adds an anonymous function to the object\'s update loop. This function runs every frame during play mode. It receives the game object as its first argument (<code>obj => { /* ... */ }</code>) and also has <code>this</code> bound to the object.',
        'api_docs.drak.component': 'Accesses an existing component instance attached to the object by its name.',
        'api_docs.drak.add_component': 'Adds a new component instance to the object under the given name.',
        'api_docs.drak.remove_component': 'Removes a component from the object by its name.',
        'api_docs.drak.add_tag': 'Adds a tag to the object.',
        'api_docs.drak.remove_tag': 'Removes a tag from the object.',
        'api_docs.drak.has_tag': 'Checks if the object has a specific tag.',
        'api_docs.drak.echo': 'Logs the underlying Three.js object to the console.',
        'api_docs.drak.eye': 'Temporarily highlights the object in yellow for 1 second. Useful for debugging visibility.',
        'api_docs.drak.call_to': 'Logs a reference to another object by its name to the console.',
        'api_docs.drak.touch': 'Executes all scripts attached to another object by its name.',
        'api_docs.drak.ref': 'Retrieves a value from the object\'s <code>userData</code> by a specified key. This is useful for storing custom data directly on the object.',
        'api_docs.drak.link': 'Makes this object a child of another object specified by name. This object\'s position, rotation, and scale will become relative to its new parent.',
        'api_docs.drak.point_to': 'Orients this object to look at the position of another object specified by name.',
        'api_docs.drak.hook': 'Executes a provided function, passing the underlying Three.js object as an argument. Allows direct manipulation of the object using Three.js APIs.',
        'api_docs.drak_no_args.description': 'When called without arguments, <code>drak()</code> returns an object focused on global scene queries:',
        'api_docs.drak_no_args.by_tag': 'Returns an array of <code>drak</code> wrappers for all objects in the scene that have the specified tag.',
        'api_docs.global_tags.title': 'Global Tag Functions',
        'api_docs.global_tags.description': 'These functions operate on any <code>THREE.Object3D</code> instance directly, typically used within the global scripting scope (outside any object script).',
        'api_docs.global_tags.get_by_tag': 'Returns an array of all objects in the scene that have the specified tag.',
        'api_docs.global_tags.set_tag': 'Adds a tag to the given <code>THREE.Object3D</code>.',
        'api_docs.global_tags.remove_tag': 'Removes a tag from the given <code>THREE.Object3D</code>.',
        'api_docs.global_tags.has_tag': 'Checks if the given <code>THREE.Object3D</code> has a specific tag.',
        'menu.terminal': 'Terminal',
    },
    pt: {
        'menu.settings': 'Configurações',
        'settings.language': 'Idioma:',
        'settings.language_description': 'Escolha o idioma da interface.',
        'settings.script_loading': 'Carregamento de Script:',
        'settings.script_loading.preload': 'Pré-carregar ao Iniciar',
        'settings.script_loading.fixload': 'Sob Demanda (Fixload)',
        'settings.script_loading_description': 'Determina como os scripts dos objetos são carregados durante o modo de jogo. Pré-carregar carrega todos de uma vez, Sob Demanda carrega quando necessário.',
        'settings.edit_global_script': 'Editar Script Global',
        'menu.help': 'Ajuda',
        'menu.help.about': 'Sobre o Draki.js',
        'menu.help.scripting_api': 'API de Scripting',
        'viewer.title': 'Visualizador',
        'layout.default': 'Layout Padrão',
        'layout.wide': 'Layout Largo',
        'layout.tall': 'Layout Alto',
        'layout.focus': 'Modo Foco',
        'panel.hierarchy': 'Hierarquia',
        'panel.inspector': 'Inspetor',
        'panel.project': 'Projeto',
        'project.new_folder': 'Nova Pasta',
        'project.import_file': 'Importar Arquivo',
        'panel.scripts': 'Scripts',
        'scripts.new_script': 'Novo Script',
        'scripts.clear_cache': 'Limpar Cache de Scripts',
        'viewer.tabs.scene_scripts': 'Scripts da Cena',
        'viewer.tabs.global_script': 'Script Global (Preload)',
        'viewer.tabs.fixload_cache': 'Cache (Fixload)',
        'viewer.filter_placeholder': '🔍 Filtrar por nome, objeto ou conteúdo...',
        'viewer.global_script.description': 'Este script é executado uma vez quando você pressiona Play (antes de qualquer script de objeto). Você pode usar `drak` e `getByTag`.',
        'viewer.global_script.save': 'Salvar Script Global',
        'viewer.save_apply': 'Salvar & Aplicar',
        'inspector.position': 'Posição',
        'inspector.rotation': 'Rotação',
        'inspector.scale': 'Escala',
        'inspector.light_properties': 'Propriedades da Luz',
        'inspector.light.color': 'Cor',
        'inspector.light.intensity': 'Intensidade',
        'inspector.camera_properties': 'Propriedades da Câmera',
        'inspector.camera.fov': 'FOV',
        'inspector.camera.near': 'Perto',
        'inspector.camera.far': 'Longe',
        'inspector.scripts.title': 'Scripts do Objeto',
        'inspector.scripts.create_new': 'Criar Novo Script',
        'inspector.scripts.attach_existing': 'Anexar Script Existente',
        'inspector.scripts.attached_scripts': 'Scripts Anexados',
        'inspector.scripts.none_attached': 'Nenhum script anexado',
        'inspector.scripts.select_to_attach': 'Selecione o Script para Anexar',
        'transform.move': 'Mover',
        'transform.rotate': 'Rotacionar',
        'transform.scale': 'Escalar',
        'transform.reset': 'Redefinir',
        'prompt.folder_name': 'Digite o nome da pasta:',
        'prompt.script_name': 'Digite o nome do script:',
        'prompt.script_name_for_object': 'Digite o nome do script para o objeto:',
        'confirm.new_scene': 'Tem certeza que deseja criar uma nova cena? Todos os dados não salvos serão perdidos.',
        'confirm.script_exists': 'O script "{scriptName}" já existe. Deseja anexá-lo a este objeto?',
        'confirm.delete_script': 'Remover o script "{scriptName}"?',
        'confirm.delete_object': 'Remover o objeto "{objectName}"?',
        'confirm.delete_folder': 'Remover a pasta "{folderName}"?',
        'confirm.delete_file': 'Remover o arquivo "{fileName}"?',
        'confirm.clear_script_cache': 'Tem certeza que deseja limpar todo o cache de scripts? Isso não pode ser desfeito.',
        'viewer.no_scripts_in_scene': 'Nenhum script encontrado na cena.',
        'viewer.cached_scripts_title': 'Scripts Compilados em Cache (Fixload)',
        'viewer.no_cached_scripts': 'Nenhum script em cache. Os scripts são adicionados aqui quando executados pela primeira vez no modo Fixload.',
        'api_docs.intro': 'Aqui está uma visão geral da função de script disponível no Draki.js:',
        'api_docs.drak.description': 'Acessa um objeto na cena pelo seu nome. Retorna um objeto com métodos para manipular o objeto alvo. Se o objeto não for encontrado, `null` é retornado.',
        'api_docs.drak.set': 'Define um valor de propriedade via um caminho separado por pontos (ex: \'position.x\', \'material.color.r\').',
        'api_docs.drak.get': 'Recupera um valor de propriedade via um caminho separado por pontos.',
        'api_docs.drak.script': 'Adiciona uma função anônima ao loop de atualização do objeto. Esta função é executada a cada frame durante o modo de jogo. Ela recebe o objeto do jogo como primeiro argumento (<code>obj => { /* ... */ }</code>) e também tem <code>this</code> ligado ao objeto.',
        'api_docs.drak.component': 'Acessa um componente existente anexado ao objeto pelo seu nome.',
        'api_docs.drak.add_component': 'Adiciona uma nova instância de componente ao objeto sob o nome fornecido.',
        'api_docs.drak.remove_component': 'Remove um componente do objeto pelo seu nome.',
        'api_docs.drak.add_tag': 'Adiciona uma tag ao objeto.',
        'api_docs.drak.remove_tag': 'Remove uma tag do objeto.',
        'api_docs.drak.has_tag': 'Verifica se o objeto possui uma tag específica.',
        'api_docs.drak.echo': 'Registra o objeto Three.js subjacente no console.',
        'api_docs.drak.eye': 'Destaca temporariamente o objeto em amarelo por 1 segundo. Útil para depurar visibilidade.',
        'api_docs.drak.call_to': 'Registra uma referência a outro objeto pelo seu nome no console.',
        'api_docs.drak.touch': 'Executa todos os scripts anexados a outro objeto pelo seu nome.',
        'api_docs.drak.ref': 'Recupera um valor da <code>userData</code> do objeto por uma chave especificada. Isso é útil para armazenar dados personalizados diretamente no objeto.',
        'api_docs.drak.link': 'Torna este objeto um filho de outro objeto especificado pelo nome. A posição, rotação e escala deste objeto se tornarão relativas ao seu novo pai.',
        'api_docs.drak.point_to': 'Orienta este objeto para olhar para a posição de outro objeto especificado pelo nome.',
        'api_docs.drak.hook': 'Executa uma função fornecida, para manipular o objeto Three.js subjacente. Permite a manipulação direta do objeto usando as APIs do Three.js.',
        'api_docs.drak_no_args.description': 'Quando chamado sem argumentos, <code>drak()</code> retorna um objeto focado em consultas globais da cena:',
        'api_docs.drak_no_args.by_tag': 'Retorna um array de wrappers <code>drak</code> para todos os objetos na cena que possuem a tag especificada.',
        'api_docs.global_tags.title': 'Funções Globais de Tag',
        'api_docs.global_tags.description': 'Estas funções operam diretamente em qualquer instância de <code>THREE.Object3D</code>, tipicamente usadas em scripts onde você tem uma referência ao objeto (ex: <code>obj</code> no script de um objeto ou de <code>getByTag</code>).',
        'api_docs.global_tags.get_by_tag': 'Retorna um array de todos os objetos na cena que possuem a tag especificada.',
        'api_docs.global_tags.set_tag': 'Adiciona uma tag ao <code>THREE.Object3D</code> dado.',
        'api_docs.global_tags.remove_tag': 'Remove uma tag do <code>THREE.Object3D</code> dado.',
        'api_docs.global_tags.has_tag': 'Verifica se o <code>THREE.Object3D</code> dado possui uma tag específica.',
        'menu.terminal': 'Terminal',
    }
};

const i18n = new I18nManager(translations);

/**
 * Main entry point. Executed when the DOM is fully loaded.
 * Initializes the ThreeCore engine and attaches it to the viewport.
 */
document.addEventListener('DOMContentLoaded', () => {
    const core = new ThreeCore();
    const viewport = document.getElementById('viewport');

    if (viewport) {
        core.init(viewport);
        core.setupEventListeners();
        core.setupLayoutSwitcher();

        // Initial button states
        core.updatePlayPauseStopButtons('stop'); // Ensure buttons reflect stopped state

        // Add window resize listener
        window.addEventListener('resize', () => core.onWindowResize());
        // Call it once immediately to set the initial size correctly
        core.onWindowResize();

        // Apply initial language and set the active class on the correct button
        core.i18n.translateUI();
        const languageOptionsContainer = document.getElementById('language-options');
        if (languageOptionsContainer) {
            const currentLangBtn = languageOptionsContainer.querySelector(`.lang-option[data-lang-code="${core.i18n.currentLanguage}"]`);
            if (currentLangBtn) {
                currentLangBtn.classList.add('active');
            }
        }

        // Load existing scripts into the UI panel
        core.populateScriptsPanel();

        // Create a default scene
        core.createObject('platform');
        core.createObject('cube');
    } else {
        console.error('Viewport element not found. Engine cannot be initialized.');
    }
});