import { mat4, glMatrix } from 'gl-matrix';
import { Monkey, Cube } from './models';

const fetchImage = url => new Promise(r => {
  const image = new Image();
  image.onload = () => r(image);
  image.src = url;
});

const fetchJson = async url => {
  return (await fetch(url)).json();
};

export default class Game {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl');
    window.gl = this.gl;
    this.models = [];
    this.init();
  }

  async init() {
    const { gl } = this;
    await this.fetchResources();
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);
    mat4.identity(this.projMatrix);
    mat4.perspective(
      this.projMatrix,
      glMatrix.toRadian(45),
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000.0,
    );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    this.addModel(new Cube(gl, { texture: this.crateTexture }));
    this.addModel(new Monkey(gl, { model: this.monkey, texture: this.monkeyTexture }));

    this.start();
  }

  async fetchResources() {
    this.monkey = await fetchJson('/monkey.json');
    this.monkeyTexture = await fetchImage('/monkey.png');
    this.crateTexture = await fetchImage('/crate.jpg');
  }

  start() {
    const loop = () => {
      const now = performance.now() / 1000;
      const camX = Math.sin(now / 3 * Math.PI) * 3;
      const camY = 0;
      const camZ = Math.cos(now / 3 * Math.PI) * 9;

      mat4.lookAt(
        this.viewMatrix,
        [camX, camY, camZ],
        [0, 0, 0],
        [0, 1, 0],
      );
      for (let i = 0; i < this.models.length; i++) {
        this.models[i].draw(this.viewMatrix, this.projMatrix);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  addModel(model) {
    this.models.push(model);
  }
}
