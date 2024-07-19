const gameboard = document.getElementById('gameboard');

let nextPosition = 2;

const flags = {
    "femaleFlag": {
        name: 'Female Flag',
        backgroundColor: 'pink',
        position: 0,
    },
    "maleFlag": {
        name: 'Male Flag',
        backgroundColor: 'blue',
        position: 1,
    },
    "gayFlag": {
        name: 'Gay Pride Flag',
        backgroundColor: 'red',
        parents: ['Female Flag', 'Male Flag'],
    },
};

let discoveredFlags = [
    flags["femaleFlag"],
    flags["maleFlag"],
];

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
    draggableDiv.style.top = 10 + element.position*100 + 10 * element.position + 'px'
    draggableDiv.textContent = element.name;

    gameboard.appendChild(draggableDiv);
    makeDraggableAndClone(draggableDiv);
}

function makeDraggableAndClone(draggable) {
    $(draggable).draggabilly({
        containment: true,
    }).on('dragStart', dragStartHandler)
      .on('dragEnd', dragEndHandler);
}

function dragStartHandler(event, pointer) {
    const draggie = $(this).data('draggabilly');
    const position = draggie.position;

    const clone = this.cloneNode(true); // Clone the DOM element
    clone.style.left = position.x + 'px';
    clone.style.top = position.y + 'px';
    clone.classList.remove('is-pointer-down', 'is-dragging');

    gameboard.appendChild(clone);
    makeDraggableAndClone(clone);
}

function dragEndHandler(event, pointer) {
    console.log("ended dragging");
    flags.gayFlag.position = nextPosition;
    nextPosition++;
    discoveredFlags.push(flags.gayFlag);
    createAndAppendDraggable(flags.gayFlag);
}

// Initial call for existing draggable elements
$(document).ready(function () {
    discoveredFlags.forEach(createAndAppendDraggable);
});