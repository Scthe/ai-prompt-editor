import React, { useEffect, useState } from 'react';
import { AstDiffTable } from 'components/promptDetails';
import { PromptAstTokenDiff, diffAstTrees } from 'parser';
import { ResultCardProps } from './resultCard';

// TODO show: all, only added, only removed, only changed
export const ResultTabDiff = (props: ResultCardProps) => {
  const tokenDiffs = useDiffAstTrees(props);

  return <AstDiffTable tokenDiffs={tokenDiffs} />;
};

const useDiffAstTrees = (props: ResultCardProps) => {
  const astBefore = props.before.result?.ast;
  const astAfter = props.after.result?.ast;

  const [diffs, setDiffs] = useState<PromptAstTokenDiff[]>([]);

  useEffect(() => {
    if (astBefore && astAfter) {
      setDiffs(diffAstTrees(astBefore, astAfter));
    }
  }, [astAfter, astBefore]);

  return diffs;
};
