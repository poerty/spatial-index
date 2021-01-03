type BaseAgentProps = {
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
};

export class BaseAgent {
  public min_x: number;
  public max_x: number;
  public min_y: number;
  public max_y: number;

  constructor(props: BaseAgentProps) {
    if ('x' in props) {
      this.min_x = props.x;
      this.max_x = props.x + props.width;
      this.min_y = props.y;
      this.max_y = props.y + props.height;
    } else {
      this.min_x = props.min_x;
      this.max_x = props.max_x;
      this.min_y = props.min_y;
      this.max_y = props.max_y;
    }
  }
}

export type CompareAgent<Agent extends BaseAgent> = (agent_1: Agent, agent_2: Agent) => boolean;
export const defaultCompareAgent = (agent_1: BaseAgent, agent_2: BaseAgent) => agent_1.min_x === agent_2.min_x && agent_1.max_x === agent_2.max_x && agent_1.min_y === agent_2.min_y && agent_1.max_y === agent_2.max_y;
