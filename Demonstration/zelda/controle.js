game.log_key; 
game.log_down(logKey1);
game.log_up(logKey2);
distancia=false
fimDistino=false
var bumbe=false
var gobumbe=false
var bomba=false
var bombaTime=-65
var bombaKabom=false


function logKey1(e) {
    if(game.check_id("player") == true){
    if(e.code == "KeyB"){
       
            if(bomba==false){
                Nandraki.create_sprite("bomba",1,"sprite/itens/bomba.png",null,null,null,null,64,64,15,10,25,25);
                Nandraki.move_obj("bomba",player.di+10,player.up+12.5,false)
               // Nandraki.create_box("bomba",15,15,25,25,"none");  
               // Nandraki.ative_box("hit_bomba",true); 
                    
            }
      
       bomba=true;
    }
 
   
if(e.code == "KeyW"){
	
    player.up-=2
    player.anim = "correr_up"
    game.display("hit_player","none")   
    }	

if( e.code == "KeyS") {

   
   
    player.up+=2
    game.display("hit_player","none") 
    player.anim = "correr_down" 

    }
   
   
if( e.code == "KeyA") {
    
    player.mirror=1;
    game.display("hit_player","none")  
    player.di-=2
    player.anim = "correr"
}

if( e.code == "KeyD") {
    player.mirror=0;
    player.di+=2
    player.anim = "correr"
    game.display("hit_player","none")  
    }	

    }
}

function logKey2(e) {
    if(game.check_id("player") == true){
    if(e.code == "KeyF"){
        game.display("hit_player","none")
        player.anim = "parado"
       
      
        }	
if(e.code == "KeyW"){
	
    player.anim = "parado"

    }
    
    if(e.code == "KeyG"){
        player.anim="rangue";
        game.start_som("som/boomerang.wav")
        if(bumbe==false && game.check_id("sprite_item") == false && player.mirror==0){
           game.spawn_sprite("item","sprite/itens/boomer01.png",player.di+50,player.up+40);
           bumbe=true
           gobumbe="frente";
           

        }   

     
        if(bumbe==false && game.check_id("sprite_item") == false && player.mirror==1){
            game.spawn_sprite("item","sprite/itens/boomer01.png",player.di+32,player.up+40);
            bumbe=true
            gobumbe="costa";
         }
       
    
  

     }
     
     if(e.code == "KeyF"){
            
        player.anim="atk";
        game.start_som("som/fightersword.wav")
        game.display("hit_player","block")  
     
  }	
   
if( e.code == "KeyS") {

    player.anim = "parado"
      
    }
   
   
if( e.code == "KeyA") {
    
  
    player.anim = "parado"
}

if( e.code == "KeyD") {

    player.anim = "parado"
    
        }	
      }
}
