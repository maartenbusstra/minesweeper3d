import { Cube } from './models';

export default class Game {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl');
    window.gl = this.gl;
    this.models = [];
    this.init();
  }
  init() {
    const { gl } = this;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    this.addModel(new Cube(gl));

    this.start();
  }

  start() {
    const loop = () => {
      for (let i = 0; i < this.models.length; i++) {
        this.models[i].draw();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  addModel(model) {
    this.models.push(model);
  }
}
