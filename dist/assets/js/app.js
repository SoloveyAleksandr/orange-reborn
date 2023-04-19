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

      if (this.wrapper.getAttribute("data-click") !== null) {
        this.btn.addEventListener("click", this.handleClick.bind(this));
      } else {
        if (window.matchMedia("(min-width: 851px)").matches) {
          this.wrapper.addEventListener("mouseenter", this.open.bind(this));
          this.wrapper.addEventListener("mouseleave", this.close.bind(this));
        } else {
          this.btn.addEventListener("click", this.handleClick.bind(this));
        }
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
      this.btn.classList.add("_active");
      this.content.style.maxHeight = this.maxHeight;
      this.isOpen = true;
    }

    close() {
      this.wrapper.classList.remove("_open");
      this.btn.classList.remove("_active");
      this.content.style.maxHeight = 0;
      this.isOpen = false;
    }
  }

  class Checkbox {
    constructor(label) {
      this.label = typeof label === "string" ? document.querySelector(label) : label;
      this.input = this.label.querySelector("input");

      if (this.label && this.input) {
        this.init();
      }
    }

    init() {
      this.input.addEventListener("change", this.handleChange.bind(this));

      if (this.input.checked) {
        this.label.classList.add("_checked");
      }
    }

    handleChange() {
      if (this.input.checked) {
        this.label.classList.add("_checked");
      } else this.label.classList.remove("_checked");
    }
  }

  class Input {
    constructor(container) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      this.input = this.container.querySelector(".request-form-contacts__input");

      if (this.container && this.input) {
        this.init();
      }
    }

    init() {
      this.input.addEventListener("focus", this.focusHandler.bind(this));
      this.input.addEventListener("blur", this.focusHandler.bind(this));
    }

    setFocus() {
      this.container.classList.add("_focus");
    }

    removeFocus() {
      this.container.classList.remove("_focus");
    }

    focusHandler() {
      if (this.input.value === "" && this.container.classList.contains("_focus")) {
        this.removeFocus();
      } else {
        this.setFocus();
      }
    }
  }

  class InputFile {
    constructor(container) {
      this.container = typeof container === "string" ? document.querySelector(container) : container;
      this.input = this.container.querySelector("input[type=file]");
      this.fileName = this.container.querySelector(".offer-form-file__name");

      if (this.container && this.input && this.fileName) {
        this.init();
      }
    }

    init() {
      this.setActive();
      this.input.addEventListener("change", this.setActive.bind(this));
    }

    setActive() {
      if (this.input.value) {
        this.fileName.classList.remove("_hidden");
        this.fileName.innerText = this.input.files[0].name.length > 15 ? `(${this.input.files[0].name.slice(0, 15)}...)` : `(${this.input.files[0].name})`;
      } else {
        this.fileName.classList.add("_hidden");
      }
    }
  }

  class FormValid {
    constructor(form) {
      this.form = typeof form === "string" ? document.querySelector(form) : form;
      this.inputList = gsap.utils.toArray("input", this.container);
      this.btn = this.form.querySelector("button");
      this.isValid = false;

      if (this.form && this.btn) {
        this.init();
      }
    }

    init() {
      this.checkValid();
      this.form.addEventListener("submit", (e) => this.submitHandler.call(this, e));
      this.inputList.forEach(input => input.addEventListener("change", this.checkValid.bind(this)));
    }

    checkValid() {
      if (this.inputList.every(input => input.value)) {
        this.isValid = true;
        this.form.classList.add("_valid");
      } else {
        this.isValid = false;
        this.form.classList.remove("_valid");
      }
    }

    submitHandler(e) {
      if (!this.isValid) {
        e.preventDefault();
      }
    }
  }

  // RESIZE RELOAD
  const startWindowSize = window.innerWidth;

  // const breakpoints = [375, 500, 850, 1200, 1920];
  const breakpoints = [480, 850, 1200, 1920];
  let maxBreakpoint = Infinity;
  let minBreakpoint = 480;

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

  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    if (width >= maxBreakpoint || width <= minBreakpoint) {
      location.reload();
    }
  })
  //<==

  // HEADER
  const menuDropdownList = gsap.utils.toArray(".header-menu-dropdown");
  menuDropdownList.forEach(item => new Dropdown(item));

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
  //<==

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

      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;
      const canvasWidthPrec = canvasWidth / (window.innerWidth / 100) / 100;
      const canvasHeightPrec = canvasHeight / (window.innerWidth / 100) / 100;

      renderer.setSize(canvasWidth, canvasHeight);

      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        renderer.setSize(window.innerWidth * canvasWidthPrec, window.innerWidth * canvasHeightPrec);
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

  const mainServiceSwiper = document.querySelector(".main-service-swiper");
  const mainServiceItems = gsap.utils.toArray(".main-service-list-item");

  if (window.matchMedia("(min-width: 851px)").matches) {
    if (mainServiceSwiper) {
      const swiperWrapper = mainServiceSwiper.querySelector(".swiper-wrapper");
      const docFragment = document.createDocumentFragment();

      mainServiceItems.forEach(item => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide main-service-swiper-slide";

        const content = item.querySelector(".main-service-list-item-content").innerHTML;
        slide.innerHTML = content;
        docFragment.appendChild(slide);
      })

      swiperWrapper.append(docFragment);

      const swiper = new Swiper(mainServiceSwiper, {
        direction: "vertical",
        spaceBetween: 50,
        autoHeight: true,
        allowTouchMove: false,
        speed: 1000,
      })

      const swiperNavBtns = gsap.utils.toArray(".main-service-list-item-btn");

      swiperNavBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => swiperHandler(index));
        if (swiper.activeIndex === index) {
          btn.classList.add("_active");
        }
      })

      function swiperHandler(index) {
        swiperNavBtns.forEach((btn, i) => {
          btn.classList.remove("_active");
          if (index === i) {
            btn.classList.add("_active");
            swiper.slideTo(index);
          }
        })
      }

    }
  } else {
    mainServiceItems.forEach(item => new Dropdown(item));
  }
  // <==

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
  //<==

  // TEAM
  if (document.querySelector(".team")) {
    if (window.matchMedia("(min-width: 501px)").matches) {
      const teamImgContainer = document.querySelector(".team-img");
      const teamImg = document.querySelector(".team-img__img");
      const teamList = document.querySelector(".team-list");
      const teamListItems = gsap.utils.toArray(".team-list-item");

      teamListItems.forEach(item => {
        const data = item.getAttribute("data-img");

        item.addEventListener("mouseenter", (e) => setImg(e, data, item));
        item.addEventListener("mouseleave", () => {
          item.classList.remove("_active")
        });
      })

      teamList.addEventListener("mouseleave", hideImg);

      function setImg(e, data, item) {
        const mousePos = e.clientX;
        const listRects = teamList.getClientRects();
        const listCenter = listRects[0].left + (listRects[0].width / 2);
        const isLeft = mousePos > listCenter;

        item.classList.add("_active");

        teamImg.setAttribute("src", data);
        teamImgContainer.classList.add("_active");

        if (isLeft) {
          teamImgContainer.classList.add("_left");
          teamImgContainer.classList.remove("_right");
        } else {
          teamImgContainer.classList.add("_right");
          teamImgContainer.classList.remove("_left");
        }
      }

      function hideImg() {
        teamImgContainer.classList.remove("_active");
        teamImgContainer.classList.remove("_left");
        teamImgContainer.classList.remove("_right");
      }
    }
  }
  //<==

  // business-baner
  const businessBaner = document.querySelector(".business-baner");
  if (businessBaner) {
    const line = businessBaner.querySelector(".business-baner-bg__line");
    const btn = businessBaner.querySelector(".business-baner__btn");
    const title = businessBaner.querySelector(".business-baner__title");
    const text = businessBaner.querySelector(".business-baner__text");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: businessBaner,
        start: "top 80%",
        end: "bottom top",
        toggleActions: "play none none reverse",
      }
    });

    tl.from(line, {
      x: "-100vw",
      duration: 2,
      ease: "back.out(2)",
    }, "sin");

    tl.from(title, {
      y: "-10rem",
      opacity: 0,
      duration: 1,
      delay: 0.8
    }, "sin")

    tl.from(text, {
      y: "10rem",
      opacity: 0,
      duration: 1,
      delay: 1.5,
    }, "sin")

    tl.from(btn, {
      opacity: 0,
      x: "10rem",
      duration: 1.5,
      ease: "back.out(2)",
    })

  }
  //<==

  // digital-pack
  const digitalPack = document.querySelector(".digital-pack");
  if (digitalPack) {
    const arrows = gsap.utils.toArray(".digital-pack-bg__arrow");
    const btn = digitalPack.querySelector(".digital-pack__btn");
    const title = digitalPack.querySelector(".digital-pack__title");
    const text = digitalPack.querySelector(".digital-pack__text");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: digitalPack,
        start: "top 80%",
        end: "bottom top",
        toggleActions: "play none none reverse",
      }
    });

    arrows.forEach((el, i) => {
      tl.from(el, {
        x: "-100vw",
        ease: "back.out(2)",
        duration: 2,
      }, "sin")
    })

    tl.from(title, {
      opacity: 0,
      y: "-10rem",
      duration: 1,
      delay: 0.5,
    }, "sin");

    tl.from(text, {
      opacity: 0,
      y: "10rem",
      duration: 1,
      delay: 1,
    }, "sin");

    tl.from(btn, {
      opacity: 0,
      x: "10rem",
      duration: 1,
    });

  }
  //<==

  // ABOUT
  const aboutMainImgWrapper = document.querySelector(".about-main-img-wrapper");

  if (aboutMainImgWrapper) {
    if (window.matchMedia("(min-width: 1201px)").matches) {
      const aboutMainImg = aboutMainImgWrapper.querySelector(".about-main-img");
      const imagRect = aboutMainImg.getBoundingClientRect();
      const xCenter = (imagRect.left + window.scrollX) + (imagRect.width / 2);
      const yCenter = (imagRect.top + window.scrollY) + (imagRect.height / 2);

      window.addEventListener("mousemove", (e) => rotateImage(e.pageX, e.pageY));

      function rotateImage(mouseX, mouseY) {
        const xDiff = Math.abs(mouseX - xCenter) / ((imagRect.width / 2) / 100) / 100;
        const yDiff = Math.abs(mouseY - yCenter) / ((imagRect.height / 2) / 100) / 100;

        const xDeg = gsap.utils.clamp(0, 1.5, xDiff);
        const yDeg = gsap.utils.clamp(0, 1.5, yDiff);

        aboutMainImg.style.transform = `rotateX(${mouseY > xCenter ? yDeg * -1 : yDeg}deg) rotateY(${mouseX > yCenter ? xDeg : xDeg * -1}deg) translateZ(-1rem)`
      }
    }
  }
  //<==

  // TYPES 
  if (document.querySelector(".types")) {
    const typesList = document.querySelector(".types-list");
    const typesListRect = typesList.getBoundingClientRect();
    const startPos = typesListRect.top + window.scrollY;

    const imgContainer = document.querySelector(".types-img-wrapper");
    const imgCard = imgContainer.querySelector(".types-img");
    const img = imgContainer.querySelector("img");
    const imgRect = imgContainer.getBoundingClientRect();

    class Types {
      constructor(item) {
        this.wrapper = typeof item === "string" ? document.querySelector(item) : item;
        this.content = this.wrapper.querySelector(".types-list-item-content");
        this.data = this.wrapper.getAttribute("data-img");

        if (this.wrapper && this.content) {
          this.init();
        }
      }

      init() {
        this.maxHeight = this.content.offsetHeight * 2 / 10 + "rem";
      }

      setCenter() {
        const rect = this.wrapper.getBoundingClientRect();
        this.center = (rect.top + window.scrollY) + (rect.height / 2) - startPos;
      }

      open() {
        this.content.style.maxHeight = this.maxHeight;
        this.wrapper.classList.add("_open");
        img.setAttribute("src", this.data);
        this.isOpen = true;
      }

      close() {
        this.content.style.maxHeight = 0;
        this.wrapper.classList.remove("_open");
        this.wrapper.classList.remove("_next");
        this.wrapper.classList.remove("_prev");
        this.isOpen = false;
      }

      next() {
        this.wrapper.classList.add("_next");
      }

      prev() {
        this.wrapper.classList.add("_prev");
      }
    }

    class TypesController {
      constructor(types) {
        this.types = types;

        this.init();
      }

      init() {
        this.types.forEach((type, index) => {
          type.open();
          type.setCenter();
          type.close();
          type.wrapper.addEventListener("click", (e) => {
            this.open.call(this, index);
          })
        })
        this.types.forEach((type) => {
          type.wrapper.style.transition = "0.5s";
          type.content.style.transition = "0.5s";
          if (type.wrapper.getAttribute("data-open") !== null) {
            type.open();
            imgContainer.style.top = type.center - (imgRect.height / 2) + "px";
          }
        })
      }

      open(index) {
        this.types.forEach((type) => {
          type.close();
        })
        this.types[index].open();
        if (this.types[index - 1]) {
          this.types[index - 1].prev();
        }
        if (this.types[index + 1]) {
          this.types[index + 1].next();
        }

        imgContainer.style.top = this.types[index].center - (imgRect.height / 2) + "px";
      }
    }

    const items = gsap.utils.toArray(".types-list-item");
    const types = [];

    items.forEach(item => {
      types.push(new Types(item));
    })

    new TypesController(types);

    if (window.matchMedia("(min-width: 1201px)").matches) {
      window.addEventListener("mousemove", (e) => rotateImage(e.pageX, e.pageY));

      function rotateImage(mouseX, mouseY) {
        const xCenter = (imgRect.left + window.scrollX) + (imgRect.width / 2);
        const xDiff = Math.abs(mouseX - xCenter) / ((imgRect.width / 2) / 100) / 100 * 3;

        const xDeg = gsap.utils.clamp(0, 5, xDiff);

        imgCard.style.transform = `rotateY(${mouseX > xCenter ? xDeg : xDeg * -1}deg)`;
      }
    }
  }
  //<==

  // DEVELOPMENT
  const devHistorySwiper = document.querySelector(".development-history-swiper");

  if (devHistorySwiper) {
    const swiper = new Swiper(devHistorySwiper, {
      speed: 400,
      slidesPerView: "auto",
      freeMode: true,
      spaceBetween: 16,
    })
  }

  const developmentQuestionsItems = gsap.utils.toArray(".development-questions-list-item");
  developmentQuestionsItems.forEach(item => new Dropdown(item));

  if (document.querySelector(".development-stage")) {

    const marker = document.querySelector(".development-stage-timeline__marker");

    const swiper = new Swiper(".development-stage-swiper", {
      speed: 500,
      on: {
        "slideChange": (swiper) => {
          const left = 100 / (swiper.slides.length - 1);
          marker.style.left = `calc(${left * swiper.activeIndex}% - ${swiper.activeIndex > 0 ? marker.offsetWidth : 0}px)`;
          marker.innerText = swiper.activeIndex + 1 > 9 ? swiper.activeIndex + 1 : "0" + (swiper.activeIndex + 1);

          if (swiper.activeIndex === swiper.slides.length - 1) {
            marker.classList.add("_orange");
          } else {
            marker.classList.remove("_orange");
          }
          if (swiper.activeIndex === 0) {
            marker.style.left = "0px"
          }
        },
      },
      effect: 'creative',
      creativeEffect: {
        prev: {
          translate: ["-50%", 0, -400],
          opacity: 0,
        },
        next: {
          translate: ["100%", 0, 0],
          opacity: 1
        },
      },
      pagination: {
        el: ".development-stage-pagination",
        type: "bullets",
        clickable: true,
        bulletClass: "development-stage-pagination__bullet",
        bulletActiveClass: "development-stage-pagination__bullet_active",
      },
    });

    window.swiper = swiper

    // const swiper = new Swiper(".development-stage-swiper", {
    //   speed: 1000,
    //   scrollbar: {
    //     el: ".development-stage-timeline",
    //     draggable: true,
    //     dragClass: "development-stage-timeline__marker",
    //     dragSize: 56,
    //   },
    //   on: {
    //     "slideChange": (swiper) => {
    //       marker.innerText = swiper.activeIndex + 1;
    //     }
    //   }
    // });
  }
  //<==

  // SEO
  if (window.matchMedia("(min-width: 851px)").matches && document.querySelector(".seo-steps-swiper")) {
    const swiper = new Swiper(".seo-steps-swiper", {
      freeMode: true,
      slidesPerView: "auto",
      speed: 500,
      spaceBetween: 16,
    })
  }
  //<==

  // REQUEST
  if (document.querySelector(".request")) {
    const servicesList = gsap.utils.toArray(".request-form-services__item");

    servicesList.forEach(label => new Checkbox(label));

    const contactsList = gsap.utils.toArray(".request-form-contacts__item");

    contactsList.forEach(item => new Input(item));

    if (window.matchMedia("(max-width: 850px)").matches) {
      new Swiper(".request-form-services__swiper", {
        freeMode: true,
        speed: 500,
        slidesPerView: "auto",
        spaceBetween: 8,
      })
    }
  }
  //<==

  // IMPORT-DRINKS
  if (document.querySelector('.import-drinks-main')) {
    const items = gsap.utils.toArray(".import-drinks-main-item");

    items.forEach((item, index) => {
      item.innerHTML += item.innerHTML;

      const tl = gsap.timeline({
        repeat: -1,
      })

      tl.to(item, {
        y: "50%",
        duration: 80 - index * 15,
        ease: "none",
      })
    })
  }

  const importDrinksResult = document.getElementById("import-drinks-result");
  if (importDrinksResult && window.matchMedia("(min-width: 851px)").matches) {
    var parallaxInstance = new Parallax(importDrinksResult);
  }

  const importDrinksElements = document.getElementById("import-drinks-elements");
  if (importDrinksElements) {
    var parallaxInstance = new Parallax(importDrinksElements);
  }

  if (document.querySelector(".import-drinks-visualization__container") && window.matchMedia("(min-width: 851px)").matches) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".import-drinks-visualization__container",
        scrub: 1,
        start: "-=100px top",
        end: "95% top",
      }
    })

    tl.from(".import-drinks-visualization-mob", {
      top: 0,
    }, "sin")
    tl.from(".import-drinks-visualization-mob__img", {
      y: 0,
    }, "sin")
  }

  const importDrinksTemplates = gsap.utils.toArray(".import-drinks-templates__box");
  importDrinksTemplates.forEach((box, i) => {
    const list = box.querySelector(".import-drinks-templates-list");
    const listClone = list.cloneNode(true);

    box.appendChild(listClone);

    const tl = gsap.timeline({
      repeat: -1,
    });

    tl.to(list, {
      x: i % 2 > 0 ? "100%" : "-100%",
      duration: list.children.length * 4,
      ease: "none",
    }, "sin")

    tl.to(listClone, {
      x: i % 2 > 0 ? "100%" : "-100%",
      duration: list.children.length * 4,
      ease: "none",
    }, "sin")
  })
  //<==

  //==>
  if (document.querySelector(".vacancy-open-filter")) {
    class RadioController {
      constructor(wrapper) {
        this.wrapper = typeof wrapper === "string" ? document.querySelector(wrapper) : wrapper;
        if (this.wrapper) {
          this.init();
        }
      }

      init() {
        this.labels = gsap.utils.toArray("label", this.wrapper);
        this.labels.forEach(el => {
          const input = el.querySelector("input");
          if (input.checked) {
            el.classList.remove("default-tag_white");
          } else {
            el.classList.add("default-tag_white");
          }

          input.addEventListener("change", this.handleChange.bind(this));
        })
      }

      handleChange() {
        this.labels.forEach(el => {
          const input = el.querySelector("input");
          if (input.checked) {
            el.classList.remove("default-tag_white");
          } else {
            el.classList.add("default-tag_white");
          }
        })
      }
    }

    new RadioController(".vacancy-open-filter-container");

    new Swiper(".vacancy-open-filter", {
      freeMode: true,
      slidesPerView: "auto",
    })
  }
  //<==

  const offerForm = document.querySelector(".offer-form");
  if (offerForm) {
    const inputList = gsap.utils.toArray(".offer-form-input__item");
    inputList.forEach((item) => new Input(item));

    new InputFile(".offer-form-file");

    new FormValid(".offer-form");
  }

  if (document.querySelector(".smm-keys-target-swiper")) {
    new Swiper(".smm-keys-target-swiper", {
      freeMode: false,
      slidesPerView: 1,
      spaceBetween: 50,
      speed: 500,
      autoHeight: true,
      pagination: {
        el: ".smm-keys-target-bullets",
        type: "bullets",
        bulletClass: "smm-keys-target-bullets__item",
        bulletActiveClass: "_active",
        clickable: true,
      },

      breakpoints: {
        481: {
          slidesPerView: "auto",
          freeMode: true,
          spaceBetween: 0,
          pagination: false,
          autoHeight: false,
        },
      }
    })
  }

  if (document.querySelector(".import-drinks-concept") && window.matchMedia("(max-width: 480px)").matches) {
    const slides = gsap.utils.toArray(".import-drinks-concept__img");

    const swiperWrapper = document.querySelector(".import-drinks-concept-swiper-wrapper");
    const docFragment = document.createDocumentFragment();

    slides.forEach(slide => {
      slide.classList.add("swiper-slide");
      docFragment.appendChild(slide.cloneNode(true));
    });
    swiperWrapper.append(docFragment);

    new Swiper(".import-drinks-concept-swiper", {
      speed: 500,
      spaceBetween: 50,
      pagination: {
        el: ".import-drinks-concept-bullets",
        type: "bullets",
        bulletClass: "smm-keys-target-bullets__item",
        bulletActiveClass: "_active",
        clickable: true,
      },
    })
  }

  const landingAdvantagesList = document.querySelector(".landing-advantages-list");

  if (landingAdvantagesList) {
    class LandingItemsController {
      constructor(wrapper) {
        this.itemsList = [...wrapper.children];
        this.init();
      }

      init() {
        this.itemsList.forEach((item, index) => {
          item.addEventListener("mouseenter", this.setActive.bind(this, index));
        });
      }

      setActive(i) {
        this.itemsList.forEach((item, index) => {
          if (i === index) {
            item.classList.add("_active");
          } else {
            item.classList.remove("_active");
          }
        })
      }
    }

    new LandingItemsController(landingAdvantagesList);
  }

  const importDrinksFontsContainer = document.querySelector(".import-drinks-fonts__container");
  if (importDrinksFontsContainer && window.matchMedia("(max-width: 480px)").matches) {
    const doxList = importDrinksFontsContainer.querySelectorAll(".import-drinks-fonts__box");
    const fragment = document.createDocumentFragment();
    doxList.forEach(box => {
      fragment.appendChild(box.cloneNode(true));
    });
    importDrinksFontsContainer.innerHTML = "";
    importDrinksFontsContainer.appendChild(fragment);
  }
});