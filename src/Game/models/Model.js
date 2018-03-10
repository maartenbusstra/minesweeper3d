export default class Model {
  constructor(gl, program) {
    this.gl = gl;
    this.createShaders();
  }

  attachProgram(program) {
    this.program = program;
    this.prepare();
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
}
