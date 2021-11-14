<h1 align="center"> <img src="https://i.ibb.co/n3BMNKM/logo.png" alt="mascote"  border="0"></h1>
<h1 align="center"><img src="https://img.shields.io/badge/Lincense-MIT-green" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Version-1.4.0 [05/12]-blue" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Projeto-Ativo-success" alt="index-html" border="0"><img src="https://img.shields.io/badge/Ultima%20Att-14/11/2021-green" alt="index-html" >     
<br>
<h6 align="center"><img src="https://i.ibb.co/3hqPt3N/index-html.png" alt="index-html" border="0"><p>index.html</h6>

</br>
<h3>Sobre o projeto / 
About the project</h3>
<p>
<h4></h4>A engine game nandraki esta sendo criada com base webgl,html,js e css com proposta de criar jogo de maneira fácil pelo celular e computador, com objetivo de favorecer computares antigo e com baixo consumo de ram e placa de vídeo, com suporte para interagir lib de game existente que usa tecnologia Webgl canvas.Projeto esta sendo feito em class principal e blocos de função js.Podendo ate possível ser usada para pessoas que não usa maquina robusta e que não tem suporte webgl no navegador, assim nasceu a ideia do DDP (dinâmica Dom programar)que uso js,html e css sem canvas para criar jogos.
Em processo alfa aqui em baixo tem links de exemplos de projetos feitos na engine
<br>
<h4></h4>The nandraki game engine is being created based on webgl, html, js and css with the purpose of creating games easily on cell phones and computers, with the objective of favoring old computers with low consumption of ram and video card, with support for interacting Existing game lib that uses Webgl technology canvas.Project is being done in main class and js function blocks.It can even be used for people who don't use robust machines and don't have webgl support in their browser, so the idea of ​​DDP was born (Dynamic Dom program) I use js, html and css without canvas to create games.
In alpha process below, there are links to examples of projects made in the engine

<br>
 [Demostração test e test2]
<br> 
Nota:[Na pasta da engine contém arquivo test de demostração/
In the engine folder contains demo test file]


  Test 1 html: https://github.com/ronanbastos/Nandraki.js/blob/main/test.html
<p>
  Test 2 html: https://github.com/ronanbastos/Nandraki.js/blob/main/test2.html
<p>
	
*Download engine: https://github.com/ronanbastos/Nandraki.js/archive/refs/heads/main.zip
<p>
	
# Playground
<p>
  Playground Dom : https://tironan.000webhostapp.com/test2.html
<p>
  Playground canvas 2D: https://tironan.000webhostapp.com/test.html
<p>
  Playground canvas 3D: 🚧  Em construção...  🚧	

<p>
  Playground Site : https://tironan.000webhostapp.com/nandraki.html	
	
# CDN 

***<script src= "https://tironan.000webhostapp.com/nandraki.js" ></script>***
version{	
***<script src="https://unpkg.com/nandraki@1.3.8/nandraki.js" ></script>***
}
<p>

# Testar o script 
[Testar sem inteface da engine... Crie um arquivo chamado index.html e cole o seguinte código nele]



	<!DOCTYPE html>
	<html>
	<head>

	 <script src="https://tironan.000webhostapp.com/nandraki.js"></script>
         <script src="https://unpkg.com/nandraki@1.3.8/nandraki.js"></script>			
		
	</head>
	<body>
	<script>
	      myjogo = {
		 start : function(){

		   const txt = new Nandraki("h1","text","Ola mundo!",0,0,0);
		   Nandraki.create_ui(txt.obj,txt.id,"0px","100px","50px","50px");

		   const txt2 = new Nandraki("h1","text",1+1,0,0,0);
		   Nandraki.create_ui(txt2.obj,txt2.id,"0px","100px","50px","100px");

		 },	
	       }

	     fps=60;	
	     game.update(myjogo.start,fps);  

	</script>
	</body>
	</html>

<h2>Funcionalidades e Metas</h2>

- [x] Criar interface da engine html
- [x] Export html
- [x] Manipulação de elemento Dom
- [x] Key event down e up
- [x] Event touch,click,move
- [x] Manipulação de css e js
- [x] Criar event Gamepad touch
- [x] Manipulação de animação			
- [ ] Manipulação de canvas 
- [ ] Criar event Gamepad
- [ ] Verficador de estados animação
- [ ] Import Apps Android
	
	
# projeto Electron
  Aqui: https://github.com/ronanbastos/Nandraki.js/tree/Nandraki-Electron
	
# Documentação

Aqui: https://ronanbastos.github.io/Nandraki.js/

# Autor 

Projeto esta sendo feito por mim @RonanBasto,caso queria ajudar pode entra conta comigo.<p>
Email:ronanbatos@hotmail.com	
<h4> Doar:<a href="https://www.paypal.com/donate?business=4KJAVYQLQDMHA&no_recurring=0&item_name=Ajudar+a+engine&currency_code=BRL">Aqui!</a></h4>



