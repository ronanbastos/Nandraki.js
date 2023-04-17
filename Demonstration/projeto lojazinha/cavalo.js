
Cavalo = new Object(object)

cavalo={
	mirror:false,
	frame:0,
	framefps:0,
	x:0,
	y:0,
	colider:"",
	bateu:false,
	animador:"parado",
	chamar:false,
	montar:false,
	fugir:false,
	pegar:false,
	img:{
		parado:"img/cavalo_parado.png",
		andando:"img/cavalo_correndo.png",
		montado:"img/cavalo_montado.png",
	},
}



function chamar(){
	
	get_perto = game.check_colidir("box_cavalo", "box_player");
	get_chegou = game.check_colidir("cavalo", "player");
	get_bateu = game.check_colidir("box_cavalo", "hit_player");
	cavalo.bateu = get_bateu;
    

if (get_bateu && comprar_cavalo==true) {
    cavalo.fugir = true;
	game.start_som("som/fugir.mp3")
} else if (get_chegou && comprar_cavalo==true) {
    cavalo.chamar = false;
    cavalo.animador = "parado";
	
	
}

if (cavalo.chamar == true && comprar_cavalo==true) {
  cavalo.animador = "correndo";
  if (cavalo.frame >= 5) {
    cavalo.frame = 1;
  }
  game.img_frame("cavalo", "img[2]cavalo", 64, 64, 5, cavalo.frame++, 5, 1);

  if (game.get_tx("cavalo")!=  game.get_tx(player.id) && game.get_tx("cavalo") >  game.get_tx(player.id)&& comprar_cavalo==true) {
    cavalo.x -= 5;
    game.force_obj("cavalo", cavalo.x, cavalo.y,false);
    cavalo.mirror = false;

    if (game.get_ty("cavalo") != game.get_ty(player.id) && game.get_ty("cavalo") > game.get_ty(player.id)) {
      cavalo.y -= 5;
    }
  }

  if (game.get_tx("cavalo")!= game.get_tx(player.id) && game.get_tx("cavalo") < game.get_tx(player.id) && comprar_cavalo==true) {
    cavalo.x += 5;
    game.force_obj("cavalo", cavalo.x, cavalo.y,true);
    cavalo.mirror = true;

    if (game.get_ty("cavalo") != game.get_ty(player.id) && game.get_ty("cavalo") < game.get_ty(player.id) && comprar_cavalo==true) {
      cavalo.y += 5;
    }
  }
} else if (get_perto == false && comprar_cavalo==true) {
  cavalo.animador = "parado";
  cavalo.colider="";
} else if (get_bateu == true && comprar_cavalo==true) {
  cavalo.fugir = true;
} else if (get_chegou == true && comprar_cavalo==true) {
  cavalo.chamar = false;
  cavalo.animador = "parado";
  
}else if (get_perto == true && comprar_cavalo==true) {
  cavalo.chamar = false;
  cavalo.colider="player";
  cavalo.animador = "parado";
}

if (cavalo.animador == "ninguem" && cavalo.animador == "parado" && comprar_cavalo==true) {
  game.img_frame("cavalo", "img[1]cavalo", 64, 64, 5, 1, 5, 1); //fm, fis, ffe, fr
} else if (cavalo.animador == "andando") {
  cavalo.framefps++;
  if (cavalo.framefps >= 2) {
    cavalo.framefps = 0;
    if (cavalo.frame >= 5) {
      cavalo.frame = 1;
    }
    game.img_frame("cavalo", "img[2]cavalo", 64, 64, 5, cavalo.frame++, 5, 1); //fm, fis, ffe, fr
  }
} else if (cavalo.animador == "parado" && comprar_cavalo==true) {
  cavalo.framefps++;
  if (cavalo.framefps >= 2) {
    cavalo.framefps = 0;
    if (cavalo.frame >= 5) {
      cavalo.frame = 1;
    }
    game.img_frame("cavalo", "img[1]cavalo", 64, 64, 5, cavalo.frame++, 5, 1); //fm, fis, ffe, fr
  }
} else {
  cavalo.colider = "ninguem";
}


 if(cavalo.fugir==true && comprar_cavalo==true){
		 cavalo.x+=5
		 cavalo.animador="correndo/fugindo"
		 if(cavalo.frame>=5){
				
				cavalo.frame=1
		 }
		 game.img_frame("cavalo","img[2]cavalo",64,64,5,cavalo.frame++,5,1)//fm, fis, ffe, fr
		 game.force_obj("cavalo",cavalo.x,cavalo.y,true);
		 if(distancia==250){
			cavalo.fugir=false; 
			game.img_frame("cavalo","img[1]cavalo",64,64,5,1,5,1)//fm, fis, ffe, fr
		 }
		
	 }



if(cavalo.montar==true && comprar_cavalo==true){
			
			game.display("player","none")
			 cavalo.framefps++;
		  if (cavalo.framefps <= 15) {
			cavalo.framefps = 0;
			if (cavalo.frame >= 4) {
			  cavalo.frame = 1;
			}
		  }
			game.img_frame("cavalo","img[3]cavalo",64,64,5,cavalo.frame++,5,1)//fm, fis, ffe, fr
			
			cavalo.x=player.x
			cavalo.y=player.y 
			game.force_obj("cavalo",cavalo.x,cavalo.y,true);
	}else{
	
	        game.display("player","block")
			cavalo.montar=false
			
					
			
	}

	
   if(cavalo.montar==false && comprar_cavalo==true){
	   
	  
	  cavalo.animador="parado" 
   }

  



	
}