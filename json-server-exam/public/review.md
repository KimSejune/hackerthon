# Hackerthon Review

## deleteBtn을 마지막 생성된 요소에 이벤트를 건다.
- deleteBtn[deleteBtn.length - 1].addEventListener('click', deleteBtnAction);
  - 이벤트를 생성되는 마지막 부분에 걸어준다.

## Array.from Method

- 받아오는 이름값들을 배열로 변경해준다.

```js
// 유사배열객체를 배열 Method를 사용가능하게 변경한다.
inputpeople = Array.prototype.slice.call(inputpeople);

// 또다른 방법이다.
inputpeople = Array.from(inputpeople);
```

- Array.from() 메소드는 유사 배열 혹은 반복가능한 객체로부터 새 Array 인스턴스를 만듭니다.

```js
Array.from(arrayLike[, mapFn[, thisArg]])
```

## onchage function

- 요소의 값이 변경 될 때 발생한다.
  - 라디오 버튼과 체크 박스의 경우, 체크 된 상태가 변경되면 onchange 이벤트가 발생합니다.
- object일때 사용가능하다.

```js
object.onchange = function(){myScript};
```
