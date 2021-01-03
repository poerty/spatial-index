import { QuadTree } from '../src';

import { SquareAgentFactory } from './square_agent_factory';

const CANVAS_SIZE = 1000;

const square_agent_factory = new SquareAgentFactory({ canvas_size: CANVAS_SIZE });

describe('QuadTree', () => {
  it('empty', () => { /**/ });
  it('temp', () => {

    const agent_list = square_agent_factory.createList({
      length: 1000000,
      square_size: 1,
    });
    const search_agent_list = square_agent_factory.createList({
      length: 1000,
      square_size: 10,
    });

    console.time('build');
    const min_x = 0;
    const max_x = CANVAS_SIZE;
    const min_y = 0;
    const max_y = CANVAS_SIZE;
    const quad_tree = new QuadTree({
      bounding_area: { min_x, max_x, min_y, max_y },
    });

    quad_tree.bulkAdd(agent_list);
    console.timeEnd('build');

    console.time('search');
    search_agent_list.forEach((box) => {
      quad_tree.search({ bounding_area: box });
    });

    const search_result = quad_tree.search({
      bounding_area: {
        min_x: 1,
        max_x: 2,
        min_y: 1,
        max_y: 2,
      },
    });
    console.log('search_result: ', search_result);
    console.timeEnd('search');
  });
});
