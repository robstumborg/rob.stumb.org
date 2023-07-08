$(function () {
  const body = document.querySelector("body");
  const toggle = document.getElementById("toggle");
  const input = document.getElementById("switch");

  // Check if the user's preference is stored in local storage
  const storedPreference = localStorage.getItem("themePreference");

  // Set the theme based on the stored preference or the user's OS/browser settings
  if (
    storedPreference === "dark" ||
    (!storedPreference &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    input.checked = true;
    body.classList.add("night");
  }

  // Theme toggle
  toggle.addEventListener("click", function () {
    const isChecked = input.checked;
    if (isChecked) {
      body.classList.remove("night");
      localStorage.setItem("themePreference", "light");
    } else {
      body.classList.add("night");
      localStorage.setItem("themePreference", "dark");
    }
  });

  const introHeight = document.querySelector(".switch-wrapper").offsetHeight;
  const topButton = document.getElementById("top-button");
  const $topButton = $("#top-button");

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > introHeight) {
        $topButton.fadeIn();
      } else {
        $topButton.fadeOut();
      }
    },
    false
  );

  topButton.addEventListener("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  // Emoji hand wave
  if (document.querySelector(".emoji.wave-hand")) {
    const hand = document.querySelector(".emoji.wave-hand");

    function waveOnLoad() {
      hand.classList.add("wave");
      setTimeout(function () {
        hand.classList.remove("wave");
      }, 2000);
    }

    setTimeout(function () {
      waveOnLoad();
    }, 1000);

    hand.addEventListener("mouseover", function () {
      hand.classList.add("wave");
    });

    hand.addEventListener("mouseout", function () {
      hand.classList.remove("wave");
    });
  }

  // CV animations
  window.sr = ScrollReveal({
    reset: false,
    duration: 600,
    easing: "cubic-bezier(.694,0,.335,1)",
    scale: 1,
    viewFactor: 0.3,
  });

  sr.reveal(".background");
  sr.reveal(".skills");
  sr.reveal(".experience", { viewFactor: 0.2 });
  sr.reveal(".featured-projects", { viewFactor: 0.1 });
  sr.reveal(".other-projects", { viewFactor: 0.05 });

  // mobile menu
  $(".mobile-menu-link").click(function (e) {
    e.preventDefault();

    $(".mobile-menu-overlay").toggleClass("open");
    $(".mobile-menu").toggleClass("open");
    $("html").toggleClass("hidden");
  });
});
