/* eslint import/no-webpack-loader-syntax: off */
import { mat4, glMatrix } from 'gl-matrix';
import Model from '../Model';
import vertShaderSrc from '!raw-loader!./vertexShader.glsl';
import fragShaderSrc from '!raw-loader!./fragmentShader.glsl';

export default class Monkey extends Model {
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
    const mesh = this.model.meshes[0];

    this.vertices = [].concat.apply([], mesh.vertices);
    this.indices = [].concat.apply([], mesh.faces);
    this.texCoords = mesh.texturecoords[0];
    this.normals = mesh.normals;

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
    this.texCoordBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const vertPositionLocation = gl.getAttribLocation(this.program, 'vertPosition');
    gl.vertexAttribPointer(
      vertPositionLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.enableVertexAttribArray(vertPositionLocation);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    const vertTexCoordLocation = gl.getAttribLocation(this.program, 'vertTexCoord');
    gl.vertexAttribPointer(
      vertTexCoordLocation,
      2,
      gl.FLOAT,
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.enableVertexAttribArray(vertTexCoordLocation);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    const vertNormalLocation = gl.getAttribLocation(this.program, 'vertNormal');
    gl.vertexAttribPointer(
      vertNormalLocation,
      3,
      gl.FLOAT,
      gl.TRUE,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.enableVertexAttribArray(vertNormalLocation);
  }

  createTextures() {
    const { gl } = this;
    this.boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.boxTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.texture,
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  draw() {
    const { gl } = this;
    const now = performance.now() / 1000;
    const camX = Math.sin(now / 4 * Math.PI) * 5;
    const camY = Math.cos(now / 4 * Math.PI) * 5;

    mat4.lookAt(
      this.viewMatrix,
      [camX, camY, 1],
      [0, 0, 0],
      [0, 0, 1],
    );

    // mat4.rotate(this.worldMatrix, this.identityMatrix, glMatrix.toRadian(45), 1.0);

    gl.useProgram(this.program);
    gl.bindTexture(gl.TEXTURE_2D, this.boxTexture);
    gl.activeTexture(gl.TEXTURE0);

    gl.uniformMatrix4fv(this.mWorldLocation, gl.FALSE, this.worldMatrix);
    gl.uniformMatrix4fv(this.mViewLocation, gl.FALSE, this.viewMatrix);
    gl.uniformMatrix4fv(this.mProjLocation, gl.FALSE, this.projMatrix);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
