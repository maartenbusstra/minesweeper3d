/* eslint import/no-webpack-loader-syntax: off */
import { mat4, glMatrix } from 'gl-matrix';
import Model from '../Model';
import vertShaderSrc from '!raw-loader!./vertexShader.glsl';
import fragShaderSrc from '!raw-loader!./fragmentShader.glsl';

export default class Monkey extends Model {
  static vertices = [
    // X, Y, Z          U, V

    // Top
    -1.0, 1.0, -1.0,    0, 0,
    -1.0, 1.0,  1.0,    0, 1,
     1.0, 1.0,  1.0,    1, 1,
     1.0, 1.0, -1.0,    1, 0,

    // Left
    -1.0,  1.0,  1.0,   1, 1,
    -1.0, -1.0,  1.0,   0, 1,
    -1.0, -1.0, -1.0,   0, 0,
    -1.0,  1.0, -1.0,   1, 0,

    // Right
    1.0,  1.0,  1.0,    1, 1,
    1.0, -1.0,  1.0,    0, 1,
    1.0, -1.0, -1.0,    0, 0,
    1.0,  1.0, -1.0,    1, 0,

    // Front
     1.0,  1.0, 1.0,    1, 1,
     1.0, -1.0, 1.0,    1, 0,
    -1.0, -1.0, 1.0,    0, 0,
    -1.0,  1.0, 1.0,    0, 1,

    // Back
     1.0,  1.0, -1.0,   0, 0,
     1.0, -1.0, -1.0,   0, 1,
    -1.0, -1.0, -1.0,   1, 1,
    -1.0,  1.0, -1.0,   1, 0,

    // Bottom
    -1.0, -1.0, -1.0,   1, 1,
    -1.0, -1.0,  1.0,   1, 0,
     1.0, -1.0,  1.0,   0, 0,
     1.0, -1.0, -1.0,   0, 1,

  ];
  static indices = [
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

  init() {
    const { gl } = this;
    this.identityMatrix = new Float32Array(16);
    this.worldMatrix = new Float32Array(16);
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);
    this.mWorldLocation = gl.getUniformLocation(this.program, 'mWorld');
    this.mViewLocation = gl.getUniformLocation(this.program, 'mView');
    this.mProjLocation = gl.getUniformLocation(this.program, 'mProj');
    mat4.identity(this.identityMatrix);
    mat4.identity(this.worldMatrix);
    mat4.identity(this.projMatrix);
    mat4.perspective(
      this.projMatrix,
      glMatrix.toRadian(45),
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000.0,
    );
    this.createBuffers();
    this.createTextures();
  }

  createShaders() {
    const { gl } = this;
    this.vertShader = this.createShader(gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShader = this.createShader(gl.FRAGMENT_SHADER, fragShaderSrc);
  }

  get shaders() {
    return [this.vertShader, this.fragShader];
  }

  createBuffers() {
    const { gl } = this;
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Monkey.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Monkey.indices), gl.STATIC_DRAW);

    const vertPositionLocation = gl.getAttribLocation(this.program, 'vertPosition');
    gl.vertexAttribPointer(
      vertPositionLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );

    const vertTexCoordLocation = gl.getAttribLocation(this.program, 'vertTexCoord');
    gl.vertexAttribPointer(
      vertTexCoordLocation,
      2,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(vertPositionLocation);
    gl.enableVertexAttribArray(vertTexCoordLocation);
  }

  createTextures() {
    const { gl } = this;
    this.boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('crate'))
    gl.bindTexture(gl.TEXTURE_2D, null);
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

    gl.useProgram(this.program);
    gl.bindTexture(gl.TEXTURE_2D, this.boxTexture);
    gl.activeTexture(gl.TEXTURE0);

    gl.uniformMatrix4fv(this.mWorldLocation, gl.FALSE, this.worldMatrix);
    gl.uniformMatrix4fv(this.mViewLocation, gl.FALSE, this.viewMatrix);
    gl.uniformMatrix4fv(this.mProjLocation, gl.FALSE, this.projMatrix);
    gl.drawElements(gl.TRIANGLES, Monkey.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
