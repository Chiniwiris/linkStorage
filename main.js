//const
let elementos = [];
let editable = false;
let editKey = null;
const $add_btn = document.querySelector('#add-btn');
const $close_btn = document.querySelector('#close-btn');
const $edit_add_slider = document.querySelector('.edit-add-slider');
const $titulo = document.getElementById('titulo');
const $imagen = document.getElementById('img');
const $url = document.getElementById('url');
const $genero = document.getElementById('genero');
const $confirm_btn = document.querySelector('.confirm-btn');
const $genderSelect = document.querySelector('#gender-select');
const $searchBar = document.querySelector('#search-bar');
console.log($searchBar, 'value :' + $searchBar.value);
const generos = ['Shounen', 'Seinen', 'Terror', 'Comedia', 'Isekai', 'Psicología', 'Mega', 'Mediafire', 'Peliculas', 'Series', 'Programas', 'Estudios', 'Cursos', 'Páginas', 'Mangas'];

//html ajax config
const setBasicDataToHTML = () => {
  const genderSelectFragment = document.createDocumentFragment();
  const genderFragment = document.createDocumentFragment();
  const genderSelectDefault = document.createElement('option');
  const genderFragmentDefault = document.createElement('option');

  genderSelectDefault.setAttribute('value', 'todos');
  genderSelectDefault.textContent = 'Todos';
  genderFragmentDefault.setAttribute('value', '');
  genderFragmentDefault.textContent = 'Seleccione un genero';

  genderSelectFragment.appendChild(genderSelectDefault);
  genderFragment.appendChild(genderFragmentDefault);

  for (let i = 0; i < generos.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', generos[i]);
    option.textContent = generos[i];
    genderSelectFragment.appendChild(option);
  }
  for (let i = 0; i < generos.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', generos[i]);
    option.textContent = generos[i];
    genderFragment.appendChild(option);
  }
  $genderSelect.appendChild(genderSelectFragment);
  $genero.appendChild(genderFragment);
}

//Listeners
$add_btn.addEventListener('click', () => {
  $edit_add_slider.style.display = 'inline';
  addEventListener('keypress', e => {
    if (e.key == 'Enter') {
      if ($titulo.value != '' && $url.value != '' && $genero.value != '') {
        $imagen.value = `images/${$imagen.value}`;
        if ($imagen.value == '') {$imagen.value = 'images/ejemplo'}
        putItemsToDbHandler($titulo.value, $imagen.value, $url.value, $genero.value);
        clearInputs();
        setItemsToDocumentHandler();
        $edit_add_slider.style.display = 'none';
      } else {
        console.log('data needed');
      }
    }
  })
})

$close_btn.addEventListener('click', () => {
  $edit_add_slider.style.display = 'none';
})

$genderSelect.addEventListener('change', (e) => {
  setItemsToDocumentHandler(e.target.value);
})

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Escape':
      console.log('Escape btn');
      $edit_add_slider.style.display = 'none';
      break;
    case 'ArrowUp':
      console.log('add btn');
      $edit_add_slider.style.display = 'inline';
      break;
  }
})

$searchBar.addEventListener('change', async (e) => {
  let result = await getAllItemsFromDB(null, e.target.value);
  if ($searchBar.value == '') {
    setItemsToDocumentHandler(null);
  } else {
    setItemsToDocument(result);
  }
})

$confirm_btn.addEventListener('click', () => {
  if ($titulo.value != '' && $url.value != '' && $genero.value != '') {
    $imagen.value = `images/${$imagen.value}`;
    if ($imagen.value == '') {$imagen.value = 'images/ejemplo.jpg'}
    putItemsToDbHandler($titulo.value, $imagen.value, $url.value, $genero.value);
    setItemsToDocumentHandler();
    clearInputs();
    $edit_add_slider.style.display = 'none';
  } else {
    console.log('data needed');
  }
})

window.addEventListener('keypress', (e) => {
  if (e.key == 'd') {
    window.addEventListener('keypress', (e) => {
      if (e.key == '@') {
        window.addEventListener('keypress', (e) => {
          if (e.key == 'i') {
            if (confirm('Delete all items?')) {
              removeAllItems();
              setItemsToDocumentHandler(null);
            }
          }
        })
      }
    })
  }
})

//main functions
const searcher = async (string) => {
  return await getAllItemsFromDB(null, string);
}

const setItemsToDocumentHandler = async (gender) => {
  console.log(gender);
  if (gender == null || gender == 'todos') {
    const elements = await getAllItemsFromDB();
    setItemsToDocument(elements);
  } else {
    const elements = await getAllItemsFromDB(gender);
    setItemsToDocument(elements);
  }
}

const removeItemFromDocument = (key, item, mainContainer) => {
  remove(key);
  mainContainer.removeChild(item);
  console.log('item removed');
}

const editItemFromDocument = (key, object) => {
  edit(key, object);
  setItemsToDocumentHandler();
  console.log('item modified');
}

const putItemsToDbHandler = ($titulo, $imagen, $url, $genero) => {
  if (editable == false) {
    addItemsToDb($titulo, $imagen, $url, $genero);
  } else if (editable != false && editKey != null) {
    modifyItemsInDb($titulo, $imagen, $url, $genero, editKey);
    editable = false;
    editKey = null;
  }
}
//main functions AJAX

const setItemsToDocument = (arr) => {
  console.log(arr);
  const itemsMainContainer = document.querySelector('.container-body-items-container');
  itemsMainContainer.innerHTML = '';
  let documentFragment = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i++) {
    let url = arr[i].url;
    let key = arr[i].key;
    let img = arr[i].imagen;
    let titulo = arr[i].titulo;
    let genero = arr[i].genero;
    let $item = document.createElement('div');
    let $item_top = document.createElement('div');
    let $item_center = document.createElement('div');
    let $item_bottom = document.createElement('div');
    let $item_top_gender = document.createElement('div');
    let $item_top_edit = document.createElement('div'); let $item_top_delete = document.createElement('div'); let $item_center_img = document.createElement('img');
    let $item_bottom_title = document.createElement('p');

    $item.classList.add('item');
    $item_top.classList.add('item-top');
    $item_top_gender.classList.add('item-gender');
    $item_top_edit.classList.add('item-edit');
    $item_top_delete.classList.add('item-delete');
    $item_center.classList.add('item-center')
    $item_bottom.classList.add('item-bottom');

    $item_bottom_title.textContent = titulo;
    $item_top_delete.textContent = 'X';
    $item_top_gender.textContent = genero;
    $item_center_img.setAttribute('src', img);
    $item_top_edit.textContent = 'E';
    $item_top.appendChild($item_top_gender);
    $item_top.appendChild($item_top_edit);
    $item_top.appendChild($item_top_delete);
    $item_center.appendChild($item_center_img);
    $item_bottom.appendChild($item_bottom_title);
    $item.appendChild($item_top);
    $item.appendChild($item_center);
    $item.appendChild($item_bottom);

    //functions
    $item_top_delete.addEventListener('click', () => {
      if (confirm('Do you want to delete this item')) {
        removeItemFromDocument(key, $item, itemsMainContainer);
      } else {
        console.log('the item did not remove');
      }
    })

    $item_top_edit.addEventListener('click', () => {
      $edit_add_slider.style.display = 'inline';
      $titulo.value = titulo;
      $url.value = url;
      $imagen.value = img;
      $genero.value = genero;
      editable = true;
      editKey = key;
    })

    $item_center_img.addEventListener('click', () => {
      open(url, '_blank');
    })

    documentFragment.appendChild($item);
  }
  itemsMainContainer.appendChild(documentFragment);
}

const clearInputs = () => {
  $imagen.value = '', $url.value = '', $genero.value = '', $titulo.value = '';
}
//IdexedDB
const IDBRequest = indexedDB.open('linkstorage_db', 1);

IDBRequest.addEventListener('upgradeneeded', () => {
  console.log('database created successfully');
  const db = IDBRequest.result;
  db.createObjectStore('items', {
    autoIncrement: true
  })
})

IDBRequest.addEventListener('success', () => {
  console.log('everything is good');
  setBasicDataToHTML();
  setItemsToDocumentHandler();
})

IDBRequest.addEventListener('error', () => {
  console.log('an error ocurred');
})

//INDEXDED DB CRUD

/*
 * crud object format:
 * {name:name, link:link, image:image, url:url, gender:gender}
 * if(image.value = null){
 *      image = local image;
 * }
 *
 **/

const add = obj => {
  const idb = getIDBData('added', 'readwrite');
  idb.add(obj);
}

const remove = key => {
  const idb = getIDBData('removed', 'readwrite');
  idb.delete(key);
}

const edit = (key, obj) => {
  const idb = getIDBData('modified', 'readwrite');
  idb.put(obj, key);
}

const readAll = () => {
  const idb = getIDBData('all data readed', 'readonly');
  const cursor = idb.openCursor();
  cursor.addEventListener('success', () => {
    if (cursor.result) {
      console.log(cursor.result.value);
      cursor.result.continue();
    } else {
      console.log('readAll function ended');
    }
  })
}

//database functions
const removeallitems = () => {
  const idb = getIDBData('all data readed', 'readonly');
  const cursor = idb.openCursor();
  const result = [];
  cursor.addEventListener('success', () => {
    if (cursor.result) {
      remove(cursor.result.key);
      cursor.result.continue();
    } else {
      console.log('remove items ended');
    }
  })
}

const getIDBData = (msg, mode) => {
  const db = IDBRequest.result;
  const idbtransaction = db.transaction('items', mode);
  const objectstore = idbtransaction.objectStore('items');
  idbtransaction.addEventListener('complete', () => {
    console.log(msg);
  })
  return objectstore;
}
const addItemsToDb = ($titulo, $imagen, $url, $genero) => {
  /*var = string*/
  add({titulo: $titulo, url: $url, imagen: $imagen, genero: $genero});
  console.log('added');
}

const modifyItemsInDb = ($titulo, $imagen, $url, $genero, key) => {
  const item = {titulo: $titulo, url: $url, imagen: $imagen, genero: $genero};
  edit(key, item);
  console.log('edited');
}

//function to load the links on the document
const getAllItemsFromDB = (gender = null, string = null) => {
  if (string != null) {
    return new Promise((resolve, reject) => {
      const result = [];
      const idb = getIDBData('all data readed', 'readonly');
      const cursor = idb.openCursor();
      console.log(`initial string: ${string}`);
      cursor.addEventListener('success', () => {
        if (cursor.result) {
          if (cursor.result.value.titulo.substring(0, string.length) == string) {
            const item = {};
            item.titulo = cursor.result.value.titulo;
            item.url = cursor.result.value.url;
            item.imagen = cursor.result.value.imagen;
            item.genero = cursor.result.value.genero;
            item.key = cursor.result.key;
            result.push(item);
          }
          cursor.result.continue();
        } else {
          console.log(result);
          resolve(result);
        }
      })
    })
  } else if (gender == null) {
    return new Promise((resolve, reject) => {
      const result = [];
      const idb = getIDBData('all data readed', 'readonly');
      const cursor = idb.openCursor();
      cursor.addEventListener('success', () => {
        if (cursor.result) {
          const item = {};
          item.titulo = cursor.result.value.titulo;
          item.url = cursor.result.value.url;
          item.imagen = cursor.result.value.imagen;
          item.genero = cursor.result.value.genero;
          item.key = cursor.result.key;
          result.push(item);
          cursor.result.continue();
        } else {
          console.log(result);
          resolve(result);
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      const result = [];
      const idb = getIDBData('all data readed', 'readonly');
      const cursor = idb.openCursor();
      cursor.addEventListener('success', () => {
        if (cursor.result) {
          if (cursor.result.value.genero == gender) {
            const item = {};
            item.titulo = cursor.result.value.titulo;
            item.url = cursor.result.value.url;
            item.imagen = cursor.result.value.imagen;
            item.genero = cursor.result.value.genero;
            item.key = cursor.result.key;
            result.push(item);
          }
          cursor.result.continue();
        } else {
          console.log(result);
          resolve(result);
        }
      })
    })

  }
}

