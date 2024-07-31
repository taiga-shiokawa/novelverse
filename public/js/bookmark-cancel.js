document.addEventListener("DOMContentLoaded", () => { // イベント発生 ブシャーーーー
  document.querySelectorAll(".bookmark-form").forEach(form => { // クラスに一致するすべての要素を取得
    form.addEventListener("submit", async (event) => { // またまたイベント発生 ブシャーーーー
      event.preventDefault(); // 意図しないフォーム送信を防ぐ
      const novelId = form.getAttribute("data-novel-id"); // 属性取得
      const csrfToken = form.querySelector('input[name="_csrf"]').value;
      /**
       * form要素から上に祖先要素を探しにいく
       * .book-itemの親要素、つまりbook-listを取得
       */
      const bookItem = form.closest('.book-item'); 

      try {
        const response = await fetch('/user/account/bookmark/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
          },
          body: JSON.stringify({ novelId }) // novelIdをJSON文字列に変換
        });

        if (response.ok) { // fetch APIによるレスポンスが200番台かどうか
          const result = await response.json();
          if (result.success) {
            bookItem.remove(); // book-listコンテナを削除
            // alert('ブックマークを解除しました');
          } else {
            alert(result.message);
          }
        } else {
          alert('ブックマークの解除に失敗しました');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('ログインしてください');
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => { // イベント発生 ブシャーーーー
  document.querySelectorAll(".bookmark_form").forEach(form => { // クラスに一致するすべての要素を取得
    form.addEventListener("submit", async (event) => { // またまたイベント発生 ブシャーーーー
      event.preventDefault(); // 意図しないフォーム送信を防ぐ
      const novelId = form.getAttribute("data-novel-id"); // 属性取得
      const csrfToken = form.querySelector('input[name="_csrf"]').value;
      /**
       * form要素から上に祖先要素を探しにいく
       * .book-itemの親要素、つまりbook-listを取得
       */
      const bookItem = form.closest('.book-item'); 

      try {
        const response = await fetch('/user/account/bookmark/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
          },
          body: JSON.stringify({ novelId }) // novelIdをJSON文字列に変換
        });

        if (response.ok) { // fetch APIによるレスポンスが200番台かどうか
          const result = await response.json();
          if (result.success) {
            bookItem.remove(); // book-listコンテナを削除
            // alert('ブックマークを解除しました');
          } else {
            alert(result.message);
          }
        } else {
          alert('ブックマークの解除に失敗しました');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('ログインしてください');
      }
    });
  });
});