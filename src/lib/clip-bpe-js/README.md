- Original repo: https://github.com/josephrocca/clip-bpe-js
- Original licence: https://github.com/josephrocca/clip-bpe-js/blob/main/LICENSE

I have converted it to TS so it has typings and cause we need better interoperability with both esbuild and Jest. Ok, let's be honest, it will be Jest causing problems.

If you debug webui, it's called ['clip-vit-large-patch14'](https://huggingface.co/openai/clip-vit-large-patch14). Other sources:

- https://github.com/huggingface/transformers/blob/58e3d23e97078f361a533b9ec4a6a2de674ea52a/src/transformers/models/clip/tokenization_clip.py#L272
- https://github.com/mlfoundations/open_clip/blob/main/src/open_clip/tokenizer.py
- https://github.com/openai/CLIP/blob/main/clip/simple_tokenizer.py

## License text

MIT License

Copyright (c) 2023 josephrocca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
