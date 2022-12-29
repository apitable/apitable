import { deleteField, openFieldMenu } from 'cypress/support/common';

describe('Copy Linked Tables', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();
  });

  it('This table can be managed, and related tables can be managed', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    openFieldMenu('可管理 E');

    cy.get('.react-contexify__item').eq(4).click().then(() => {
      expect(cy.get('.styles_grid__3MkPW .styles_fieldNameWrapper__3f71C').contains('可管理 E的副本')).to.be.exist;
    });

    cy.open('/space/spcfan7hTtnxg/workbench/dst8HJcU0KPW5z5BCy/viwlUBUjYg20r').then(() => {
      expect(cy.get('.styles_grid__3MkPW .styles_fieldNameWrapper__3f71C').contains('可管理 A 2')).to.be.exist;
    });

    deleteField('可管理 A 2');

    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU').then(() => {
      cy.get('.styles_grid__3MkPW .styles_fieldNameWrapper__3f71C').each($el => {
        $el.map((index, dom) => {
          expect(dom.innerText).to.not.match(/可管理 E的副本/);
        });
      });
    });
  });

  it('This table can be managed and related tables can be edited', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    openFieldMenu('可编辑 B');

    cy.get('.react-contexify__item').eq(4).click().then(() => {
      expect(cy.get('.styles_grid__3MkPW .styles_fieldNameWrapper__3f71C').contains('可编辑 B的副本')).to.be.exist;
    });

    cy.open('/space/spcfan7hTtnxg/workbench/dstwSUth6wVblDR3HC/viwsCy2XqN0pK').then(() => {
      expect(cy.get('.styles_grid__3MkPW .styles_fieldNameWrapper__3f71C').contains('可管理 A 2')).to.be.exist;
    });

    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    deleteField('可编辑 B的副本');

    cy.get('.styles_grid__3MkPW .styles_fieldNameWrapper__3f71C').each($el => {
      $el.map((index, dom) => {
        expect(dom.innerText).to.not.match(/可编辑 B的副本/);
      });
    });
  });

  it('This table can be managed, and related tables can be viewed', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    openFieldMenu('可查看 C');

    cy.get('.react-contexify__item--disabled').each($el => {
      $el.map((index, dom) => {
        expect(dom.innerText).to.be.match(/复制列/);
      });
    });
  });

  it('This table can be managed, and access to related tables is prohibited', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    openFieldMenu('不可见 D');

    cy.get('.react-contexify__item--disabled').each($el => {
      $el.map((index, dom) => {
        expect(dom.innerText).to.be.match(/复制列/);
      });
    });
  });

});
