
function check_ui(){
    
    Nandraki.create_ui("pontos_txt","Pontos:","#ffff")
    Nandraki.create_ui("pontos",0,"#ffff")
    Nandraki.move_ui("pontos_txt",5,-15,true)
    Nandraki.move_ui("pontos",50,-15,true) 
    
    Nandraki.create_ui("tempo_txt","Tempo:","#ffff")
    Nandraki.create_ui("tempo",10,"#ffff")
    Nandraki.move_ui("tempo_txt",100,-15,true)
    Nandraki.move_ui("tempo",140,-15,true)  

    Nandraki.create_ui("vida_txt","Vida:","#ffff")
    Nandraki.create_ui("vida",3,"#ffff")
    Nandraki.move_ui("vida_txt",200,-15,true)
    Nandraki.move_ui("vida",230,-15,true)    
}
function AnimPlayer(){

    game.force_obj("player",Player.di,Player.up)

    if(Player.anim=="paradoW"){
       
        game.img_frame(Player.id,"img[1]player",64,64,12,1,1,1); 


}
if(Player.anim=="paradoD"){
  
    game.img_frame(Player.id,"img[1]player",64,64,23,10,10,10); 


}
if(Player.anim=="paradoA"){
 
    game.img_frame(Player.id,"img[1]player",64,64,23,22,22,22); 


}
if(Player.anim=="paradoS"){

    game.img_frame(Player.id,"img[1]player",64,64,23,8,8,8); 


}
if(Player.anim=="correndo_lateral1"){

if(Player.frame>=17)Player.frame=10
game.img_frame(Player.id,"img[1]player",64,64,23,Player.frame++,17,10); 


}
if(Player.anim=="correndo_lateral2"){
    
    if(Player.frame>=23)Player.frame=18
    game.img_frame(Player.id,"img[1]player",64,64,23,Player.frame++,23,18); 
    
}
if(Player.anim=="correndo_up"){

if(Player.frame>=4)Player.frame=1
game.img_frame(Player.id,"img[1]player",64,64,12,Player.frame++,4,1); 


}
if(Player.anim=="correndo_down"){
     if(Player.frame>=8)Player.frame=5
        game.img_frame(Player.id,"img[1]player",64,64,12,Player.frame++,5,5); 
    }
 

 }
