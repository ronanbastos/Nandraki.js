

tronco1 = {
    id:"tronco1",
    x:-150,
    y:0,
    ativo:false
}
tronco2 = {
    id:"tronco2",
    x:-150,
    y:0,
    ativo:false
}
tronco3 = {
    id:"tronco3",
    x:-150,
    y:0,
    ativo:false
}
tronco4 = {
    id:"tronco4",
    x:-150,
    y:0,
    ativo:false
}
tronco5 = {
    id:"tronco5",
    x:0,
    y:0,
    ativo:false
}

tart1 = {
    id:"tart1",
    x:800,
    y:0,
    ativo:false
}
tart2 = {
    id:"tart2",
    x:800,
    y:0,
    ativo:false
}
tart3 = {
    id:"tart3",
    x:800,
    y:0,
    ativo:false
}
tart4 = {
    id:"tart4",
    x:800,
    y:0,
    ativo:false
}
tart5 = {
    id:"tart5",
    x:800,
    y:0,
    ativo:false
}

function troncoCreate(img,valor,obj,id,x,y){
 
    if(game.check_id(id)==false){

        game.spawn_sprite(id,img,x,y)  
        game.camada(id,-5) 

    }
    if(obj.x > game.get_window_w()){

        game.kill_free(id)
        obj.x=-15

    }
    if(obj.x == -800){

        game.kill_free(id)
        obj.x=800

    }
    if(valor=="-"){
        
        if(game.check_colidir(id,"box_player")==true){
            
            game.force_obj("player",Player.di-=5,Player.up)
            return obj.ativo=true
            
        }else{

            return obj.ativo=false
        }
      
    }else  if(valor=="+"){
       
        if(game.check_colidir(id,"box_player")==true){

            game.force_obj("player",Player.di+=5,Player.up)
            return obj.ativo=true
            
        }else{

            return obj.ativo=false
        }
     
    }

}