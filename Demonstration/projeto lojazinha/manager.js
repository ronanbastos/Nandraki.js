object = {
  id:null,
  img:null,
  x:0,
  y:0,
  pulo:false,
  velocidade:0,
  gravidade:0,
  forca:0,
  massa:5,
  animador:"parado",
  frame:0,
  framefps:0,
  mirror:false,
  
}


jogo ={
	
ObjectCreate: function(){

	Nandraki.create_sprite(player.id,5,player.img.parado,player.img.andando,player.img.pulo,player.img.atacando01,player.img.atacando02,64,64,15,32,250,250)

	Nandraki.create_box("player",20,20,0,0,"block")
	Nandraki.move_obj("box_player",game.get_tx(player.id)+20,game.get_ty(player.id)+25,false)
	Nandraki.ative_box("box_player",false)
	

	Nandraki.ative_box("hit_player",false)
	game.display("hit_player","none")
	Nandraki.move_obj("hit_player",game.get_tx(player.id)+45,game.get_ty(player.id)+25,false)
	
	Nandraki.create_sprite("cavalo",3,cavalo.img.parado,cavalo.img.andando,cavalo.img.montado,null,null,64,64,32,32,20,25)
	Nandraki.ative_box("box_cavalo",false)
	Nandraki.create_box("cavalo",20,20,0,0,"block")
	game.img_frame("cavalo","img[1]cavalo",64,64,5,1,5,1)//fm, fis, ffe, fr
	cavalo.animador="parado"
	game.display("navbar","none")

},	

Start : function(){
	 distancia = relativisticDistance(player.x,player.y,cavalo.x,cavalo.y,5,1,5)
	 //console.log(distancia)
	Nandraki.move_ui("navbar",game.get_tx(player.id)+10,game.get_ty(player.id)-135,true)
	
	game.click("cp_varinha",cp_Alert)
	game.click("cp_placa",cp_scena)
	game.click("cp_celular",cp_Alert)
	if(comprar_cavalo==false){
	
	   game.camada("cavalo",-100)
	   game.display("cavalo","none")
	
	}
	if(comprar_cavalo==true){
	
     game.camada("cavalo",50)
	 game.display("cavalo","block")
	
	}

  if(game.check_id("cavalo_prod")==false){
		
 		comprar_cavalo=true
	    game.camada("cavalo",50)
		game.display("cavalo","block")
		
	}
	
	if(cavalo.pegar==true && get_perto == true && comprar_cavalo==true){
	
	game.force_obj("cavalo", player.x, player.y,false);
			cavalo.x=player.x
			cavalo.y=player.y 
    }else{
		
		    cavalo.x=cavalo.x
			cavalo.y=cavalo.y
	}
	
     ative();	
	 chamar();
	 animar();
	
	 //game.camera('2d',game.get_tx(player.id)-250,game.get_ty(player.id),500000000,500000000)
	
	 game.kill_free("msg");
	 
	  	
   
 },	
}

fps=60;
game.update(jogo.Start,fps); 


