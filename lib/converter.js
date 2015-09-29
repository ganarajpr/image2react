import boxtree from 'box-tree';

export default function converter(json){
    var boxes = json.boxes.map(function (box) {
        return [
            box.startX,
            box.startY,
            box.endX,
            box.endY,
            box.type
        ];
    });

    var tree = boxtree(boxes);
    return convertTree(tree);
}


function convertTree(node,destNode){

    if(node.type === "root"){
        destNode = {
            type : "Region",
            children : []
        };
        for (var i = 0; i < node.children.length; i++) {
            destNode.children.push(
                convertTree(node.children[i],destNode)
            );
        }
        return destNode;
    }
    else{
        var newNode = {
            type : typeToComponent[node.data[4]],
            children : []
        };
        for (var i = 0; i < node.children.length; i++) {
            newNode.children.push(
                convertTree(node.children[i],newNode)
            );
        }
        return newNode;
    }
}
