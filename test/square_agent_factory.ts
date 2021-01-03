import { BaseAgent } from '../src/base';

export class SquareAgentFactory {
  canvas_size: number;

  constructor({ canvas_size }: { canvas_size: number }) {
    this.canvas_size = canvas_size;
  }

  createList({ length, square_size }: { length: number; square_size: number }): BaseAgent[] {
    return new Array(length).fill(0).map(() => {
      const min_x = Math.random() * (this.canvas_size - square_size);
      const min_y = Math.random() * (this.canvas_size - square_size);
      return new BaseAgent({
        min_x,
        max_x: min_x + square_size,
        min_y,
        max_y: min_y + square_size,
      });
    });
  }
}
