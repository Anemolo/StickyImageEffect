import * as THREE from "three";
import { fragment, vertex } from "./shaders";

function GLManager(data) {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  camera.position.z = 5;

  const scene = new THREE.Scene();
  camera.lookAt = scene.position;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  this.render = this.render.bind(this);
  this.textures = data.map((entry, i) =>
    new THREE.TextureLoader().load(
      entry.image,
      this.calculateAspectRatioFactor.bind(this, i)
    )
  );
  this.factors = data.map(d => new THREE.Vector2(1, 1));
  this.currentIndex = 0;
  this.nextIndex = 0;
  this.textureProgress = 0;
  this.camera = camera;
  this.scene = scene;
  this.renderer = renderer;
  this.meshes = [];
  this.initialRender = false;
  this.time = 0;
  this.loopRaf = null;
  this.loop = this.loop.bind(this);
}
GLManager.prototype.getViewSize = function() {
  const fovInRadians = (this.camera.fov * Math.PI) / 180;
  const viewSize = Math.abs(5 * Math.tan(fovInRadians / 2) * 2);

  return viewSize;
};
GLManager.prototype.getPlaneSize = function() {
  const viewSize = this.getViewSize();
  return { width: viewSize * 1.5, height: viewSize };
};
GLManager.prototype.calculateAspectRatioFactor = function(index, texture) {
  const plane = this.getPlaneSize();
  const windowRatio = window.innerWidth / window.innerHeight;
  const rectRatio = (plane.width / plane.height) * windowRatio;
  const imageRatio = texture.image.width / texture.image.height;

  let factorX = 1;
  let factorY = 1;
  if (rectRatio > imageRatio) {
    factorX = 1;
    factorY = (1 / rectRatio) * imageRatio;
  } else {
    factorX = (1 * rectRatio) / imageRatio;
    factorY = 1;
  }

  this.factors[index] = new THREE.Vector2(factorX, factorY);
  if (this.currentIndex === index) {
    this.meshes[0].material.uniforms.u_textureFactor.value = this.factors[
      index
    ];
    this.meshes[0].material.uniforms.u_textureFactor.needsUpdate = true;
  }
  if (this.nextIndex === index) {
    this.meshes[0].material.uniforms.u_texture2Factor.value = this.factors[
      index
    ];
    this.meshes[0].material.uniforms.u_texture2Factor.needsUpdate = true;
  }
  if (this.initialRender) {
    console.log("rendering");
    this.render();
  }
};
// Plane Stuff
GLManager.prototype.createPlane = function() {
  // Calculate bas of Isoceles triangle(camera)
  const viewSize = this.getViewSize();
  const { width, height } = this.getPlaneSize();

  const segments = 60;
  const geometry = new THREE.PlaneBufferGeometry(
    width,
    height,
    segments,
    segments
  );
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_texture: { type: "t", value: this.textures[this.currentIndex] },
      u_textureFactor: { type: "f", value: this.factors[this.currentIndex] },
      u_texture2: { type: "t", value: this.textures[this.nextIndex] },
      u_texture2Factor: { type: "f", value: this.factors[this.nextIndex] },
      u_textureProgress: { type: "f", value: this.textureProgress },
      u_viewSize: { type: "f", value: viewSize },
      u_progress: { type: "f", value: 0 },
      u_direction: { type: "f", value: 0 },
      u_effect: { type: "f", value: 0 },
      u_time: { type: "f", value: this.time },
      u_waveIntensity: { type: "f", value: 0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  this.scene.add(mesh);
  this.meshes.push(mesh);
};
GLManager.prototype.updateTexture = function(newIndex, progress) {
  let didChange = false;
  if (newIndex != null && this.newIndex !== this.currentIndex) {
    this.currentIndex = this.nextIndex;
    this.nextIndex = newIndex;
    this.textureProgress = 0;
    this.meshes[0].material.uniforms.u_textureProgress.value = 0;
    this.meshes[0].material.uniforms.u_texture.value = this.textures[
      this.currentIndex
    ];
    this.meshes[0].material.uniforms.u_textureFactor.value = this.factors[
      this.currentIndex
    ];
    this.meshes[0].material.uniforms.u_texture2.value = this.textures[newIndex];

    this.meshes[0].material.uniforms.u_texture2Factor.value = this.factors[
      newIndex
    ];

    didChange = true;
  }
  if (progress != null && progress !== this.textureProgress) {
    this.meshes[0].material.uniforms.u_textureProgress.value = progress;
    this.textureProgress = progress;
    didChange = true;
  }

  if (!this.loopRaf && didChange) {
    this.render();
  }
};
GLManager.prototype.update = function({
  progress,
  direction,
  effect,
  waveIntensity
}) {
  this.meshes[0].material.uniforms.u_progress.value = progress;
  this.meshes[0].material.uniforms.u_direction.value = direction;
  this.meshes[0].material.uniforms.u_effect.value = effect;
  this.meshes[0].material.uniforms.u_waveIntensity.value = waveIntensity;
  // this.render();
};
// Other stuff
GLManager.prototype.render = function() {
  if (!this.initialRender) {
    this.initialRender = true;
  }
  this.renderer.render(this.scene, this.camera);
};
GLManager.prototype.mount = function(container) {
  container.appendChild(this.renderer.domElement);
};
GLManager.prototype.unmount = function() {
  for (let i = 0; i < this.meshes.length; i++) {
    this.meshes.material.dispose();
    this.meshes.geometry.dispose();
  }
  this.mesh = null;
  this.renderer = null;
  this.camera = null;
  this.scene = null;
  this.container = null;
};
GLManager.prototype.onResize = function() {
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  for (var i = 0; i < this.textures.length; i++) {
    if (this.textures[i].image) {
      this.calculateAspectRatioFactor(i, this.textures[i]);
    }
  }

  this.render();
};
GLManager.prototype.scheduleLoop = function() {
  if (this.loopRaf) return;
  this.loop();
};

GLManager.prototype.loop = function() {
  this.render();
  this.time += 0.1;
  this.meshes[0].material.uniforms.u_time.value = this.time;

  this.loopRaf = requestAnimationFrame(this.loop);
};

GLManager.prototype.cancelLoop = function() {
  cancelAnimationFrame(this.loopRaf);
  this.loopRaf = null;
};

export { GLManager };
