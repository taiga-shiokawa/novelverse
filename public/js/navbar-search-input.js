document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("searchInput");
  const suggestionsDiv = document.getElementById("suggestions");
  const allDropdowns = document.querySelectorAll('.dropdown-content');

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value;
    if (query.length > 0) {
      const response = await fetch(
        `/novel/author?q=${encodeURIComponent(query)}`
      );
      const suggestions = await response.json();
      displaySuggestions(suggestions);
    } else {
      suggestionsDiv.style.display = "none";
    }
  });

  function displaySuggestions(suggestions) {
    suggestionsDiv.innerHTML = "";
    if (suggestions.length > 0) {
      suggestions.forEach((suggestion) => {
        const div = document.createElement("div");
        div.textContent = suggestion;
        div.className = "suggestion-item";
        div.onclick = (e) => {
          e.stopPropagation(); // イベントの伝播を止める
          searchInput.value = suggestion;
          suggestionsDiv.style.display = "none";
          // フォームを送信
          searchInput.form.submit();
        };
        suggestionsDiv.appendChild(div);
      });
      suggestionsDiv.style.display = "block";
    } else {
      suggestionsDiv.style.display = "none";
    }
  }

  // ドロップダウンの外側をクリックしたときに全てのドロップダウンを閉じる
  document.addEventListener('click', (event) => {
    allDropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target) && !event.target.closest('.site-nav-button')) {
        dropdown.classList.remove('show');
      }
    });
  });

  // 検索フォーム内のクリックイベントが親要素に伝播しないようにする
  allDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });
});