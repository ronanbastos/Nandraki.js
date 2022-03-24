game.log_key;
 game.log_down(logKey1);
 function logKey1(e) {
    if(game.check_id("player")==true){
	   if( e.code == "KeyA" ) {
            Player.di-=3
            Player.anim="correndo_lateral2"     

		}else if( e.code == "KeyD") {
            Player.di+=3
            Player.anim="correndo_lateral1"
         
             
		}else  if( e.code == "KeyW") {
            Player.up-=3
            Player.anim="correndo_up"
            Player.mirror=0

		}else  if( e.code == "KeyS") {
            Player.up+=3
            Player.anim="correndo_down"

		} 
     
    }
  }

game.log_up(logKey2);	
function logKey2(e) {
    if(game.check_id("player")==true){
		if( e.code == "KeyS") {
            Player.anim="paradoS"
		}
        if( e.code == "KeyA") {
            Player.anim="paradoA"
          
		}
        if( e.code == "KeyD") {
            Player.anim="paradoD"
          
		}
        if( e.code == "KeyW") {
            Player.anim="paradoW"
           
		}
     
    }
}
