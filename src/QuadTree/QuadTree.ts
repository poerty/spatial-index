import { BaseAgent, CompareAgent, BoundingArea, SpatialIndex, defaultCompareAgent } from '../base';

import { QuadTreeNode } from './QuadTreeNode';

const MAX_AGENT_COUNT_PER_NODE = 3;
const DEFAULT_MAX_NODE_DEPTH = 32;

interface QuadTreeProps<Agent extends BaseAgent> {
  bounding_area: BoundingArea;
  max_agent_count_per_node?: number;
  max_node_depth?: number;
  compareAgent?: CompareAgent<Agent>;
}
type QuadTreeSearchArgs = {
  bounding_area: BoundingArea;
};
export class QuadTree<Agent extends BaseAgent> implements SpatialIndex<Agent, QuadTreeSearchArgs> {
  private root_node: QuadTreeNode<Agent>;
  private bounding_area: BoundingArea;

  private max_agent_count_per_node: number;
  private max_node_depth: number;
  private compareAgent: CompareAgent<Agent>;

  constructor(props: QuadTreeProps<Agent>) {
    this.root_node = new QuadTreeNode({ agent_list: [] });
    this.bounding_area = props.bounding_area;
    this.max_agent_count_per_node = props.max_agent_count_per_node || MAX_AGENT_COUNT_PER_NODE;
    this.max_node_depth = props.max_node_depth || DEFAULT_MAX_NODE_DEPTH;
    this.compareAgent = props.compareAgent || defaultCompareAgent;
  }

  public add(agent: Agent) {
    this.root_node.add(agent, this.bounding_area);
    // TODO: split after add to leaf node (in QuadTreeNode)
    this.root_node.split(this.max_agent_count_per_node, this.max_node_depth, 0, this.bounding_area);
    return true;
  }

  public bulkAdd(agent_list: Agent[]) {
    agent_list.forEach((agent) => this.root_node.add(agent, this.bounding_area));
    // TODO: need to test below versus
    // 1. split after add to leaf node (in QuadTreeNode)
    // 2. split once from the root node
    this.root_node.split(this.max_agent_count_per_node, this.max_node_depth, 0, this.bounding_area);
    return true;
  }

  public remove(agent: Agent) {
    this.root_node.remove(agent, this.bounding_area, this.compareAgent);
    return true;
  }

  public search(args: QuadTreeSearchArgs) {
    const target_agent_list: Agent[] = [];
    this.root_node.search(target_agent_list, this.bounding_area, args.bounding_area);
    return target_agent_list;
  }
}
