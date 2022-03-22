/*

        game.spawn_sprite("tronco1","itens/itens_09.png",10,10)  
        game.spawn_sprite("tronco2","itens/itens_09.png",10,10) 
        game.spawn_sprite("tronco3","itens/itens_09.png",10,10)  
        game.spawn_sprite("tronco4","itens/itens_09.png",10,10)    
        game.spawn_sprite("tronco5","itens/itens_09.png",10,10)    
        game.spawn_sprite("tartaruga1","itens/itens_08.png",10,10)
        game.spawn_sprite("tartaruga2","itens/itens_16.png",10,10)
        game.spawn_sprite("tartaruga3","itens/itens_08.png",10,10)
        game.spawn_sprite("tartaruga4","itens/itens_16.png",10,10)
        game.spawn_sprite("tartaruga5","itens/itens_08.png",10,10)

*/
tronco1 = {
    x:0,
    y:0,
    ativo:false
}
tronco2 = {
    x:1300,
    y:395,
    ativo:false
}
tronco3 = {
    x:0,
    y:0,
    ativo:false
}
tronco4 = {
    x:0,
    y:0,
    ativo:false
}
tronco5 = {
    x:0,
    y:0,
    ativo:false
}

tartaruga1 = {
    x:0,
    y:0,
    ativo:false
}
tartaruga2 = {
    x:0,
    y:0,
    ativo:false
}
tartaruga3 = {
    x:0,
    y:0,
    ativo:false
}
tartaruga4 = {
    x:0,
    y:0,
    ativo:false
}
tartaruga5 = {
    x:0,
    y:0,
    ativo:false
}

function troncoCreate(){
    if(game.check_id("tronco1")==true){
        if(game.check_colidir("tronco1","box_player")==true){
            game.force_obj("player",Player.di+=5,Player.up)
            tronco1.ativo=true
        }else{
            tronco1.ativo=false
        }
        game.force_obj("tronco1",tronco1.x+=5,tronco1.y)
                           
        if(tronco1.x > game.get_window_w()){
            game.kill_free("tronco1")
            tronco1.x=-15

        }
    }else{
        game.spawn_sprite("tronco1","itens/itens_09.png",-50,415)  
        game.camada("tronco1",-5) 
    }

    if(game.check_id("tronco2")==true){
       
        if(game.check_colidir("tronco2","box_player")==true){
            game.force_obj("player",Player.di-=5,Player.up)
            tronco2.ativo=true
        }else{
            tronco2.ativo=false
        }
        game.force_obj("tronco2",tronco2.x-=5,tronco2.y)

        if(tronco2.x < -1300){
            game.kill_free("tronco2")
            tronco2.x=1300

        }

    }else{
        game.spawn_sprite("tronco2","itens/itens_09.png",tronco1.x,tronco1.y) 
        game.camada("tronco1",-5) 
    }
}