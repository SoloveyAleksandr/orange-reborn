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
})