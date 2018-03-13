export default class Model {
  constructor(gl) {
    this.gl = gl;
    this.createShaders();
    this.createProgram();
    this.init();
  }

  createShader(type, src) {
    const { gl } = this;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`ERROR compiling shader`, gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  createProgram() {
    const { gl, shaders } = this;
    this.program = gl.createProgram();

    for (let i = 0; i < shaders.length; i++) {
      gl.attachShader(this.program, shaders[i]);
    }

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(`Could not compile WebGL program. \n\n ${gl.getProgramInfoLog(this.program)}`);
    }
  }
}
