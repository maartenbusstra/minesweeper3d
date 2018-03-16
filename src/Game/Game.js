import { mat4, glMatrix } from 'gl-matrix';
import { Monkey, Cube } from './models';
import Player from './Player';

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
    this.input = {
      FORWARD: false,
      BACKWARD: false,
      LEFT: false,
      RIGHT: false,
    };
  }

  async init() {
    const { gl } = this;
    await this.fetchResources();
    this.player = new Player();

    this.cameraMatrix = new Float32Array(16);
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);
    mat4.identity(this.projMatrix);
    mat4.identity(this.viewMatrix);
    mat4.translate(this.viewMatrix, this.viewMatrix, [0, -1, 0]);


    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    this.addModel(new Cube(gl, { texture: this.crateTexture }));
    this.addModel(new Monkey(gl, { model: this.monkey, texture: this.monkeyTexture }));

    this.initInput();
    this.start();
  }

  initInput() {
    document.addEventListener('keydown', e => {
      if (e.code === 'KeyW') this.input.FORWARD = true;
      if (e.code === 'KeyS') this.input.BACKWARD = true;
      if (e.code === 'KeyA') this.input.LEFT = true;
      if (e.code === 'KeyD') this.input.RIGHT = true;
    });
    document.addEventListener('keyup', e => {
      if (e.code === 'KeyW') this.input.FORWARD = false;
      if (e.code === 'KeyS') this.input.BACKWARD = false;
      if (e.code === 'KeyA') this.input.LEFT = false;
      if (e.code === 'KeyD') this.input.RIGHT = false;
    });
  }

  async fetchResources() {
    this.monkey = await fetchJson('/monkey.json');
    this.monkeyTexture = await fetchImage('/monkey.png');
    this.crateTexture = await fetchImage('/crate.jpg');
  }

  start() {
    const { gl } = this;
    const loop = () => {
      const { FORWARD, BACKWARD, LEFT, RIGHT } = this.input;
      if (FORWARD) this.player.moveForward();
      if (BACKWARD) this.player.moveBackward();
      if (LEFT) this.player.turnLeft();
      if (RIGHT) this.player.turnRight();

      gl.canvas.width = document.documentElement.clientWidth;
      gl.canvas.height = document.documentElement.clientHeight;

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0.7, 0.7, 0.7, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);


      mat4.rotate(this.cameraMatrix, this.viewMatrix, glMatrix.toRadian(this.player.orientation), [0, 1, 0]);
      mat4.translate(
        this.cameraMatrix, this.cameraMatrix,
        this.player.position
      );

      mat4.perspective(
        this.projMatrix,
        glMatrix.toRadian(45),
        gl.canvas.width / gl.canvas.height,
        0.1,
        1000.0,
      );

      for (let i = 0; i < this.models.length; i++) {
        this.models[i].draw(this.cameraMatrix, this.projMatrix);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  addModel(model) {
    this.models.push(model);
  }
}
