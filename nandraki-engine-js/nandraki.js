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
	canvas = document.getElementById(id);
	document.body.innerHTML += "<canvas id='canvas' width="+width+" height="+height+">";
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
    stop_time : function (myVar){


	return clearTimeout(myVar);

    },
     get_left : function (id){

	
	let x=document.getElementById(id).offsetLeft;
	return x;

    },
    get_top : function (id){

	
	let y=document.getElementById(id).offsetTop;
	return y;

    },		
    moveXD : function (a,id){

	var step=1; 
	var x=document.getElementById(id).offsetLeft;
	if(x < a){
                x= x +step;
                document.getElementById(id).style.left= x + "px"; // horizontal movimento
	}

    },
    moveXE : function (a,id){

	var step=1; 
	var x=document.getElementById(id).offsetLeft;
	if(x > a){
                x= x -step;
                document.getElementById(id).style.left= x + "px"; // horizontal movimento
	}

    },
    timeXD: function(valor,id){
 
	game.moveXD(valor,id);
	var y=document.getElementById(id).offsetTop;
	var x=document.getElementById(id).offsetLeft;
	document.getElementById("msg").innerHTML="X: " + x + " Y : " + y
	timeD=setTimeout('game.timeXD',1000);

    },
    timeXE: function(valor,id){
 
	game.moveXE(valor,id);
	var y=document.getElementById(id).offsetTop;
	var x=document.getElementById(id).offsetLeft;
	document.getElementById("msg").innerHTML="X: " + x + " Y : " + y
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
    click_touch_start:function(id,func){
      
	document.getElementById(id).addEventListener("touchstart", func, false);
	
    },
    click_touch_end:function(id,func){
      
	

    },	
    set_text: function (id,txt){
      let h = document.getElementById(id);
      return h.innerHTML = txt;	
    },	
    move_touch:function(id){
	
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
}
