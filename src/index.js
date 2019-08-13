import "./styles.css";

let width = window.innerWidth - 330;
let height = window.innerHeight;

let stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height
});

let layer = new Konva.Layer();
stage.add(layer);

let ifDragorTransformRect = false;
let con = stage.container();
let x1, x2, y1, y2;
con.addEventListener("mousedown", function(e) {
    e.preventDefault();
    stage.setPointersPositions(e);
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
});
con.addEventListener("mouseup", function(e) {
    e.preventDefault();
    stage.setPointersPositions(e);
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    con.style.cursor = "default";

    if (!ifDragorTransformRect) {
        createRect();
    }

    ifDragorTransformRect = false;
});

con.addEventListener("mouseover", function() {
    con.style.cursor = "crosshair";
});

function createRect() {
    let rect = new Konva.Rect({
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
        name: "rect",
        draggable: true
    });
    rect.on("transformstart", function() {
        ifDragorTransformRect = true;
    });

    let tr = new Konva.Transformer({
        rotateEnabled: false,
        anchorStroke: "#fc766a",
        borderStroke: "#fc766a",
        anchorFill: "#fc766a",
        anchorCornerRadius: 50,
        anchorStrokeWidth: 5,
        keepRatio: false
    });
    layer.add(tr);
    layer.add(rect);

    tr.attachTo(rect);

    layer.draw();
    // console.log(layer);
}

//if drag exist rect, then don't create a new rect
layer.on("mouseover", function() {
    con.style.cursor = "move";
});
layer.on("mouseout", function() {
    con.style.cursor = "crosshair";
});
layer.on("dragstart", function() {
    ifDragorTransformRect = true;
    // updateText();
});
//================================================

// function updateText() {
//     let xmax = Math.round(rect.x() + rect.width() * rect.scaleX());
//     let ymax = Math.round(rect.y() + rect.height() * rect.scaleY());
//     let x_center = Math.round(rect.x() + rect.width() / 2);
//     let y_center = Math.round(rect.y() + rect.width() / 2);
//     let lines = [
//         "x: " + rect.x(),
//         "y: " + rect.y(),
//         "",
//         "xml",
//         "xmin: " + rect.x(),
//         "ymin: " + rect.y(),
//         "xmax: : " + xmax,
//         "ymax: " + ymax,
//         "",
//         "txt",
//         "x_center: " + x_center,
//         "y_center: " + y_center,
//         "width: " + rect.width(),
//         "height: " + rect.height(),
//         "",
//         "rotation: " + rect.rotation(),
//         "width: " + rect.width(),
//         "height: " + rect.height(),
//         "scaleX: " + rect.scaleX(),
//         "scaleY: " + rect.scaleY()
//     ];
//     text.text(lines.join("\n"));
//     layer.batchDraw();
// }

let textFile = null;
let makeTextFile = function(text) {
    let data = new Blob([text], { type: "text/plain" });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
};

document.getElementById("output").addEventListener("click", function() {
    console.log(layer.find(".rect"));
    console.log(layer.find(".rect").length);

    let link = document.createElement("a");
    link.setAttribute("download", "output.txt");

    let OutputString = "";

    layer.find(".rect").forEach(function(el) {
        OutputString =
            OutputString +
            "1" +
            " " +
            el.attrs.x +
            " " +
            el.attrs.y +
            " " +
            el.width() +
            " " +
            el.height() +
            "\r\n";
    });

    link.href = makeTextFile(OutputString);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function() {
        let event = new MouseEvent("click");
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
});
