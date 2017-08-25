(function (window, document) {

  var nlistitem;
  var insertList = document.querySelector('.insertList');
  var addBtn = document.getElementById('addBtn');
  var addBox = document.querySelector('.addBox');
  var addCancel = document.querySelector('.addCancel');
  var submitBtn = document.getElementById('submitBtn');
  var inputtotal = document.getElementById('total');
  var inputcalpeople = document.getElementById('calpeople');
  var inputcount = document.getElementById('count');
  var inputpeople1 = document.getElementById('people1');
  var inputpeople2 = document.getElementById('people2');
  var inputpeople3 = document.getElementById('people3');
  var inputday = document.getElementById('day');


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
            insertListItem(el);
          });
        } else {
          console.log("status Error : " + this.status);
        }
      }
    }
  }


  function insertListItem(el) {
    insertListTable(el);
  }

  function insertListTable({
    id,
    total,
    calpeople,
    count,
    people,
    day
  }) {
    // if (people.length + 1 !== count * 1) {
    //   return alert('인원수가 다릅니다.');
    // }
    var putMoney = total / count;
    var myMoney = total - putMoney;

    let str = `
    <div class="insertCard" id="${id}">
      <div class="cardHeader">
        <p>${day}</p>
        <img src="/asset/trash.svg" class="deleteBtn" data-id="${id}">
        <img src="/asset/edit.svg">
      </div>  
    <div class="cardBody">
      <div class="col-8 cardBodyLeft">
        <div>
          <p class="label">계산한 사람</p>
          <p class="calPeople">
            ${calpeople}
          </p>
        </div>
        <div class="moneyCal">
          <div class="totalMoney"> <label>계산한 돈</label> <p class="rightTotalMoney">${myMoney}</p></div>
          <div class="getMoney"> <label>받은 돈</label> <p class="rightMoney">-</p><p class="rightGetMoney"> 0000 </p></div>
          <div class="leftMoney"> <label>남은 돈</label><img src="/asset/coin_one.svg"><p class="rightLeftMoney"> 0000 </p></div>
        </div>
      </div>
    <div class="col-8 cardBodyRight">
        <div>
          <p class="label">함께한 사람</p>
          <p class="anotherPeople">${count}명</p>
        </div>
        <div class="getPeople">`
    for (var i = 1; i < count * 1; i++) {
      str += `<div class="ui checkbox getPeople${i}"><input type="checkbox" class="getPeople${i}"><label>${people[i-1]}</label> <p>${putMoney}</p></div>`
    }
    str += `</div>
      </div>  
    </div>
  </div>`
    insertList.insertAdjacentHTML('beforeend', str);
    var deleteBtn = document.querySelectorAll('.deleteBtn');
    checkArrayAction();
    deleteBtn[deleteBtn.length - 1].addEventListener('click', deleteBtnAction);

  }

  function checkArrayAction() {
    var checkArray = document.querySelectorAll('.cardBodyRight > .getPeople > div > input[type=checkbox]');
    [...checkArray].map(el => {
      console.log(el);
      el.onchange = function(){
        let insertCard = findParent(this);
        console.log(insertCard);
        let rightTotalMoney = insertCard.querySelector('.rightTotalMoney');
        let rightGetMoney = insertCard.querySelector('.rightGetMoney');
        let rightLeftMoney = insertCard.querySelector('.rightLeftMoney');
        
        let total = +rightGetMoney.textContent;
        let money = +el.nextElementSibling.nextElementSibling.textContent;
        let byName = el.parentNode;
        if(el.checked === true){   
          total += money;
          byName.style.textDecoration = 'line-through';
        } else {
          total -= money;
          byName.style.textDecoration = 'none';
        }
        rightGetMoney.textContent = total;
        rightLeftMoney.textContent = (rightTotalMoney.textContent*1 - rightGetMoney.textContent*1);
        console.log(rightLeftMoney.textContent);

        
        

        // document.querySelector('') = ;
      };
    });
  }
  function findParent(el){
    while(!el.parentNode.id){
      el = el.parentNode;
    }
    return el;
  }
  function addBtnAction(e) {
    if (addBox.style.display === 'none') {
      console.log('style');
      addBox.style.display = "block";
      submitBtn.addEventListener('click', submitBtnAction);
    }
  }

  function submitBtnAction(e) {

    console.log('hi');
    if (!inputtotal.value.trim() && !inputcalpeople.value.trim() && !inputcount.value.trim()) {
      return alert('총금액, 계산한 사람명, 인원은 필수 입력입니다.');
    } else {

      insertPostItem(inputtotal.value, inputcalpeople.value, inputcount.value, [inputpeople1.value, inputpeople2.value, inputpeople3.value], inputday.value);
      inputtotal.focus();
      inputtotal.value = '';
      inputcalpeople.value = "";
      inputcount.value = "";
      inputpeople1.value = "";
      inputpeople2.value = "";
      inputpeople3.value = "";
      inputday.value = "";
    }

  }

  function insertPostItem(total, calpeople, count, people, day) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/NListItem', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    var data = {
      total,
      calpeople,
      count,
      people,
      day
    };
    console.log(data);
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          console.log('Post status OK!');
          var addItem = JSON.parse(xhr.responseText);

          insertListItem(addItem);

        } else {
          console.log('Post status Error!!');
        }
      }
    }
  }

  // add 창에서의 취소버튼
  function cancelBtnAction(e) {
    console.log('cancle OK');
    addBox.style.display = 'none';

  }

  function deleteBtnAction(e) {

    insertList.removeChild(e.target.parentNode.parentNode);
    console.log(e.target.dataset.id);
    deleteDBlist(e.target.dataset.id);
  }

  function deleteDBlist(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/NListItem/' + id, true);
    xhr.send(null);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('Delete Status OK!');

          nlistitem.splice(id - 1, 1);
          console.log(nlistitem);
        } else {
          console.log('Delete Status Error');
        }
      }
    }

  }


  getListItem();
  addBtn.addEventListener('click', addBtnAction);
  addCancel.addEventListener('click', cancelBtnAction);

})(window, document);