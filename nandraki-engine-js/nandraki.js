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
	setTimeout('func',time); 
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
	
    },
    timeXE: function(valor,id){
 
	game.moveXE(valor,id);
	var y=document.getElementById(id).offsetTop;
	var x=document.getElementById(id).offsetLeft;
	//document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
	timeE=setTimeout('game.timeXE',1000);
	
	        
	
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
    touch_start:function(id,func){
      
	document.getElementById(id).addEventListener("touchstart", func, false);
	
    },
    touch_end:function(id,func){
      
	document.getElementById(id).addEventListener("touchend", func, false);

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
    move_key:function(id,func,updown){
	const nome = document.getElementById(id);
	document.addEventListener(updown, func);
    },
    opacity: function(ob,op){
      let obj = document.getElementById(ob); 	
      obj.style.opacity=op;

   },				 
   camera_2d: function(player){


   },
   print: function(p){
	
     return alert(p);
	
   }, 	
   variavel : function(n,v){
	var nome = n;	
	variavel[nome] = v;

    },	
   create_objById : function(obj,id){
		
	document.body.innerHTML += '<'+obj+' id="'+id+'">'+'</'+obj+'>';

    },		
   obj_in_obj:function(obj,add){
	document.getElementById(obj).appendChild(document.getElementById(add));	
    },
   remove_class: function(id,c){
     let element = document.getElementById(id);
     element.classList.remove(c);	
   },
   get_window_W:function(){
     let w = window.innerWidth;
     return w;
   }, 
   get_window_H:function(){
     let h = window.innerHeight;
     return h;
   },
   class_in_obj: function(obj,add){
     let element = document.getElementById(obj);
     element.classList.add(add);
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
    radius: function(radius) {
  	return 2 * Math.PI * radius;
    },
    colidir_calQL: function(id1,id2,valor,pulo,check) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2); 	
	    return pulo == false && Math.min(obj2.left*2-valor) <=  Math.min(obj1.left*2) && Math.min(obj2.top) <= Math.min(obj1.top)&& Math.max(obj2.left*2-valor) <=  Math.max(obj1.left*2) && Math.max(obj2.top) <= Math.max(obj1.top+valor) && check==true;		
	  						
		
    },
    colidir_calQR: function(id1,id2,valor,pulo,check) {
	    let obj1 = document.getElementById(id1);
	    let obj2 = document.getElementById(id2); 	
	    return pulo == false && obj2.right*2-valor <=  obj1.right*2 && obj2.top <= obj1.top && check==true;
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
