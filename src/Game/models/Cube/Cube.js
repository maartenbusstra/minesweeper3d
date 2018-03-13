/* eslint import/no-webpack-loader-syntax: off */
import { mat4, glMatrix } from 'gl-matrix';
import Model from '../Model';
import vertShaderSrc from '!raw-loader!./vertexShader.glsl';
import fragShaderSrc from '!raw-loader!./fragmentShader.glsl';

export default class Cube extends Model {
  constructor(...args) {
    super(...args);
    this.identityMatrix = new Float32Array(16);
    mat4.identity(this.identityMatrix);
  }

  vertices = [
    // X, Y, Z           R, G, B

    // Top
    -1.0, 1.0, -1.0,   0.2, 0.2, 0.2,
    -1.0, 1.0, 1.0,    0.2, 0.2, 0.2,
    1.0, 1.0, 1.0,     0.2, 0.2, 0.2,
    1.0, 1.0, -1.0,    0.2, 0.2, 0.2,

    // Left
    -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
    1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
    1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
    1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
    1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
    1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
    -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
    1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
    1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
  ];

  indices = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
  ];


  get shaders() {
    return [this.vertShader, this.fragShader];
  }

  createShaders() {
    const { gl } = this;
    this.vertShader = this.createShader(gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShader = this.createShader(gl.FRAGMENT_SHADER, fragShaderSrc);
  }

  prepare() {
    const { gl } = this;
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    const vertPositionLocation = gl.getAttribLocation(this.program, 'vertPosition');
    gl.vertexAttribPointer(
      vertPositionLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );

    const vertColorLocation = gl.getAttribLocation(this.program, 'vertColor');
    gl.vertexAttribPointer(
      vertColorLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(vertPositionLocation);
    gl.enableVertexAttribArray(vertColorLocation);

    this.mWorldLocation = gl.getUniformLocation(this.program, 'mWorld');
    this.mViewLocation = gl.getUniformLocation(this.program, 'mView');
    const mProjLocation = gl.getUniformLocation(this.program, 'mProj');

    this.worldMatrix = new Float32Array(16);
    this.xRotationMatrix = new Float32Array(16);
    this.yRotationMatrix = new Float32Array(16);
    this.viewMatrix = new Float32Array(16);
    const projMatrix = new Float32Array(16);

    mat4.identity(this.xRotationMatrix);
    mat4.identity(this.yRotationMatrix);
    mat4.identity(this.worldMatrix);
    mat4.perspective(
      projMatrix,
      glMatrix.toRadian(45),
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000.0,
    );

    gl.uniformMatrix4fv(this.mWorldLocation, gl.FALSE, this.worldMatrix);
    gl.uniformMatrix4fv(mProjLocation, gl.FALSE, projMatrix);
  }

  draw() {
    const { gl } = this;
    const now = performance.now() / 1000;
    const camX = Math.sin(now / 2 * Math.PI) * 10;
    const camY = (Math.sin(now / 4 * Math.PI) + 1) * 2;
    const camZ = Math.cos(now / 2 * Math.PI) * 3;

    mat4.lookAt(
      this.viewMatrix,
      [camX, camY, camZ],
      [0, 0, 0],
      [0, 1, 0],
    );

    gl.uniformMatrix4fv(this.mViewLocation, gl.FALSE, this.viewMatrix);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
