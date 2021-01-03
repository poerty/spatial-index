import { BoundingArea } from '../base';

export type Quadratic<T> = [T, T, T, T];

export interface QuadraticArgs {
  split_x: number;
  split_y: number;
}
export const getQuadraticArgs = ({ min_x, max_x, min_y, max_y }: BoundingArea): QuadraticArgs => {
  const split_x = (min_x + max_x) >> 1;
  const split_y = (min_y + max_y) >> 1;
  return { split_x, split_y };
};

export const quadraticBoundingArea = ({ min_x, max_x, min_y, max_y }: BoundingArea, args: QuadraticArgs): Quadratic<BoundingArea> => {
  const quadratic_bounding_area: Quadratic<BoundingArea> = [
    { min_x: args.split_x, max_x, min_y: args.split_y, max_y },
    { min_x: args.split_x, max_x, min_y, max_y: args.split_y },
    { min_x, max_x: args.split_x, min_y: args.split_y, max_y },
    { min_x, max_x: args.split_x, min_y, max_y: args.split_y },
  ];

  return quadratic_bounding_area;
};

export const quadratic = <T extends BoundingArea>(input: T, args: QuadraticArgs): Quadratic<T | undefined> => {
  const quadratic_input: Quadratic<T | undefined> = [undefined, undefined, undefined, undefined];
  if (input.max_x >= args.split_x && input.max_y >= args.split_y) {
    quadratic_input[0] = input;
  }
  if (input.max_x >= args.split_x && input.min_y < args.split_y) {
    quadratic_input[1] = input;
  }
  if (input.min_x < args.split_x && input.max_y >= args.split_y) {
    quadratic_input[2] = input;
  }
  if (input.min_x < args.split_x && input.min_y < args.split_y) {
    quadratic_input[3] = input;
  }

  return quadratic_input;
};

export const quadraticList = <T extends BoundingArea>(input_list: T[], args: QuadraticArgs): Quadratic<T[]> => {
  const quadratic_input_list: Quadratic<T[]> = [[], [], [], []];
  input_list.forEach((input) => {
    if (input.max_x >= args.split_x && input.max_y >= args.split_y) {
      quadratic_input_list[0].push(input);
    }
    if (input.max_x >= args.split_x && input.min_y < args.split_y) {
      quadratic_input_list[1].push(input);
    }
    if (input.min_x < args.split_x && input.max_y >= args.split_y) {
      quadratic_input_list[2].push(input);
    }
    if (input.min_x < args.split_x && input.min_y < args.split_y) {
      quadratic_input_list[3].push(input);
    }
  });

  return quadratic_input_list;
};
