import { Triangle } from './models';

export default class Game {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl');
    window.gl = this.gl;
    this.shaders = [];
    this.models = [];
    this.init();
  }
  init() {
    const { gl } = this;
    const triangle = new Triangle(gl);
    this.addModel(triangle);

    this.createProgram();
    this.draw();
  }

  addModel(model) {
    this.models.push(model);
    for (let i = 0; i < model.shaders.length; i++) {
      this.shaders.push(model.shaders[i]);
    }
  }

  draw() {
    const { models } = this;
    for (let i = 0; i < models.length; i++) {
      models[i].draw();
    }
  }

  createProgram(shaders) {
    const { gl } = this;
    const program = gl.createProgram();
    for (let i = 0; i < this.shaders.length; i++) {
      gl.attachShader(program, this.shaders[i]);
    }
    gl.linkProgram(program);
    gl.useProgram(program);
    for (let i = 0; i < this.models.length; i++) {
      this.models[i].attachProgram(program);
    }
    return program;
  }
}
