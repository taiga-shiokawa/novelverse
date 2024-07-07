//ジャンルドロップダウン
const genreButton = document.getElementById("genreButton");
const genreDropdown = document.getElementById("genreDropdown");

genreButton.addEventListener("mouseenter", function() {
  genreDropdown.classList.add("show");
})

genreButton.addEventListener("mouseleave", function() {
  setTimeout(() => {
      if (!genreDropdown.matches(":hover")) {
          genreDropdown.classList.remove("show");
      }
  }, 100);
});

genreDropdown.addEventListener("mouseleave", function() {
  genreDropdown.classList.remove("show");
});

//作家ドロップダウン
const writerButton = document.getElementById("writerButton");
const writerDropdown = document.getElementById("writerDropdown");

writerButton.addEventListener("mouseenter", function() {
  writerDropdown.classList.add("show");
});

writerButton.addEventListener("mouseleave", function() {
  setTimeout(() => {
    if (!writerDropdown.matches(":hover")) {
      writerDropdown.classList.remove("show");
    }
  }, 100);
});

writerDropdown.addEventListener("mouseleave", function() {
  writerDropdown.classList.remove("show");
});

//サイト案内ドロップダウン
const siteInformationButton = document.getElementById("siteInformationButton");
const siteInfomationDropdown = document.getElementById("siteInfomationDropdown");

siteInformationButton.addEventListener("mouseenter", function() {
  siteInfomationDropdown.classList.add("show");
});

siteInformationButton.addEventListener("mouseleave", function() {
  setTimeout(() => {
    if (!siteInfomationDropdown.matches(":hover")) {
      siteInfomationDropdown.classList.remove("show");
    }
  }, 100);
});

siteInfomationDropdown.addEventListener("mouseleave", function() {
  siteInfomationDropdown.classList.remove("show");
});

//掲示板ドロップダウン
const boardButton = document.getElementById("boardButton");
const boardDropdown = document.getElementById("boardDropdown");

boardButton.addEventListener("mouseenter", function() {
  boardDropdown.classList.add("show");
});

boardButton.addEventListener("mouseleave", function() {
  setTimeout(() => {
    if (!boardDropdown.matches(":hover")) {
      boardDropdown.classList.remove("show");
    }
  }, 100);
});

boardDropdown.addEventListener("mouseleave", function() {
  boardDropdown.classList.remove("show");
});

//マイページドロップダウン
const mypageButton = document.getElementById("mypageButton");
const mypageDropdown = document.getElementById("mypageDropdown");

mypageButton.addEventListener("mouseenter", function() {
  mypageDropdown.classList.add("show");
});

mypageButton.addEventListener("mouseleave", function() {
  setTimeout(() => {
    if (!mypageDropdown.matches(":hover")) {
      mypageDropdown.classList.remove("show");
    }
  }, 100);
});

mypageDropdown.addEventListener("mouseleave", function() {
  mypageDropdown.classList.remove("show");
});