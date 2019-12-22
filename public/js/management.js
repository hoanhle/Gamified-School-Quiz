function toggle(n) {
    const menus = document.getElementsByClassName('submenu');
    for (let i=0;i<menus.length;i++){
        if ((i === (n)) && (menus[i].style.display !== 'block')){
            menus[i].style.display = 'block';
        }else{
            menus[i].style.display = 'none';
        }
    } 
}


function addAnswer(){
    const fakes = document.getElementById('fake_ans');
    const div = document.createElement('div');
    const hintDiv = document.createElement('div');
    const ans = document.createElement('input');
    const hint = document.createElement('input');
    const checkbox = document.createElement('input');
    const checkDiv= document.createElement('div');
  

    const n = fakes.children.length / 3 + 1;
    // Setting ans
    ans.id = n;
    ans.name = `options[${ n }][option]`;
    // Setting hint
    hint.id = `hint${  n}`;
    hint.name= `options[${  n }][hint]`;
    // Check box
    checkbox.type= 'checkbox';
    checkbox.name= `options[${  n }][correctness]`;

    // Setting div
    div.className = 'col-sm-5';
    div.appendChild(ans);
  
    // Setting hint div
    hintDiv.className = 'col-sm-5';
    hintDiv.append(hint);
  
    // Setting check div
    checkDiv.className =' col-sm';
    checkDiv.append(checkbox);

    fakes.append(div);
    fakes.append(hintDiv);
    fakes.append(checkDiv);
}


function toggleTitleEdit(){
    const form = document.getElementById('edit_title');
    if (form.style.display === 'none'){
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function search() {
/*
// Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("questionaires_ul");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
*/

    var input = document.getElementById('search');
    var filter = input.value.toUpperCase();
    var titles = document.getElementsByClassName('top_li')
    var value, a, i, j, li;

    for (i = 0; i < titles.length; i++){
        li = titles[i];
        name = titles[i].getElementsByTagName('a')[0].innerText;
        if (name.toUpperCase().search(filter) > -1) {
            li.style.display = "";
        } else {
            li.style.display = "none"; 
        }
    }
}
