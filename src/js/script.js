const gameboard = document.getElementById('gameboard');

let currentFlagId = 0;

const flags = {
    "femaleFlag": {
        name: 'Female Flag',
        backgroundColor: 'pink',
        position: 0,
        parents: null,
        draggie: null,
    },
    "maleFlag": {
        name: 'Male Flag',
        backgroundColor: 'blue',
        position: 1,
        parents: null,
        draggie: null,
    },
    "gayFlag": {
        position: 2,
        name: 'Gay Pride Flag',
        backgroundColor: 'red',
        parents: {
            'a': 'Male Flag',
            'b': 'Male Flag'
        },
        draggie: null,
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
    draggableDiv.style.left = '10px';
    draggableDiv.style.top = 10 + element.position * 100 + 10 * element.position + 'px'
    draggableDiv.textContent = element.name;

    gameboard.appendChild(draggableDiv);
    makeDraggableAndClone(draggableDiv, element);
}

function createAndAppendDraggable(element) {
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add('draggable');
    draggableDiv.style.backgroundColor = element.backgroundColor;
    draggableDiv.style.left = '10px';
    draggableDiv.style.top = 10 + element.position * 100 + 10 * element.position + 'px';
    draggableDiv.textContent = element.name;

    gameboard.appendChild(draggableDiv);
    makeDraggableAndClone(draggableDiv, element);
}

function createAndAppendDraggableWithPosition(element, position) {
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add('draggable');
    draggableDiv.style.backgroundColor = element.backgroundColor;
    draggableDiv.style.left = position.x + 'px';
    draggableDiv.style.top = position.y + 'px';
    draggableDiv.textContent = element.name;

    gameboard.appendChild(draggableDiv);
    makeDraggableAndClone(draggableDiv, element);
}

function makeDraggableAndClone(draggable, jsObject) {
    // Initialize draggabilly and attach event handlers
    $(draggable).draggabilly({
        containment: true,
    }).on('dragStart', function (event, pointer) {
        // Bind this to dragStartHandler
        dragStartHandler.call(this, event, pointer, jsObject);
    }).on('dragEnd', dragEndHandler);

    // Retrieve the draggabilly instance and add metadata
    let draggy = $(draggable).data('draggabilly');
    draggy.metadata = jsObject;
}

function dragStartHandler(event, pointer, jsObject) {
    const draggie = $(this).data('draggabilly');
    draggie.metadata.id = currentFlagId;
    currentFlagId++;
    draggedAwayFlags.push($(this));
    const position = draggie.position;

    const clone = this.cloneNode(true); // Clone the DOM element
    clone.style.left = position.x + 'px';
    clone.style.top = position.y + 'px';
    clone.classList.remove('is-pointer-down', 'is-dragging');

    const clonedObject = Object.assign({}, jsObject)

    gameboard.appendChild(clone);
    makeDraggableAndClone(clone, clonedObject);
}

function dragEndHandler(event, pointer) {
    // Retrieve the draggabilly instance
    const draggieX = $(this).data('draggabilly');
    const nameParentX = draggieX.metadata.name;


    draggedAwayFlags.forEach(flag => {
        const draggieY = flag.data('draggabilly');
        position = draggieY.position;
        // check if the mouse cursor is on the flag
        const flagId = draggieY.metadata.id;
        const draggedFlagId = draggieX.metadata.id;


        if (flagId === draggedFlagId) {
            // Same ID
            // This will have to be updated so that the id is comprised of the overarching object and the draggie instances
            return;
        }

        const adjustedPositionX = gameboard.offsetLeft + position.x;
        const adjustedPositionY = gameboard.offsetTop + position.y;

        if (adjustedPositionX <= pointer.pageX && pointer.pageX <= adjustedPositionX + 100 &&
            adjustedPositionY <= pointer.pageY && pointer.pageY <= adjustedPositionY + 100) {
            // Mouse cursor is on the flag
            const nameParentY = draggieY.metadata.name;


            for (const [key, value] of Object.entries(flags)) {
                if (value.parents === null) {
                    continue;
                }
                if (value.parents.a === nameParentX && value.parents.b === nameParentY ||
                    value.parents.a === nameParentY && value.parents.b === nameParentX) {
                    const newFlag = flags[key];

                    createAndAppendDraggableWithPosition(newFlag, {
                        x: position.x,
                        y: position.y
                    });
                    createAndAppendDraggable(newFlag);

                    flag.remove();
                    $(this).remove();
                    // I need to remove the flag from the draggedAwayFlags array
                    // The thing is it needs to be a the specific flag
                    draggedAwayFlags.splice(draggedAwayFlags.indexOf(flag), 1);
                    draggedAwayFlags.splice(draggedAwayFlags.indexOf(this), 1);
                }
            }
        }
    });
}

// Initial call for existing draggable elements
$(document).ready(function () {
    discoveredFlags.forEach(createAndAppendDraggable);
});