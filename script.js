document.addEventListener("DOMContentLoaded", () => {
  // Affiche les compétences lorsqu'elles sont visibles
  const skillBoxes = document.querySelectorAll(".skill-box");

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }

  function revealSkills() {
    skillBoxes.forEach((skillBox) => {
      if (isVisible(skillBox)) {
        skillBox.style.opacity = "1"; // Rendre visible
        skillBox.style.transform = "translateX(0)"; // Position normale
      }
    });
  }

  // Déclenche l'effet au défilement
  window.addEventListener("scroll", revealSkills);

  // Vérifie la visibilité au chargement
  revealSkills();

  // Observer pour les éléments de la timeline
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  ); // Lancer quand 10% de l'élément est visible

  timelineItems.forEach((item) => {
    observer.observe(item);
  });

  // Galerie avec défilement horizontal
  const galleryContent = document.querySelector(".gallery-content");
  const leftButton = document.querySelector(".scroll-button.left");
  const rightButton = document.querySelector(".scroll-button.right");

  if (leftButton && rightButton && galleryContent) {
    leftButton.addEventListener("click", () => {
      galleryContent.scrollBy({
        left: -galleryContent.clientWidth,
        behavior: "smooth",
      });
    });

    rightButton.addEventListener("click", () => {
      galleryContent.scrollBy({
        left: galleryContent.clientWidth,
        behavior: "smooth",
      });
    });
  }

  const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Adjust on window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  });

  // Star field properties
  const numStars = 3000;
  const starArray = [];

  // Generate initial star positions
  function createStars() {
    starArray.length = 0;
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const z = Math.random() * canvas.width; // Depth for 3D effect
      const size = Math.random() * 1.5; // Size variation
      starArray.push({ x, y, z, size });
    }
  }

  // Update and draw stars with slight rotation
  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    starArray.forEach((star) => {
      // Rotate stars
      star.z -= 0.2; // Adjust speed of "forward" motion
      if (star.z <= 0) star.z = canvas.width;

      // Calculate new star position and size
      const scale = 140 / star.z;
      const x = (star.x - canvas.width / 2) * scale + canvas.width / 2;
      const y = (star.y - canvas.height / 2) * scale + canvas.height / 2;

      // Draw star
      ctx.beginPath();
      ctx.arc(x, y, star.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });

    requestAnimationFrame(animateStars);
  }

  createStars();
  animateStars();

  // Animation de rebond et rotation des sphères
  const spheres = document.querySelectorAll(".sphere");

  // Observer pour déclencher l'effet de rebond quand les sphères deviennent visibles
  const sphereObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.5 }
  ); // Lancer quand 50% de la sphère est visible

  spheres.forEach((sphere) => {
    sphereObserver.observe(sphere);
  });

  // Rotation au survol
  spheres.forEach((sphere) => {
    sphere.addEventListener("mouseenter", () => {
      sphere.classList.add("rotate"); // Ajouter la classe pour la rotation continue
    });
    sphere.addEventListener("mouseleave", () => {
      sphere.classList.remove("rotate"); // Retirer la classe après le survol
    });
  });

  const carousel = document.querySelector(".carousel-content");
  let currentRotation = 0;
  const rotationStep = -90;
  const waitTime = 5000; // 5 secondes

  function rotateCarousel() {
    currentRotation += rotationStep;
    carousel.style.transform = `rotateY(${currentRotation}deg)`;
  }

  // Automatisation de la rotation toutes les 5 secondes
  let autoRotate = setInterval(rotateCarousel, waitTime);

  // Rotation manuelle au clic
  carousel.addEventListener("click", () => {
    clearInterval(autoRotate); // Stopper la rotation automatique temporairement
    rotateCarousel(); // Passer à la carte suivante
    autoRotate = setInterval(rotateCarousel, waitTime); // Reprendre la rotation automatique
  });

  const carouselList = document.querySelector(".carouselveille__list");
  const carouselItems = document.querySelectorAll(".carouselveille__item");
  const elems = Array.from(carouselItems);

  carouselList.addEventListener("click", function (event) {
    var newActive = event.target;
    var isItem = newActive.closest(".carouselveille__item");

    if (
      !isItem ||
      newActive.classList.contains("carouselveille__item_active")
    ) {
      return;
    }

    update(newActive);
  });

  const update = function (newActive) {
    const newActivePos = newActive.dataset.pos;

    const current = elems.find((elem) => elem.dataset.pos == 0);
    const prev = elems.find((elem) => elem.dataset.pos == -1);
    const next = elems.find((elem) => elem.dataset.pos == 1);
    const first = elems.find((elem) => elem.dataset.pos == -2);
    const last = elems.find((elem) => elem.dataset.pos == 2);

    current.classList.remove("carouselveille__item_active");

    [current, prev, next, first, last].forEach((item) => {
      var itemPos = item.dataset.pos;

      item.dataset.pos = getPos(itemPos, newActivePos);
    });
  };

  const getPos = function (current, active) {
    const diff = current - active;

    if (Math.abs(current - active) > 2) {
      return -current;
    }

    return diff;
  };
});
