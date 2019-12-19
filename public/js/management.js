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
  let label = document.createElement("label");
  let labelHint = document.createElement("label");
  

  //name formating options[4][option]
  // Setting label
  label.for = fakes.children.length+2;
  label.innerText = "Answer: ";
  // Setting ans
  ans.id = fakes.children.length+2;
  ans.name = "options[" + fakes.children.length+2 +"][option]";
  // Setting hint
  hint.id = "hint" + fakes.children.length+2;
  hint.name= "options[" + fakes.children.length+2 +"][hint]";
  // Hint label
  labelHint.for = hint.id;
  labelHint.innerText = "Hint(optional): ";

  // Setting div
  div.className = "col-sm-5";
  div.append(label);
  div.appendChild(ans);
  
  // Setting hint div
  hintDiv.className = "col-sm-5";
  hintDiv.append(labelHint);
  hintDiv.append(hint);

  fakes.append(div);
  fakes.append(hintDiv);
}


function toggleTitleEdit(){
  let form = document.getElementById('edit_title');
  if (form.style.display === 'none'){
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}
