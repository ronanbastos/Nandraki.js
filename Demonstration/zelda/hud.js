
var Hud_config = () =>{
   
    
    Nandraki.create_ui("pontos",itemPlayer.pontos,"#ffff")
    Nandraki.create_ui("bombas",itemPlayer.bombas,"#ffff")
    Nandraki.create_ui("flechas",itemPlayer.flechas,"#ffff")
    Nandraki.create_ui("chaves",itemPlayer.chaves,"#ffff")
    
    itemPlayer.create("hud","sprite/itens/HUD.png",35,5);
    game.camada("sprite_hud",50)
    Nandraki.move_obj("sprite_hud",36,0,true)
   
    Nandraki.move_obj("pontos",45,0,true)  
    game.fonte_size("pontos",7)
    
    Nandraki.move_obj("bombas",71,0,true)  
    game.fonte_size("bombas",7)
    
    
    Nandraki.move_obj("flechas",94,0,true)  
    game.fonte_size("flechas",7)

    Nandraki.move_obj("chaves",111,0,true)  
    game.fonte_size("chaves",7) 
}