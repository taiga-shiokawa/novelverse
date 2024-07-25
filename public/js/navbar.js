//ボタンホバー時のドロップダウン
function setupDropdown(buttonId, dropdownId) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);

  button.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    allDropdowns.forEach(d => {
      if (d.id !== dropdownId) {
        d.classList.remove('show');
      }
    });
    dropdown.classList.toggle('show');
  });

  button.addEventListener("mouseenter", function () {
    dropdown.classList.add("show");
  });

  button.addEventListener("mouseleave", function (event) {
    setTimeout(() => {
      if (!dropdown.matches(":hover")) {
        dropdown.classList.remove("show");
      }
    }, 100);
  });
}

// 既存のコードの後に追加

// すべてのドロップダウンを取得
const allDropdowns = document.querySelectorAll('.dropdown_content');

// ドキュメント全体にクリックイベントリスナーを追加
document.addEventListener('click', function(event) {
  allDropdowns.forEach(dropdown => {
    // クリックされた要素がドロップダウンの外部かどうかをチェック
    if (!dropdown.contains(event.target) && !event.target.matches('.site_nav_button')) {
      dropdown.classList.remove('show');
    }
  });
});

//ジャンルドロップダウン
setupDropdown("genreButton", "genreDropdown");
//作家ドロップダウン
setupDropdown("writerButton", "writerDropdown");
//サイト案内ドロップダウン
setupDropdown("siteInformationButton", "siteInfomationDropdown")
//掲示板ドロップダウン
setupDropdown("boardButton", "boardDropdown")
//マイページドロップダウン
setupDropdown("mypageButton", "mypageDropdown");