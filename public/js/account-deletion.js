// 要素を取得
const modal = document.querySelector('.js-modal'),
      open = document.querySelector('.js-modal-open'),
      closeButton = document.querySelector('.js-modal-close-button'),
      close = document.querySelector('.js-modal-close');

// 「開くボタン」をクリックしてモーダルを開く
function modalOpen() {
  modal.classList.add('is-active');
}
open.addEventListener('click', modalOpen);

// 「閉じるボタン」をクリックしてモーダルを閉じる
function modalClose(e) {
  e.preventDefault(); // aタグのデフォルト動作を防ぐ
  modal.classList.remove('is-active');
}
close.addEventListener('click', modalClose);
closeButton.addEventListener('click', modalClose);

// 「モーダルの外側」をクリックしてモーダルを閉じる
function modalOut(e) {
  if (e.target === modal) {
    modal.classList.remove('is-active');
  }
}
document.addEventListener('click', modalOut);