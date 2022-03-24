/*
        game.spawn_sprite("carro01","itens/itens_02.png",0,game.random_m(650,420,420))
        game.spawn_sprite("carro02","itens/itens_03.png",-15,game.random_m(650,420,420))
        game.spawn_sprite("carro03","itens/itens_04.png",-15,game.random_m(650,420,420))
        game.spawn_sprite("carro04","itens/itens_05.png",-15,game.random_m(650,420,420))
        game.spawn_sprite("carro05","itens/itens_06.png",-15,game.random_m(650,420,420))
        game.spawn_sprite("carro06","itens/itens_07.png",-15,game.random_m(650,420,420))
*/

car2 = {
    x:0,
    y:0
}
car3 = {
    x:0,
    y:0
}
car4 = {
    x:0,
    y:0
}
car5 = {
    x:0,
    y:0
}
car6 = {
    x:0,
    y:0
}



function speedCar(){
    
    if(game.check_id("carro02")==true){
        if(game.check_colidir("carro02","carro03")==true){
            game.force_obj("carro02",car2.x+=80,car2.y+=20)
        }
        if(game.check_colidir("carro02","carro04")==true){
            game.force_obj("carro02",car2.x+=80,car2.y+=50)
        }
        if(game.check_colidir("carro02","carro05")==true){
            game.force_obj("carro02",car2.x+=80,car2.y+=50)
        }
        if(game.check_colidir("carro02","carro06")==true){
            game.force_obj("carro02",car2.x+=80,car2.y+=50)
        }else{
            game.force_obj("carro02",car2.x+=50,car2.y)
        }
    

    }
    if(game.check_id("carro03")==true){
        if(game.check_colidir("carro03","carro02")==true){
            game.force_obj("carro03",car3.x+=80,car3.y+=20)
        }
        if(game.check_colidir("carro03","carro04")==true){
            game.force_obj("carro03",car3.x+=80,car3.y+=50)
        }
        if(game.check_colidir("carro03","carro05")==true){
            game.force_obj("carro03",car3.x+=80,car3.y+=50)
        }
        if(game.check_colidir("carro03","carro06")==true){
            game.force_obj("carro03",car3.x+=80,car3.y+=50)
        }else{
            game.force_obj("carro03",car3.x+=55,car3.y)
        }


    }
    if(game.check_id("carro04")==true){
        if(game.check_colidir("carro04","carro02")==true){
            game.force_obj("carro04",car4.x+=80,car4.y+=20)
        }
        if(game.check_colidir("carro04","carro03")==true){
            game.force_obj("carro04",car4.x+=80,car4.y+=50)
        }
        if(game.check_colidir("carro04","carro05")==true){
            game.force_obj("carro04",car4.x+=80,car4.y+=50)
        }
        if(game.check_colidir("carro04","carro06")==true){
            game.force_obj("carro04",car4.x+=80,car4.y+=50)
        }else{
        game.force_obj("carro04",car4.x+=60,car4.y)
        }   
    }
    if(game.check_id("carro05")==true){
        game.force_obj("carro05",car5.x+=70,car5.y)

    }
    if(game.check_id("carro06")==true){

            game.force_obj("carro06",car6.x+=85,car6.y)   

    }

    if(car2.x>=game.get_window_w()){
        car2.x=-150
         car2.y=0
        game.kill_free("carro02")
    }
    if(car3.x>=game.get_window_w()){
      
        car3.x=-150
        car3.y=0
        game.kill_free("carro03")
    }
    if(car4.x>= game.get_window_w()){
        car4.x=-150
        game.kill_free("carro04")
    }
    if(car5.x>=game.get_window_w()){
        car5.x=-150
        game.kill_free("carro05")
    }
    if(car6.x>=game.get_window_w()){
        car6.x=-150
        game.kill_free("carro06")
    }
 
}