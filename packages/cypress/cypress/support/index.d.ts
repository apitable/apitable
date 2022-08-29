declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(accountType?: 'viceAccount' | 'mainAccount'): any;
    saveCookie(): Chainable<any>;
    open(url: string, waitConnect: boolean): Chainable<any>;
    getDomByTestId(id: string): Chainable<any>;
    link(url: string): void;
    canvasClick(x: number, y: number): void
    canvasRightClick(x: number, y: number): void
  }
}
