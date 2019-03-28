const createEleWithClass = (tag, className) => {
  const ele = document.createElement(tag);
  ele.className = className;
  return ele;
};

class Slides {
  constructor(data) {
    this.data = data;
    this.container = createEleWithClass("div", "slides");
    // container.className = "slides";

    this.slides = this.data.map((entry, index) => {
      const slide = createEleWithClass("div", "slide");
      const title = createEleWithClass("h1", "slide-title");
      if (index === 0) {
        title.style.color = "#f9f9f9";
      } else {
        this.slides[i].firstChild.style.color = "transparent";
        slide.classList.add("next");
      }
      title.innerHTML = entry.title;
      slide.appendChild(title);
      this.container.appendChild(slide);
      return slide;
    });
  }
  mount(container) {
    container.appendChild(this.container);
  }
  onActiveIndexChange(activeIndex) {
    for (let i = 0; i < this.slides.length; i++) {
      if (activeIndex === i) {
        this.slides[i].firstChild.style.color = "#f9f9f9";
        this.slides[i].classList.remove("next");
        this.slides[i].classList.remove("prev");
      } else {
        this.slides[i].firstChild.style.color = "transparent";
        if (activeIndex > i) {
          this.slides[i].classList.remove("next");
          this.slides[i].classList.add("prev");
        } else {
          this.slides[i].classList.add("next");
          this.slides[i].classList.remove("prev");
        }
      }
    }
  }
  onMove(indexFloat) {
    this.container.style.transform = `translateY(${(indexFloat * 100) /
      this.slides.length}%)`;
  }
  appear() {
    this.container.classList.add("scrolling");
  }
  disperse(activeIndex) {
    this.container.classList.remove("scrolling");
    for (let index = 0; index < this.data.length; index++) {
      if (index > activeIndex) {
        this.slides[index].classList.add("next");
        this.slides[index].classList.remove("prev");
      } else if (index < activeIndex) {
        this.slides[index].classList.remove("next");
        this.slides[index].classList.add("prev");
      } else {
        this.slides[index].classList.remove("next");
        this.slides[index].classList.remove("prev");
      }
    }
  }
}

export { Slides };
