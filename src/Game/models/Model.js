export default class Model {
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
