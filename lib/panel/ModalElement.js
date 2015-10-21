'use babel';

/* @flow */
import React from 'react-for-atom';
import ModalComponent from './ModalComponent';

class ModalElement extends HTMLElement {

  initialize(path) {
    return this;
  }


  attachedCallback() {
    var content = "";
    React.render(
        <ModalComponent textContent={content}/>,
      this
    );
  }

  setModalContent(content){
    React.render(
        <ModalComponent textContent={content}/>,
      this
    );
  }

  detachedCallback() {
    React.unmountComponentAtNode(this);
  }

}

module.exports = ModalElement = document.registerElement('modal-element', {
  prototype: ModalElement.prototype,
});
