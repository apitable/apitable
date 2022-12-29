import 'cypress-wait-until';
import { PIPE_LINE } from 'cypress/support/config';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const MAIN_ACCOUNT = {
  credential: 'qwer1234',
  username: 'e2e@vikadata.com',
};
const VICE_ACCOUNT = {
  credential: 'qwer1234',
  username: 'e2e_sub@vikadata.com',
};

Cypress.Commands.add('login', (accountType: 'viceAccount' | 'mainAccount' = 'mainAccount') => {
  cy.request('post', '/api/v1/auth/signIn\n', {
    data: 'FutureIsComing',
    type: 'password',
    ...(accountType === 'mainAccount' ? MAIN_ACCOUNT : VICE_ACCOUNT),
  }).then(res => {
    const cookie = res.headers['set-cookie'];

    if (document.cookie.includes('XSRF-TOKEN')) {
      return;
    }
    Array.isArray(cookie) && cookie.forEach(c => {
      if (c.split(';')[0].split('=')[0] === 'XSRF-TOKEN') cy.setCookie('XSRF-TOKEN', c.split(';')[0].split('=')[1]);
      if (c.split(';')[0].split('=')[0].includes('SESSION')) cy.setCookie('SESSION', c.split(';')[0].split('=')[1]);
    });
  });
});

Cypress.Commands.add('saveCookie', (done) => {
  const token = cy.getCookie('XSRF-TOKEN').then(c => {
    c && cy.setCookie('XSRF-TOKEN', c.value);
  });
  const session = cy.getCookie('SESSION').then(c => {
    c && cy.setCookie('SESSION', c.value);
  });
});

Cypress.Commands.add('link', (url: string) => {
  if (Cypress.env('pipeline')) {
    url = url + `?pipeline=${Cypress.env('pipeline')}`;
  }
  cy.visit(url).wait(2000);
});

Cypress.Commands.add('open', (url: string, waitConnect: boolean = true) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      cy.stub(win.console, 'log').as('consoleLog');
    },
  });
  if (!waitConnect) {
    return;
  }
  // You need to watchRoom and then do subsequent operations, currently you can listen to the "resourceRevisions" printed on the console as a basis for judgment
  cy.waitUntil(() => {
    return cy.get('@consoleLog', {
      timeout: 200000,
    }).should('be.calledWithMatch', /resourceRevisions/);
  }, {
    timeout: 200000,
  });
});

// Cypress.Commands.add('link', (nodeName: string) => {
//   cy.get('.treeViewRoot').eq(0).find('.style_nodeItemWrapper__2Hkl3').contains(new RegExp(`^${nodeName}$`)).click();
//   cy.wait(2000);
// });

Cypress.Commands.add('getDomByTestId', (id: string) => {
  return cy.get(`[data-test-id=${id}]`);
});

Cypress.Commands.add('canvasClick', (x: number, y: number) => {
  return cy.get('canvas').trigger('mousemove', x, y).trigger('mousemove', x, y).click(x, y);
});

Cypress.Commands.add('canvasRightClick', (x: number, y: number) => {
  return cy.get('canvas').trigger('mousemove', x, y).trigger('mousemove', x, y).rightclick(x, y);
});
