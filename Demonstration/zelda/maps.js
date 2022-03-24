lefts=0;
tops=0;

class Maps {
    
    constructor() {
         	
	let html=`<div class="removeSavel" id="drag" style="position:absolute;">
	<div id="moverD" style="position:absolute;float:left;top:10px;left:260px;">
	►
	</div>
	<div id="moverE" style="position:absolute;float:left;top:10px;left:-5px;">
	◄
	</div>
	<div id="moverDown" style="position:absolute;float:left;top:65px;left:110px;">
	▼
	</div>
	<div id="moverUp" style="position:absolute;float:left;top:-10px;left:110px;">
	▲
	</div>
	<div id="salve" style="position:absolute;float:left;top:45px;left:270px;">
	[salvar]
	</div>
    <div  style="position:absolute; width:250px; border-style:groove; margin-left:5px; border-width:5px; border-color:Slategray;background-color:Lightgray;">
    <div style="height:20px;border-style:groove;border-width:5px;">
     Add Sprite
    </div>
    <div id="text" contenteditable="true" style="margin-top:5px;  COLOR:#ffffff; margin-left:5px;width:175px;background-color:#878787; border-style:groove; float:left; border-width:1px; border-color:greenyellow;">      
     
    </div>
  
    <button id="go_create" >Create</button>
    <div style="height:10px;">
    </div>
    </div>`;	
	 document.body.innerHTML +=html;
	let test1 = document.getElementById("moverD");
	let test2 = document.getElementById("moverE");
	let test3 = document.getElementById("moverUp");
	let test4 = document.getElementById("moverDown");
	let editor = document.getElementById("drag");
	


	test1.addEventListener("mouseenter", function( event ) {
	  // highlight the mouseenter target
	  lefts=lefts+50;
	 editor.style.left = lefts + "px";


	}, false);

	test2.addEventListener("mouseenter", function( event ) {

	 lefts=lefts-50;
	 editor.style.left = lefts + "px";
	  // reset the color after a short delay

	}, false);

	test3.addEventListener("mouseenter", function( event ) {
	  // highlight the mouseenter target
	 tops=tops-50;
	 editor.style.top = tops + "px";
	  // reset the color after a short delay

	}, false);


	test4.addEventListener("mouseenter", function( event ) {
	  // highlight the mouseenter target
	 tops=tops+50;
	 editor.style.top = tops + "px";
	  // reset the color after a short delay
	}, false);
    }
   static mouse(id){
	
	dragElement(document.getElementById(id));
	document.getElementById(id).style.position = 'absolute';
	function dragElement(elmnt) {
	  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
    }
    static touch(id){
      let element = document.getElementById(id);
      element.classList.add("dragme");
	 let dom = {
       container: document.body
	}
	 let container = {
	    x: dom.container.getBoundingClientRect().left,
	    y: dom.container.getBoundingClientRect().top,
	    w: dom.container.getBoundingClientRect().width,
	    h: dom.container.getBoundingClientRect().height
    } 	
	 let drag = {
   	  w: element.offsetWidth,
   	  h: element.offsetHeight
	}
      let nodeList = document.getElementsByClassName('dragme');

	for (let i = 0; i < nodeList.length; i++) {
	  let obj = nodeList[i];
	  obj.addEventListener('touchmove', function(event) {
	    let touch = event.touches[0];
	    let posX = touch.pageX - container.x - drag.w / 2;
              let posY = touch.pageY - container.y - drag.h / 2;	
	    element.style.left = posX + "px"; 
	    element.style.top = posY + "px";
	    event.preventDefault();
	  }, false);
       }
    }
     static create(id,x,link){
	
	
	let html=`
	 	<div id="${id+x}" style="position:absolute;">		
		<img style="position:absolute;" src="${link}" alt="Erro!"/>
	 	</div> `;	
	document.body.innerHTML +=html;
	Maps.mouse(id+x);
	Maps.touch(id+x);	
	 
	let test1 = document.getElementById("moverD");
	let test2 = document.getElementById("moverE");
	let test3 = document.getElementById("moverUp");
	let test4 = document.getElementById("moverDown");
	let editor = document.getElementById("drag");
	

	test1.addEventListener("mouseenter", function( event ) {
	  // highlight the mouseenter target
	  lefts=lefts+50;
	 editor.style.left = lefts + "px";


	}, false);

	test2.addEventListener("mouseenter", function( event ) {

	 lefts=lefts-50;
	 editor.style.left = lefts + "px";
	  // reset the color after a short delay

	}, false);

	test3.addEventListener("mouseenter", function( event ) {
	  // highlight the mouseenter target
	 tops=tops-50;
	 editor.style.top = tops + "px";
	  // reset the color after a short delay

	}, false);


	test4.addEventListener("mouseenter", function( event ) {
	  // highlight the mouseenter target
	 tops=tops+50;
	 editor.style.top = tops + "px";
	  // reset the color after a short delay
	}, false);
	
	
    }
    static salveRemove(){
    
   

	    let myObj = document.querySelectorAll(".removeSavel");
	    i = 0;
	    l = myObj.length;

	    for (i; i < l; i++) {
		   myObj[i].remove();
	    }

		
    
    
    }
    static get_text(id){

	 let get_text = document.getElementById(id).textContent;	
	 return get_text;

	}
    static random_mf(ma,mi,s){
       return Math.floor(Math.random() * (ma-mi) + s); 
    }
}



