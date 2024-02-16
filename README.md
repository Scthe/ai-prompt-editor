# AI Prompt Editor ([DEMO](https://scthe.github.io/ai-prompt-editor/))

If you have worked with AUTOMATIC1111's [Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) for even an hour, you know dealing with prompts is tiresome. There is no syntax highlight, or debug messages. The features are [poorly explained](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features). For example, everything at the start of the prompt (or after `BREAK`) is more important. But do we know where the [75-token](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#infinite-prompt-length) `BREAK` will be inserted?

With my AI Prompt Editor, you can:

- Visualize the prompt as a list of tokens or AST.
- Combine several snippets into 1 prompt. No more text files to copy and paste from. Instead, create 2 groups: `Environment - castle` and `Environment - city`. Toggle between them and copy the generated prompt.
- See the inner workings of the [CLIP tokenizer](https://huggingface.co/docs/transformers/model_doc/clip). Check how `BREAK` affects the token count. Debug where 75 token `BREAK`s are placed.
- Get warnings if your prompt might not parse correctly. Did you forget to close a `)`? Or maybe you have provided a `masterpiece` twice?
- Syntax highlight.

What's more, I've also added a [prompt/image diff](https://scthe.github.io/ai-prompt-editor/#/diff/):

- Compare changes between 2 prompts.
- Read prompts from AI-generated images. It's all in the [Exif](https://en.wikipedia.org/wiki/Exif).

## Examples


https://github.com/Scthe/ai-prompt-editor/assets/9325337/24cd91a4-1e7f-4f66-b436-a91c74ee6895


_In the left panel, the user adds the term 'masterpiece'. It is shown in the details panel on the right. We can change the view mode, and inspect AST and CLIP tokens. We are warned that 'masterpiece' already exists in the prompt. In the results tab, we are shown the final prompt that was merged from groups: 'My super style', 'Subject', 'Environment and misc', and 'BREAK preview'. Groups can be toggled on/off, moved around, etc. The details panel at the bottom reflects the changes in real time._

<br /><br />


https://github.com/Scthe/ai-prompt-editor/assets/9325337/b9ef7d3b-417d-4e68-9ae4-cff5db59cbd6



_The user adds the term 'aaaaa' to the 'Prompt Before'. The panel on the bottom detects that this term exists in 'Prompt Before', but was removed in 'Prompt After'. The user drags images to both prompts. The original prompts are read from images and compared. The 'Models' tab (available only for images) contains settings like step count, CFG scale, or sampler._

## How does this work?

[Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) is open-source. We know what happens to the prompt. It's all a matter of converting the code to JS. It goes like this:

1. Remove LoRAs and Hypernetworks from the prompt text.
1. Use Lark to parse the prompt using [grammar](https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L15).
2. Use lark transformers to [resolve the values](https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L100) for scheduled and alternate based on the current step.
3. Generate the final prompt after scheduled and alternate are replaced. This is a string. We no longer use AST after this step. We only needed it to parse scheduled and alternate.
4. Use a [regex](https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L352) to get an array of tuples: `("text", attention)`. E.g. `[("house, tree,hill,sky", 1.3), ("flowers", 1.1)]`.
5. Use CLIP tokenizer to [generate](https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/sd_hijack_clip.py#L84) `PromptChunks`. Each `PromptChunk` contains CLIP-encoded token IDs and their weights. Each chunk contains 77 tokens, but 2 are reserved for start and end tokens.

In JS I could use [Lark.js](https://pypi.org/project/lark-js/) to generate a parser for the first 2 steps. In step 4 I have used the same regex. For the CLIP tokenizer, I adapted the code from [clip-bpe-js](https://github.com/josephrocca/clip-bpe-js).

## Usage

Normally, the first step is to compile [lark grammar](src/lib/lark/prompt_grammar.lark) into `src/lib/lark/prompt_grammar_lark.js`. I've decided to commit this file into the repo, as GitHub would not be able to deploy the page without it. See ["Generating JS file from lark grammar"](#generating-js-file-from-lark-grammar) below for more info.

The rest is the usual yarn stuff:

1. `yarn install`
1. `yarn start` <- dev server
1. Go to [http://localhost:8000/](http://localhost:8000/)

### Other commands

- `yarn build`. Builds prod version into `./build`.
- `yarn preview`. Builds prod version into `./build`, starts [http-server](https://www.npmjs.com/package/http-server).
- `yarn clean`. Remove all files from `./build`.
- `yarn lint`. Runs linter.
- `yarn ts-dry`. Dry test compiles the whole project using TypeScript.
- `yarn test`. Run tests.
- `yarn test:watch`. Run tests in watch mode.

### Generating JS file from lark grammar

Follow this instruction only if you need to generate `prompt_grammar_lark.js` from scratch. As mentioned before, I've already commited this file into git.

1. `pip install lark-js`. Install `Lark.js`.
2. `yarn lark:compile`. Compiles `src/lib/lark/prompt_grammar.lark` into `src/lib/lark/prompt_grammar_lark.js`
3. Edit `src/lib/lark/prompt_grammar_lark.js` with the following fixes:
   1. Find `var DATA = {... options: { ... }}` and remove `strict` and `ordered_sets` from options.
   2. Find `const util = typeof require !== 'undefined' && require('util');` and replace it with `const util = undefined;`.

You should have the same file as the one [provided by me](src/lib/lark/prompt_grammar_lark.js) (minus some prettier formatting). You can always diff both files if something is not working.

Interesting process, right? I will not comment on this. If you thought external libraries would work with even the simplest cases, you've chosen the wrong profession.

## FAQ

**Q: How accurate is the token count?**

Should be quite accurate, maybe with an extra comma somewhere. The algorithm is the same. I've made small modifications to lark grammar. Webui uses `Earley`, but `Lark.js` only has a **much** stricter `LALR` parser. The regex is the same and so should be the CLIP tokenizer. Merging snippets is surprisingly not easy (what if you forgot to close a brace?).

I've decided to be stricter than webui. Prompts like e.g. `(aaa, BREAK bbb)` are not allowed. While webui will accept it, it does not do what you think it does. I mean, webui does not report errors, so it will accept everything. Btw. whitespace before and after `BREAK` is **always** required.

**Q: Where can I find the code for parsing the prompt?**

The main flow is in [src/parser/index.ts](src/parser/index.ts). Each subsequent step has its own function, so it should be easy to navigate.

Keep in mind that building AST and CLIP tokenization is slow. I've moved this inside the [web worker](src/hooks/useParsedPrompt.ts#L29). This makes it hard to debug using browser tools. Personally, I don't mind. The code in `src/parser` is covered by unit tests. If you need the debugger, run Jest from Visual Studio Code's `JavaScript Debug Terminal`.

**Q: Can I debug scheduled/alternate?**

Scheduled/alternate prompts are parsed and visible in AST. In the final prompt, they will be always resolved using `step=0`, `maxStep=10`. This is currently [hardcoded](src/parser/resolveAlternateAndScheduled.ts). You can change the values in the code and it will resolve correctly (check `resolveAlternateAndScheduled.test.ts`). I just have not written a UI to configure this easier. Maybe some separate `Variants` tab? Anyway, both features are rarely used, so debugging them using AST should be enough.

**Q: Does it support styles?**

It does not support `{prompt}` syntax. Instead, create a new group and drag it into the right place. In the video above, 'My super style' is an example.

**Q: Is there a specification for Exif data for AI-generated images?**

Maybe. I've tested with my images and a few ones found on [civitai](https://civitai.com/).

## References

- AUTOMATIC1111's [Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui).
- [lark](https://github.com/lark-parser/lark).
- [Lark.js](https://pypi.org/project/lark-js/).
- [clip-bpe-js](https://github.com/josephrocca/clip-bpe-js). Basis for CLIP tokenizer.
- A lot of [huggingface](https://huggingface.co/).

And JS:

- [react-simple-code-editor](https://github.com/react-simple-code-editor/react-simple-code-editor). I have tested many editors. I'd rather not drop a full-on CodeMirror here. `react-simple-code-editor` just.. worked? Then I followed instructions for Prism integration and it also worked?
- [Prism](https://prismjs.com/).
- [Zustand](https://github.com/pmndrs/zustand).
- [ExifReader](https://github.com/mattiasw/ExifReader).
- [Framer Motion](https://www.framer.com/motion/).
- [@dnd-kit](https://dndkit.com/).
- [Material Design Icons (mdi)](https://pictogrammers.com/library/mdi/).
- yarn, esbuild, TypeScript, React, Tailwind CSS, Jest. The usual stack.
  - Have fun [working with ASTs](src/lib/lark/prompt_grammar.types.ts#L243) without TypeScript.
