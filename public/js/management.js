/* jshint esversion:6 */
function toggle(n) {
  let menus = document.getElementsByClassName("submenu");
  for (let i=0;i<menus.length;i++){
    if ((i == (n)) && (menus[i].style.display != "block")){
      menus[i].style.display = "block";
    }else{
      menus[i].style.display = "none";
    }
  } 
}


function addAnswer(){
  let fakes = document.getElementById("fake_ans");
  let div = document.createElement("div");
  let ans = document.createElement("input");
  let label = document.createElement("label");
  
  label.for = fakes.children.length+2;
  label.innerText = "Answer: ";
  div.className = "col-sm-5";
  ans.id = fakes.children.length+2;
  ans.name = fakes.children.length+2;

  div.append(label);
  div.appendChild(ans);

  fakes.append(div);
}


function toggleTitleEdit(){
  let form = document.getElementById('edit_title');
  if (form.style.display === 'none'){
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}
