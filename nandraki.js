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
        console.log("Version[1.3.0]");
	alert("Version[1.3.0]");
	
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
      
	document.getElementById(id).addEventListener("touchstart", func, false);
	
    },
    touch_end:function(id,func){
      
	document.getElementById(id).addEventListener("touchend", func, false);

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
    touch_move:function(id){
      let element = document.getElementById(id);
      element.classList.add("dragme");
      let nodeList = document.getElementsByClassName('dragme');

	for (let i = 0; i < nodeList.length; i++) {
	  let obj = nodeList[i];
	  obj.addEventListener('touchmove', function(event) {
	    let touch = event.targetTouches[0];
	    event.target.style.left = touch.pageX + 'px';
	    event.target.style.top = touch.pageY + 'px';
	    event.preventDefault();
	  }, false);
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
   obj_in_obj:function(obj,add){
	document.getElementById(obj).appendChild(document.getElementById(add));	
    },
   remove_class: function(id,c){
     let element = document.getElementById(id);
     element.classList.remove(c);	
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
   id_in_obj:function(obj,nome){
	document.querySelector(obj).id +=" "+nome;
    },
   get_obj: function(id){
	let element = document.getElementById(id);
	return element;

   },		
    camada:function(player,num){
	let obj = document.getElementById(player);	
	obj.style.zIndex=num;
    }, 	
    kill_free : function(player){
	let obj = document.getElementById(player);
	obj.remove();
    },
    radius: function(radius) {
  	return 2 * Math.PI * radius;
    },
    colidir_aq: function(id1,id2,valor,pulo,check) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2); 	
	    return pulo == false && Math.min(obj2.left*2-valor) >=  Math.min(obj1.left*2) && Math.min(obj2.top) <= Math.min(obj1.top)&& Math.max(obj2.left*2-valor) <=  Math.max(obj1.left*2) && Math.max(obj2.top) <= Math.max(obj1.top+valor) && check==true;		
	  						
		
    },
    colidir_force: function(id1,id2,check_contato) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2);
	    let local1=game.coord(obj1);
	    let local2=game.coord(obj2);		
	    let check_r=local1.right <=local2.right;
	   
	    		
	    return check_r == check_contato && local1.top >= local2.top;
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
