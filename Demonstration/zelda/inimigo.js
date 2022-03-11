find=false;
limite=0;
normalizar=false;
Inimigo = {
        Vida: (vida,valor,operado) => {
            
            if (operado == "+" ){
                
                return this.vida + valor
            }else if(operado == "-"){

                return this.vida - valor

            }else{

                return this.vida

            }
                
        },
        _AnimationFrame: function (obj) {
        
            if (inimigo.mirror == 0) {
                game.force_obj("inimigo", inimigo.di, inimigo.up, false);
                
            } else {

                game.force_obj("inimigo", inimigo.di, inimigo.up, true);
            
            }
        if(inimigo.anim == "parado"){

            game.img_frame("inimigo","img[1]inimigo",64, 64, 8,0,8, 8); 
            
        }  
            if (inimigo.anim == "correr") {
                if (inimigo.frame >=2 ) inimigo.frame = 0;
                game.img_frame("inimigo","img[1]inimigo",64, 64, 2, inimigo.frame++, 2, 0);


            }
            if (inimigo.anim == "atk") {
                if (inimigo.frame >=3 ) inimigo.frame = 0;
                game.img_frame("inimigo","img[2]inimigo",64, 64, 3, inimigo.frame++, 3, 0);


            }
        
        },
        _Move: function () {
          if(find==false && normalizar==true){
            
            player.di=inimigo.di +Math.floor(Math.random() * 250)
            
        
          }else if(find==true){
            limite=Math.floor(Math.random() * 100)+player.di;
          }
          if(player.di==inimigo.di+10 && inimigo.mirror !=player.mirror  ){
            find=true;
        }
         if(game.check_id("player")==false && find==false &&  normalizar==true){

            anim="parado"
            game.img_frame("inimigo","img[1]inimigo",64, 64, 8,0,8, 8);

        } else if(game.check_id("inimigo")==true){
           
            if(game.check_colidir("box_player","box_inimigo")==true ){
                Inimigo.AnimationFrame();
                inimigo.anim="atk"
                player.vida-=1
                find=true;

                if(player.vida<=0){
                    
                    normalizar=true;
                    find=false;
                }
            }else{
                if( find==true &&  normalizar==false){
                    Inimigo.AnimationFrame()
                     inimigo.anim="correr"
                }else{
                    anim="parado"
                }
                
                if(player.up>inimigo.up && player.di<inimigo.di && inimigo.mirror==1 && find==true &&  normalizar==false ){
                    inimigo.up+=2 

                }else if(player.up<inimigo.up && player.di<inimigo.di && inimigo.mirror==1  && find==true &&  normalizar==false ){
                    inimigo.up-=2 

                }else if(player.up>inimigo.up && player.di>inimigo.di && inimigo.mirror==0 && find==true &&  normalizar==false){
                    inimigo.up+=2 

                }else if(player.up<inimigo.up && player.di>inimigo.di && inimigo.mirror==0 && find==true &&  normalizar==false ){
                    inimigo.up-=2 

                }

                 if(inimigo.di>=-30 && inimigo.mirror==0 && find==true &&  normalizar==false){
                    inimigo.di+=2
                    }
                    if( inimigo.di >= limite && find==true &&  normalizar==false){
                    
                    inimigo.mirror=1;
                    
                    }
                    if(inimigo.di>=-30 && inimigo.mirror==1 && find==true &&  normalizar==false){
                        inimigo.di-=2
                  
                    }
                    
                
                    if(inimigo.di==-30 || player.di==inimigo.di+10 && find==true &&  normalizar==false ){
                            inimigo.mirror=0
                    }
                 
                   
                   
                   
                    }

                }    
            
          
            
        },
        get AnimationFrame() {
        
            return this._AnimationFrame;
        
            
        },
       get Move(){
        
            return this._Move();
        
            
        }, 
            
    } 