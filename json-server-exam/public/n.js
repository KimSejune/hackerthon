(function (window, document) {

  var nlistitem;
  var insertList = document.querySelector('.insertList');
  var addBtn = document.getElementById('addBtn');
  var addBox = document.querySelector('.addBox');
  var cancelBtn = document.querySelector('.cancelBtn');
  

  function getListItem(e) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/NListItem', true);
    xhr.send(null);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('status OK!');
          nlistitem = JSON.parse(xhr.responseText);
          nlistitem.forEach(el => {
            insertListItem(insertList, el.id, el.total, el.calpeople, el.count, el.people1, el.people2, el.people3, el.day);
          });
        } else {
          console.log("status Error : " + this.status);
        }
      }
    }
  }


  function insertListItem(e, id, total, calpeople, count, people1, people2, people3, day) {
    insertListTable(id, total, calpeople, count, people1, people2, people3, day);
  }

  function insertListTable(id, total, calpeople, count, people1, people2, people3, day) {
    var putMoney = total / count;
    let str = `<div class="insertCard">
    <div class="cardHeader">
      ${day}
      <button class="deleteBtn" data-id=${id}>지우기</button>
    </div>  
    <div class="cardBody">
      <div class="cardBodyLeft">
        <div class="calpeolpe">
          계산한 사람 ${calpeople}
        </div>
        <div class="totalMoney">계산한 돈 ${total}</div>
        <div class="getMoney">받은 돈</div>
        <div class="leftMoney">받을 돈</div>
      <div class="cardBodyRight">
        <div class="anotherPeople">함께한 사람 ${count}</div>`
    for (var i = 0; i < count * 1; i++) {
      str += `<div class="getPeople${i}"><input type="checkbox">${people1} ${putMoney}</div>`
    }
    str += `</div>
        </div>
      </div>`

    insertList.insertAdjacentHTML('beforeend', str);
    var deleteBtn = document.querySelectorAll('.deleteBtn');
    deleteBtn[deleteBtn.length - 1].addEventListener('click', deleteBtnAction);
    
  }

  function addBtnAction(e) {
    if (addBox.style.display === "none") {
      addBox.style.display === "block";
    } else {
      if (!(total.value.trim())) {
        alert('총금액을 입력해주세요.');
      } else if (!(calpeople.value.trim())) {
        alert('계산한 돈을 입력해주세요.')
      } else {
        insertPostItem(total.value, calpeople.value, count.value, people1.value, people2.value, people3.value, day.value);
        total.focus();
        total.value = "";
        calpeople.value = "";
        count.value = "";
        people1.value = "";
        people2.value = "";
        people3.value = "";
        day.value = "";
      }
    }
  }

  function insertPostItem(total, calpeople, count, people1, people2, people3, day) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/NListItem', true);
    var data = {
      total,
      calpeople,
      count,
      people1,
      people2,
      people3,
      day
    };
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          console.log('Post status OK!');
          var addItem = JSON.parse(xhr.responseText);

          insertListItem(insertList, addItem.total, addItem.calpeople, addItem.count, addItem.people1, addItem.people2, addItem.people3, addItem.day);

        } else {
          console.log('Post status Error!!');
        }
      }
    }
  }

  // add 창에서의 취소버튼
  function cancelBtnAction(e) {
    addBox.style.display === "none";
  }

  function deleteBtnAction(e) {
  
    insertList.removeChild(e.target.parentNode.parentNode);
    console.log(e.target.dataset.id);
    deleteDBlist(e.target.dataset.id);
  }

  function deleteDBlist(id){
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/NListItem/'+id, true);
    xhr.send(null);

    xhr.onreadystatechange = function(){
      if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status === 200){
          console.log('Delete Status OK!');
          
          nlistitem.splice(id-1,1);
          console.log(nlistitem);
        }else {
          console.log('Delete Status Error');
        }
      }
    }

  }


  getListItem();
  addBtn.addEventListener('click', addBtnAction);
  cancelBtn.addEventListener('click', cancelBtnAction);

})(window, document);