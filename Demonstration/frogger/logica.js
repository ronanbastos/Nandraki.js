def=-60
checkFim=false
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

     troncoCreate("itens/itens_09.png","+",tronco1,tronco1.id,tronco1.x,415);
     game.force_obj("tronco1",tronco1.x+=5,tronco1.y)

     troncoCreate("itens/itens_08.png","-",tart1,tart1.id,tart1.x,390);
     game.force_obj("tart1",tart1.x-=5,tart1.y)

     troncoCreate("itens/itens_09.png","+",tronco2,tronco2.id,tronco2.x,365);
     game.force_obj("tronco2",tronco2.x+=5,tronco2.y)

     troncoCreate("itens/itens_08.png","-",tart2,tart2.id,tart2.x,340);
     game.force_obj("tart2",tart2.x-=5,tart2.y)

     troncoCreate("itens/itens_09.png","+",tronco3,tronco3.id,tronco3.x,315);
     game.force_obj("tronco3",tronco3.x+=5,tronco3.y)

     troncoCreate("itens/itens_08.png","-",tart4,tart4.id,tart4.x,265);
     game.force_obj("tart4",tart4.x-=5,tart4.y)

     troncoCreate("itens/itens_09.png","+",tronco4,tronco4.id,tronco4.x,240);
     game.force_obj("tronco4",tronco4.x+=5,tronco4.y)

     troncoCreate("itens/itens_08.png","-",tart5,tart5.id,tart5.x,200);
     game.force_obj("tart5",tart5.x-=5,tart5.y)
     
     if(game.check_colidir("final3","box_player")==true){
        game.display("sapo3","block") 
        game.kill_free("player");
        let value=game.get_text("tempo")
        game.kill_free("final3")
        value= 10
        game.set_text("tempo",value)
        fim=fim+1;
        checkFim=true
     }else{
        checkFim=false
     }

     if(game.check_colidir("final1","box_player")==true){
        game.display("sapo1","block") 
        game.kill_free("player");
        let value=game.get_text("tempo")
        game.kill_free("final1")
        value= 10
        game.set_text("tempo",value)
        fim=fim+1;
        checkFim=true
    }else{
       checkFim=false
    }
     if(game.check_colidir("final2","box_player")==true){
        game.display("sapo2","block") 
        game.kill_free("player");
        let value=game.get_text("tempo")
        game.kill_free("final2")
        value= 10
        game.set_text("tempo",value)
        fim=fim+1;
        checkFim=true
    }else{
       checkFim=false
    }
     if(game.check_colidir("final4","box_player")==true){
        game.display("sapo4","block") 
        game.kill_free("player");
        game.kill_free("final4")
        value= 10
        game.set_text("tempo",value)
        fim=fim+1;
        checkFim=true
    }else{
       checkFim=false
    }
     if(fim==4){
        game.load("fim.html")

     }
  
}

function crono(){
    def++
    if(def==1){
       let value=game.get_text("tempo")
        value-=1
        game.set_text("tempo",value)
        def=-60
        if(value<=0){

            game.load("gameOver.html")
     
         }
    }

  

}   

function lif(){
    let value=game.get_text("vida")
    value-=1
    if(value<=0){
        game.load("gameOver.html")
    }
    game.set_text("vida",value)
}

function checkMar(){
  
    if(game.check_colidir("box_player","hit_mar")==true && 
    tronco1.ativo==false  && 
    tronco2.ativo==false  &&
    tronco3.ativo==false  && 
    tronco4.ativo==false  && 
    tronco5.ativo==false  && 
    tart1.ativo==false    && 
    tart2.ativo==false    &&
    tart3.ativo==false    &&
    tart4.ativo==false    &&
    tart5.ativo==false    &&
    checkFim==false
    ){
       game.kill_free("player");
       lif();   
    }
}
