const gameboard = document.getElementById('gameboard');


/**
 * Creates and appends a draggable div element to the gameboard.
 *
 * @param {Object} element - The element object containing the properties of the draggable div.
 * @param {number} i - The index of the draggable div.
 */
function createAndAppendDraggable(element, i) {
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add('draggable');
    draggableDiv.style.backgroundColor = element.backgroundColor;
    draggableDiv.style.left = element.position.x + 'px';
    draggableDiv.style.top = element.position.y + 10 + 10 * i + 'px';
    draggableDiv.textContent = element.content;

    gameboard.appendChild(draggableDiv);
    makeDraggableAndClone(draggableDiv);
}

// Adjusted makeDraggableAndClone function to work with DOM elements
/**
 * Makes an element draggable and clones it when dragged.
 * This is achieved using the Draggabilly library.
 * @param {HTMLElement} draggable - The element to make draggable.
 */
function makeDraggableAndClone(draggable) {
    $(draggable).draggabilly({
        containment: true,
    }).on('dragStart', function (event, pointer) {
        const draggie = $(this).data('draggabilly');
        const position = draggie.position;
        console.log("position: " + position.x);
        const clone = this.cloneNode(true); // Clone the DOM element
        clone.style.left = position.x + 'px';
        clone.style.top = position.y + 'px';
        clone.classList.remove('is-pointer-down', 'is-dragging');
        gameboard.appendChild(clone);
        // Call the same function to make the clone draggable and able to clone itself
        makeDraggableAndClone(clone);
    });
}

// Initial call for existing draggable elements
document.addEventListener('DOMContentLoaded', function () {
    const initialDraggableElements = [{
            content: 'male flag',
            backgroundColor: 'blue',
            position: {
                x: 10,
                y: 0
            },
        },
        {
            content: 'female flag',
            backgroundColor: 'pink',
            position: {
                x: 10,
                y: 100
            },
        }
    ];

    for (let i = 0; i < initialDraggableElements.length; i++) {
        createAndAppendDraggable(initialDraggableElements[i], i);
    }
});