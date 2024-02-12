import { ParsingMessage, PromptAstGroup, WeightedToken } from 'parser';
import { AstTextNode, getAllTexts, isAstTextNode, traverse } from '.';

export const writeWeights = (
  root: PromptAstGroup,
  weights: WeightedToken[],
  messages: ParsingMessage[]
) => {
  const weightsMap = createTokenWeightsMap(weights);

  const nodes: Array<AstTextNode> = [];
  traverse(root, (node) => {
    if (isAstTextNode(node)) {
      nodes.push(node);
    }
  });

  nodes.forEach((node) => {
    let names = getAllTexts(node);
    const possiblyWasRemoved = names.some((t) => t.length === 0);
    names = names.filter((t) => t.length > 0);

    const weights = names.map((name) => weightsMap[name]);
    const weight = weights.find((e) => e !== undefined);

    /*console.log(names, {
      names,
      weights,
      weight,
      weightsMap,
    });*/
    if (weight !== undefined) {
      node.resolvedWeight = weight;
    } else if (!possiblyWasRemoved) {
      console.warn(`Missing weight for`, node);
      messages.push({
        level: 'warning',
        text: `AST has '${names.join('|')}', but webui seems to have missed it`,
      });
    }
  });
};

const createTokenWeightsMap = (weights: WeightedToken[]) => {
  const result: Record<string, number | undefined> = {};

  weights.forEach(([text, weight]) => {
    result[text] = weight;
  });

  return result;
};
