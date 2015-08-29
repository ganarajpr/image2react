'use babel';

import {CompositeDisposable} from 'event-kit';
import path from 'path';
import _ from 'underscore-plus';
import ImageEditorElement from './ImageEditorElement';
import ImageEditorComponent from './ImageEditorComponent';
import React from 'react-for-atom';
//import ImageEditorStatusView from './ImageEditorStatusView';
var uiProviders = [];
var uriComponentMap = {};
const imageExtensions = ['.jpeg', '.jpg', '.png'];

function openURI(uriToOpen) {
    var uriExtension = path.extname(uriToOpen).toLowerCase();
    if (_.include(imageExtensions, uriExtension)) {
        return createView(uriToOpen);
    }
}


function createView (uri): HTMLElement {

  var hostElement = new ImageEditorElement().initialize(uri);
  var component = React.render(<ImageEditorComponent filePath={uri}/>,
    hostElement);
  //uriComponentMap[uri] = component;
  // TODO(most): unmount component on tab close.

  return hostElement;
}

class Image2react {
    constructor() {
        this.active = false;
    }

    isActive() {
        return this.active;
    }

    activate(state: ?any) {
        this.openerDisposable = atom.workspace.addOpener(openURI);
    }

    deactivate() {
        return this.openerDisposable.dispose();
    }

    consumeStatusBar(statusBar) {
        //var view = new ImageEditorStatusView(statusBar);
        //return view.attach();
    }
}

export default new Image2react();
