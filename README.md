<h1 align="center"> <img src="https://i.ibb.co/n3BMNKM/logo.png" alt="mascote"  border="0"></h1>
<h1 align="center"><img src="https://img.shields.io/badge/Lincense-MIT-green" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Version-1.2.0-blue" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Projeto-Ativo-success" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Repo%20size-5%2C0%20MiB-important" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Build-Alfa-red" alt="index-html" border="0">     
</h1>
<br>
<h6 align="center"><img src="https://i.ibb.co/3hqPt3N/index-html.png" alt="index-html" border="0"><p>index.html</h6>

</br>
<h3>Sobre o projeto</h3>
<p>
<h4></h4>A engine game nandraki  esta sendo criada com base webgl,html,js e css com proposta de criar jogo de maneira facil pelo celular e computador,com objetivo de 
favorecer computares antigo e com baixo consumo de ram e placa de video,com suporte para interagir lib de game existente que usa tecnologia Webgl canvas.Projeto esta sendo feito em class principal e blocos de função js.Podendo ate possivel ser usanda para pessoas que não usa maquina robusta e que não tem suporte webgl no navegador,assim nasceu a ideia do DDP (dinâmica Dom programar) que uso js,html e css sem canvas para criar jogos.
	
Em processo alfa aqui em baixo tem links de exemplos de projetos feitos na engine<br>
Demostração test e test2 <br> 
Nota:[Na pasta da engine contém arquivo test de demostração]


  Test 1 html: https://github.com/ronanbastos/Nandraki.js/blob/main/test.html
<p>
  Test 2 html: https://github.com/ronanbastos/Nandraki.js/blob/main/test2.html
<p>
	
*Download engine: https://github.com/ronanbastos/Nandraki.js/archive/refs/heads/main.zip
<p>
	
# Playgrand
<p>
  Playgrand Dom : https://tironan.000webhostapp.com/test2.html
<p>
  Playgrand canvas 2D: https://tironan.000webhostapp.com/test.html
<p>
  Playgrand canvas 3D: 🚧  Em construção...  🚧	

<p>
  Playgrand Site : 🚧  Em construção...  🚧	
	
# CDN 

***<script src= "https://tironan.000webhostapp.com/nandraki.js" ></script>***
<p>

# Autor 

Projeto esta sendo feito por mim @RonanBasto,caso queria ajudar pode entra conta comigo.<p>
Email:ronanbatos@hotmail.com	
<h4> Doar:<a href="https://pagseguro.uol.com.br/checkout/nc/nl/donation/sender-identification.jhtml?t=8b8ca05a0edd8514fca91a650545641e53996970f1d93de6627e1e44ab6d1de2&e=true#rmcl">Aqui!</a></h4>

# Testar o script 
[Testar sem inteface da engine... Crie um arquivo chamado index.html e cole o seguinte código nele]



	<!DOCTYPE html>
	<html>
	<head>

	 <script src="https://tironan.000webhostapp.com/nandraki.js"></script>

	</head>
	<body>
	<script>
	      myjogo = {
		 start : function(){

		   const txt = new Nandraki("h1","text","Ola mundo!");
		   Nandraki.create_ui(txt.obj,txt.id,"0px","100px","50px","50px");

		   const txt2 = new Nandraki("h1","text",1+1);
		   Nandraki.create_ui(txt2.obj,txt2.id,"0px","100px","50px","100px");

		 },	
	       }

	     fps=60;	
	     game.update(myjogo.start(),fps);  

	</script>
	</body>
	</html>

<h2>Funcionalidades e Metas</h2>

- [x] Criar interface da engine html
- [x] Export html
- [x] Manipulação de elemento Dom
- [x] Key event down e up
- [x] Event touch,click,move		
- [ ] Manipulação de canvas 
- [ ] Criar event Gamepad
- [ ] Criar event Gamepad touch		
	
	
# Documentação

https://ronanbastos.github.io/Nandraki.js/





