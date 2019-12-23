/*
    A function to toggle the visibility of questions in the aside bar.
*/
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

/*
    A function that creates new options in the 
    webpage forms.
*/
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

/*
    A simple search function for searching both questions
    and questionnaires.
*/
function search() {
    const input = document.getElementById('search');
    const filter = input.value.toUpperCase();
    const titles = document.getElementsByClassName('top_li')
    let value, a, i, j, li, question, found;

    for (i = 0; i < titles.length; i++){
        li = titles[i];
        name = titles[i].getElementsByTagName('a')[0].innerText;
        questions = titles[i].getElementsByTagName('li');
        found = false;
        for(j = 0; j < questions.length; j++){
            question = questions[j].textContent;
            if(question.toUpperCase().search(filter) > -1){
                found = true;  
            }
        }
        if (name.toUpperCase().search(filter) > -1 || found) {
            li.style.display = "";
        } else {
            li.style.display = "none"; 
        }
    }
}
