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
        div.className = "suggestion_item";
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
      if (!dropdown.contains(event.target) && !event.target.closest('.site_nav_button')) {
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

//レスポンシブ用
document.addEventListener('DOMContentLoaded', () => {
  const allDropdowns = document.querySelectorAll('.dropdown-content');
  //レスポンシブ用
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mobileSuggestionsDiv = document.getElementById("mobileSuggestions");


  //レスポンシブ
  mobileSearchInput.addEventListener("input", async () => {
    const query = mobileSearchInput.value;
    if (query.length > 0) {
      const response = await fetch(
        `/novel/author?q=${encodeURIComponent(query)}`
      );
      const suggestions = await response.json();
      displaySuggestions(suggestions);
    } else {
      mobileSuggestionsDiv.style.display = "none";
    }
  });

  function displaySuggestions(suggestions) {
    mobileSuggestionsDiv.innerHTML = "";
    if (suggestions.length > 0) {
      suggestions.forEach((suggestion) => {
        const div = document.createElement("div");
        div.textContent = suggestion;
        div.className = "suggestion_item";
        div.onclick = (e) => {
          e.stopPropagation(); // イベントの伝播を止める
          mobileSearchInput.value = suggestion;
          mobileSuggestionsDiv.style.display = "none";
          // フォームを送信
          mobileSearchInput.form.submit();
        };
        mobileSuggestionsDiv.appendChild(div);
      });
      mobileSuggestionsDiv.style.display = "block";
    } else {
      mobileSuggestionsDiv.style.display = "none";
    }
  }

  // ドロップダウンの外側をクリックしたときに全てのドロップダウンを閉じる
  document.addEventListener('click', (event) => {
    allDropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target) && !event.target.closest('.site_nav_button')) {
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