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
    this.modalComponent = React.render(
        <ModalComponent textContent={content}/>,
      this
    );
  }

  setModalContent(content){
    this.modalComponent._editor.setText(content);
  }

  detachedCallback() {
    React.unmountComponentAtNode(this);
  }

}

module.exports = ModalElement = document.registerElement('modal-element', {
  prototype: ModalElement.prototype,
});
