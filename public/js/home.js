//ボタンホバー時のドロップダウン
function setupDropdown(buttonId, dropdownId) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);

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

  dropdown.addEventListener("mouseleave", function () {
    dropdown.classList.remove("show");
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