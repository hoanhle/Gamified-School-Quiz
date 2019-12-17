function toggle(n) {
    var menus = document.getElementsByClassName("submenu");
    for(var i=0;i<menus.length;i++){
        if((i == (n)) && (menus[i].style.display != "block")){
            menus[i].style.display = "block";
        }else{
            menus[i].style.display = "none";
        }
    } 
}

