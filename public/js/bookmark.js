document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bookmark-form").forEach(form => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const novelId = form.getAttribute("data-novel-id");

      try {
        const response = await fetch('/user/account/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ novelId })
        });

        if (response.ok) {
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
        alert('エラーが発生しました');
      }
    });
  });
});