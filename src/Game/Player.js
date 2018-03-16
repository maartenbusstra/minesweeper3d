import { glMatrix } from 'gl-matrix';

export default class Player {
  constructor() {
    this.movementSpeed = 0.14;
    this.lookSensitivity = 2;
    this.position = [0, 0, 0];
    this.orientation = 0;
  }

  moveForward() {
    const orientation = glMatrix.toRadian(this.orientation);

    this.position = [
      this.position[0] - Math.sin(orientation) * this.movementSpeed,
      this.position[1],
      this.position[2] + Math.cos(orientation) * this.movementSpeed,
    ];
  }

  moveBackward() {
    const orientation = glMatrix.toRadian(this.orientation);

    this.position = [
      this.position[0] + Math.sin(glMatrix.toRadian(this.orientation)) * this.movementSpeed,
      this.position[1],
      this.position[2] - Math.cos(glMatrix.toRadian(this.orientation)) * this.movementSpeed,
    ];
  }

  turnLeft() {
    this.orientation = this.orientation - this.lookSensitivity;
  }

  turnRight() {
    this.orientation = this.orientation + this.lookSensitivity;
  }
}
