// Singleton responsável por configurar e manter a cena 3D principal com Three.js
class ThreeCore {
  constructor() {
    // Garante que apenas uma instância de ThreeCore exista (Singleton)
    if (ThreeCore.instance) return ThreeCore.instance;

    // Cria uma nova cena 3D
    this.scene = new THREE.Scene();

    // Câmera com perspectiva. Defina os parâmetros reais onde estão os "..."
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    // Renderizador com fundo transparente (ideal para sobrepor ao DOM 2D da Nandraki.js)
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Armazena a instância como Singleton
    ThreeCore.instance = this;
  }

  // Inicializa a cena dentro de um container HTML e começa o loop de renderização
  init(container) {
    container.appendChild(this.renderer.domElement);
    this.animate();
  }

  // Loop de animação que mantém a renderização ativa
  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}

// Abstract Factory para criar componentes básicos do Three.js
class ThreeFactory {
  // Cria uma luz pontual branca
  createLight() {
    return new THREE.PointLight(0xffffff, 1);
  }

  // Cria um cubo verde com material padrão
  createCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(geometry, material);
  }

  // Cria uma câmera com perspectiva. Defina os parâmetros reais onde estão os "..."
  createCamera() {
    return new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
  }
}

// Builder Pattern para construir entidades compostas (agrupamento de objetos)
class EntityBuilder {
  constructor() {
    this.entity = new THREE.Object3D(); // Entidade base que pode conter vários elementos
  }

  // Adiciona uma malha (mesh) à entidade
  addMesh(mesh) {
    this.entity.add(mesh);
    return this; // Permite encadeamento de chamadas
  }

  // Define a posição da entidade no espaço 3D
  setPosition(x, y, z) {
    this.entity.position.set(x, y, z);
    return this;
  }

  // Finaliza a construção e retorna a entidade
  build() {
    return this.entity;
  }
}

// Fábrica de Protótipos: permite registrar e clonar objetos facilmente
class PrototypeFactory {
  constructor() {
    this.prototypes = {}; // Dicionário de objetos registrados por nome
  }

  // Registra um objeto 3D com um nome específico
  register(name, object3D) {
    this.prototypes[name] = object3D;
  }

  // Retorna uma cópia/clonagem do objeto registrado
  clone(name) {
    return this.prototypes[name]?.clone() ?? null;
  }
}
