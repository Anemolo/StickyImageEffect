import {
  Showcase
} from "./Showcase";
import {
  Slides
} from "./Slides";

const container = document.getElementById("app");

const slidesData = [{
    // https://unsplash.com/photos/2_Ip8Tfi8jM
    // No credit required
    image: "https://images.unsplash.com/photo-1487768047333-c8781e88b283?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Creativity"
  },
  {
    // https://unsplash.com/photos/Y2G16TB2fws
    // No credit required
    image: "https://images.unsplash.com/photo-1519058497187-7167f17c6daf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2048&q=100",
    title: "Time"
  },
  {
    //https://unsplash.com/photos/6tx6K80_IJw
    // No credit required
    image: "https://images.unsplash.com/photo-1520883579495-5592ae324d5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Home"
  },
  {
    // https://unsplash.com/photos/05Y_dRUcMaQ
    // No credit required
    image: "https://images.unsplash.com/photo-1514296138597-3cbbf6ca4239?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Curiosity"
  },
  {
    // https://unsplash.com/photos/hAb_8YM2kJw
    // No credit required
    image: "https://images.unsplash.com/photo-1500336866626-5a47b3158a48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Order"
  }
];

const slides = new Slides(slidesData);
const showcase = new Showcase(slidesData, {
  onActiveIndexChange: activeIndex => {
    slides.onActiveIndexChange(activeIndex);
  },
  onIndexChange: index => {
    slides.onMove(index);
  },
  onZoomOutStart: ({
    activeIndex
  }) => {
    slides.appear();
  },
  onZoomOutFinish: ({
    activeIndex
  }) => {},
  onFullscreenStart: ({
    activeIndex
  }) => {
    slides.disperse(activeIndex);
  },
  onFullscreenFinish: ({
    activeIndex
  }) => {}
});

showcase.mount(container);
slides.mount(container);
showcase.render();

window.addEventListener("resize", function () {
  showcase.onResize();
});

window.addEventListener("mousemove", function (ev) {
  showcase.onMouseMove(ev);
});