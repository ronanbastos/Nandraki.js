x = 0;
y = 0;
pulo=2;
gravity = 0.05;
gravitySpeed = 0;
bounce=0.6
rockbottom = 380;
anim="parado1";

function playerAnimar(){

		if(anim=="parado1"){

		game.render_sprite(player.parado1,Nandraki,x,y)	 

		}else 	if(anim=="parado2"){

		game.render_sprite(player.parado2,Nandraki,x,y)	 

		}else 	if(anim=="run1"){

			game.render_sprite(player.correndo2,Nandraki,x,y)	 
		 
		}else 	if(anim=="run2"){

			game.render_sprite(player.correndo1,Nandraki,x,y)	 
		
		}else 	if(anim=="pulo"){
		
			game.render_sprite(player.pulo,Nandraki,x,y)

		 }
	
		 if(anim=="atacar"){
           
			game.render_sprite(player.atacar,Nandraki,x,y)
			 	
		 }
	
     

}