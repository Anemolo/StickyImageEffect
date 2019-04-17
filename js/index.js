import { Showcase } from "./Showcase";
import { Slides } from "./Slides";
import { Cursor } from "./Cursor";
import image1 from "../images/1.jpg";
import image2 from "../images/2.jpg";
import image3 from "../images/3.jpg";
import image4 from "../images/4.jpg";
import image5 from "../images/5.jpg";

const container = document.getElementById("app");
const cursor = new Cursor(document.querySelector(".cursor"));
const slidesData = [
  {
    image: image1,
    title: "Segovia",
    meta: "Spain / Castile and León"
  },
  {
    image: image2,
    title: "Barcelona",
    meta: "Spain / Catalonia"
  },
  {
    image: image3,
    title: "Málaga",
    meta: "Spain / Andalusia"
  },
  {
    image: image4,
    title: "Pamplona",
    meta: "Spain / Navarre"
  },
  {
    image: image5,
    title: "Bilbao",
    meta: "Spain / Biscay"
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
  onZoomOutStart: ({ activeIndex }) => {
    cursor.enter();
    slides.appear();
  },
  onZoomOutFinish: ({ activeIndex }) => {},
  onFullscreenStart: ({ activeIndex }) => {
    cursor.leave();
    slides.disperse(activeIndex);
  },
  onFullscreenFinish: ({ activeIndex }) => {}
});

showcase.mount(container);
slides.mount(container);
showcase.render();

window.addEventListener("resize", function() {
  showcase.onResize();
});

window.addEventListener("mousemove", function(ev) {
  showcase.onMouseMove(ev);
});
