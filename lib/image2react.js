'use babel';

import {CompositeDisposable} from 'event-kit';
import path from 'path';
import _ from 'underscore-plus';
import ImageEditorElement from './ImageEditorElement';
import ImageButtonElement from './panel/ImageButtonElement';

import {File} from 'atom';

var uiProviders = [];
var uriComponentMap = {};
const imageExtensions = ['.png', '.jpeg', '.jpg'];

var bbFile;


function openURI(uriToOpen) {
    if (uriToOpen.indexOf('.image2react') > -1) {
        var uriToOpen = uriToOpen.replace('.image2react','');
        return createView(uriToOpen,{});
        // return createBoundingBoxFile(uriToOpen).then((isNew)=>{
        //     var bbox = {};
            // if(!isNew){
            //     return bbFile.read().then((bbdata)=>{
            //         if(bbdata){
            //             bbox = JSON.parse(bbdata);
            //             var formattedBbox =  bbox.boxes.map(function (box) {
            //                 return [
            //                     box.startX,
            //                     box.startY,
            //                     box.endX,
            //                     box.endY,
            //                     box.type
            //                 ];
            //             });
            //             var boundTree = boundingTree(formattedBbox);
            //             console.log(boundTree);
            //         }
            //         return createView(uriToOpen,bbox);
            //     })
            // }
        //     return createView(uriToOpen,bbox);
        // });
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
  return new ImageEditorElement().initialize(uri,bbox.boxes);
}

class Image2react {
    constructor() {
        this.active = false;
    }

    isActive() {
        return this.active;
    }

    onActivePaneChange(editor){
        if(this.buttonPanel){
          this.buttonPanel.destroy();
          this.buttonPanel = null;
        }
        if(editor && editor.localName !== "IMAGE-EDITOR-VIEW"){
          var filePath = editor.getPath();
          var uriExtension = path.extname(filePath).toLowerCase();
          if (_.include(imageExtensions, uriExtension)) {
            var viewElement = new ImageButtonElement().initialize(filePath);
            this.buttonPanel = atom.workspace.addBottomPanel({
                item : viewElement
            });
          }
        }
    }

    activate(state: ?any) {
        this.activePaneDisposable = atom.workspace
                    .onDidChangeActivePaneItem(::this.onActivePaneChange);
        this.openerDisposable = atom.workspace.addOpener(openURI);
    }

    deactivate() {
        this.activePaneDisposable.dispose();
        return this.openerDisposable.dispose();
    }
}

export default new Image2react();
