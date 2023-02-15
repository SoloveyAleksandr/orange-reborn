document.addEventListener("DOMContentLoaded", () => {

  class Dropdown {
    constructor(wrapper) {
      this.wrapper = typeof wrapper === "string" ? document.querySelector(wrapper) : wrapper;
      this.btn = this.wrapper.querySelector(".dropdown-btn");
      this.content = this.wrapper.querySelector(".dropdown-content");
      this.isOpen = this.wrapper.getAttribute("data-open") !== null ? true : false;

      if (this.wrapper && this.btn && this.content) {
        this.init();
      }
    }

    init() {
      this.maxHeight = this.content.offsetHeight * 2 / 10 + "rem";
      if (window.matchMedia("(min-width: 851px)").matches) {
        this.wrapper.addEventListener("mouseenter", this.open.bind(this));
        this.wrapper.addEventListener("mouseleave", this.close.bind(this));
      } else {
        this.btn.addEventListener("click", this.handleClick.bind(this));
      }

      if (this.isOpen) {
        this.open();
      } else this.close();
    }

    handleClick() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.wrapper.classList.add("_open");
      this.content.style.maxHeight = this.maxHeight;
      this.isOpen = true;
    }

    close() {
      this.wrapper.classList.remove("_open");
      this.content.style.maxHeight = 0;
      this.isOpen = false;
    }
  }

  const dropdownList = gsap.utils.toArray(".dropdown");
  dropdownList.forEach(item => new Dropdown(item));

  if (window.matchMedia("(max-width: 850px)").matches) {
    const MENU_BTN = document.querySelector(".header-btn");
    const MENU = document.querySelector(".header-menu");

    if (MENU_BTN && MENU) {
      MENU_BTN.addEventListener("click", () => {
        MENU_BTN.classList.toggle("_active");
        MENU.classList.toggle("_active");
      })
    }
  }


  // MAIN
  if (document.querySelector(".main-video")) {
    const canvas = document.querySelector(".main-video canvas");

    // BLOB
    if (canvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: canvas.getContext("webgl"),
        antialias: true,
        alpha: true
      });

      const simplex = new SimplexNoise();

      const startWindowSize = window.innerWidth;

      const breakpoints = [375, 500, 850, 1200, 1920];
      let maxBreakpoint = Infinity;
      let minBreakpoint = null;

      for (let i = 0; i < breakpoints.length; i++) {
        if (startWindowSize < breakpoints[i]) {
          maxBreakpoint = breakpoints[i];
          break;
        }
      }

      for (let i = breakpoints.length - 1; i > 0; i--) {
        if (startWindowSize > breakpoints[i]) {
          minBreakpoint = breakpoints[i];
          break;
        }
      }

      if (breakpoints.includes(startWindowSize)) {
        maxBreakpoint = startWindowSize;
      }

      console.log(minBreakpoint, maxBreakpoint)

      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;
      const canvasWidthPrec = canvasWidth / (window.innerWidth / 100) / 100;
      const canvasHeightPrec = canvasHeight / (window.innerWidth / 100) / 100;

      renderer.setSize(canvasWidth, canvasHeight);

      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        renderer.setSize(window.innerWidth * canvasWidthPrec, window.innerWidth * canvasHeightPrec);
        if (width >= maxBreakpoint || width <= minBreakpoint) {
          location.reload();
        }
      })

      renderer.setPixelRatio(window.devicePixelRatio || 1);

      camera.position.z = 5;

      let geometry = new THREE.SphereGeometry(0.8, 32, 32);

      let material = new THREE.MeshPhongMaterial({
        color: 0xFAC68D,
        shininess: 100
      });

      let lightTop = new THREE.DirectionalLight(0xF990B3, 1);
      lightTop.position.set(0, 500, 200);
      lightTop.castShadow = true;
      scene.add(lightTop);

      let lightBottom = new THREE.DirectionalLight(0xFDEAD3, 1);
      lightBottom.position.set(0, -500, 400);
      lightBottom.castShadow = true;
      scene.add(lightBottom);

      let ambientLight = new THREE.AmbientLight(0xFF518A);
      scene.add(ambientLight);

      let sphere = new THREE.Mesh(geometry, material);

      scene.add(sphere);

      const animSpeed = 50;
      const animSpikes = 0.5;
      const animProccesing = 1.3;

      let update = () => {
        let time = performance.now() * 0.00001 * animSpeed * Math.pow(1, 3),
          spikes = animSpikes * animProccesing;

        for (let i = 0; i < sphere.geometry.vertices.length; i++) {
          let p = sphere.geometry.vertices[i];
          p.normalize().multiplyScalar(1.5 + 0.4 * simplex.noise3D(p.x * spikes, p.y * spikes, p.z * spikes + time));
        }

        sphere.geometry.computeVertexNormals();
        sphere.geometry.normalsNeedUpdate = true;
        sphere.geometry.verticesNeedUpdate = true;
      }

      function animate() {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    // BANER
    const banerContainers = gsap.utils.toArray(".main-video-baner-box");

    banerContainers.forEach((container, index) => {
      const list = container.querySelector(".main-video-baner-list");
      const listClone = list.cloneNode(true);

      container.appendChild(listClone);

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(list, {
        x: index % 2 ? "-100%" : "100%",
        duration: 30,
        ease: "none"
      }, "sin")
      tl.to(listClone, {
        x: index % 2 ? "-100%" : "100%",
        duration: 30,
        ease: "none"
      }, "sin")
    })
  }

  // WORKS 
  const worksTags = document.querySelector(".works-tag-wrapper");

  if (worksTags) {
    const swiper = new Swiper(worksTags, {
      speed: 400,
      slidesPerView: "auto",
      freeMode: true,
      spaceBetween: 0,
      breakpoints: {
        850: {
          spaceBetween: 10
        },
      }
    });
  }

  const mainWorks = document.querySelector(".main-works");

  if (mainWorks) {
    if (window.matchMedia("(max-width: 500px)").matches) {
      const swiper = new Swiper(mainWorks, {
        speed: 400,
        spaceBetween: 16,
        pagination: {
          el: ".main-works-pagination",
          type: "bullets",
          bulletClass: "main-works-pagination__item",
          bulletActiveClass: "main-works-pagination__item_active",
          clickable: true,
        },
      });
    }
  }
})