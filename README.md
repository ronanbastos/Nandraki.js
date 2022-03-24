<h1 align="center"> <img src="https://i.ibb.co/n3BMNKM/logo.png" alt="mascote"  border="0"></h1>

<br>
<h1 align="center"><img src="https://img.shields.io/badge/Lincense-MIT-green" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Version-1.4.5 [next:05/05/2022]-blue" alt="index-html" border="0"> <img src="https://img.shields.io/badge/Projeto-Ativo-success" alt="index-html" border="0"><img src="https://img.shields.io/badge/Ultima%20Att-17/03/2022-green" alt="index-html" >     
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
  Playground CodePen: https://codepen.io/ronan-varella/pen/xxPeeEM
<p><br>
	
  Playground Site : https://tironan.000webhostapp.com/nandraki.html	
	
# CDN 


	<script src="https://unpkg.com/nandraki@1.4.5/nandraki.js" ></script>
	<script src="https://unpkg.com/nandraki@1.4.6/nandraki.js" ></script>
<p>

# Testar o script 
[Testar sem inteface da engine... Crie um arquivo chamado index.html e cole o seguinte código nele]

	<!DOCTYPE html>
	<html>
	<head>
		<script src="nandraki.js"></script>
		<script src="https://unpkg.com/nandraki@1.4.6/nandraki.js" ></script>
	</head>
	<body>

		<script>
		        
		       myjogo = {


			 start : function(){


			   Nandraki.create_ui("text_id","hello world")	


			 },	
		       }

		       fps=60;	
		       game.update(myjogo.start,fps);  

	</script>
	</body>
	</html>



<h2>Funcionalidades e Metas</h2>

- [x] Criar interface completa
- [x] Export html
- [ ] Pre-renderização de frame
- [ ] Visulização de arquivos do projeto	
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
	

# Autor 
Projeto esta sendo feito por mim @RonanBasto,caso queria ajudar pode entra conta comigo.<p>
Email:ronanbatos@hotmail.com	
<h4> Doar:<a href="https://www.paypal.com/donate?business=4KJAVYQLQDMHA&no_recurring=0&item_name=Ajudar+a+engine&currency_code=BRL">Aqui!</a></h4>

# Documentation.md

Welcome to the Nandraki.js!

|Alfa documentação 1.4.5 ultima versão ante do hard rest do codigo para Beta

|1.4.5 colocamos camada de animação de sprite

|Beta tem previsão para 2023 com versão 3.0
      
       
Verficar Version

	Nandraki.version();
	 
	
Criar obj com Class Nandraki
	     
	      //Nandraki.create_sprite(id, camadas, img1, img2, img3, img4, img5, width, height, boxl, boxh, left, top)	
	     //constructor(id,vida, gravidade, velocidade, massa, di, up, mirror, anim, jump, frame)
	    //Nandraki. create_ui(id,txt,cor)
	   //Nandraki.move_obj(id,left,top,fixed)
	  Nandraki.create_obj("text",100,100,50,50,true);
	
Detectar colisão Nandraki.js
    

		if(game.check_colidir("box_chao","box_player")==true && game.check_id("box_chao") == true ){
		
		//player.up=player.up
		//player.di=player.di
		//return true
			
		}


Start game

	      game.create_obj(div,text);
	      
	      myjogo = {


		 loop : function(){


		   Nandraki.create_ui("text"," Hello world!","ffff");	


		 },	
	       }

	     fps=60;	
	     game.update(myjogo.loop,fps);  


Criar canvas

	game.canvas_start(id,width,height);

Canvas Text 
	
	 game.canvas_text(text,font,cor,x,y);	
	
Canvas Arc
	
	 game.canvas_arc(x,y,font,b,p);


Game Print

	game.print("ola mundo"); 
	

force_obj function(id,x,y,rotate)
	
	  //  rotate true = translate3d("+x+"px,"+y+"px, 0px) rotateY(180deg)	
	 //   rotate false = translate3d("+x+"px,"+y+"px, -0px) rotateY(0deg)
	 
	 game.force_obj(item1.id,item1.di,item1.gravidade,true) 
	 
	 //ir para frente dentro do loop
	  item1.di++
	  game.force_obj(item1.id,item1.di,item1.gravidade,true) 
	 
	 
Simples gravidade div dom

		// version 1.4.5
	            fora do loop{
		  	    Nandraki.create_sprite(id player, camadas, img1, img2, img3, img4, img5, width, height, boxl, boxh, left, top);
 		   	    const player = new Nandraki(id player,vida, gravidade, velocidade, massa, di, up, mirror, anim, jump, frame);
			    
		    }
		    dentro do loop update{
			    
			    game.force_obj("player", player.di, player.up, false);
			    
			    if(player.up >= chao.up){
			     player.up = player.up
			    }else{
			     game.gravit(player) ou player.up+=5
			    }
		    
		    }
		    
    

Click Mouse

		function click(){

		 game.print("click");
		}
		game.click_start("id do obj",click);


Move Mouse

		game.move_mouse(id do obj);


Move Mouse

		game.move_mouse(id do obj);



create box

	game.create_box(id,debug);


Touch start e and


	function click(){
	
	 game.print("touch start ative");
	
	}
	game.touch_end("id do obj",click); 
	// or 
	game.touch_start("id do obj",click);


Add obj dentro de outro obj 
	
	game.obj_in_obj(id do obj1,id do obj2);
	
Set Text 

         game.set_text(id do obj,"texto");
	 game.set_text(id do obj,1+1);
	
Teclado log keydown keyup

	 game.log_key;
	 game.log_down(logKey1);
	 function logKey1(e) {
		   if( e.code == "KeyS") {
			game.print("Test log key down ok!");
			}
	  }
	game.log_up(logKey2);	
	function logKey2(e) {
			if( e.code == "KeyS") {
				game.print("Test log key up ok!");
			}
	}
	
	
Scale X
     
       game.scaleX("id player ou obj","-1");
	
Random Math 
	
	 random_m(max,min,variante);
	
Random Math floor
	
	random_mf(max,min,variante);

 Opacity
	
	opacity(id,value);
	
	
 kill_free 
	
	
	  kill_free(id);
	 
	


som_play  

	game.som_play(id,path som);
	


touchpad virtual
	  
	html in body{
		<div id="joy">
		</div>
	}
	game.touchpad("joy" ,set left,set top);
	stick=game.get_obj("stick");	
	base=game.get_obj("base-stick");
	
	 if(stick.offsetLeft == 32){
                  Player.anim="parado";
                  Player.di=Player.di;	
               }

               if(stick.offsetLeft < 32){
                  Player.di-=2
                  Player.anim="correndo_lateral2"
               } 
               else if(stick.offsetLeft > 32){
                  Player.di+=2
                  Player.anim="correndo_lateral1"
               }
               if(stick.offsetTop <= -1 ){
                  Player.up-=2
                  Player.anim="correndo_up"
                  
               }
               if(stick.offsetTop == 32 ){
                  Player.anim="parado";
                  Player.di=Player.di;	
                  
               }
               if(stick.offsetTop > 32 ){
                  Player.up+=2
                  Player.anim="correndo_down"
                  
               }
	

Create sprite
    
    //create_sprite(id,camadas,img1,img2,img3,img4,img5,width,height,boxl,boxh,left,top)
 
    //cada img gera um id "img[nivel da camada]player"  
    
    //boxl=x boxh=y são coodernada do box collider 2d do objeto.Ative sempre o Nandraki.create_box("box_player",true);
    
    //todo sprite tem seu box_id
    
    Nandraki.create_sprite("vida",1,"item.png",null,null,null,null,16,16,9,14,28,25);
   
 
img frame
      
     //img_frame: function(id,id da img = por padrão sempre vai ser img[3]+id do obj ,width,height,calculo do frame,inicio do frame,frame variavel,reset frame)
     //img_id sempre vai ter padrão de img[3]id. 
     //[3] = camanda da imgame 3 do objeto
        
    if(player.anim=="run"){

		game.img_frame(id,"img[3]player",64,32, 7, player.frame++, 7, 0);
	 	if(frame==7)frame=0

	}
	
bd_save: function(variavel,value)

         localStorage.setItem(variavel, value);

   

bd_load: function(variavel)

	game.bd_load(variavel)
   

bd_remove: function(variavel)

	game.bd_remove(variavel)
   
  
bd_clear: function()

	game.bd_clear();
	
  
Camera: function()

	game.camera("2d",x,y )
			
spawn sprite: function()

	game.spawn_sprite(id,img,left,top);
	
display item: function()
	 
	 // none=ocuto
	 // block=visivel
	 game.display(id obj,"none")


