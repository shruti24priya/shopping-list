const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter =document.getElementById("filter");
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemFromStorage = getItemsFromStorage();
    if(itemFromStorage !== null)
    {
        itemFromStorage.forEach((item) => addItemToDom(item));
    }
    checkUi();
}

 function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;

    if (newItem.value === ''){
        alert('Please add an item');
        return;
}

   if(isEditMode){
    const itemToEdit =itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode =false;
   } else{
    if(checkIfItemExists(newItem)) {
        alert('That item already exists!');
        return;
    }
   }
   addItemToDom(newItem);

   addItemToStorage(newItem);
    
    checkUi();
    itemInput.value ='';
}

 function addItemToDom(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button);
    itemList.appendChild(li);
 }

function addItemToStorage(item){
    const itemFromStorage = getItemsFromStorage();
    console.log(itemFromStorage)
    itemFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemFromStorage) );
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}
 function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
 }
 function removeItem(item){
    if(confirm('Are you sure?')){
         item.remove();
       
    removeItemFromStorage(item.textContent);
    
    checkUi();
    }
  }


function getItemsFromStorage (){
    let itemFromStorage;
    if (localStorage.getItem('items') === null){
        itemFromStorage =[];
    }
    else{
        itemFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemFromStorage;

}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target);
    }
}
function checkIfItemExists(item){
    const itemFromStorage = getItemsFromStorage();

    return itemFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
   // item.style.color = '#ccc';
   item.classList.add('edit-mode');
   formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
   formBtn.style.backgroundColor = '#228B22';
   itemInput.value = item.textContent;
}

function removeItemFromStorage(item){
    let itemFromStorage = getItemsFromStorage();

    itemFromStorage = itemFromStorage.filter((i) =>i !== item);

    localStorage.setItem('items',JSON.stringify(itemFromStorage));
}

function clearItems(e){
    while (itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    localStorage.removeItem('items');

    checkUi();
}
function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    
    items.forEach(item =>{
        const itemName = item.firstChild.textContent.toLowerCase();
       
        if (itemName.indexOf(text) !=-1) {
            item.style.display ='flex';
        }
        else{
            item.style.display ='none';
        }
    }
    );

}

function checkUi(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
  
    if (items.length === 0) {
        clearBtn.style.display ='none';
        itemFilter.style.display ='none';
    } else{
        clearBtn.style.display = 'block';
        itemFilter.style.display ='block';
    }
    formBtn.innerHTML ='<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
}

function init(){
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItems);
itemFilter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded',displayItems);

checkUi();
}
init();