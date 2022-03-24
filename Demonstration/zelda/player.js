Player = {
    hud: (pontos,bombas,flechas,chaves) => {
     let itens ={};
     itens.pontos = pontos;
     itens.bombas = bombas;
     itens.flechas = flechas;
     itens.chaves = chaves;
     function create(id,img,left,top){
        game.spawn_sprite(id,img,left,top);
       
     }
     
     itens.create=create;

     return itens;
            
    },
    _AnimationFrame: function () {
        if(bomba==true){
            if (bombaTime >= 14 ){
                game.kill_free("bomba")  
                bomba=false   
                bombaTime=-65
                bombaKabom=false
            }  

            if(bombaTime>=1){
               
                game.img_frame("bomba","img[1]bomba",64, 64,14,bombaTime++,14,14);
                if (bombaTime >= 7 ){
                    bombaKabom=true
                    //let audio1 = new Audio();
                    //audio1.src = "som/bombexplode.wav";
                    //audio1.play(); 
                    
                    game.start_som("som/bombexplode.wav")
                }
            }else  if(bombaTime<=1){
                bombaTime++    
                game.img_frame("bomba","img[1]bomba",64, 64,14,1,14,14); 
            }   
           


        }
        if (player.mirror == 0) {
            game.force_obj("player", player.di, player.up, false);
        } else {

            game.force_obj("player", player.di, player.up, true);
        }
      if(player.anim == "parado"){

        game.img_frame("player","img[1]player",64, 64, 8,0,8, 8); 
        
       }  
        if (player.anim == "correr") {
            if (player.frame >= 8 ) player.frame = 2;
            game.img_frame("player","img[1]player",64, 64, 8, player.frame++, 8, 2);


        }
        if (player.anim == "correr_down") {
            if (player.frame >= 8 ) player.frame = 2;
            game.img_frame("player","img[2]player",64, 64, 8, player.frame++, 8, 2);


        }
        if (player.anim == "correr_up") {
            if (player.frame >= 7 ) player.frame = 2;
            game.img_frame("player","img[3]player",64,32, 7, player.frame++, 7, 2);


        }
        if (player.anim == "atk") {
            if (player.frame >= 5 ) player.frame = 3;
            game.img_frame("player","img[4]player",64,32, 5, player.frame++, 5, 3);


        }
        if (player.anim == "rangue" && bumbe==true) {
           
            game.img_frame("player","img[5]player",64,64, 10,3,10,0);


        }else{

            player.anim = "parado"
        }
        
    },
    get AnimationFrame() {
     
        return this._AnimationFrame;
    },
   

 
}