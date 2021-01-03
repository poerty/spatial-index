import { BaseAgent, CompareAgent, BoundingArea, isUnitBoundingArea } from '../base';

import { getQuadraticArgs, quadraticBoundingArea, quadratic, Quadratic, quadraticList } from './utils';

interface QuadTreeNodeArgs<Agent extends BaseAgent> {
  agent_list: Agent[];
}
type NonLeafQuadTreeNode<Agent extends BaseAgent> = QuadTreeNode<Agent> & {
  child_node_list: Quadratic<QuadTreeNode<Agent>>;
  agent_count: -1;
};
export class QuadTreeNode<Agent extends BaseAgent> {
  child_node_list: Quadratic<QuadTreeNode<Agent>> | [];
  agent_list: Agent[];
  agent_count: number;

  constructor(args: QuadTreeNodeArgs<Agent>) {
    this.child_node_list = [];
    this.agent_list = args.agent_list;
    this.agent_count = this.agent_list.length;
  }

  private isNonLeaf(): this is NonLeafQuadTreeNode<Agent> {
    return this.agent_count === -1;
  }

  public add(agent: Agent, bounding_area: BoundingArea) {
    if (this.isNonLeaf()) {
      this.agent_count++;
      const quadratic_args = getQuadraticArgs(bounding_area);
      const quadratic_bounding_area = quadraticBoundingArea(bounding_area, quadratic_args);
      const quadratic_agent = quadratic(agent, quadratic_args);
      quadratic_agent.forEach((local_agent, index) => {
        if (local_agent) {
          this.child_node_list[index].add(local_agent, quadratic_bounding_area[index]);
        }
      });
    } else {
      this.agent_list.push(agent);
      this.agent_count++;
    }
  }

  public remove(target_agent: Agent, bounding_area: BoundingArea, compareAgent: CompareAgent<Agent>): boolean {
    if (this.isNonLeaf()) {
      const quadratic_args = getQuadraticArgs(bounding_area);
      const quadratic_bounding_area = quadraticBoundingArea(bounding_area, quadratic_args);
      const quadratic_agent = quadratic(target_agent, quadratic_args);

      for (let i = 0; i < 4; i++) {
        const local_agent = quadratic_agent[i];
        if (local_agent) {
          const deleted = this.child_node_list[i].remove(local_agent, quadratic_bounding_area[i], compareAgent);
          if (deleted) {
            return true;
          }
        }
      }

      return false;
    } else {
      const target_index = this.agent_list.findIndex((agent) => compareAgent(agent, target_agent));
      if (target_index !== -1) {
        this.agent_count--;
        this.agent_list[target_index] = this.agent_list[this.agent_count];
        return true;
      }

      return false;
    }
  }

  public split(max_agent_count: number, max_node_depth: number, node_depth: number, bounding_area: BoundingArea) {
    if (isUnitBoundingArea(bounding_area) || max_node_depth <= node_depth) {
      return this;
    }

    if (this.isNonLeaf()) {
      const quadratic_args = getQuadraticArgs(bounding_area);
      const quadratic_bounding_area = quadraticBoundingArea(bounding_area, quadratic_args);
      for (let i = 0; i < 4; i++) {
        this.child_node_list[i].split(max_agent_count, max_node_depth, node_depth + 1, quadratic_bounding_area[i]);
      }
      return this;
    } else {
      if (max_agent_count > this.agent_count) {
        return this;
      }

      this.child_node_list = [
        new QuadTreeNode({ agent_list: [] }),
        new QuadTreeNode({ agent_list: [] }),
        new QuadTreeNode({ agent_list: [] }),
        new QuadTreeNode({ agent_list: [] }),
      ];

      const quadratic_args = getQuadraticArgs(bounding_area);
      const quadratic_bounding_area = quadraticBoundingArea(bounding_area, quadratic_args);
      const quadratic_agent_list = quadraticList(this.agent_list, quadratic_args);

      this.agent_list = [];
      this.agent_count = -1;
      for (let i = 0; i < 4; i++) {
        quadratic_agent_list[i].forEach((agent) => this.child_node_list[i].add(agent, quadratic_bounding_area[i]));
        this.child_node_list[i].split(max_agent_count, max_node_depth, node_depth + 1, quadratic_bounding_area[i]);
      }

      return this;
    }
  }

  public search(target_agent_list: Agent[], bounding_area: BoundingArea, search_bounding_area: BoundingArea) {
    if (this.isNonLeaf()) {
      const quadratic_args = getQuadraticArgs(bounding_area);
      const quadratic_bounding_area = quadraticBoundingArea(bounding_area, quadratic_args);
      const quadratic_input = quadratic(search_bounding_area, quadratic_args);
      for (let i = 0; i < 4; i++) {
        if (quadratic_input[i]) {
          this.child_node_list[i].search(target_agent_list, quadratic_bounding_area[i], search_bounding_area);
        }
      }
    } else {
      target_agent_list.push(...this.agent_list);
    }
  }

  public getPossibleCollisionList(): Array<[Agent, Agent]> {
    return [];
  }
}
