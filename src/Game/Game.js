import { Monkey } from './models';

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

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    this.addModel(new Monkey(gl, { model: this.monkey, texture: this.monkeyTexture }));

    this.start();
  }

  async fetchResources() {
    this.monkey = await fetchJson('/monkey.json');
    this.monkeyTexture = await fetchImage('/monkey.png');
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
