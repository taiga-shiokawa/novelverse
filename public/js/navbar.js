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