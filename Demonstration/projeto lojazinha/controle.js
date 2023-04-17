game.log_key;
game.log_down(logKey1);

function logKey1(e) {
 
 if( e.code == "KeyQ" ) {
		
	if(cavalo.colider=="player" || get_perto==true && comprar_cavalo==true){
		cavalo.montar=true
		cavalo.animador="parado"
	}
	
}
 if( e.code == "KeyI" ) {
		
	game.display("navbar","block")
	
}
if( e.code == "KeyE" ) {
	cavalo.montar=false	
	

	if(cavalo.colider=="player" || get_perto==true && comprar_cavalo==true){
		
			
			cavalo.montar=false
			
			game.img_frame("cavalo","img[1]cavalo",64,64,5,1,5,1)//fm, fis, ffe, fr
		  	cavalo.animador="parado"
			game.display("player","block")
			player.x=player.x
			player.y=player.y
			cavalo.x=cavalo.x
			cavalo.y=cavalo.y
		
		
	}
	
}  
 if( e.code == "KeyD" ) {
		
	player.x+=5
	player.animador ="andando"
	game.force_obj(player.id,player.x,player.y,false);
	player.mirror=false

	 if(cavalo.montar==true){
		
		cavalo.mirror=false		
	 }
	
	
}
if( e.code == "KeyS" ) {
		
	player.y+=5
	player.animador ="andando"
	game.force_obj(player.id,player.x,player.y,true);
	player.mirror=false
	
	
}
if( e.code == "KeyP" ) {
		
	
	if(cavalo.montar==false){
		
	    cavalo.mirror=true
		cavalo.pegar=true
	 }
	
	
}
 
if( e.code == "KeyG" ) {
	 if(cavalo.montar==false && comprar_cavalo==true){
		fala=Math.floor(Math.random() * 10)
		fala_player=Math.floor(Math.random() * 10)
		game.spawn_sprite("msg","img/cavalo02.png",player.x,player.y-30)
		cavalo.chamar=true
		
		if(fala_player == 1)game.start_som("som/craudio vem aqui cav.wav")
		if(fala_player == 2)game.start_som("som/CavaloFx.mp3")
		if(fala_player >= 5)game.start_som("som/craudio.wav")
		if(fala_player == 3)game.start_som("som/craudio vem aqui cav.wav")
		if(fala_player == 4)game.start_som("som/craaaaaaaaaaaudioooo.wav")
		
		if (get_chegou && comprar_cavalo==true) {
			if(fala > 6)game.start_som("som/CavaloFx.mp3")
			if(fala == 2)game.start_som("som/relinchando.mp3")		
			if(fala_player >= 7)game.start_som("som/isso cavalo bom garo.wav")
			
			
		}
    }
}
if( e.code == "KeyW" ) {
		
	player.y-=5
	player.animador ="andando"
	game.force_obj(player.id,player.x,player.y,false);
	player.mirror=false
	
}
 if( e.code == "KeyA" ) {
		
	player.x-=5
	player.animador ="andando"
	game.force_obj(player.id, player.x,player.y,true); 
	player.mirror=true
	if(cavalo.montar==true){
		
	    cavalo.mirror=true
		game.force_obj("cavalo",player.x,player.y,true); 
	 }
	
	
}
if( e.code == "KeyF" ) {
		
		
	player.animador ="ataque01"
	game.display("hit_player","block")
	type_ataque="soco"
	game.start_som("som/soco.mp3")
	
	
}
if( e.code == "KeyV" ) {
		
    if(comprar_varinha==true){		
		player.animador ="ataque02"
		game.display("hit_player","block")
		type_ataque="varinha"
		game.start_som("som/varinha.mp3")
	}
}

 }
 
game.log_up(logKey2);

function logKey2(e) {
if(e.code == "KeyD" ) {
	
  player.animador="parado"
  
  if(cavalo.montar==true){
	 game.img_frame("cavalo","img[3]cavalo",64,64,5,5,5,1)//fm, fis, ffe, fr
	 cavalo.animador="parado"
	 
   }
  
}
if( e.code == "KeyP" ) {
		
	
	if(cavalo.montar==false){
		
	    cavalo.mirror=false
		cavalo.pegar=false
	 }
	
	
}

if(e.code == "KeyG" ) {
	
  game.kill_free("msg")
   
  
}
if(e.code == "KeyW" ) {
	
  player.animador="parado"
   
  
}
if(e.code == "KeyS" ) {
	
  player.animador="parado"
   
}
if(e.code == "KeyF" ) {
	
  player.animador="parado"
  game.display("hit_player","none")
  type_ataque=""
}
 if( e.code == "KeyA" ) {
		
		
	player.animador ="parado"
	
}
if( e.code == "KeyV" ) {
		
		
	player.animador ="parado"
	game.display("hit_player","none")
	type_ataque=""
}

}
