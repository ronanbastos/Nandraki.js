class Nandraki {
    constructor(obj,id,txt,grav,vel,mas) {
        this.obj = obj;
        this.id = id;
	this.txt = txt;
	document.body.innerHTML += '<'+this.obj+' id="'+this.id+'">'+txt+'</'+this.obj+'>';
	this.body=document.getElementById(this.id);	
	this.gravidade =grav;
	this.velocidade =vel;
	this.massa=mas;	
	
    }

    static create_obj(id,width,height,top,left) {
        let obj = document.getElementById(id);
	obj.style.width = width;
	obj.style.height = height;
	obj.style.border = "solid 1px";
	obj.style.top = top;
	obj.style.left = left;
	obj.style.position = 'absolute';
	
    }
    static create_ui(id,width,height,top,left) {
        let obj = document.getElementById(id);
	obj.style.width = width;
	obj.style.height = height;
	obj.style.top = top;
	obj.style.left = left;
	obj.style.position = 'absolute';
	
    }	
    static version(){
        console.log("Version[1.3.2]");
	alert("Version[1.3.2]");
	
    }		
    		
  	 	
}


game = {
    canvas_start: function(id,width,height){
	document.body.innerHTML += "<canvas id='canvas' width="+width+" height="+height+">";	
	canvas = document.getElementById(id);
	return nandraki = canvas.getContext('2d');
   },
   canvas_text : function(text,font,cor,x,y) {
	if(font == null || font == " ")
	{	
	nandraki.font = '20pt Calibri';
	}else{
	nandraki.font = font;
        }
        nandraki.fillStyle = cor;
	nandraki.fillText(text,x,y);
		
    },
	
    canvas_arc: function(x,y,font,b,p){
     
	nandraki.arc(x, y,font,b,p);
	
    },	
    canvas_clear: function(){
     nandraki.clearRect(0, 0, canvas.width, canvas.height);	
    },  
    sprite_add: function(id,img,arg){
       let element = document.getElementById(id);
       element.style.background="url('"+igm+"')"+arg;
     
    }, 
    reload: function(ative){
    
    return document.location.reload(ative);
     
    },
    stop_interval(myVar){
     clearInterval(myVar);
    }, 
    start_interval(myVar,time){
     setInterval(myVar,time);
    },			
    stop_time : function (myVar){

	clearTimeout(myVar);

    },
    som_play: function(id,link_som){
	    function play(){
	    var audio1 = new Audio();
	    audio1.src = link_som;
	    audio1.play();
		}
		document.getElementById(id).addEventListener("click",play, false);

	},		
    start_time: function (func,time){
	setTimeout(func,time); 
    },    
    animar_left : function (id,mi,ma,time){

	document.getElementById(id).animate([
	  {animationDirection:"alternate"},
	  { left: mi+"px" },
	  { left: ma+"px" },
	  {animationDirection:"alternate"}
	], {
	  
	  duration: time,
	  iterations: Infinity
	   
	});

    },
    animar_top : function (id,mi,ma,time){

	document.getElementById(id).animate([
	  {animationDirection:"alternate"},
	  { top: mi+"px" },
	  { top: ma+"px" },
	  {animationDirection:"alternate"}
	], {
	  
	  duration: time,
	  iterations: Infinity
	   
	});

    },			
     jump_force : function (id,valor,time){

	document.getElementById(id).animate([
	  { top: valor+"px" },
	  { animationFillMode:"forwards"}
	], {
	  
	  duration: time,
	  iterations: 1
	   
	});

    },
    get_mouse_x: function(){
	

    },
    get_mouse_y: function(y){
       
	
    },	
    get_left : function (id){

	
	let x=document.getElementById(id).offsetLeft;
	return x;

    },
	
    get_top : function (id){

	
	let y=document.getElementById(id).offsetTop;
	return y;

    },
    moveX_rest : function (a,rest,id){

	var step=5;
	
	var x=document.getElementById(id).offsetLeft;
	//document.getElementById("msg").innerHTML="X: " + x;

	if(x > a){
                x= x - step;
                document.getElementById(id).style.left= x + "px"; 
	}else{
	  x= x + step + rest;
          document.getElementById(id).style.left= x + "px";
	}
	
    },		
    moveXD : function (a,id){

	var step=5; 
	var x=document.getElementById(id).offsetLeft;
	if(x < a){
                x= x +step;
                document.getElementById(id).style.left= x + "px"; 
	}

    },
    moveXE : function (a,id){

	var step=5;
	var y=document.getElementById(id).offsetTop; 
	var x=document.getElementById(id).offsetLeft;
	//document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
	if(x > a){
                x= x - step;
                document.getElementById(id).style.left= x + "px"; // horizontal movimento
	}
	
    },
    timeXD: function(valor,id){
 
	game.moveXD(valor,id);
	var y=document.getElementById(id).offsetTop;
	var x=document.getElementById(id).offsetLeft;
	//document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
	timeD=setTimeout('game.timeXD',1000);
	fim=setTimeout(clearTimeout(timeD),1100)
    },
    timeXE: function(valor,id){
 
	game.moveXE(valor,id);
	var y=document.getElementById(id).offsetTop;
	var x=document.getElementById(id).offsetLeft;
	//document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
	timeE=setTimeout('game.timeXE',1000);
	
	        
	
    },
    force_obj: function(id,x,y,rotate){
	let element = document.getElementById(id);
	if(rotate==true){

	   element.style.transform="translate3d("+x+"px,"+y+"px, 0px) rotateY(180deg)";
	
	}else{
	
	   element.style.transform="translate3d("+x+"px,"+y+"px, -0px) rotateY(0deg)";
	
	}
    },	 

    scaleX:function(id,valor){
	let obj = document.getElementById(id);
	obj.style.transform="scaleX("+valor+")";	 
    },
    load:function(valor){
	return window.location.href=valor;	 
    },
    load_time:function(valor,time){
	setTimeout(function() {
          window.location.href = valor;
	}, time);

    
    },
    hover_mouse: function(id){
	const isHover = e => e.parentElement.querySelector(':hover') === e;    
	const myDiv = document.getElementById(id);
	document.addEventListener('mousemove', function checkHover() {
	  const hovered = isHover(myDiv);
	  if (hovered !== checkHover.hovered) {
	    return true;
	    checkHover.hovered = hovered;
	  }
	});
   },  		
    move_mouse: function(id){
	
	dragElement(document.getElementById(id));
	document.getElementById(id).style.position = 'absolute';
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
    touch_start:function(id,func){
      
	document.getElementById(id).addEventListener("touchstart", func, true);
	
    },
    touch_end:function(id,func){
      
	document.getElementById(id).addEventListener("touchend", func, true);

    },
    ative_touch:function(){
      
	return document.body.style.touchAction="auto";

    },
    touch_long:function(id,func,t){
	
	var onlongtouch; 
	var timer;
	var touchduration = t; //length of time we want the user to touch before we do something

	function touchstart(e) {
	    e.preventDefault();
	    if (!timer) {
		timer = setTimeout(onlongtouch, touchduration);
	    }
	}

	function touchend() {
	    //stops short touches from firing the event
	    if (timer) {
		clearTimeout(timer);
		timer = null;
	    }
	}

	onlongtouch = func;
	

	document.addEventListener("DOMContentLoaded", function(event) { 
	    document.getElementById(id).addEventListener("touchstart", touchstart, false);
	    document.getElementById(id).addEventListener("touchend", touchend, false);
	});



    },
    click_start:function(id,func){
      
	document.getElementById(id).addEventListener("click",func, false);

    },	
    move_touch:function(id){
      let element = document.getElementById(id);
      element.classList.add("dragme");
	 var dom = {
       container: document.body
	}
	 var container = {
	    x: dom.container.getBoundingClientRect().left,
	    y: dom.container.getBoundingClientRect().top,
	    w: dom.container.getBoundingClientRect().width,
	    h: dom.container.getBoundingClientRect().height
    } 	
	 var drag = {
   	  w: element.offsetWidth,
   	  h: element.offsetHeight
	}
      let nodeList = document.getElementsByClassName('dragme');

	for (let i = 0; i < nodeList.length; i++) {
	  let obj = nodeList[i];
	  obj.addEventListener('touchmove', function(event) {
	    let touch = event.touches[0];
	    posX = touch.pageX - container.x - drag.w / 2;
         posY = touch.pageY - container.y - drag.h / 2;	
	    element.style.left = posX + "px"; 
	    element.style.top = posY + "px";
	    event.preventDefault();
	  }, false);
       }
    },
    move_touch_imbut:function(id_item,id_container){
	
		document.getElementById(id_item).style.position = 'absolute';  
	     document.getElementById(id_item).style.width= "50%";
    		document.getElementById(id_item).style.height= "50%";
		var dom = {
		    container: document.getElementById(id_container),//document.body,
		    drag: document.getElementById(id_item),
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
			touch = e.touches[0];
			posX = touch.pageX - container.x - drag.w / 2;
			posY = touch.pageY - container.y - drag.h / 2;
		    

		    dom.drag.style.left = posX + "px";
		    dom.drag.style.top = posY + "px";
		    	 
		}
    },  	 
    random_m: function(ma,mi,s){
    
       return Math.random() * (ma-mi) + s;
       
    },
    random_mf: function(ma,mi,s){
    
       return Math.floor(Math.random() * (ma-mi) + s);
       
    },
   	
    set_text: function (id,txt){
      let h = document.getElementById(id);
      return h.innerHTML = txt;	
    },	
    log_key:function(){
	
	log = document.getElementById('body');
	
    },		
    log_down:function(func){
	
	document.addEventListener('keydown', func);
    },
    log_up:function(func){
	
	document.addEventListener('keyup', func);
    },	
    opacity: function(ob,op){
      let obj = document.getElementById(ob); 	
      obj.style.opacity=op;

   },				 
   camera_2d: function(obj){


   },
   print: function(p){
	
     return alert(p);
	
   }, 	
   variavel : function(n,v){
	var nome = n;	
	variavel[nome] = v;

    },	
   create_obj : function(obj,id){
		
	document.body.innerHTML += '<'+obj+' id="'+id+'">'+'</'+obj+'>';

    },
     ia_left: function(obj1,obj2,id,dis,v){
		
	if(obj1.left >= obj2.left){
		document.getElementById(id).animate([
		  // keyframes
		  {animationDirection:"alternate"},
		  { left: obj1.left+dis+"px" }
		
		], {
		  // timing options
		  duration: v,
		  iterations: Infinity
		 
		});
	}else{
		document.getElementById(id).animate([
		  // keyframes
		  
		  { left: obj1.left-dis+"px" }
		
		], {
		  // timing options
		  duration: v,
		  iterations: Infinity
		 
		});
	}
    },
    ia_top: function(obj1,obj2,id,dis,v){
		
	if(obj1.top >= obj2.top){
		document.getElementById(id).animate([
		  // keyframes
		  {animationDirection:"alternate"},
		  { top: obj1.top+dis+"px" }
		
		], {
		  // timing options
		  duration: v,
		  iterations: Infinity
		 
		});
	}else{
		document.getElementById(id).animate([
		  // keyframes
		  
		  { top: obj1.top-dis+"px" }
		
		], {
		  // timing options
		  duration: v,
		  iterations: Infinity
		 
		});
	}
    },	 						
   obj_in_obj:function(obj,id){
	document.getElementById(obj).appendChild(document.getElementById(add));	
    },
   remove_class: function(id,obj){
     let element = document.getElementById(id);
     element.classList.remove(obj);	
   },
   get_window_w:function(){
     let w = window.innerWidth;
     return w;
   },
  	 
   get_window_h:function(){
     let h = window.innerHeight;
     return h;
   },
   class_in_obj: function(obj,add){
     let element = document.getElementById(obj);
     element.classList.add(add);
   },
   ball_border: function(id,rad){
	let element = document.getElementById(id);
	element.style.borderRadius= rad+"%";

   },		
   id_in_obj_min:function(obj,nome){
	document.querySelector(obj).id +=nome;
    },
    id_in_obj_max:function(obj,nome){
	document.querySelector(obj).id +=" "+nome;
    },
    id_in_two_obj:function(obj,nome1,nome2){
	document.querySelector(obj).id +=" "+nome1+" "+nome2;
    },	
   get_obj: function(id){
	let element = document.getElementById(id);
	return element;

   },		
    camada:function(player,num){
	let obj = document.getElementById(player);	
	obj.style.zIndex=num;
    }, 	
    kill_free : function(id){
	let obj = document.getElementById(id);
	obj.remove();
    },
    animar_obj:function(id,css,time){
	let obj = document.getElementById(id);
	x=css;
	obj.animate(x,time);	
    },
    text_bot:function(id,txt,vel){
		let content = txt;
		let text = document.getElementById('text');

		let speed = vel;
		let cont = 0;

		function typeWriter () {
		  if(cont < content.length){
		    text.textContent += content.charAt(cont);
		    cont++;
		    setTimeout(typeWriter, speed);
		  }else{
		    text.textContent = '';
		    cont = 0;
		    typeWriter();
		  }
		}

		typeWriter();

	

	
	},
    get_text:function(id){

	 let get_text = document.getElementById(id).textContent;	
	 return get_text;

	},
     edite_text: function(id,text){
	
	document.getElementById(id).textContent = text;

	},	
    clock_time: function(m,s,valor){
		  	
		  let segundos = 0;
            let minutos = 0;
            	
            function segundo(){
                //incrementa os segundos
                segundos++;
                if(segundos==60){
                    //incrementa os minutos
                    minutos++;
                    //Zerar os segundos
                    segundos=0;
                    //escreve os minutos
                    document.getElementById(m).innerHTML=minutos
                }
                //escreve os segundos
                document.getElementById(s).innerHTML=segundos
                
            }	
            setInterval(function(){

			segundo();
			if(valor==minutos){
			
			return true;	

			}
		  },1000)
		   /*
		   ex html
		  <div id="clock">
		    <span id="minuto">00</span><span>:</span><span id="segundo">00</span>
	       </div>
	      */

	 
    },
    id_check: function(id){
	
	if (document.getElementById(id)) {
	    return true;
	} else {
	   return false;
	}
    },
    move_parent: function(id){
     let div_p = document.getElementById(id);
	div_p.appendChild(this.parentElement);
	

   },
   create_clone_animate: function(id,obj,css,time){
     obj.innerHTML += '<div id="obj_'+id+'"></div>';		
	let clone = document.getElementById("obj_"+id);
	x=css;
	clone.animate(x,time);	
   },
   clone_obj_move: function(id,obj){

	
	let seuNode = document.getElementById(id);
     let clone   = seuNode.cloneNode(true); 
     obj.appendChild(clone);

   },	
   clone_obj: function(id){
   	let seuNode = document.getElementById(id);
     let clone   = seuNode.cloneNode(true);
	return clone;
   },

    radius: function(radius) {
  	return 2 * Math.PI * radius;
    },
    colidir_aq: function(id1,id2,valor,pulo,check) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2); 	
	    return pulo == false && Math.min(obj2.left*2-valor) >=  Math.min(obj1.left*2) && Math.min(obj2.top) <= Math.min(obj1.top)&& Math.max(obj2.left*2-valor) <=  Math.max(obj1.left*2) && Math.max(obj2.top) <= Math.max(obj1.top+valor) && check==true;		
	  						
		
    },
    r_check: function(id1,id2) {

	let obj1 = document.getElementById(id1);
	let obj2 = document.getElementById(id2);
     let local1 = game.coord(obj1);
	let local2 = game.coord(obj2);	 
	let check_r = local1.offsetRight < local2.offsetRight;
	
	return check_r;
	},
     l_check: function(id1,id2) {

	let obj1 = document.getElementById(id1);
	let obj2 = document.getElementById(id2);
     let local1 = game.coord(obj1);
	let local2 = game.coord(obj2);	 
	let check_r = local1.offsetLeft > local2.offsetLeft;
	
	return check_r;
	},
    colidir_force_r: function(id1,id2,check_contato) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2);
	    let local1 = game.coord(obj1);
	    let local2 = game.coord(obj2);		
	    let check_r = local1.right  <=local2.right ;
	   
	    		
	    return check_r == check_contato && local1.top >= local2.top;
    },
    colidir_force_l: function(id1,id2,check_contato) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2);
	    let local1 = game.coord(obj1);
	    let local2 = game.coord(obj2);		
	    let check_l = local1.left <=local2.left;
	   
	    		
	    return check_l == check_contato && local1.top >= local2.top;
    },		
    colidir_cal: function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    },
    
    colidir : function (r0, r1) {
    	return game.colidir_cal(r0.left, r0.right, r1.left, r1.right) && game.colidir_cal(r0.top, r0.bottom,r1.top, r1.bottom);
    },	
    coord : function(obj){
	return obj.getBoundingClientRect();  

    },
    update : function(jogo,fps) {
		
		return setInterval(jogo,fps);
		
    }, 		
}
