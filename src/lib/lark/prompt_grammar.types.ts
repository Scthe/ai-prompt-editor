/* eslint-disable @typescript-eslint/no-explicit-any */

/** Look for 'class LarkOptions extends Serialize' */
export interface LarkOptions {
  /**
   * Display debug information and extra warnings. Use only when debugging
   */
  debug?: boolean;

  /**
   * Prevent the tree builder from automagically removing "punctuation" tokens
   */
  keep_all_tokens?: boolean;

  /**
   * Lark will produce trees comprised of instances of this class instead of the default `lark.Tree`.
   */
  tree_class?: any;

  /**
   * Cache the results of the Lark grammar analysis, for x2 to x3 faster loading. LALR only for now.
   * - When `False`, does nothing (default)
   * - When `True`, caches to a temporary file in the local directory
   * - When given a string, caches to the path pointed by the string
   */
  cache?: boolean | string;

  /**
   * Lexer post-processing (Default: `None`) Only works with the basic and contextual lexers.
   */
  postlex?: any;

  /**
   * Decides which parser engine to use. Accepts "earley" or "lalr". (Default: "earley").
   */
  parser?: 'earley' | 'lalr';

  /**
   * Decides whether or not to use a lexer stage
   */
  lexer?: 'auto' | 'basic' | 'contextual' | 'dynamic' | 'dynamic_complete';

  /**
   * Applies the transformer to every parse tree (equivalent to applying it after the parse, but faster)
   */
  transformer?: any;

  /**
   * The start symbol. Either a string, or a list of strings for multiple possible starts (Default: "start")
   */
  start?: string | string[];

  /**
   * How priorities should be evaluated - "auto", `None`, "normal", "invert" (Default: "auto")
   */
  priority?: 'auto' | null | 'normal' | 'invert';

  /**
   * Decides how to handle ambiguity in the parse. Only relevant if parser="earley"
   */
  ambiguity?: 'resolve' | 'explicit' | 'forest';

  /**
   * When `True`, uses the `regex` module instead of the stdlib `re`.
   */
  regex?: boolean;

  /**
   * Propagates (line, column, end_line, end_column) attributes into all tree branches.
   * Accepts `False`, `True`, or a callable, which will filter which nodes to ignore when propagating.
   */
  propagate_positions?: boolean | ((node: any) => boolean);

  /**
   * Dictionary of callbacks for the lexer. May alter tokens during lexing. Use with caution.
   */
  lexer_callbacks?: { [key: string]: any };

  /**
   * When `True`, the `[]` operator returns `None` when not matched.
   * When `False`,  `[]` behaves like the `?` operator, and returns no value at all.
   */
  maybe_placeholders?: boolean;

  /**
   * A callback for editing the terminals before parse.
   */
  edit_terminals?: (terminals: any) => any;

  /**
   * Flags that are applied to all terminals (both regex and strings)
   */
  g_regex_flags?: string;

  /**
   * Accept an input of type `bytes` instead of `str`.
   */
  use_bytes?: boolean;

  /**
   * A List of either paths or loader functions to specify from where grammars are imported
   */
  import_paths?: string[] | ((path: string) => any)[];

  /**
   * Override the source of from where the grammar was loaded. Useful for relative imports and unconventional grammar loading
   */
  source_path?: string;

  /**
   * Internal use
   */
  _plugins?: any;
}

interface LarkToken<T extends string> {
  type: T;
}

interface LarkError {
  _format_expected(expected: string[]): string;
}

/**
 * The parser expected a token, but the input ended
 *
 * An exception that is raised by the parser, when the input ends while it still expects a token.
 */
export interface UnexpectedEOF extends LarkError {
  expected: Set<string>;
  token: LarkToken<'<EOF>'>;
}
export const isUnexpectedEOFError = (e: unknown): e is UnexpectedEOF =>
  e !== null && typeof e === 'object' && hasToken(e) && !hasPosition(e);

/**
 * The lexer encountered an unexpected string
 *
 * An exception that is raised by the lexer, when it cannot match the next string of characters to any of its terminals.
 */
export interface UnexpectedCharacters extends LarkError {
  pos_in_stream: number;
  line: number;
  column: number;
  token: null;
}
export const isUnexpectedCharactersError = (
  e: unknown
): e is UnexpectedCharacters =>
  e !== null && typeof e === 'object' && !hasToken(e) && hasPosition(e);

/**
 * The parser received an unexpected token
 *
 * An exception that is raised by the parser, when the token it received doesn't match any valid step forward.
 */
export interface UnexpectedToken extends LarkError {
  pos_in_stream: number;
  line: number;
  column: number;
  token: LarkToken<string>;
  expected: Set<string>;
}
export const isUnexpectedTokenError = (e: unknown): e is UnexpectedToken =>
  e !== null && typeof e === 'object' && (hasPosition(e) || hasToken(e));

const hasPosition = (e: object) => typeof (e as any).pos_in_stream === 'number';
const hasToken = (e: object) => (e as any).token != null;

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

type PromptRules =
  | 'start'
  | 'prompt'
  | 'emphasized'
  | 'scheduled'
  | 'scheduledremove'
  | 'alternate'
  | 'plain';

// type ASTNodeChild<T extends string> = ASTValue | ASTNode<T>;

export interface ASTNode<T extends PromptRules, ChildrenType> {
  data: T;
  children: ChildrenType;
  _meta: null;
}

export interface ASTValue {
  type: string;
  start_pos: number;
  value: string;
  line: number;
  column: number;
  end_line: number;
  end_column: number;
  end_pos: number;
}

/** Matches: `aaa` */
export type PlainASTNode = ASTNode<'plain', [ASTValue]>;

/** Matches: `(aaa)` | `[aaa]` */
export type Emphasized3_ASTNode = ASTNode<
  'emphasized',
  // we will have: ['(', prompt, ')']
  [ASTValue, PromptASTNode, ASTValue]
>;

/** Matches: `(aaa:1.3)` */
export type Emphasized5_ASTNode = ASTNode<
  'emphasized',
  // we will have: ['(', prompt, ':', prompt, ')']
  [ASTValue, PromptASTNode, ASTValue, PromptASTNode, ASTValue]
>;

/** Matches: `[from:to:0.25]` */
export type Scheduled_ASTNode = ASTNode<
  'scheduled',
  // we will have: [prompt, prompt, NUMBER]
  [PromptASTNode, PromptASTNode, ASTValue]
>;

/** Matches: `[to:0.25]` */
export type ScheduledAddAfter_ASTNode = ASTNode<
  'scheduled',
  // we will have: [prompt, NUMBER]
  [PromptASTNode, ASTValue]
>;

/** Matches: `[from::0.25]` */
export type ScheduledRemoveAfter_ASTNode = ASTNode<
  'scheduledremove',
  // we will have: [prompt, NUMBER]
  [PromptASTNode, ASTValue]
>;

/** Matches: `[aaa|bbb|ccc]` */
export type AlternateASTNode = ASTNode<'alternate', Array<PromptASTNode>>;

export type PromptASTNode = ASTNode<
  'prompt',
  Array<
    | PlainASTNode //
    | Emphasized3_ASTNode
    | Emphasized5_ASTNode
    | Scheduled_ASTNode
    | ScheduledAddAfter_ASTNode
    | ScheduledRemoveAfter_ASTNode
    | AlternateASTNode
  >
>;

export type PromptASTNodeStart = ASTNode<'start', PromptASTNode[]>;
