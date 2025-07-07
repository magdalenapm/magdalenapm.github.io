document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("cursor");
  const redLayer = cursor?.querySelector(".gradient-layer.red");
  const imageLayer = cursor?.querySelector(".gradient-layer.image");
  const navList = document.querySelector(".main-nav ul");
  const cursorCross = document.getElementById("cursor-cross");

  const navLinks = document.querySelectorAll(".main-nav li a, .page-title");

  // Variables for smoothing arrows (kept from original)
  let lastLeftAngles = new Map();
  let lastRightAngles = new Map();

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (cursor) {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    }
    if (cursorCross) {
      cursorCross.style.left = `${x}px`;
      cursorCross.style.top = `${y}px`;
    }

    navLinks.forEach((link) => {
      const leftArrow = link.querySelector(".left-arrow");
      const rightArrow = link.querySelector(".right-arrow");
      if (!leftArrow || !rightArrow) return;

      const rect = link.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      const leftX = rect.left - 20;
      const leftY = centerY;
      let angleLeft = Math.atan2(y - leftY, x - leftX) * (180 / Math.PI);

      const rightX = rect.right + 20;
      const rightY = centerY;
      let angleRight = Math.atan2(y - rightY, x - rightX) * (180 / Math.PI);

      angleLeft = (angleLeft + 360) % 360;
      angleRight = (angleRight + 360) % 360;
      angleRight = (angleRight + 180) % 360;

      function smoothAngle(lastAngle, currentAngle) {
        if (lastAngle === undefined) return currentAngle;
        let delta = currentAngle - lastAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        return lastAngle + delta * 0.55;
      }

      const smoothLeft = smoothAngle(lastLeftAngles.get(leftArrow), angleLeft);
      const smoothRight = smoothAngle(lastRightAngles.get(rightArrow), angleRight);

      lastLeftAngles.set(leftArrow, smoothLeft);
      lastRightAngles.set(rightArrow, smoothRight);

      leftArrow.style.left = `-20px`;
      leftArrow.style.top = `50%`;
      leftArrow.style.transform = `translate(-50%, -50%) rotate(${smoothLeft}deg)`;

      rightArrow.style.right = `-20px`;
      rightArrow.style.top = `50%`;
      rightArrow.style.transform = `translate(50%, -50%) rotate(${smoothRight}deg)`;
    });
  });

  // Background image preview logic on nav hover
  document.querySelectorAll(".main-nav li").forEach((li) => {
    const link = li.querySelector("a");
    const img = li.querySelector("img.cursor-img-src");
    if (!link || !img) return;
    const src = img.getAttribute("src");

    link.addEventListener("mouseenter", () => {
      if (imageLayer) {
        imageLayer.style.backgroundImage = `url('${src}')`;
        imageLayer.style.opacity = "1";
      }
      if (redLayer) redLayer.style.opacity = "0";
      navList?.classList.add("hovering");
    });

    link.addEventListener("mouseleave", () => {
      if (imageLayer) imageLayer.style.opacity = "0";
      if (redLayer) redLayer.style.opacity = "1";
      navList?.classList.remove("hovering");
    });
  });

  // Crosshair effect on clickable elements
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorCross?.classList.add("clickable");
    });
    el.addEventListener("mouseleave", () => {
      cursorCross?.classList.remove("clickable");
    });
  });

  // Menu toggle logic
  const menuToggle = document.getElementById("menu-toggle");
  const sideMenu = document.getElementById("side-menu");
  const menuClose = document.getElementById("menu-close");

  menuToggle?.addEventListener("click", () => sideMenu?.classList.add("open"));
  menuClose?.addEventListener("click", () => sideMenu?.classList.remove("open"));

  // Banner image click handlers
  const leftBannerLink = document.querySelector(".banner-left");
  const rightBannerLink = document.querySelector(".banner-right");

  // 🛠️ FIX: Force cursor to stay hidden on banner-right (and its children)
  if (rightBannerLink) {
    rightBannerLink.addEventListener("click", (e) => {
      e.preventDefault();
      menuToggle?.click();
    });

    rightBannerLink.addEventListener("mouseenter", () => {
      rightBannerLink.style.cursor = "none";
      rightBannerLink.querySelectorAll("*").forEach((child) => {
        child.style.cursor = "none";
      });
    });

    rightBannerLink.addEventListener("mouseleave", () => {
      rightBannerLink.style.cursor = "none";
      rightBannerLink.querySelectorAll("*").forEach((child) => {
        child.style.cursor = "none";
      });
    });
  }

  // Replace this:
  // pageTitle?.addEventListener("mouseenter", () => {
  //   sideMenu?.classList.add("open");
  // });

  // WITH this: open side menu on click of .page-title
  const pageTitle = document.querySelector(".page-title");
  pageTitle?.addEventListener("click", () => {
    sideMenu?.classList.add("open");
  });

  // Debug banner hover logs (optional)
  document.querySelector(".banner-left").onmouseenter = () => {
    console.log("LEFT");
  };
  document.querySelector(".banner-right").onmouseenter = () => {
    console.log("RIGHT");
  };
});