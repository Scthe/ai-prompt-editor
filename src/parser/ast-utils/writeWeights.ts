import {
  ParsingMessage,
  PromptAstGroup,
  PromptAstToken,
  WeightedToken,
} from 'parser';
import { traverse } from '.';

export const writeWeights = (
  root: PromptAstGroup,
  weights: WeightedToken[],
  messages: ParsingMessage[]
) => {
  const nodes: PromptAstToken[] = [];

  traverse(root, (node) => {
    if (node.type === 'token') {
      nodes.push(node);
    }
  });

  const weightsMap = createTokenWeightsMap(weights);
  nodes.forEach((node) => {
    const w = weightsMap[node.value];
    if (w !== undefined) {
      node.resolvedWeight = w;
    } else {
      console.warn(`Missing weight for '${node.value}'`);
      messages.push({
        level: 'warning',
        text: `AST has '${node.value}', but webui seems to have missed it`,
      });
    }
  });
};

const createTokenWeightsMap = (weights: WeightedToken[]) => {
  const result: Record<string, number> = {};

  weights.forEach(([text, weight]) => {
    result[text] = weight;
  });

  return result;
};
