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


  // MAIN BLOB
  // const canvas = document.getElementById("main-canvas");
  const canvas = document.querySelector("canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: canvas.getContext("webgl"),
    antialias: true,
    alpha: true
  });

  const simplex = new SimplexNoise();

  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  camera.position.z = 5;

  let geometry = new THREE.SphereGeometry(0.8, 128, 128);

  let material = new THREE.MeshPhongMaterial({
    color: 0xFAC68D,
    shininess: 100
  });

  let lightTop = new THREE.DirectionalLight(0xF990B3, 1);
  lightTop.position.set(0, 500, 200);
  lightTop.castShadow = true;
  scene.add(lightTop);

  let lightBottom = new THREE.DirectionalLight(0xF99B6E, 1);
  lightBottom.position.set(0, -500, 400);
  lightBottom.castShadow = true;
  scene.add(lightBottom);

  let ambientLight = new THREE.AmbientLight(0xFF518A);
  scene.add(ambientLight);

  let sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);

  const animSpeed = 50;
  const animSpikes = 0.9;
  const animProccesing = 1.3;

  let update = () => {
    let time = performance.now() * 0.00001 * animSpeed * Math.pow(1, 3),
      spikes = animSpikes * animProccesing;

    for (let i = 0; i < sphere.geometry.vertices.length; i++) {
      let p = sphere.geometry.vertices[i];
      p.normalize().multiplyScalar(1.5 + 0.3 * simplex.noise3D(p.x * spikes, p.y * spikes, p.z * spikes + time));
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

})