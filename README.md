<h1 align="center"> <img src="https://i.ibb.co/n3BMNKM/logo.png" alt="mascote"  border="0"></h1>

<br>
<h1 align="center"><img src="https://img.shields.io/badge/Lincense-MIT-green" alt="index-html" border="0"> 
<img src="https://img.shields.io/badge/2.6.1-blue" alt="index-html" >     
 <img src="https://img.shields.io/badge/Projeto-Ativo-success" alt="index-html" border="0"><img src="https://img.shields.io/badge/Ultima%20Att-04/05/2025-green" alt="index-html" >     

<br>
<h3>Sobre o projeto / 
About the project</h3>
<p>
<h4></h4>A engine game nandraki esta sendo criada com base webgl,html,js e css com proposta de criar jogo de maneira fácil pelo celular e computador, com objetivo de favorecer computares antigo e com baixo consumo de ram e placa de vídeo, com suporte para interagir lib de game existente que usa tecnologia Webgl canvas.Projeto esta sendo feito em class principal e blocos de função js.Podendo ate possível ser usada para pessoas que não usa maquina robusta e que não tem suporte webgl no navegador, assim nasceu a ideia do DDP (dinâmica Dom programar)que uso js,html e css sem canvas para criar jogos.
Em processo alfa aqui em baixo tem links de exemplos de projetos feitos na engine
<br>
<h4></h4>The nandraki game engine is being created based on webgl, html, js and css with the purpose of creating games easily on cell phones and computers, with the objective of favoring old computers with low consumption of ram and video card, with support for interacting Existing game lib that uses Webgl technology canvas.Project is being done in main class and js function blocks.It can even be used for people who don't use robust machines and don't have webgl support in their browser, so the idea of ​​DDP was born (Dynamic Dom program) I use js, html and css without canvas to create games.
In alpha process below, there are links to examples of projects made in the engine

<br>
<br>	
 [Demostração test ,test1 e test2]
<br> 
Nota:[Na pasta da engine contém arquivo test de demostração/
In the engine folder contains demo test file]


  Test  html: https://github.com/ronanbastos/Nandraki.js/blob/main/test.html
<p>
  Test 1 html: https://github.com/ronanbastos/Nandraki.js/blob/main/test1.html
<p>
  Test 2 html: https://github.com/ronanbastos/Nandraki.js/blob/main/test2.html
<p>	
*Download engine: https://github.com/ronanbastos/Nandraki.js/archive/refs/heads/main.zip
<p>
	
# Playground

<p>
  Playground 3D Draki.js : https://drakijs--ronan1995.on.websim.ai/?v=98
<p>
  Playground Dom : https://ronanbastos.github.io/Nandraki.js/   //Use o console para pegar variaves da Nandraki e game
	<p>
  Js Inteface :  https://ronanbastos.github.io/Nandraki-Inteface/ 
<p>
  Playground CodePen: https://codepen.io/ronan-varella/pen/xxPeeEM
<br>
#	
	
# CDN 

	<script src="https://unpkg.com/nandraki@2.5.8/nandraki.js" ></script>
<p>

# Help channel 

1 => @RonanTI:      https://www.youtube.com/channel/UCmffxA2ppF1zL9SEU22_7AA  <p>
2 => @BrazilianDev: https://www.youtube.com/watch?v=zQ6_a0LRHsU&list=PL-R1FQNkywO7cyBnd-vmF1ufCoaMcAa9k&ab_channel=BrazilianDev
<p>
3 =>
<p>
4 =>
<p>	
5 =>
<p>
# Testar o script 
[Testar sem inteface da engine... Crie um arquivo chamado index.html e cole o seguinte código nele]

	<html>
	<head>
		
		<script src="https://unpkg.com/nandraki@2.5.8/nandraki.js" ></script>
	</head>
	<body>

		<script>
		       Nandraki.create_ui("text_id","[hello world]")
		       myjogo = {


			 start : function(){


			  // Nandraki.create_ui("text_id","hello world")	


			 },	
		       }

		       fps=60;	
		       game.update(myjogo.start,fps);  

	</script>
	</body>
	</html>

	[draki 3d]
 
 	<html>
	<head>
		
		<script src="draki3d.js"></script>
	</head>
	<body>
 	 
	    <script>
	
	// Exemplo de como o usuário pode interagir diretamente
	const draki = new ThreeCore();
	draki.init(document.body);
	
	// Criação dos objetos diretamente
	let cubo = Game.create('cube');
	cubo.position.set(5,0, 0);
	
	
	let camera = Game.create('camera');
	camera.position.set(5,0,5);
	
	
	let luz = Game.create('light');
	luz.position.set(0,5,10);
	
	
	// Animando o cubo
	draki.animate = function () {
	  cubo.rotation.y += 0.05;
	  cubo.rotation.x += 0.01;
	  draki.renderer.render(draki.scene, camera);
	  requestAnimationFrame(draki.animate);
	};
	
	draki.scene.add(camera);
	draki.scene.add(cubo);
	draki.scene.add(luz);
	
	    </script>
	</body>
	</html>

<h2>Funcionalidades e Metas  [Features] </h2>

- [x] Criar interface completa<br>
- [x] Export html<br>	
- [x] Criar interface da engine html<br>
- [x] Manipulação de elemento Dom<br>
- [x] Key event down e up<br>
- [x] Event touch,click,move<br>
- [x] Manipulação de css e js<br>
- [x] Criar event Gamepad touch<br>
- [x] Criar event Gamepad joystick<br>	
- [x] Manipulação de animação<br>		
- [x] Manipulação de canvas<br>
- [x] Verficador de estados animação<br>	
- [x] Criador de mapas canvas e sprite png<br>
- [x] Interface da engine android,web e desktop<br>
- [x] Implementar sistema Singleton da cena principal
- [x] Adicionar suporte a câmera, malhas e luzes via Abstract Factory
- [x] Criar sistema EntityBuilder para compor objetos
- [x] Adicionar suporte a clonagem via protótipos (PrototypeFactory)
- [x] Suporte a Game.create('tipo') para construção simplificada
- [x] Sistema de nomeação e busca de objetos na cena (.name)
- [x] Função drak() para acessar e alterar dinamicamente propriedades (set, get)
- [x] Sistema de scripts dentro dos objetos via script(fn)
- [x] ATT camada lib js externa <br>	
- [x] ATT camada 3D game Webgl<br>
- [x] Finalizar sistema de Scene Singleton (ThreeCore)<br>
- [x] Implementar sistema de hierarquia de objetos na cena<br>
- [ ] Adicionar suporte completo a componentes via script (drak().set/get/script)<br>
- [ ] Criar módulo de física básica (colisores, gravidade simples)<br>
- [ ] Desenvolver sistema de câmera com controle de movimento<br>
- [ ] Adicionar suporte a importação de modelos externos (GLTF/OBJ)<br>
- [ ] Implementar sistema de materiais personalizados<br>
- [ ] Criar GUI mínima para visualização e depuração da cena<br>
- [ ] Sistema de exportação da cena como JSON<br>
- [ ] Criar sistema de carregamento de cenas (load/save)<br>
- [ ] Adicionar sistema de input (teclado, mouse, toque)<br>
- [ ] Implementar módulo de áudio 3D<br>
- [ ] Adicionar sistema de animações básicas (keyframes)<br>
- [ ] Criar módulo de iluminação avançada (ambient, direcional, sombras)<br>
- [ ] Integrar com Nandraki.js para sobreposição de UI 2D<br>
- [ ] Sistema de entidades baseadas em componentes (ECS simplificado)<br>
- [ ] Modo de build/exportação para Web (embed fácil)<br>
- [ ] Criar documentação básica da engine<br>
- [ ] Subir repositório com exemplo de jogo funcional<br>
- [ ] Criar sistema de plugin para usuários extenderem a engine<br>
- [ ] ATT camada Web3<br>
- [ ] Import Apps Android<br>
- [ ] Import Apps Exe<br>
- [ ] Import Apps deb<br>
<br>
# Metas da Engine Draki3D<br>

✅ Fase 1 — Núcleo funcional<br>
🚧 Fase 2 — Scripting e lógica de jogo<br>
🚧 Fase 3 — Estrutura de projeto<br>
🚧 Fase 4 — Assets e importação<br>
🚧 Fase 5 — Exportação e build<br>
🚧 Fase 6 — Suporte a gameplay<br>
🚧 Fase 7 — Ferramentas extras<br>


 Sistema de plugins para extensões da engine<br>
# projeto Electron
  Aqui: 🚧 [OFF] 🚧	
<br>
# Autor 
Projeto esta sendo feito por mim @RonanBasto,caso queria ajudar pode entra conta comigo.<p>
Email:ronanbatos@hotmail.com

<h4>[Paypal] Doar:<a href="https://www.paypal.com/donate?business=4KJAVYQLQDMHA&no_recurring=0&item_name=Ajudar+a+engine&currency_code=BRL">Aqui!</a></h4>
	
# Npmjs	
https://www.npmjs.com/package/nandraki
	
# Documentation.md
 Aqui:https://ronanbastos.github.io/Documentation-Nandraki.js/ 



