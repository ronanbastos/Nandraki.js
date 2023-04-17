player = new Object(object)



player.id="player"
type_ataque=""
player.img={
parado:"img/player/parado.png",
andando:"img/player/andando.png",	
pulo:"img/player/jump.png",
atacando01:"img/player/ataque.png",
atacando02:"img/player/ataque_varinha.png",	
}

comprar_cavalo=false
comprar_varinha=false
dinheiro=true

function animar(){
	
	
	
	if(player.animador=="ataque01"){
		player.framefps++
	    if(player.framefps>=2){
			player.framefps=0;
			if(player.frame>=5){
				
				player.frame=1
			}
			game.img_frame("player","img[4]player",64,64,5,player.frame++,5,1)//fm, fis, ffe, fr
			
			
			
	    }
		
	}else if(player.animador=="ataque02"){
		if(comprar_varinha==true){
				player.framefps++
				if(player.framefps>=2){
					player.framefps=0;
					if(player.frame>=5){
						
						player.frame=0
						
					}
					game.img_frame("player","img[5]player",64,64,5,player.frame++,5,0)//fm, fis, ffe, fr
				
					
					
				}
		}
	}else if(player.animador=="andando"){
		
		player.framefps++
	    if(player.framefps>=2){
			player.framefps=0;
			if(player.frame>=5){
				
				player.frame=1
				
			}
			game.img_frame("player","img[2]player",64,64,5,player.frame++,5,1)//fm, fis, ffe, fr
		
			
			
	    }
	}else if(player.animador=="parado" ){
		
		player.framefps++
	    if(player.framefps>=2){
			player.framefps=0;
			if(player.frame>=5){
				
				player.frame=1
			}
			game.img_frame("player","img[1]player",64,64,5,player.frame++,5,1)//fm, fis, ffe, fr
		
			
			
	    }
		
	}
	
	
}//fim animar()

function ative() {
	perto_casa = game.check_colidir("casa", "player");
	perto_prod_caixa = game.check_colidir("toque", "hit_player");
	comprar_prod_varinha = game.check_colidir("cp_varinha", "hit_player");
	comprar_prod_cavalo = game.check_colidir("cavalo_prod", "hit_player");
	quadro_obj=game.check_colidir("cp_cavalo", "hit_player");
    calular_obj=game.check_colidir("img_celular", "hit_player");	
	celular_img=game.get_obj("img_celular")
	caixaX=0

	if(perto_casa==true && game.get_ty("player") <=315){
		game.camada(player.id,-50)
		game.camada("casa",50)
		cavalo.chamar = true
		
	}else{
		
		game.camada(player.id,50)
	}
	
	if(perto_prod_caixa==true){
		
		game.force_obj("toque",caixaX=caixaX-22,0,false);
		
		
	}
	if(comprar_prod_varinha==true){
		
		comprar_varinha=true
		game.kill_free("cp_varinha")
		game.edite_text("saldo","Saldo: 0 R$ ")
		game.edite_text("valor_varinha","Este produto já foi comprado!")
		game.edite_text("total_item","Total itens: 1")
		
	}
	
	if(quadro_obj==true && comprar_varinha==true && type_ataque=="varinha"){
		
		compra_cavalo=true
		game.kill_free("cavalo_prod")
		
	}
	if(calular_obj==true  && comprar_varinha==true && type_ataque=="varinha"){
		
		game.set_src(celular_img,"img/produto2-2.jpg")
	
		game.edite_text("celular_txt"," J2 prime")
		game.edite_text("celular_preço","Free R$")
	}
	
	
}
function cp_Alert() {

   alert("Acesso negado! Tem ser com violencia, use o f ")

}
function cp_scena() {
	
   game.load("Lojinha01.html")

}
function relativisticDistance(x1, y1, x2, y2, v, t,erro) {
  
  //d é a distância relativa
  //dx é a diferença de posição entre os objetos
  //dy é a diferença de posição entre os objetos
  //v é a velocidade
  //t é o tempo decorrido
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const vt = v * t;
  return Math.sqrt((dx - vt)*(dx - vt) + dy*dy)-erro;
}