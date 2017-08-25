(function (window, document) {
  
    let storeItem;
    let tbody = document.getElementById('tbody');
    let allcheck = document.getElementById('allcheck');
    let insertbtn = document.getElementById('insert');
    let inputform = document.getElementById('inputform');
    let cancel = document.getElementById('cancel');
    let deletebtn = document.getElementById('deletebtn');
    let name = document.getElementById('name');
    let location = document.getElementById('location');
    let star = document.getElementById('star');
    let etc = document.getElementById('etc');
  
  
    function getStoreList(e) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', '/storeList', true);
      xhr.send(null);
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
  
            console.log('status Ok! : ' + this.responseText);
            storeItem = JSON.parse(this.responseText);
            storeItem.forEach(function (el) {
              console.log(el.id, el.name, el.location, el.star, el.etc);
              insertStoreItem(tbody, el.id, el.name, el.location, el.star, el.etc);
            });
  
          } else {
            console.log('status Error');
          }
        } else {
          console.log('readyState Error : ' + xhr);
        }
      }
    }
  
    function insertStoreItem(e, id, name, location, star, etc) {
      tbody.insertAdjacentHTML('beforeend', `<tr>
      <th><input type="checkbox" id="${id}"></th>
      <th>${id}</th>
      <th>${name}</th>
      <th>${location}</th>
      <th>${star}</th>
      <th>${etc}</th>
      </tr>`);
    }
  
    function insertBtnAction(e) {
      if (inputform.style.display === 'none') {
        inputform.style.display = 'block';
        cancel.style.visibility = 'visible';
      } else {
        if (!(name.value.trim())) {
          return alert('이름은 필수입니다.')
        } else {
  
          insertPostStore(storeItem[storeItem.length - 1].id + 1, name.value, location.value, star.value, etc.value);
          name.focus();
          name.value = "";
          location.value = "";
          star.value = "";
          etc.value = "";
  
        }
      }
  
    }
  
    function insertPostStore(id, name, loacation, star, etc) {
      let xhr = new XMLHttpRequest();
      xhr.open('post', '/storeList', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      let data = {
        name,
        location,
        star,
        etc
      };
  
      xhr.send(JSON.stringify(data));
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 201) {
            console.log('Post Status OK!' + this.responseText);
            let addItem = JSON.parse(xhr.responseText);
            insertStoreItem(tbody, addItem.id, addItem.name, addItem.loacation, addItem.star, addItem.etc);
          } else {
            console.log('Post Error');
          }
        }
      }
    }
  
    function deleteBtnAction(e) {
      let deleteCheckList = document.querySelectorAll('tbody tr th input[type=checkbox]:checked');
      console.log(deleteCheckList);
  
      deleteCheckList.forEach(el => {
        tbody.removeChild(el.parentNode.parentNode);
        console.log(el.id);
        deletePostStore(el.id);
      });
    }
  
    function deletePostStore(id) {
      var xhr = new XMLHttpRequest();
      xhr.open('delete', '/storeList/'+id, true);
      xhr.send(null);
  
      xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
          if(xhr.status === 200){
            console.log('Delete status OK! :' + id);
            storeItem.splice(id,1);
            console.log(storeItem);
          }
        }
      }
    }
  
    function toggleButton(e) {
      let toggleList = document.querySelectorAll('tbody tr th input[type=checkbox]');
  
      toggleList.forEach(el => {
        el.checked = e.target.checked;
      });
    }
  
    function cancleBtnAction(e) {
      inputform.style.display = 'none';
      cancel.style.visibility = 'hidden';
    }
  
    getStoreList();
    allcheck.addEventListener('change', toggleButton);
    insertbtn.addEventListener('click', insertBtnAction);
    cancel.addEventListener('click', cancleBtnAction);
    deletebtn.addEventListener('click', deleteBtnAction);
  
  })(window, document);