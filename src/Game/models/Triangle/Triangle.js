/* eslint import/no-webpack-loader-syntax: off */
import Model from '../Model';
import vertShaderSrc from '!raw-loader!./vertexShader.glsl';
import fragShaderSrc from '!raw-loader!./fragmentShader.glsl';

export default class Triangle extends Model {
  vertices = [
  //  x     y      r    g    b
     0.0,  0.5,   1.0, 0.0, 0.0,
    -0.5, -0.5,   0.0, 1.0, 0.0,
     0.5, -0.5,   0.0, 0.0, 1.0,
  ];
  constructor(gl, program) {
    super(gl, program);
    this.gl = gl;
    this.program = program;
    this.init();
  }

  init() {
    this.createShaders();
  }

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
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const vertPositionLocation = gl.getAttribLocation(this.program, 'vertPosition');
    gl.vertexAttribPointer(
      vertPositionLocation,
      2,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0,
    );

    const vertColorLocation = gl.getAttribLocation(this.program, 'vertColor');
    gl.vertexAttribPointer(
      vertColorLocation,
      3,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT,
    )

    gl.enableVertexAttribArray(vertPositionLocation);
    gl.enableVertexAttribArray(vertColorLocation);
  }

  draw() {
    const { gl } = this;
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
