
//要素を取得
const modal = document.querySelector('.js-modal'),
      open = document.querySelector('.js-modal-open'),
      closeButton = document.querySelector('.js-modal-close-button');
      close = document.querySelector('.js-modal-close');
      other = document.querySelector('.other');

//「開くボタン」をクリックしてモーダルを開く
function modalOpen() {
  modal.classList.add('is-active');
}
open.addEventListener('click', modalOpen);

//「閉じるボタン」をクリックしてモーダルを閉じる
function modalClose() {
  modal.classList.remove('is-active');
}
close.addEventListener('click', modalClose);
closeButton.addEventListener('click', modalClose);



//「モーダルの外側」をクリックしてモーダルを閉じる
function modalOut(e) {
  if (e.target == modal) {
    modal.classList.remove('is-active');
  }
}
addEventListener('click', modalOut);


function handleChange(checkbox) {
  if(checkbox.checked){
    other.classList.add('show');
  } else {
    other.classList.remove('show');
    other.value="";
  }
}

//チェックボックスバリデーション

function validateForm() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const atLeastOneChecked = Array.from(checkboxes).some(cb => cb.checked);

  if (!atLeastOneChecked) {
      alert('少なくとも一つのチェックボックスを選択してください。');
      return false; // フォームの送信を防ぐ
  }
  return true; // フォームの送信を許可する
}