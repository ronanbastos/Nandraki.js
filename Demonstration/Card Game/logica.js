const ative=2
const returne=5
clickAtive=0
ocult=0

function clickCard(x){

    clickAtive+=1;
 
    if(clickAtive == ative){
        ativeCampo(x)
        game.move_touch_pro(x,"campo")
        game.move_mouse(x)
     

    }else if(clickAtive == returne){
        ativeBag(x)

    }
    if(game.check_colidir("lixo",x)==true){

        game.kill_free(x);

    }
    if(game.check_colidir("contentTooti",x)==true){

        alert(x)
    }

    if(x.includes('player')==true){
        const v =game.random_mf(150);
        if(v<=50){
            v=50
        }
        const id =game.random_mf(10000);
        if(game.check_colidir("contentTooti",x)==true){

            
            game.set_text("hp_txt",v)
        
            game.add_id(x,"id: "+id+"/ vida da carta: "+v)
        }

    }
   
}
function moveCard(x){

    game.move_mouse(x)
    game.move_touch_pro(x,"bagdiv")
    game.type_curso(x,"grabbing")
    

}

function ativeCampo(x){

    game.obj_in_obj("campo",x)

}
function ativeBag(x){

    game.obj_in_obj("bagdiv",x)
    game.move_touch_pro(x,"bagdiv")
    game.move_mouse(x)
    clickAtive=0

}

function ocutarCard(){
    ocult+=1
    if(ocult==1){
        game.display("bagdiv","none")
    }else{

        game.display("bagdiv","block")
        ocult=0
    }
 

}

function soma(){
    let obj=game.get_obj("hp_txt_soma")
    texto1 = game.get_text("hp_txt")
    texto2 = game.get_text("hp_txt_soma")
    if(texto2 == 0){

        obj.style.backgroundColor="rgb(255, 255, 255)";
       
     } 
    
    if(texto2 > 0){

        obj.style.backgroundColor="green";
        game.set_text("hp_txt",texto1+texto2)
      
     }else if(texto2 <= -1){

        obj.style.backgroundColor="red";
        game.set_text("hp_txt",texto1+texto2)
     
     }
}
function createCard(){

        const id =game.random_mf(10000);
        
       game.create_obj_pro("  <img id='card"+id+"'       onmousedown='moveCard(this.id)'  onclick='clickCard(this.id)'  src='mana_verde.png' />")
       ativeBag("card"+id)
 
    
   


}