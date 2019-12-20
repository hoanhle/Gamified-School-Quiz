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
  let hintDiv = document.createElement("div");
  let ans = document.createElement("input");
  let hint = document.createElement("input");
  let checkbox = document.createElement("input");
  let checkDiv= document.createElement("div");
  

  let n = fakes.children.length / 2 +2;
  // Setting ans
  ans.id = n;
  ans.name = "options["+ n +"][option]";
  // Setting hint
  hint.id = "hint" + n;
  hint.name= "options[" + n +"][hint]";
  // Check box
  checkbox.type= "checkbox";
  checkbox.name= "options[" + n +"][correctness]";

  // Setting div
  div.className = "col-sm-5";
  div.appendChild(ans);
  
  // Setting hint div
  hintDiv.className = "col-sm-5";
  hintDiv.append(hint);
  
  // Setting check div
  checkDiv.className =" col-sm";
  checkDiv.append(checkbox);

  fakes.append(div);
  fakes.append(hintDiv);
  fakes.append(checkDiv);
}


function toggleTitleEdit(){
  let form = document.getElementById('edit_title');
  if (form.style.display === 'none'){
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}
