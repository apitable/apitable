export interface IGrammar {
  Value: RegExp;
  And: RegExp;
  Or: RegExp;
  Not: RegExp;
  LeftParen: RegExp;
  RightParen: RegExp;
}

export const BOOLEAN_EXPR_GRAMMAR: IGrammar = {
  Value: /[a-zA-Z0-9_$@?.]+/,
  And: /&&/,
  Or: /\|\|/,
  Not: /!/,
  LeftParen: /\(/,
  RightParen: /\)/,
};
