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
  var inputpeople = document.querySelectorAll('.people1');
  var plusPeople = document.getElementById('plusPeople');
  var addpepleform = document.getElementById('addpepleform');
  // inputpeople = Array.from(inputpeople);
  inputpeople = Array.prototype.slice.call(inputpeople);

  var inputday = document.getElementById('day');

  
  // DB에 저장된 데이터를 가져온다.
  function getListItem(e) {
    var xhr = new XMLHttpRequest();

    // 비동기 방식으로 데이터를 보낸다.
    xhr.open('get', '/NListItem', true);
    xhr.send(null);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('status OK!');
          // DB로 부터 가져온 데이터를 객체형식으로 저장한다.
          nlistitem = JSON.parse(xhr.responseText);
          nlistitem.forEach(el => {
            // 각각의 요소들을 insertListTable로 넘겨준다.
            insertListTable(el);
          });
        } else {
          console.log("status Error : " + this.status);
        }
      }
    }
  }

  // 입력받은 객체값을 main에 그려준다.
  function insertListTable({
    id,
    total,
    calpeople,
    count,
    people,
    day
  }) {
    // 1인당 갚아야할 돈을 변수로 지정.
    var putMoney = total / count;
    // 나의 것을 제외하고 낸돈을 지정.
    var myMoney = total - putMoney;

    console.log(people);

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
    // deleteBtn을 마지막 생성된 요소에 이벤트를 건다.
    deleteBtn[deleteBtn.length - 1].addEventListener('click', deleteBtnAction);

  }

  // check된 요소들을 찾기위한 함수.
  function checkArrayAction() {

    // checkbox요소를 가진 것들을 선택.
    var checkArray = document.querySelectorAll('.cardBodyRight > .getPeople > div > input[type=checkbox]');
    [...checkArray].map(el => {
      console.log(el);

      // 요소의 값이 변경될 때를 체크한다.
      el.onchange = function () {
        // 요소의 부모를 찾는 변수 insertCard 선언
        let insertCard = findParent(this);
        console.log(insertCard);
        let rightTotalMoney = insertCard.querySelector('.rightTotalMoney');
        let rightGetMoney = insertCard.querySelector('.rightGetMoney');
        let rightLeftMoney = insertCard.querySelector('.rightLeftMoney');

        // String을 int로 변경
        let total = +rightGetMoney.textContent;
        // input요소의 next, next로서 p 태그의 textContent를 찾는다.
        let money = +el.nextElementSibling.nextElementSibling.textContent;
        // 요소의 체크시 밑줄을 가게하기 위하여 부모노드를 찾는다.
        let byName = el.parentNode;

        if (el.checked === true) {
          total += money;
          byName.style.textDecoration = 'line-through';
        } else {
          total -= money;
          byName.style.textDecoration = 'none';
        }
        rightGetMoney.textContent = total;
        rightLeftMoney.textContent = (rightTotalMoney.textContent * 1 - rightGetMoney.textContent * 1);
        console.log(rightLeftMoney.textContent);

      };
    });
  }

  // 부모요소의 id값을 찾을때까지 while을 돈다.
  function findParent(el) {
    while (!el.parentNode.id) {
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

    console.log('inputpeople.length :'+ (inputpeople.length)*1 + 'inputcount.count : '+inputcount.value);
    if ((inputpeople.length)*1 !== inputcount.textContent * 1) {
      return alert('인원수가 다릅니다.');
    }else if (!inputtotal.value.trim() && !inputcalpeople.value.trim() && !inputcount.value.trim()) {
      return alert('총금액, 계산한 사람명, 인원은 필수 입력입니다.');
    } else {

      insertPostItem(inputtotal.value, inputcalpeople.value, inputcount.value, inputpeople, inputday.value);
      console.log('inputpeople value' + inputpeople);
      inputtotal.focus();
      inputtotal.value = '';
      inputcalpeople.value = "";
      inputcount.value = "";
      for (var i = 0; i < inputpeople.length; i++) {
        inputpeople[i].value = "";
      }
      inputday.value = "";
    }

  }

  function insertPostItem(total, calpeople, count, people, day) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/NListItem', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    var people = people.map(el => el.value);
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

          insertListTable(addItem);

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

  function addPeopleInputBox(e) {
    addpepleform.insertAdjacentHTML('beforeend', `<input class="people1 form" type="text" name="" placeholder="이름을 입력하세요">`);
    console.log('addPeople inputpeople.length : '+inputpeople.length);
  }


  getListItem();
  addBtn.addEventListener('click', addBtnAction);
  addCancel.addEventListener('click', cancelBtnAction);
  plusPeople.addEventListener('click', addPeopleInputBox);
})(window, document);