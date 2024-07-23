document.addEventListener("DOMContentLoaded", () => { // イベント発生 ブシャーーーー
  document.querySelectorAll(".bookmark-form").forEach(form => { // クラスに一致するすべての要素を取得
    form.addEventListener("submit", async (event) => { // またまたイベント発生 ブシャーーーー
      event.preventDefault();
      const novelId = form.getAttribute("data-novel-id"); // 属性取得
      /**
       * form要素から上に祖先要素を探しにいく
       * .book-itemの親要素、つまりbook-listを取得
       */
      const bookItem = form.closest('.book-item'); 

      try {
        const response = await fetch('/user/account/bookmark/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ novelId })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            bookItem.remove();
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