function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return; // ファイルが選択されていない場合は何もしない
  }

  // ファイルが画像であるかをチェック
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください。');
    return;
  }

  // ファイルサイズのチェック
  const maxSizeMB = 2; // 最大2MBまでの画像を許可する例
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`ファイルサイズが大きすぎます。${maxSizeMB}MB以下の画像を選択してください。`);
    return;
  }

  const reader = new FileReader();
  
  reader.onload = function(e) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
  };
  
  reader.readAsDataURL(file);
}







const pass_label = document.querySelector('.pass_label'),
      password =document.querySelector('.password');

//「開くボタン」をクリックしてモーダルを開く
function passTypeChange() {
  //typeを変更する
  password.type = 'text'; 
  password.removeAttribute('readonly');
  //パスワード変更はこちらを消す
  pass_label.style.display = 'none';
}
pass_label.addEventListener('click', passTypeChange);
