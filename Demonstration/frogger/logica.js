def=-60
function meta(c2,c3,c4,c5,c6){
       
       
 
       if(game.check_id("carro02")==false){
        game.spawn_sprite("carro02","itens/itens_02.png",-150,c2)
       }
        
       if(game.check_id("carro03")==false){
        game.spawn_sprite("carro03","itens/itens_03.png",-150,c3)
       }
       if(game.check_id("carro04")==false){
        game.spawn_sprite("carro04","itens/itens_04.png",-150,c4)
       }
       if(game.check_id("carro05")==false){
        game.spawn_sprite("carro05","itens/itens_05.png",-150,c5)
       }
       if(game.check_id("carro06")==false){
        game.spawn_sprite("carro06","itens/itens_06.png",-150,c6)
       }
       if(game.check_id("carro06")==false){
        game.spawn_sprite("carro06","itens/itens_06.png",-150,c6)
       }
    
      

}     


function LogicaGame(){
    padrao=game.random_mf(5)
    if(padrao==1){

        meta(488,593,700,830,688)    
      
    }
    if(padrao==2){

        meta(593,688,830,700,488 )    

    }
    if(padrao==3){

        meta(700,830,688,488,595)    

    }

    if(padrao==4){

        meta(830,688,700,595,488)    

    }
    troncoCreate();
   
}
function crono(){
    def++
    if(def==1){
       let value=game.get_text("tempo")
        value-=1
        if(value<=0){
        game.load("gameOver.html")
        }
        game.set_text("tempo",value)
        def=-60
    }

}   
function lif(){
    let value=game.get_text("vida")
    value-=1
    game.set_text("vida",value)
}
function check_mar(){
  
    if(game.check_colidir("box_player","hit_mar")==true && tronco1.ativo==false && tronco2.ativo==false){
        game.kill_free("player");
        lif();   
    }
}
