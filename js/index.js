import { Showcase } from "./Showcase";

const container = document.getElementById("app");

const slidesData = [
  {
    // https://unsplash.com/photos/natjj0CTa-s
    // No credit required
    image:
      "https://images.unsplash.com/photo-1487768047333-c8781e88b283?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Creativity"
  },
  {
    // https://unsplash.com/photos/Y2G16TB2fws
    // No credit required
    image:
      "https://images.unsplash.com/photo-1519058497187-7167f17c6daf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2048&q=100",
    title: "Time"
  },
  {
    //https://unsplash.com/photos/rPE1qDdoVVI
    // No credit required
    image:
      "https://images.unsplash.com/photo-1520883579495-5592ae324d5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Home"
  },
  {
    // https://unsplash.com/photos/yKwJCJuz7Z0
    // No credit required
    image:
      "https://images.unsplash.com/photo-1514296138597-3cbbf6ca4239?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Curiosity"
  },
  {
    // https://unsplash.com/photos/PUQfHoZh0o8
    // No credit required
    image:
      "https://images.unsplash.com/photo-1500336866626-5a47b3158a48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    title: "Order"
  }
];

const app = new Showcase(slidesData);

app.mount(container);
app.render();

window.addEventListener("resize", function() {
  app.onResize();
});
