const gameboard = document.getElementById('gameboard');

let nextPosition = 2;

const flags = {
    "femaleFlag": {
        name: 'Female Flag',
        backgroundColor: 'pink',
        position: 0,
        parents: [],
    },
    "maleFlag": {
        name: 'Male Flag',
        backgroundColor: 'blue',
        position: 1,
        parents: [],
    },
    "gayFlag": {
        name: 'Gay Pride Flag',
        backgroundColor: 'red',
        parents: {'a': 'Male Flag', 'b': 'Male Flag'},
    },
};

let discoveredFlags = [
    flags["femaleFlag"],
    flags["maleFlag"],
];

let draggedAwayFlags = [];

/**
 * Creates and appends a draggable div element to the gameboard.
 *
 * @param {Object} element - The element object containing the properties of the draggable div.
 * @param {number} i - The index of the draggable div.
 */
function createAndAppendDraggable(element) {
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add('draggable');
    draggableDiv.style.backgroundColor = element.backgroundColor;
    draggableDiv.style.left = '10px'
    draggableDiv.style.top = 10 + element.position * 100 + 10 * element.position + 'px'
    draggableDiv.textContent = element.name;

    gameboard.appendChild(draggableDiv);
    makeDraggableAndClone(draggableDiv, element);
}

function makeDraggableAndClone(draggable, jsObject) {
    // Initialize draggabilly and attach event handlers
    $(draggable).draggabilly({
        containment: true,
    }).on('dragStart', function(event, pointer) {
        // Bind this to dragStartHandler
        dragStartHandler.call(this, event, pointer, jsObject);
    }).on('dragEnd', dragEndHandler);

    // Retrieve the draggabilly instance and add metadata
    let draggy = $(draggable).data('draggabilly');
    draggy.metadata = jsObject;
}

function dragStartHandler(event, pointer, jsObject) {
    const draggie = $(this).data('draggabilly');
    draggedAwayFlags.push($(this));
    const position = draggie.position;

    const clone = this.cloneNode(true); // Clone the DOM element
    clone.style.left = position.x + 'px';
    clone.style.top = position.y + 'px';
    clone.classList.remove('is-pointer-down', 'is-dragging');

    const clonedObject = Object.assign({}, jsObject)

    gameboard.appendChild(clone);
    makeDraggableAndClone(clone, jsObject);
}

function dragEndHandler(event, pointer) {
    // Retrieve the draggabilly instance
    const draggieX = $(this).data('draggabilly');
    const nameParentX = draggieX.metadata.name;
    console.log("Metadata: " + nameParentX);


    draggedAwayFlags.forEach(flag => {
        console.log(flag);
        const draggieY = flag.data('draggabilly');
        position = draggieY.position;
        console.log("position" + position.x);
        // check if the mouse cursor is on the flag
        if (position.x <= pointer.pageX && pointer.pageX <= position.x + 100 &&
            position.y <= pointer.pageY && pointer.pageY <= position.y + 100) {
            // Mouse cursor is on the flag
            const nameParentY = draggieY.metadata.name;
            print("Names. NameX: " + nameParentX + ", NameY: " + nameParentY);
        }
    });

    flags.gayFlag.position = nextPosition;
    nextPosition++;
    discoveredFlags.push(flags.gayFlag);
    createAndAppendDraggable(flags.gayFlag);
}

// Initial call for existing draggable elements
$(document).ready(function () {
    discoveredFlags.forEach(createAndAppendDraggable);
});