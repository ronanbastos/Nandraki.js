
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

	game.camera("2d",x,y,limitX,limitY)
			
spawn sprite: function()

	game.spawn_sprite(id,img,left,top);
	
display item: function()
	 
	 // none=ocuto
	 // block=visivel
	 game.display(id obj,"none")
