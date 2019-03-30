import { GLManager } from "./GLManager";
import { spring, parallel } from "popmotion";
import { Grab } from "./Grab";
import { Slides } from "./Slides";
import { reach } from "./reach";
// import { create } from "domain";

function Showcase(data) {
  this.GL = new GLManager(data);
  this.GL.createPlane();

  this.data = data;

  this.progress = 0;
  this.direction = 0.5;
  this.effect = 0;
  this.waveIntensity = 0;

  this.index = {
    target: 0,
    current: 0,
    initial: 0,
    scrollSize: window.innerHeight / 6,
    active: 0
  };

  this.follower = {
    x: 0,
    y: 0
  };

  this.followerSpring = null;

  this.slidesSpring = null;

  this.slides = new Slides(data);

  this.grab = new Grab({
    onGrabStart: this.onGrabStart.bind(this),
    onGrabMove: this.onGrabMove.bind(this),
    onGrabEnd: this.onGrabEnd.bind(this)
  });
}

Showcase.prototype.mount = function(container) {
  this.GL.mount(container);
  this.slides.mount(container);
  // container.appendChild(this.slidesContainer);
};
Showcase.prototype.render = function() {
  this.GL.render();
};
function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

Showcase.prototype.onMouseMove = function(ev) {
  if (this.followerSpring) {
    this.followerSpring.stop();
    this.followerSpring = null;
    // this.follower.vx = 0;
    // this.follower.vy = 0;
  }

  this.followerSpring = reach({
    from: { x: this.follower.x, y: this.follower.y },
    to: { x: ev.clientX, y: ev.clientY },
    velocity: { x: this.follower.vx, y: this.follower.vy },
    stiffness: 500,
    damping: 50,
    mass: 1
  }).start({
    update: position => {
      const velocity = {
        x: position.x - this.follower.x,
        y: position.y - this.follower.y
      };
      this.GL.updateRgbEffect({ position, velocity });
      // ball.style.background = "blue";
      // const transform = `
      // translate(calc(-50% + ${position.x.toFixed(
      //   2
      // )}px),calc(-50% + ${position.y.toFixed(2)}px) )`;
      // ball.style.transform = transform;
      this.follower = {
        x: position.x,
        y: position.y,
        vx: velocity.x,
        vy: velocity.y
      };
      // console.log(this.follower)
    },
    complete: () => {
      this.GL.updateRgbEffect({
        position: this.follower,
        velocity: { x: 0, y: 0 }
      });
      this.follower.vx = 0;
      this.follower.vy = 0;
    }
  });
  // this.GL.updateRgbEffect({ position, velocity });
};
Showcase.prototype.onGrabMove = function(scroll) {
  this.index.target = clamp(
    this.index.initial + scroll.delta / this.index.scrollSize,
    -this.data.length + 0.51,
    0.49
  );

  const index = clamp(Math.round(-this.index.target), 0, this.data.length - 1);

  if (this.index.active !== index) {
    this.index.active = index;
    this.slides.onActiveIndexChange(this.index.active);

    this.GL.updateTexture(index);
    if (this.textureProgressSpring) {
      this.textureProgressSpring.stop();
      this.textureProgressSpring = null;
    }
    this.textureProgressSpring = spring({
      from: 0,
      to: 1,
      stiffness: 400,
      damping: 30
    }).start(val => {
      this.GL.updateTexture(null, val);
    });
  }

  if (this.slidesPop) {
    this.slidesPop.stop();
  }
  this.slidesPop = spring({
    from: this.index.current,
    to: this.index.target,
    stiffness: 400,
    damping: 15,
    mass: 0.25
  }).start(val => {
    this.slides.onMove(val);
    this.index.current = val;
  });
};
Showcase.prototype.onGrabStart = function() {
  this.slides.appear();
  this.index.initial = this.index.current;

  if (this.GLStickPop) {
    this.GLStickPop.stop();
  }
  this.GL.scheduleLoop();

  const directionSpring = spring({
    from: this.direction,
    to: 0,
    speed: 1,
    mass: 0.25,
    stiffness: 800,
    damping: 200
  });
  const progressSpring = spring({
    from: this.progress,
    to: 1,
    mass: 2,
    stiffness: 170,
    damping: 20
  });
  const effectSpring = spring({
    from: this.effect,
    to: 1,
    mass: 2,
    stiffness: 100,
    damping: 10
  });

  const waveIntensitySpring = spring({
    from: this.waveIntensity,
    to: 0.25
  });
  this.GLStickPop = parallel(
    progressSpring,
    directionSpring,
    effectSpring,
    waveIntensitySpring
  ).start(values => {
    this.progress = values[0];
    this.direction = values[1];
    this.effect = values[2];
    this.waveIntensity = values[3];

    this.GL.updateStickEffect({
      progress: this.progress,
      direction: this.direction,
      effect: this.effect,
      waveIntensity: this.waveIntensity
    });
  });
};
Showcase.prototype.snapToIndex = function() {
  if (this.slidesPop) {
    this.slidesPop.stop();
  }
  this.slidesPop = spring({
    from: this.index.current,
    to: Math.round(this.index.target),
    stiffness: 100,
    damping: 10,
    mass: 0.5
  }).start(val => {
    this.slides.onMove(val);
    this.index.current = val;
  });
};
Showcase.prototype.onGrabEnd = function() {
  this.slides.disperse(this.index.active);

  this.snapToIndex();

  if (this.GLStickPop) {
    this.GLStickPop.stop();
  }
  const directionSpring = spring({
    from: this.direction,
    to: 1,
    speed: 1,
    mass: 0.25,
    stiffness: 800,
    damping: 200
  });
  const progressSpring = spring({
    from: this.progress,
    to: 0,
    stiffness: 170,
    damping: 20
  });
  const effectSpring = spring({
    from: this.effect,
    to: 0,
    mass: 2,
    stiffness: 500,
    damping: 100
  });

  const waveIntensitySpring = spring({
    from: this.waveIntensity,
    to: 0,
    stiffness: 500,
    damping: 50
  });

  this.GLStickPop = parallel(
    progressSpring,
    directionSpring,
    effectSpring,
    waveIntensitySpring
  ).start({
    update: values => {
      this.progress = values[0];
      this.direction = values[1];
      this.effect = values[2];
      this.waveIntensity = values[3];
      this.GL.updateStickEffect({
        progress: this.progress,
        direction: this.direction,
        effect: this.effect,
        waveIntensity: this.waveIntensity
      });
    },
    complete: () => {
      this.GL.cancelLoop();
    }
  });
};

Showcase.prototype.onResize = function() {
  this.GL.onResize();
};
export { Showcase };
