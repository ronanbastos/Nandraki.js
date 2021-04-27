# Nandraki.js
Engine game</br>
<img src="https://i.ibb.co/k6pMWgQ/index-html.png" alt="index-html" border="0"></br>
Mascote</br>
<img src="https://github.com/ronanbastos/Nandraki.js/blob/main/nandraki-engine-js/mascote.png?raw=true" alt="index-html" border="0">
</br></p>
<!DOCTYPE html>
<html>
<head>
</head>
<body>


<player id="player"></player>
<chao id="chao"></chao>
<item id="power">

</item>
<parede id="parede"></parede>

<script>
       
                            
class Nandraki {
    constructor(obj,id,txt) {
        this.obj = obj;
        this.id = id;
	this.txt = txt;	
	document.body.innerHTML += '<'+this.obj+' id="'+this.id+'">'+txt+'</'+this.obj+'>';
	this.obj = document.getElementById(this.id);	
	return obj;
    }

    static create_obj(obj,id,width,height,top,left) {
        obj = document.getElementById(id);
	obj.style.width = width;
	obj.style.height = height;
	obj.style.border = "solid 1px";
	obj.style.top = top;
	obj.style.left = left;
	obj.style.position = 'absolute';
	
    }
    static create_ui(obj,id,width,height,top,left) {
        obj = document.getElementById(id);
	obj.style.width = width;
	obj.style.height = height;
	obj.style.top = top;
	obj.style.left = left;
	obj.style.position = 'absolute';
	
    }	
  	 	
}

const parede_1 = new  Nandraki("parede","parede1","");
Nandraki.create_obj(parede_1.obj,parede_1.id,"10px","500px","50px","535px");

const lifebarra = new  Nandraki("barra","life","");
Nandraki.create_obj(lifebarra.obj,lifebarra.id,"100px","5px","15px","10px");

lifebarra.obj.style.background = "red";
const lifebarra2 = new  Nandraki("barra2","life2","");
Nandraki.create_obj(lifebarra2.obj,lifebarra2.id,"100px","5px","15px","10px");

const txt = new Nandraki("h6","text","Pontos:");
Nandraki.create_ui(txt.obj,txt.id,"0px","0px","0px","50px");
ui_ponto = document.getElementById(txt.id);

const txt_pontos = new Nandraki("h6","pontos","0");
Nandraki.create_ui(txt_pontos.obj,txt_pontos.id,"0px","0px","0px","90px");
pontos=100;


barralife= document.getElementById(lifebarra.id);
ui_ponto = document.getElementById(txt_pontos.id);
player = document.getElementById("player");
chao = document.getElementById("chao");
item = document.getElementById("power");
parede = document.getElementById("parede");
parede1 = document.getElementById(parede_1.id);



item.style.width = "30px";
item.style.height = "30px";
item.style.border = "solid 1.5px";
item.style.top = '50px';
item.style.left = '150px';
item.style.position = 'absolute';
topAtual2 = parseInt(item.style.top, 10);
leftAtual2 =  parseInt(item.style.left, 10);
gravidade2=1;
velocidade2=1;


chao.style.width = "500px";
chao.style.height = "10px";
chao.style.border = "solid 1.5px";
chao.style.top = '550px';
chao.style.left = '45px';
chao.style.position = 'absolute';
topAtual1 = parseInt(chao.style.top, 10);

parede.style.border = "solid 1.5px";
parede.style.width = "10px";
parede.style.height = "500px";
parede.style.top = '50px';
parede.style.left = '40px';
parede.style.position = 'absolute';



player.style.position = 'absolute';
player.style.top = '100px';
player.style.left = '60px';
player.style.background='url("player.png") no-repeat -112px -16px';
player.style.width="17px";
player.style.height= "18px";
velocidade=1;
gravidade =1;
lefts = 0;
pulo = false;
vida = 5;
esquerda=false;
direita=false;
leftAtual =  parseInt(player.style.left, 10);
topAtual = parseInt(player.style.top, 10);
frame=1;
variavel = {};
duplo_pulo=0;
tecla="";

function corre() {
    frame++;
    if (frame == 6) frame = 1;
    if(frame==1){
	    player.style.background='url("player.png") no-repeat -112px -46px';
	    player.style.width="17px";
	    player.style.height= "16px";
    }
    if(frame==2){
	    player.style.background='url("player.png") no-repeat -144px -47px';
	    player.style.width="17px";
	    player.style.height= "17px";

    }
    if(frame==3){
            player.style.background='url("player.png") no-repeat -176px -49px';
	    player.style.width="17px";
	    player.style.height= "17px";

    }
   if(frame==4){
            player.style.background='url("player.png") no-repeat -16px -80px';
	    player.style.width="17px";
	    player.style.height= "17px";

    }
    if(frame==5){
    
	    player.style.background='url("player.png") no-repeat -48px -80px';
	    player.style.width="17px";
	    player.style.height= "18px";
    }
    if(frame==6){
            player.style.background='url("player.png") no-repeat -80px -80px;';
	    player.style.width="17px";
	    player.style.height= "18px";

    }			 
					
}


game = {
    moveX : function(nome,left,grav){
	alert("test");
    },
    scaleX:function(id,valor){
	let obj = document.getElementById(id);
	obj.style.transform="scaleX("+valor+")";	 
    },
    	
    move_mouse: function(id){
	
	dragElement(document.getElementById(id));

	function dragElement(elmnt) {
	  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	  if (document.getElementById(elmnt.id + "header")) {
	    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	  } else {
	    elmnt.onmousedown = dragMouseDown;
	  }

	  function dragMouseDown(e) {
	    e = e || window.event;
	    e.preventDefault();
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    document.onmouseup = closeDragElement;
	    document.onmousemove = elementDrag;
	  }

	  function elementDrag(e) {
	    e = e || window.event;
	    e.preventDefault();
	  
	    pos1 = pos3 - e.clientX;
	    pos2 = pos4 - e.clientY;
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	 
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	  }

	  function closeDragElement() {
	   
	    document.onmouseup = null;
	    document.onmousemove = null;
	  }
	}
    },
    click_touch:function(id,func){
     	
    document.getElementById(id).innerHTML +='<touch ontouchstart="'+func+'(event)" ontouchend="'+func+'(event)"></touch>';	
     

    },
    set_text: function (id,txt){
      let h = document.getElementById(id);
      return h.innerHTML = txt;	
    },	
    move_touch:function(id){
	
	var dom = {
    container: document.body,
    drag: document.getElementById(id),
	}
	var container = {
	    x: dom.container.getBoundingClientRect().left,
	    y: dom.container.getBoundingClientRect().top,
	    w: dom.container.getBoundingClientRect().width,
	    h: dom.container.getBoundingClientRect().height
	}
	var drag = {
	    w: dom.drag.offsetWidth,
	    h: dom.drag.offsetHeight
	}

	target = null;

	document.body.addEventListener('touchstart', handleTouchStart, false);
	document.body.addEventListener('touchmove', handleTouchMove, false);
	document.body.addEventListener('touchend', handleTouchEnd, false);
	document.body.addEventListener('touchcancel', handleTouchCancel, false);

	function handleTouchStart(e) {
	    if (e.touches.length == 1) {
		var touch = e.touches[0];
		target = touch.target;
	    }
	}
	function handleTouchMove(e) {
	    if (e.touches.length == 1) {
		if(target ===  dom.drag) {
		    moveDrag(e);
		}
	    }
	}
	function handleTouchEnd(e) {
	    if (e.touches.length == 0) { // User just took last finger off screen
		target = null;
	    }
	}
	function handleTouchCancel(e) {
	    return;
	}

	function moveDrag(e) {
	    var touch = e.touches[0];
	    var posX = touch.pageX - container.x - drag.w / 2;
	   
	    

	    dom.drag.style.left = posX + "px";
	    
	}		
    },	
    key_move:function(id,key,key_type,sty,valor,s){
	const nome = document.getElementById(id);
	nome.style.position="absolute";
	document.addEventListener(key_type, function(event) {
	  if (event.keyCode == key) {
	    if(s == "-"){ 	
	    	nome.style.sty = nome.getBoundingClientRect().sty - valor + 'px';
	    }else{
	      nome.style.sty = nome.getBoundingClientRect().sty + valor + 'px';
	    }
	  }
	});
    },
    opacity: function(ob,op){
      let obj = document.getElementById(ob); 	
      obj.style.opacity=op;

   },				 
   camera_2d: function(player){


   },	
   variavel : function(n,v){
	var nome = n;	
	variavel[nome] = v;

    },	
   create_obj : function(obj,id){
		
	document.body.innerHTML += '<'+obj+' id="'+id+'">'+'</'+obj+'>';

    },	
   add_in_obj:function(obj,add){
	document.getElementById(obj).appendChild(document.getElementById(add));	
    },
   id_in_obj:function(obj,nome){
	document.querySelector(obj).id +=" "+nome;
    },		
    camada:function(player,num){
	let obj = document.getElementById(player);	
	obj.style.zIndex=num;
    }, 	
    kill_free : function(player){
	let obj = document.getElementById(player);
	obj.remove();
    },
    calculecolid: function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1)
    },
    
    colidir : function (r0, r1) {
    	return game.calculecolid(r0.left, r0.right, r1.left, r1.right) && game.calculecolid(r0.top, r0.bottom,r1.top, r1.bottom);
    },	
    coord : function(obj){
	return obj.getBoundingClientRect();  

    },
    	
    start : function() {
	
	game.move_touch("parede");
	chaolocal=game.coord(chao);
        playerlocal=game.coord(player);
	powerlocal=game.coord(item);
	paredelocal=game.coord(parede);
	parede1local=game.coord(parede1);

	check_item_in_chao=  game.colidir(chaolocal, powerlocal);
	check_item_in_player=  game.colidir(playerlocal, powerlocal);
	check_parede_in_player=  game.colidir(paredelocal,playerlocal);
	check_parede1_in_player=  game.colidir(parede1local,playerlocal);
	area = powerlocal.width*powerlocal.height;

	
	if(check_parede1_in_player==true){	
		
		lefts = lefts - 1.5;
		
	
		
				
	}else{
	
	player.style.left = (leftAtual + lefts) + 'px'; 
	}

	///item check
	if(powerlocal.right == playerlocal.right){
	 //alert(powerlocal.top +" = "+playerlocal.top );
	  let obj = document.getElementById("life");
	  obj.style.background="red";	
	  obj.style.width -= "5px"		
	}
			
	if( powerlocal.left*2-25 <  playerlocal.left*2 && powerlocal.top < playerlocal.top && pulo==false){		
			
		        //lefts = lefts - 10;
		 	//game.set_text(txt_pontos.id,pontos+1);	
			//game.kill_free("power");
			
			game.camada("player",2); 
			game.camada("power",1); 
		}
	if(check_item_in_player){
		
		pontos-=0.05;	
		Nandraki.create_obj(lifebarra.obj,lifebarra.id,pontos+"px","5px","15px","10px");	
		//alert("vida =" + vida);
		//vida -= 1;
		//if(vida <= 0){
		//game.kill_free("player");
			
	
	}else{

	
	}
	if(check_item_in_chao==true ){	
		
		item.style.top = (topAtual2 + gravidade2 ) + 'px';
			
	}else{
		
	gravidade2 += velocidade2;
		item.style.top = (topAtual2 + gravidade2) + 'px';

        }
		
	///____________
	//player check
	if(game.colidir(chaolocal, playerlocal)){	
		
				
		player.style.left = (leftAtual + lefts) + 'px'; // desloca 5px para a direita	
		player.style.top = (topAtual + velocidade ) + 'px';
		pulo=false;
				
				
	}
	else if(game.colidir(powerlocal, playerlocal)){	
		
				
		player.style.left = (leftAtual + lefts) + 'px'; // desloca 5px para a direita	
		player.style.top = (topAtual + velocidade ) + 'px';
		pulo=false;
				
	}	
	else{
	
	pulo=true;
	if(pulo==true){	
	 if(duplo_pulo == 0 && check_item_in_chao==false ){
		velocidade += gravidade;
		player.style.top = (topAtual + velocidade) + 'px';
		player.style.left = (leftAtual + lefts) + 'px';
			
	 } 

		
	velocidade += gravidade;
	player.style.top = (topAtual + velocidade) + 'px';
	player.style.left = (leftAtual + lefts) + 'px';
	
	
	
	   }	
	  }
	///____________
	///parede check
	if(check_parede_in_player==true){	
		
		lefts = lefts + 0.5;	
		
				
	}else{
	
	player.style.left = (leftAtual + lefts) + 'px'; 
	}
	


	},

     update : function(jogo,fps) {
		
		return setInterval(jogo,fps);
	
	}, 	
}
   
document.querySelector('body').addEventListener('keydown', function(event) {
tecla = event.keyCode;
var esquerda =true;
var direita =true;
	if(tecla == 13) {
	 
	 // tecla ENTER
		
	}
        if(tecla == 27) {
	 // tecla ESC
	 
		
	}
	if(tecla == 65) {
	 corre();
		
	 // seta pra ESQUERDA
	if(check_parede_in_player == true){	
		esquerda = true;
		lefts = lefts + 0;
		pulo=false;
		
			
	}		
		
	else{	
	lefts = lefts - 1.5;
	
	player.style.transform="scaleX(-1)";
	}	
	}
         if(tecla == 87) {
				
	 	
		if(pulo==false){
		
	     	if(topAtual  >=500){
		 velocidade -=150;	
		 player.style.top = (topAtual + velocidade) + 'px';
		 player.style.left = (leftAtual + lefts) + 'px';
                 }
		 if(topAtual >=490){
		  velocidade -=150;	
		  player.style.bottom = (topAtual + velocidade) + 'px';
	          player.style.left = (leftAtual + lefts) + 'px';
                 }
	 	 if(topAtual >=350){
		  velocidade -=150;	
		 player.style.top = (topAtual + velocidade) + 'px';
		 player.style.left = (leftAtual + lefts) + 'px';
                 }
		 if(topAtual >=250){
		 velocidade -=150;	
		 player.style.bottom = (topAtual + velocidade) + 'px';
		 player.style.left = (leftAtual + lefts) + 'px';
                 }
		 if(topAtual >=-200){
		 velocidade -=150;	
		 player.style.top = (topAtual + velocidade) + 'px';
		 player.style.left = (leftAtual + lefts) + 'px';
                 }
		
		}		
	 // seta pra CIMA
	} 
        if(tecla == 68) {
	 // seta pra DIREITA
	
	corre();
	if(check_parede_in_player==true){	
		direita =true;
		lefts = lefts - 0;
		pulo=false;
		
				
	}
	else{	
		lefts = lefts + 1.5;
		
		player.style.transform="scaleX(1)";
	}
	} 
        if(tecla == 40) {
	
 
	}
});


function countTouches(event){
  var x = event.targetTouches.length;
  alert(x);
}
game.click_touch("power",countTouches);
game.update(game.start,5);


</script>



</body>
</html>
