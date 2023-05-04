class Nandraki {

    constructor(id, vida, gravidade, velocidade, massa, di, up, mirror, anim, jump, frame) {
        this.id = id;
        this.vida = vida;
        this.gravidade = gravidade;
        this.velocidade = velocidade;
        this.massa = massa;
        this.di = di;
        this.up = up;
        this.mirror = mirror;
        this.anim = anim;
        this.jump = jump;
        this.frame = frame;
        this.body = document.getElementById(this.id);

    }
	static drop_sprite(id, width, height, left, top, boxl, boxh, imgs) {
		
		  let img = '';
		  
		  for (let i = 0; i < imgs.length; i++) {
			const display = i === 0 ? 'block' : 'none';
			img += `<img id="img[${i}]${id}" style="position:absolute;display:${display}" src="${imgs[i]}" alt=""/>`;
		  }
		  const element = `<div id="${id}" style="width:${width}px;height:${height}px;overflow:hidden;position:absolute;left:${left}px;top:${top}px;">${img}<div id="box_${id}" style="width:${boxl}px;height:${boxh}px;position:absolute;"></div></div>`;
		  document.body.insertAdjacentHTML('beforeend', element);
		
	}
    static create_sprite(id, camadas, img1, img2, img3, img4, img5, width, height, boxl, boxh, left, top) {

        const expr = camadas;
        switch (expr) {
            case 1:
                let html1 = `							  
					<div id="${id}" style="width:${width}px;height:${height}px;overflow: hidden;position:absolute;left:${left}px;top:${top}px;">		
					<img id="img[1]${id}" style="position:absolute;" src="${img1}" alt=""/>
					<div id="box_${id}" style="width:${boxl}px;height:${boxh}px;position:absolute;">
					</div>
					</div> `;
                document.body.innerHTML += html1;
                break;
            case 2:
                let html2 = `			  
					<div id="${id}" style="width:${width}px;height:${height}px;overflow: hidden;position:absolute;">		
					<img id="img[1]${id}" style="position:absolute;" src="${img1}" alt=""/>
					<img id="img[2]${id}" style="position:absolute;" src="${img2}" alt=""/>
					<div id="box_${id}" style="width:${boxl}px;height:${boxh}px;position:absolute;left:${left}px;top:${top}px;">
					</div>
					</div> `;
                document.body.innerHTML += html2;
                break;
            case 3:
                let html3 = `						  
					<div id="${id}" style="width:${width}px;height:${height}px;overflow: hidden;position:absolute;">		
					<img id="img[1]${id}" style="position:absolute;" src="${img1}" alt=""/>
					<img id="img[2]${id}" style="position:absolute;" src="${img2}" alt=""/>
					<img id="img[3]${id}" style="position:absolute;" src="${img3}" alt=""/>
					<div id="box_${id}" style="width:${boxl}px;height:${boxh}px;position:absolute;left:${left}px;top:${top}px;">
					</div>
					</div> `;
                document.body.innerHTML += html3;
                break;
            case 4:
                let html4 = `	  
					<div id="${id}" style="width:${width}px;height:${height}px;overflow: hidden;position:absolute;">		
					<img id="img[1]${id}" style="position:absolute;" src="${img1}" alt=""/>
					<img id="img[2]${id}" style="position:absolute;" src="${img2}" alt=""/>
					<img id="img[3]${id}" style="position:absolute;" src="${img3}" alt=""/>
					<img id="img[4]${id}" style="position:absolute;" src="${img4}" alt=""/>
					<div id="box_${id}" style="width:${boxl}px;height:${boxh}px;position:absolute;left:${left}px;top:${top}px;">
					</div>
					</div> `;
                document.body.innerHTML += html4;
                break;
            case 5:
                let html5 = `
					<div id="${id}" style="width:${width}px;height:${height}px;overflow: hidden;position:absolute;">		
					<img id="img[1]${id}" style="position:absolute;" src="${img1}" alt=""/>
					<img id="img[2]${id}" style="position:absolute;" src="${img2}" alt=""/>
					<img id="img[3]${id}" style="position:absolute;" src="${img3}" alt=""/>
					<img id="img[4]${id}" style="position:absolute;" src="${img4}" alt=""/>
					<img id="img[5]${id}" style="position:absolute;" src="${img5}" alt=""/>
					<div id="box_${id}" style="width:${boxl}px;height:${boxh}px;position:absolute;left:${left}px;top:${top}px;">
					</div>
					</div> `;
                document.body.innerHTML += html5;
                break;
            default:
                console.log(`Erro, camada não encontrada: ${expr}.`);
        }


    }

    static move_obj(id, left, top, fixed) {
        let body = document.getElementById(id);
        if (fixed == true) {
            body.style.position = 'absolute';
            body.style.top = top + "px";
            body.style.left = left + "px";
            body.style.position = 'fixed';
        } else {
            body.style.position = 'absolute';
            body.style.top = top + "px";
            body.style.left = left + "px";

        }
    }

    static create_ui(id, txt, cor) {

        document.body.innerHTML += `<h5 id="${id}"> ${txt}</h5>`;
        game.color(id, cor);
    }

    static move_ui(id, left, top, fixed) {

        let body = document.getElementById(id);
        if (fixed == true) {
            body.style.position = 'absolute';
            body.style.top = top + "px";
            body.style.left = left + "px";
            body.style.position = 'fixed';
        } else {
            body.style.position = 'absolute';
            body.style.top = top + "px";
            body.style.left = left + "px";

        }


    }
    static create_box(id, boxw, boxh, left, top, display) {

        let box = document.getElementById(id);
        let html = `<div id="hit_${id}" style="width:${boxw}px;height:${boxh}px;position:absolute;left:${left}px;top:${top}px;display:${display};">
				  </div> `;
        box.innerHTML += html;

    }
    static ative_box(id, debug) {
        if (game.check_id(id) == true) {
            let box = document.getElementById(id);
            if (debug == true) {


                box.style.borderStyle = "groove";
                box.style.borderWidth = "1px";
                box.style.borderColor = "greenyellow";
                box.style.position = 'absolute';


            }
        }
    }

    static version() {
        console.log("Version[2.5.0]");
        alert("Version[2.5.0]");

    }


}

game = {

    canvas_start: function (id, width, height) {
        document.body.innerHTML += `<canvas id="${id}"  width="${width}" height=${height} > Erro canvas!</canvas>`;

    },
    canvas_text: function (text, font, cor, x, y) {
        if (font == null || font == " ") {
            Nandraki.font = '10px Times New Roman';
        } else {
            Nandraki.font = font;
        }
        Nandraki.fillStyle = cor;
        Nandraki.fillText(text, x, y);

    },
    context: function (id) {
        canvas = document.getElementById(id);
        Nandraki = canvas.getContext('2d');
        return Nandraki;
    },
    canvas_arc: function (x, y, font, b, p) {

        Nandraki.arc(x, y, font, b, p);

    },
    canvas_rect: function (x, y, height, width) {

        Nandraki.rect(x, y, height, width);

    },
    canvas_click: function (func) {

        this.canvas.addEventListener("click", func, false);


    },
    obj: function () {
        let obj = {};
        return obj;
    },
    canvas_clear: function () {
        Nandraki.clearRect(0, 0, canvas.width, canvas.height);
    },
    background_add: function (id, img, arg) {
        let element = document.getElementById(id);
        element.style.background = "url('" + igm + "')" + arg;

    },

    reload: function (ative) {

        return document.location.reload(ative);

    },
    stop_interval: function (mylet) {
        clearInterval(mylet);
    },
    start_interval: function (mylet, time) {

        setInterval(function () {

            mylet

        }, time)
    },
    stop_time: function (mylet) {

        clearTimeout(mylet);

    },
    get_tecla: function (e) {


        console.log(e.code)


    },
    click_som: function (id, link_som) {
        if (game.check_id(id) == true) {
            function play() {
                let audio1 = new Audio();
                audio1.src = link_som;
                audio1.play();
            }
            document.getElementById(id).addEventListener("click", play, false);
        }
    },
    click: function (id, func) {
        if (game.check_id(id) == true) {
            document.getElementById(id).addEventListener("click", func, false);
        }
    },
    click_target: function (id, func) {
        window.onclick = function (event) {
            if (event.target == id) {
                func;
            }
        };
    },
    start_som: function (link_som) {
        function play() {
            let audio = new Audio();
            audio.src = link_som;
            audio.play();
        }
        return play();

    },
    time_som: function (link_som, time) {
        setTimeout(function () {
            let audio = new Audio();
            audio.src = link_som;
            audio.play();

        }, time)


    },
    spawn_sprite: function (id, img, left, top) {

        let html = `				  		
        <img id="${id}" style="position:absolute;left:${left}px;top:${top}px;" src="${img}" />
             `;
        document.body.innerHTML += html;

    },
    maps_canvas: function(id, map, Size, customCases) {
	
	canvas=game.get_obj(id)
    let obj = canvas.getContext("2d");

    canvas.width = map[0].length * Size;
    canvas.height = map.length * Size;

    // Loop pelo mapa
    map.forEach(function(row, rowIndex) {
      
      row.split("").forEach(function(cell, cellIndex) {
      
        let x = cellIndex * Size;
        let y = rowIndex * Size;
      
        if (customCases[cell]) {
         
          customCases[cell](obj, x, y, Size);
        } else {
        
          obj.fillStyle = "white";
          obj.fillRect(x, y, Size, Size);
        }
      });
    });
	
	},

    set_src: function (obj,link) {

         return obj.srcset=link

    },	
	
    img_size: function (id, sizeX, sizeY) {
        document.getElementById(id).style.width = sizeX + "px";
        document.getElementById(id).style.height = sizeY + "px";

    },
    fixed: function (id) {

        document.getElementById(id).style.position = "fixed";
    },
    start_time: function (func, time) {
        setInterval(function () {

            func

        }, time);
    },

    bd_save: function (speed, value) {

        localStorage.setItem(speed, value);


    },
    bd_load: function (speed) {

        const val = localStorage.getItem(speed);
        return val;

    },
    bd_remove: function (speed) {

        localStorage.removeItem(speed);

    },
    bd_clear: function (speed) {

        localStorage.clear();

    },
    call_modal: function(id,text1,text2,text3,func){

        let text = text1;
        if (confirm(text) == true) {
          text =text2;
          func
        } else {
          text = text3;
        }
        document.getElementById(id).innerHTML = text;

    },
    img_frame: function (id, img_id, width, height, fm, fis, ffe, fr) {
        if (game.check_id(id) == true) {
            if ("img[1]" + id == img_id) {
                //console.log("camada 1")
                document.getElementById("img[1]" + id).style.display = "block";

                if (document.getElementById("img[2]" + id)) {

                    document.getElementById("img[2]" + id).style.display = "none";
                }
                if (document.getElementById("img[3]" + id)) {

                    document.getElementById("img[3]" + id).style.display = "none";
                }
                if (document.getElementById("img[4]" + id)) {

                    document.getElementById("img[4]" + id).style.display = "none";
                }
                if (document.getElementById("img[5]" + id)) {

                    document.getElementById("img[5]" + id).style.display = "none";
                }

            } else if ("img[2]" + id == img_id) {

                //console.log("camada 2")
                document.getElementById("img[1]" + id).style.display = "none";

                document.getElementById("img[2]" + id).style.display = "block";

                if (document.getElementById("img[3]" + id)) {

                    document.getElementById("img[3]" + id).style.display = "none";
                }
                if (document.getElementById("img[4]" + id)) {

                    document.getElementById("img[4]" + id).style.display = "none";
                }
                if (document.getElementById("img[5]" + id)) {

                    document.getElementById("img[5]" + id).style.display = "none";
                }


            } else if ("img[3]" + id == img_id) {

                //console.log("camada 3")
                document.getElementById("img[1]" + id).style.display = "none";

                document.getElementById("img[2]" + id).style.display = "none";

                document.getElementById("img[3]" + id).style.display = "block";

                if (document.getElementById("img[4]" + id)) {

                    document.getElementById("img[4]" + id).style.display = "none";
                }
                if (document.getElementById("img[5]" + id)) {

                    document.getElementById("img[5]" + id).style.display = "none";
                }


            } else if ("img[4]" + id == img_id) {

                //console.log("camada 4")
                document.getElementById("img[1]" + id).style.display = "none";

                document.getElementById("img[2]" + id).style.display = "none";

                document.getElementById("img[3]" + id).style.display = "none";

                document.getElementById("img[4]" + id).style.display = "block";

                if (document.getElementById("img[5]" + id)) {

                    document.getElementById("img[5]" + id).style.display = "none";
                }


            } else if ("img[5]" + id == img_id) {

                //console.log("camada 5")

                document.getElementById("img[1]" + id).style.display = "none";

                document.getElementById("img[2]" + id).style.display = "none";

                document.getElementById("img[3]" + id).style.display = "none";

                document.getElementById("img[4]" + id).style.display = "none";

                document.getElementById("img[5]" + id).style.display = "block";
            }

            let img_frame = document.getElementById(img_id);

            let frame_inicio = fis; //10 	
            let frame_math = fm; //6	
            let largura = width; //64	
            let altura = height; //64
            let frame_final = ffe; //15
            let frame_rest = fr; //10

            let linha = Math.floor(frame_inicio / frame_math) * altura;
            let coluna = frame_inicio % frame_math * largura;

            img_frame.style.marginTop = -linha + 'px';
            img_frame.style.marginLeft = -coluna + 'px';
        }
    },
    animar_left: function (id, mi, ma, time) {

        document.getElementById(id).animate([{
            animationDirection: "alternate"
        },
        {
            left: mi + "px"
        },
        {
            left: ma + "px"
        },
        {
            animationDirection: "alternate"
        }
        ], {

            duration: time,
            iterations: Infinity

        });

    },
    animar_top: function (id, mi, ma, time) {

        document.getElementById(id).animate([{
            animationDirection: "alternate"
        },
        {
            top: mi + "px"
        },
        {
            top: ma + "px"
        },
        {
            animationDirection: "alternate"
        }
        ], {

            duration: time,
            iterations: Infinity

        });

    },
    pixeled: function (id) {

        document.getElementById(id).imageRendering = "pixelated";

    },
    jump_force: function (id, mi, ma, cont) {

        document.getElementById(id).animate([{
            animationDirection: "alternate"
        },
        {
            top: mi + "px"
        },
        {
            top: ma + "px"
        },
        {
            animationDirection: "alternate"
        }
        ], {


            duration: cont,
            iterations: 1

        });

    },
    get_mouse_x: function () {

        function tellPos(p) {
            return p.pageX;
        }
        addEventListener('mousemove', tellPos, false);


    },
    fonte_size: function (id, size) {
        let x = document.getElementById(id);
        x.style.fontSize = size + "px";

    },
    color: function (id, cor) {
        let x = document.getElementById(id);
        x.style.color = cor;

    },
    get_mouse_y: function (y) {
        onmousemove = function (e2) {

            console.log("mouse location X:", e1.clientY)
            return e2.clientY;


        }

    },
    get_left: function (id) {

        if (game.check_id(id) == true) {
            let x = document.getElementById(id).offsetLeft;
            return x;
        }
    },
    get_tx: function (id) {
        if (game.check_id(id) == true) {
            const style = window.getComputedStyle(document.getElementById(id))
            let matrix = new WebKitCSSMatrix(style.transform)
            return matrix.m41
        }

    },
    get_ty: function (id) {
        if (game.check_id(id) == true) {
            const style = window.getComputedStyle(document.getElementById(id))
            let matrix = new WebKitCSSMatrix(style.transform)
            return matrix.m42
        }
    },
    get_top: function (id) {

        if (game.check_id(id) == true) {
            let y = document.getElementById(id).offsetTop;
            return y;
        }
    },
    moveX_rest: function (a, rest, id) {

        let step = 5;

        let x = document.getElementById(id).offsetLeft;
        //document.getElementById("msg").innerHTML="X: " + x;

        if (x > a) {
            x = x - step;
            document.getElementById(id).style.left = x + "px";
        } else {
            x = x + step + rest;
            document.getElementById(id).style.left = x + "px";
        }

    },
    speed_row: function (id, start, velocidade) {

        let step = 5;
        let x = document.getElementById(id).offsetLeft;

        if (x > start) {
            x = x + step + velocidade;
            document.getElementById(id).style.left = x + "px";
        }

    },
    moveXD: function (a, id) {

        let step = 5;
        let x = document.getElementById(id).offsetLeft;
        if (x < a) {
            x = x + step;
            document.getElementById(id).style.left = x + "px";
        }

    },
    moveXE: function (a, id) {

        let step = 5;
        let y = document.getElementById(id).offsetTop;
        let x = document.getElementById(id).offsetLeft;
        //document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
        if (x > a) {
            x = x - step;
            document.getElementById(id).style.left = x + "px"; // horizontal movimento
        }

    },

    timeXD: function (valor, id) {

        game.moveXD(valor, id);
        let y = document.getElementById(id).offsetTop;
        let x = document.getElementById(id).offsetLeft;
        //document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
        timeD = setTimeout('game.timeXD', 1000);
        fim = setTimeout(clearTimeout(timeD), 1100)
    },
    timeXE: function (valor, id) {

        game.moveXE(valor, id);
        let y = document.getElementById(id).offsetTop;
        let x = document.getElementById(id).offsetLeft;
        //document.getElementById("msg").innerHTML="X: " + x + " Y : " + y;
        timeE = setTimeout('game.timeXE', 1000);



    },

    force_obj: function (id, x, y, rotate) {
        if (game.check_id(id) == true) {
            let element = document.getElementById(id);
            if (rotate == null) {

                element.style.transform = "translate3d(" + x + "px," + y + "px, 0px)";

            }
            if (rotate == true) {

                element.style.transform = "translate3d(" + x + "px," + y + "px, 0px) rotateY(180deg)";

            } else {

                element.style.transform = "translate3d(" + x + "px," + y + "px, -0px) rotateY(0deg)";

            }
        }
    },
    scaleX: function (id, valor) {
        let obj = document.getElementById(id);
        obj.style.transform = "scaleX(" + valor + ")";
    },
    load: function (valor) {
        return window.location.href = valor;
    },
    load_time: function (valor, time) {
        setTimeout(function () {
            window.location.href = valor;
        }, time);


    },
    hover_mouse: function (id) {
        let div = document.getElementById(id);
        div.addEventListener('mouseenter', function () {
            return true;
        }, false);

    },

    move_mouse: function (id) {

        dragElement(document.getElementById(id));
        document.getElementById(id).style.position = 'absolute';

        function dragElement(elmnt) {
            let pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
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

    touch_start: function (id, func) {

        document.getElementById(id).addEventListener("touchstart", func, true);

    },
    touch_end: function (id, func) {

        document.getElementById(id).addEventListener("touchend", func, true);

    },
    ative_touch: function () {

        return document.body.style.touchAction = "auto";

    },
    transform: function (id, x, y, rota) {

        let element = document.getElementById(id);
        element.style.transform = `translate3d(" ${x} "px," ${y}"px, 0px) rotate(${rota}deg)`;




    },
    wrap_text: function (id) {

        return document.getElementById(id).style.wordWrap = "break-word";

    },
    touch_long: function (id, func, t) {

        let onlongtouch;
        let timer;
        let touchduration = t;

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


        document.addEventListener("DOMContentLoaded", function (event) {
            document.getElementById(id).addEventListener("touchstart", touchstart, false);
            document.getElementById(id).addEventListener("touchend", touchend, false);
        });



    },

    move_touch: function (id) {
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
            obj.addEventListener('touchmove', function (event) {
                let touch = event.touches[0];
                posX = touch.pageX - container.x - drag.w / 2;
                posY = touch.pageY - container.y - drag.h / 2;
                element.style.left = posX + "px";
                element.style.top = posY + "px";
                event.preventDefault();
            }, false);
        }
    },
    move_touch_pro: function (id_item, id_container) {

        document.getElementById(id_item).style.position = 'absolute';

        let dom = {
            container: document.getElementById(id_container),
            drag: document.getElementById(id_item),
        }
        let container = {
            x: dom.container.getBoundingClientRect().left,
            y: dom.container.getBoundingClientRect().top,
            w: dom.container.getBoundingClientRect().width,
            h: dom.container.getBoundingClientRect().height
        }
        let drag = {
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
                let touch = e.touches[0];
                target = touch.target;
            }
        }

        function handleTouchMove(e) {
            if (e.touches.length == 1) {
                if (target === dom.drag) {
                    moveDrag(e);
                }
            }
        }

        function handleTouchEnd(e) {
            if (e.touches.length == 0) {
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
    display: function (id, dispatchEvent) {
        if (game.check_id(id) == true) {
            document.getElementById(id).style.display = dispatchEvent;
        }
    },
    range_damage: function (id, speed, limit, value) {
        if (value == "+" || value == "negativo") {
            if (game.check_id(id) == true) {
                speed += 10
                game.force_obj(id, speed, 0, false);
                if (speed >= limit) {

                    return true;

                }
            }

        }
        if (value == "-" || value == "positivo") {
            if (game.check_id(id) == true) {
                speed -= 10
                game.force_obj(id, speed, 0, false);

                if (speed >= limit) {

                    return true;

                }
            }
        }




    },
    remove_all: function (selector) {

        let myObj = document.querySelectorAll(selector);
        i = 0,
            l = myObj.length;

        for (i; i < l; i++) {
            myObj[i].remove();
        }

    },
    none_all: function (selector) {

        let myObj = document.querySelectorAll(selector),
            i = 0,
            l = myObj.length;

        for (i; i < l; i++) {
            myObj[i].style.display = 'none';
        }


    },
    block_all: function (selector) {

        let myObj = document.querySelectorAll(selector),
            i = 0,
            l = myObj.length;

        for (i; i < l; i++) {
            myObj[i].style.display = 'block';
        }


    },
    random_m: function (ma, mi, s) {

        return Math.random() * (ma - mi) + s;

    },
    create_go: function () {
        texto = game.get_text("text");
        num = game.random_mf(1500, 5, 5);

        Maps.create("sprite_", num, texto);
        texto = "";
        game.camada("drag", 1500);

    },
    random_mf: function (max) {

        return Math.floor(Math.random() * max + 1);

    },
    log_key: function () {

        log = document.getElementById('body');

    },
    log_down: function (func) {

        document.addEventListener('keydown', func);
    },
    log_up: function (func) {

        document.addEventListener('keyup', func);
    },
    opacity: function (id, op) {
        let obj = document.getElementById(id);
        obj.style.opacity = op;

    },
    type_curso: function (id, type) {
        let obj = document.getElementById(id);
        obj.style.cursor = type;
    },
    get_input: function (id) {

        let input = document.getElementById(id);
        let texto = input.value;
        return texto;

    },
    fixed_body: function (zoom) {
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.position = "absolute";
        document.body.style.overflow = "hidden";
        document.body.style.zoom = zoom;
        document.body.style.scrollBehavior = "smooth";
    },
    camera: function (specto, x, y, xLimit, yLimit) {
        if (specto == "2d" || specto == "2D") {

            if (x >= xLimit || y >= yLimit) {

            } else {

                window.scroll(x, y);

            }

        } else if (specto == "canvas:2d" || specto == "canvas:2D") {

            if (x >= xLimit || y >= yLimit) {

            }

        } else {

            console.log("alerta_size:specto");
        }



    },
    camera_move: function (id=[], x) {
        id.forEach(myFunction);
        function myFunction(item) {
        document.getElementById(item).style.transform = `translateX(${x}px)`;
        } 
    },
    print: function (p) {

        return alert(p);

    },
    speed: function (n, v) {
        let nome = n;
        speed[nome] = v;

    },
    create_obj_pro: function (obj) {

        document.body.innerHTML += obj;

    },
    create_obj: function (obj, id) {

        document.body.innerHTML += '<' + obj + ' id="' + id + '">' + '</' + obj + '>';

    },
    fpsFrame: function (obj, func, fps) {

        obj.fpsFrame++
        if (obj.fpsFrame == fps) {
            func
            obj.fpsFrame = -1
        }

    },
    frame_sprite: function (name, src, context, width, height, frameIndex, row, tickCount, ticksPerFrame, frames) {

        name = {
            context: context,
            src: src,
            width: width,
            height: height,
            frameIndex: frameIndex,
            row: row,
            tickCount: tickCount,
            ticksPerFrame: ticksPerFrame,
            frames: frames,
            ative: true
        }




        return name;



    },
    update_sprite: function (obj) {


        if (obj.tickCount > obj.ticksPerFrame) {
            obj.tickCount = 0;
            if (obj.frameIndex < obj.frames - 1) {
                obj.frameIndex++;
            } else {
                obj.frameIndex = 0;
            }
        }

        obj.tickCount++;

    },
    render_sprite: function (obj, context, x, y) {

        const image = new Image();
        image.src = obj.src;
        context.drawImage(
            image,
            obj.frameIndex * obj.width, // The x-axis coordinate of the top left corner
            obj.row * obj.height, // The y-axis coordinate of the top left corner
            obj.width, // The width of the sub-rectangle
            obj.height, // The height of the sub-rectangle
            x, // The x coordinate
            y,// The y coordinate
            obj.width, // The width to draw the image
            obj.height // The width to draw the image

        );
        game.update_sprite(obj)
    },
    img_canvas: function (context, obj, src, x, y, width, height, ative) {

        obj = {
            x: x,
            y: y,
            ative: ative
        }
        if (obj.ative == true) {

            obj = new Image()
            obj.src = src
            // imagem,XiniRecorte,YiniRecorte,LRecorte,Arecorte,posX,posY,LarguraImagem,AlturaImagem // 
            context.drawImage(obj, x, y, width, height);

        }

        return obj
    },
    obj_in_obj: function (obj, id) {
        document.getElementById(obj).appendChild(document.getElementById(id));
    },
    remove_class: function (id, obj) {
        let element = document.getElementById(id);
        element.classList.remove(obj);
    },
    get_window_w: function () {
        return window.innerWidth;
    },

    get_window_h: function () {

        return window.innerHeight;
    },
    responsive_img: function (id) {

        return game.img_size(id, game.get_window_w(), game.get_window_h())
    },
    move_responsive(id, x, y) {

        Nandraki.move_obj(id, game.get_window_w() / 2 / 5 + x, game.get_window_h() / 2 + y, true)
    },
    bar: function (id, height, cor) {

        let html = `<div id="bar_${id}" style=" width: 1%;height:${height}px;background-color:${cor};">
        </div> `;
        document.body.innerHTML += html;

    },
    bar_update: function (id, size) {

        var elem = document.getElementById(id);
        return elem.style.width = size + "px";

    },
    class_in_obj: function (obj, add) {
        let element = document.getElementById(obj);
        element.classList.add(add);
    },
    ball_border: function (id, rad) {
        let element = document.getElementById(id);
        element.style.borderRadius = rad + "%";

    },
    id_in_obj_min: function (obj, nome) {
        document.querySelector(obj).id += nome;
    },
    id_in_obj_max: function (obj, nome) {
        document.querySelector(obj).id += " " + nome + " ";
    },
    id_two_in_obj: function (obj, nome1, nome2) {
        document.querySelector(obj).id += " " + nome1 + " " + nome2;
    },
    get_obj: function (id) {
        let element = document.getElementById(id);
        return element;

    },
    camada: function (id, num) {
        if (game.check_id(id) == true) {
            let obj = document.getElementById(id);
            obj.style.zIndex = num;
        }
    },
    kill_free: function (id) {
        let obj = document.getElementById(id);
        if (game.check_id(id) == true) {
            obj.remove();
        }

    },
    animar_obj: function (id, css, time) {
        let obj = document.getElementById(id);
        x = css;
        obj.animate(x, time);
    },
    text_bot: function (id, vel) {
        function typeWrite(elemento) {
            const textoArray = elemento.innerHTML.split('');
            elemento.innerHTML = ' ';
            textoArray.forEach(function (letra, i) {

                setTimeout(function () {
                    elemento.innerHTML += letra;
                }, vel * i)

            });
        }
        const titulo = document.getElementById(id);
        typeWrite(titulo);

    },
    touchpad: function (id, left, top) {

        let html = `<div id="move-base" style="width:256px;height:256px; position: absolute; left:${left}px; top:${top}px; ">
					<div id="base-stick" style="border: 1px solid black;border-radius:100%; width:128px;height:128px; position: absolute; left:64px; top:64px; ">	
						<div id="stick" style=" display: block;background: black;border-radius:100%; height: 64px;width:64px; background: radial-gradient(circle at 100px 100px, #F52D02, #801D08);  left:32px; top:32px;">	
						</div>		
					</div>
					</div>`;

        document.getElementById(id).innerHTML += html;
        document.getElementById("stick").style.position = 'absolute';
        document.getElementById("stick").style.width = "50%";
        document.getElementById("stick").style.height = "50%";
        let dom = {
            container: document.getElementById("base-stick"),
            drag: document.getElementById("stick"),
        }
        let container = {
            x: dom.container.getBoundingClientRect().left,
            y: dom.container.getBoundingClientRect().top,
            w: dom.container.getBoundingClientRect().width,
            h: dom.container.getBoundingClientRect().height
        }
        let drag = {
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
                let touch = e.touches[0];
                target = touch.target;
            }
        }

        function handleTouchMove(e) {
            if (e.touches.length == 1) {
                if (target === dom.drag) {
                    moveDrag(e);
                }
            }
        }

        function handleTouchEnd(e) {
            if (e.touches.length == 0) {
                target = null;
                dom.drag.style.left = "32px";
                dom.drag.style.top = "32px";
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

        dragElement(document.getElementById("stick"));
        document.getElementById("stick").style.position = 'absolute';

        function dragElement(elmnt) {
            let pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
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
                dom.drag.style.left = "32px";
                dom.drag.style.top = "32px";
            }
        }

    },

    get_text: function (id) {

        let get_text = parseInt(document.getElementById(id).textContent);
        return parseInt(get_text);

    },
    set_text: function (id, txt) {
        let h = document.getElementById(id);
        return h.innerHTML = txt;
    },
    edite_text: function (id, text) {

        document.getElementById(id).textContent = text;

    },
    modal: function (id, text, FontSize, height, width, posX, posY, left, top, func) {
        if (game.check_id(id) == false) {
            let html = `
            <div id="${id}" style="position: absolute;
            background-color: #ccc;top:${posY}px;left:${posX}px;
            height:${height}px;width:${width}px; border: thick  groove #d3d3d3;">
        <p id="text_${id}" style=" position: absolute;
            left:1${left}px;
            top:${top}px;   font-family:Courier New;font-size:${FontSize}px;">${text}</p>
            <p id="btn_${id}" style=" font-size:${FontSize}px;background-color: #ccc; position: absolute;top:${top / 2 + 11.5}px;left:${width + 5}px;cursor:pointer;border: #d3d3d3;">▼</p>
        </div>
            `;

            document.body.innerHTML += html;
            document.getElementById(id).style.zIndex = 100;
            game.click("btn_" + id, func);

        }

    },
    clock_time: function (m, s, valor) {

        let segundos = 0;
        let minutos = 0;

        function segundo() {
            //incrementa os segundos
            segundos++;
            if (segundos == 60) {
                //incrementa os minutos
                minutos++;
                //Zerar os segundos
                segundos = 0;
                //escreve os minutos
                document.getElementById(m).innerHTML = minutos
            }
            //escreve os segundos
            document.getElementById(s).innerHTML = segundos

        }

        setInterval(function () {

            segundo();
            if (valor == minutos) {

                return true;

            }
        }, 1000)
        /*
           ex html
          <div id="clock">
            <span id="minuto">00</span><span>:</span><span id="segundo">00</span>
           </div>
          */


    },
    check_id: function (id) {

        if (document.getElementById(id)) {
            return true;
        } else {
            return false;
        }
    },
    objH: function (id) {
        return parseInt(game.get_obj(id).style.height)
    },
    objW: function (id) {
        return parseInt(game.get_obj(id).style.width)
    },
    move_parent: function (id) {
        let div_p = document.getElementById(id);
        div_p.appendChild(obj.parentElement);


    },
    create_clone_animate: function (id, obj, css, time) {
        obj.innerHTML += '<div id="obj_' + id + '"></div>';
        let clone = document.getElementById("obj_" + id);
        x = css;
        clone.animate(x, time);
    },
    clone_obj_move: function (id, obj) {


        let seuNode = document.getElementById(id);
        let clone = seuNode.cloneNode(true);
        obj.appendChild(clone);

    },
    clone_obj: function (id) {
        let seuNode = document.getElementById(id);
        let clone = seuNode.cloneNode(true);
        return clone;
    },

    radius: function (radius) {
        return 2 * Math.PI * radius;
    },
    check_colidir: function (id1, id2) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {

            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(id1);
            let local2 = game.coord(id2);
            check_r = game.colidir(local1, local2);
            return check_r;
        }




    },
    gravity: function (obj = { up: 0, velocidade: 0, gravidade: 0.05, id: "player_id" }, target_id = [], force_jump = 5, bonce_bool = false, bounce_value = 0.8) {
        target_id.forEach(myFunction);
        function myFunction(item) {
            const colidir = game.check_colidir(obj.id, item)
            if (colidir == true) {
                if(game.get_top(item)>=game.get_ty(obj.id)){
                    obj.up = game.get_top(item) - game.objH(obj.id)
                   
                }else if(game.get_top(item)<game.get_ty(obj.id) && game.get_left(item)<game.get_tx(obj.id)  ){
                    pulo -= 1;     
                    obj.up -= 50+game.get_top(item) - game.objH(obj.id)
                    x-=game.objw(item)/game.get_tx(obj.id) 
                    obj.dir-=game.objw(item)/game.get_tx(obj.id) 
                }
               
                obj.velocidade = force_jump;
                pulo = 2;
                if (bonce_bool == true) {
                    obj.velocidade = -(obj.velocidade * bounce_value);
                }

            } else {

                game.force_gravity(obj, target_id)


            }
        }


    },
    force_gravity: function (obj = { up: 0, velocidade: 0.50 }, target_arry = []) {
        obj.up += obj.velocidade;
        target_arry.forEach(myFunction);
        function myFunction(item) {
            if (game.check_colidir(obj.id, item) == false) {
                obj.velocidade += obj.gravidade*0.5;

            }


        }

    },
    gravity_targetM: function (obj, target, bounce,force) {
    
        obj.up += obj.velocidade;
        var rockbottom = target;
        if (obj.up >= rockbottom) {

            obj.up = rockbottom;
            obj.velocidade = 5
            pulo = 1
            if (bounce == true) {
                obj.velocidade = -(obj.velocidade * force);
            }


        } else {


            obj.velocidade += obj.gravidade;


        }

    },
    gravity_targetF: function (obj, target, bounce, force, func) {

        obj.up += obj.velocidade;
        var rockbottom = target;
        if (obj.up >= rockbottom) {

            obj.up = rockbottom;
            obj.velocidade = 5;
            pulo = 1;
            if (bounce == true) {
                obj.velocidade = -(obj.velocidade * force);
            }

            return func;

        } else {


            obj.velocidade += obj.gravidade;


        }

    },
    jump: function (obj = { up: 0, velocidade: 0.50,gravitySpeed:0.5 },force=25,gravidade=1) {
        obj.up -= force+obj.velocidade*2;
        obj.gravitySpeed = -(obj.gravitySpeed + obj.velocidade* gravidade);
        obj.velocidade  =  -( obj.velocidade - obj.gravitySpeed  * gravidade);
        
    },
    colidir_obj: function (id1 = "obj_id", id2 = "obj_id") {

        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            if (game.check_colidir(id1, id2) == true) {

                return true;

            } else {

                return false;
            }

        }

    },
    Rel_distanica: function (x1, y1, x2, y2, v, t,erro) {
  
			  //d é a distância relativa
			  //dx é a diferença de posição entre os objetos
			  //dy é a diferença de posição entre os objetos
			  //v é a velocidade
			  //t é o tempo decorrido
			 
			  const dx = x2 - x1;
			  const dy = y2 - y1;
			  const vt = v * t;
			  return Math.sqrt((dx - vt)*(dx - vt) + dy*dy)-erro;

    },
    colidir_aq: function (id1, id2, valor, pulo, check) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            return pulo == false && Math.min(obj2.left * 2 - valor) >= Math.min(obj1.left * 2) && Math.min(obj2.top) <= Math.min(obj1.top) && Math.max(obj2.left * 2 - valor) <= Math.max(obj1.left * 2) && Math.max(obj2.top) <= Math.max(obj1.top + valor) && check == true;
        }

    },
    right_check: function (id1, id2) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(obj1);
            let local2 = game.coord(obj2);
            let check_r = local1.offsetRight < local2.offsetRight;
        }
        return check_r;
    },
    top_up_check: function (id1, id2) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(obj1);
            let local2 = game.coord(obj2);
            let check_t = local1.offsetTop >= local2.offsetTop;
        }
        return check_t;
    },

    top_down_check: function (id1, id2) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(obj1);
            let local2 = game.coord(obj2);
            let check_t = local1.offsetTop < local2.offsetTop;

            return check_t;
        }
    },
    left_check: function (id1, id2) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(obj1);
            let local2 = game.coord(obj2);
            let check_l = local1.offsetLeft > local2.offsetLeft;

            return check_l;
        }
    },
    colidir_force_r: function (id1, id2, check_contato) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(obj1);
            let local2 = game.coord(obj2);
            let check_r = local1.right <= local2.right;


            return check_r == check_contato && local1.top >= local2.top;
        }
    },
    colidir_force_l: function (id1, id2, check_contato) {
        if (game.check_id(id1) == true && game.check_id(id2) == true) {
            let obj1 = document.getElementById(id1);
            let obj2 = document.getElementById(id2);
            let local1 = game.coord(obj1);
            let local2 = game.coord(obj2);
            let check_l = local1.left <= local2.left;
            return check_l == check_contato && local1.top >= local2.top;
        }
    },
    colidir_cal: function (min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    },

    colidir: function (r0, r1) {
        return game.colidir_cal(r0.left, r0.right, r1.left, r1.right) && game.colidir_cal(r0.top, r0.bottom, r1.top, r1.bottom);
    },
    coord: function (id) {
        if (game.check_id(id) == true) {
            let obj = document.getElementById(id);
            return obj.getBoundingClientRect();
        }
    },

    rest: (game, canvas) => requestAnimationFrame(game, canvas),
    loop: (game, canvas) => requestAnimationFrame(game, canvas),
    update: (jogo, fps) => setInterval(jogo, fps),

}
