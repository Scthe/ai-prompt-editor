import { PromptAstGroup } from 'parser';
import { useState, useEffect } from 'react';
import { GptToken, tokenizeGpt4 } from 'utils/gpt4Tokenizer';

export const useGpt4Tokens = (astRoot: PromptAstGroup | undefined) => {
  const [tokens, setTokens] = useState<GptToken[]>([]);

  useEffect(() => {
    if (astRoot) {
      const tokens = tokenizeGpt4(astRoot);
      setTokens(tokens);
    } else {
      setTokens([]);
    }
  }, [astRoot]);

  return tokens;
};
