import { Triangle } from './models';

export default class Game {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl');
    window.gl = this.gl;
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
  }

  get shaders() {
    const { models } = this;
    const _shaders = [];

    for (let i = 0; i < models.length; i++) {
      for (let j = 0, shaders = models[i].shaders; j < shaders.length; j++) {
        _shaders.push(shaders[j]);
      }
    }

    return _shaders;
  }

  draw() {
    const { models } = this;
    for (let i = 0; i < models.length; i++) {
      models[i].draw();
    }
  }

  createProgram() {
    const { gl, shaders, models } = this;
    const program = gl.createProgram();

    for (let i = 0; i < shaders.length; i++) {
      gl.attachShader(program, shaders[i]);
    }

    gl.linkProgram(program);
    gl.useProgram(program);

    for (let i = 0; i < models.length; i++) {
      models[i].attachProgram(program);
    }

    return program;
  }
}
