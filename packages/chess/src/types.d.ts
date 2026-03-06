declare module "chess.js" {
  export class Chess {
    constructor(fen?: string);
    move(
      move: string | { from: string; to: string; promotion?: string }
    ): { san: string } | null;
    fen(): string;
  }
}

declare module "@mliebelt/pgn-parser" {
  export function parse(
    pgn: string,
    options?: Record<string, unknown>
  ): Array<{
    tags?: Record<string, string>;
    moves?: Array<{
      notation?: { notation: string };
      commentDiag?: { clk?: string };
      commentAfter?: string;
    }>;
  }>;
}
