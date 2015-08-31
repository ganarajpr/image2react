'use babel';

import {CompositeDisposable} from 'event-kit';
import path from 'path';
import _ from 'underscore-plus';
import ImageEditorElement from './ImageEditorElement';
import ImageEditorComponent from './ImageEditorComponent';
import React from 'react-for-atom';
import {File,closeAllWatchers} from 'pathwatcher';
var uiProviders = [];
var uriComponentMap = {};
const imageExtensions = ['.jpeg', '.jpg', '.png'];
var bbFile;

function openURI(uriToOpen) {
    var uriExtension = path.extname(uriToOpen).toLowerCase();
    if (_.include(imageExtensions, uriExtension)) {
        return createBoundingBoxFile(uriToOpen).then((isNew)=>{
            var bbox = {};
            if(!isNew){
                return bbFile.read().then((bbdata)=>{
                    if(bbdata){
                        bbox = JSON.parse(bbdata);
                    }
                    return createView(uriToOpen,bbox);
                })
            }
            else{
                return createView(uriToOpen,bbox);
            }
        });
    }
}

function createBoundingBoxFile(imageUri){
    var imagePath = path.parse(imageUri);
    var bbPath = _.clone(imagePath);
    bbPath.ext = ".json";
    bbPath.name = imagePath.name + "_bb";
    var pathName = path.join(bbPath.dir,bbPath.name+bbPath.ext);
    bbFile = new File(pathName);
    return bbFile.create();
}

function onEdit(bbdata){
    bbFile.write(JSON.stringify(bbdata));
}

function createView (uri,bbox): HTMLElement {

  var hostElement = new ImageEditorElement().initialize(uri);
  var component = React.render(<ImageEditorComponent onEdit={onEdit} boxes={bbox.boxes} filePath={uri}/>,
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
        closeAllWatchers();
        return this.openerDisposable.dispose();
    }

    consumeStatusBar(statusBar) {
        //var view = new ImageEditorStatusView(statusBar);
        //return view.attach();
    }
}

export default new Image2react();
