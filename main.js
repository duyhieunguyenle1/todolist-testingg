var taskList = document.querySelector('.task_list');
var addBtn = document.querySelector('.btn_add');
var inputAdd = document.querySelector('#exampleFormControlInput1');
var filterSelect = document.querySelector('.filterSelect');
var classLi = ["list-group","list-group-horizontal","rounded-0","mb-3","show"];
var tempList = [];
var isEditable = false;
const todoList = 'todoList';
var storage = JSON.parse(localStorage.getItem(todoList))||[];

// add button
addBtn.addEventListener('click',addElement);
inputAdd.addEventListener('keypress',(e)=>{
  if(e.keyCode==13)addElement();
});

// date picker
function dueDate(value){
  addElement(value);
}

// add function
function addElement(value=''){
  let inputValue = inputAdd.value.trim();
  if(!inputValue)alert('Please add task!')
  else if(inputValue&&(value instanceof PointerEvent || value==''))alert('Please select due date!');
  else if(inputValue&&value){
    handleTask(inputValue,value);
    // localStorage
    setConfig(inputValue,value);
  }
}

// text effect when clicking
function textEffect(){
  this.closest('.list-group').querySelector('#flexCheckChecked1').checked=!this.closest('.list-group').querySelector('#flexCheckChecked1').checked;
  let checkInput = this.closest('.list-group').querySelector('#flexCheckChecked1').checked;
  if(checkInput){
    isEditable = true;
    this.setAttribute('status','checked');
    this.style.textDecoration = 'line-through';
    this.classList.add('text-muted','completed');
  }else{
    isEditable = false;
    this.setAttribute('status','unchecked');
    this.style.textDecoration = 'none';
    this.classList.remove('text-muted');
  }
}

// add prefix
Number.prototype.pad = function(size){
  let s = String(this);
  while(s.length < (size||2))s="0"+s;
  return s;
}

// localStorage
function setConfig(key,due,dayCreate = new Date()){
  let temp = {};
  temp["task"]=key;
  temp["dueDay"]=due;
  temp["createDay"]=dayCreate;
  if(!(storage.includes(temp,0)))storage.push(temp);
  localStorage.setItem(todoList,JSON.stringify(storage));
}

window.onload = () =>{
  for(let i in storage){
    handleTask(storage[i].task,new Date(storage[i].dueDay),new Date(storage[i].createDay));
  }
}

// handle events
function handleTask(task,due,dayCreate = new Date()){
    // add elements
    var li = document.createElement('li');
    li.classList.add(...classLi);
    li.innerHTML = `
    <div class="form-check d-flex align-items-center">
        <input class="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1"
          aria-label="..."/>
      </div>
    <div class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
      <p class="lead fw-normal mb-0 c edit-paragraph" status="unchecked">${task}</p>
    </div>
    <div class="list-group-item ps-3 pe-0 py-2 rounded-0 border-0 bg-transparent pr-0">
      <div class="d-flex flex-row justify-content-end">
        <a href="#!" class="text-info mr-2 btn-edit" data-mdb-toggle="tooltip" title="Edit todo"><i
            class="fas fa-pencil-alt me-3"></i></a>
        <a href="#!" class="text-danger btn-delete" data-mdb-toggle="tooltip" title="Delete todo"><i
            class="fas fa-trash-alt"></i></a>
      </div>
      <div class="d-flex text-end text-muted">
        <a href="#!" class="text-muted mr-3" data-mdb-toggle="tooltip" title="Created date">
          <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${dayCreate.getDate().pad()}/${(dayCreate.getMonth()+1).pad()}/${dayCreate.getFullYear()}</p>
        </a>
        <a href="#!" class="text-muted" data-mdb-toggle="tooltip" title="Due date">
          <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${due.getDate().pad()}/${(due.getMonth()+1).pad()}/${due.getFullYear()}</p>
        </a>
      </div>
    </div>`
    taskList.appendChild(li);
    inputAdd.value="";
    // store default values
    tempList.push(li);

    // elements
    let btnDelete = li.querySelector('.btn-delete');
    let btnEdit = li.querySelector('.btn-edit');
    let paragraph = li.querySelector('.edit-paragraph');

    // delete function
    btnDelete.addEventListener('click',function(){
      this.closest('.list-group').remove();
      removeStorage(task,due,dayCreate);
    })

    // add text effect
    paragraph.classList.add('cursor-pointer');
    paragraph.addEventListener('click',textEffect);

    // edit text
    btnEdit.addEventListener('click',function(){
      // getEditArea
      let editText = this.closest('.list-group').querySelector('.edit-paragraph');

      // editable text
      editText.classList.remove('cursor-pointer');
      editText.setAttribute("contentEditable","true");
      editText.focus();
      
      // disable text effect
      if(isEditable)paragraph.click();
      editText.removeEventListener('click',textEffect);

      // when pressing enter
      editText.addEventListener('keydown',function(e){
        if(e.keyCode == 13){
          if(this.innerHTML == ""){
            this.closest('.list-group').remove();
            removeStorage(task,due,dayCreate);
          }
          else {
            storage.forEach((e,i)=>{
              if(e["task"]==task&&new Date(e.dueDay).getTime()==due.getTime()&&new Date(e.createDay).getTime()==dayCreate.getTime()){
                storage[i]["task"]=editText.innerHTML;
                task=editText.innerHTML;
                console.log(task);
                localStorage.setItem(todoList,JSON.stringify(storage));
              }
            })
            this.innerHTML = this.innerHTML.trim();
            this.removeAttribute("contentEditable");
            this.classList.add('cursor-pointer');
            this.addEventListener('click',textEffect);
          }
        }
      })
    })
}

// filter feature
filterSelect.addEventListener('change',function(){
  // selectedIndex return index you choose in filter
  valueType(this.selectedIndex);
})

function valueType(filterIndex){
  let valueLists = taskList.querySelectorAll('.list-group .edit-paragraph');
  let lists = Array.from(taskList.children);
  let dueList = [],sortList;

  // reset default values
  while(taskList.firstChild)taskList.removeChild(taskList.firstChild);
  if(filterIndex == 0){
    // add default values;
    taskList.append(...tempList);

    valueLists.forEach(valueList=>{
      let assignment = valueList.closest('.list-group').classList;
      
      // filter add
      assignment.remove('hide');
      assignment.add('show');
    })
  }else if(filterIndex == 1){
    // add default values;
    taskList.append(...tempList);

    valueLists.forEach(valueList=>{
      let assignment = valueList.closest('.list-group').classList;
      
      // reset list
      assignment.remove('show');
      assignment.add('hide');
      
      // filter completed
      if(valueList.getAttribute('status')=="checked"){
        assignment.remove('hide');
        assignment.add('show');
      }
    })
  }else if(filterIndex == 2){
    // add default values;
    taskList.append(...tempList);

    valueLists.forEach(valueList=>{
      let assignment = valueList.closest('.list-group').classList;
      
      // reset list
      assignment.remove('show');
      assignment.add('hide');
      
      //filter active
      if(valueList.getAttribute('status')=="unchecked"){
        assignment.remove('hide');
        assignment.add('show');
      }
    })
  }else {
    for(let i of lists){
      dueList.push(i);
    }
    sortList = dueList.sort((li1,li2)=>{
      const date1=new Date(li1.querySelector('a[title="Due date"]').textContent);
      const date2=new Date(li2.querySelector('a[title="Due date"]').textContent);
    
      return date2 > date1 ? 1 : -1;
    })
    taskList.append(...sortList);
    dueList.forEach((valueList)=>{
      let assignment = valueList.classList;
            
      assignment.remove('hide');
      assignment.add('show');
    })
  }
}

// find the one in storage that equal to deleted element and then remove it in storage
function removeStorage(task,due,dayCreate){
  storage.forEach((e,i)=>{
    if(e["task"]==task&&new Date(e.dueDay).getTime()==due.getTime()&&new Date(e.createDay).getTime()==dayCreate.getTime()){
      storage.splice(i,1);
      localStorage.setItem(todoList,JSON.stringify(storage));
    }
  })
}