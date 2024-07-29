document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bookmark-form").forEach(form => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // 意図しないフォーム送信を防ぐ
      const novelId = form.getAttribute("data-novel-id");

      try {
        const response = await fetch('/user/account/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ novelId }) // novelIdをJSON文字列に変換
        });

        if (response.ok) { // fetch APIによるレスポンスが200番台かどうか
          const result = await response.json();
          if (result.success) {
            alert('ブックマークに追加しました');
          } else {
            alert(result.message);
          }
        } else {
          alert('ブックマークの追加に失敗しました');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('ログインしてください');
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bookmark_form").forEach(form => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // 意図しないフォーム送信を防ぐ
      const novelId = form.getAttribute("data-novel-id");

      try {
        const response = await fetch('/user/account/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ novelId }) // novelIdをJSON文字列に変換
        });

        if (response.ok) { // fetch APIによるレスポンスが200番台かどうか
          const result = await response.json();
          if (result.success) {
            alert('ブックマークに追加しました');
          } else {
            alert(result.message);
          }
        } else {
          alert('ブックマークの追加に失敗しました');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('ログインしてください');
      }
    });
  });
});