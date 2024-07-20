const gameboard = document.getElementById('gameboard');

const flagData = [
    {
        name: 'Asexual',
        backgroundColor: 'pink',
        backgroundImage: 'Asexual.png',
        parents: null,
    },
    {
        name: 'Transgender',
        backgroundColor: 'blue',
        backgroundImage: 'Transgender.png',
        parents: null,
    },
    {
        name: 'Aromantic',
        backgroundColor: 'red',
        backgroundImage: 'Aromantic.png',
        parents: {
            'a': 'Asexual',
            'b': 'Transgender',
        },
    },
    {
        name: 'Bisexual',
        backgroundColor: 'purple',
        backgroundImage: 'Bisexual.png',
        parents: {
            'a': 'Aromantic',
            'b': 'Transgender',
        },
    },
    {
        name: 'Demiboy',
        backgroundColor: 'lightblue',
        backgroundImage: 'Demiboy.png',
        parents: {
            'a': 'Asexual',
            'b': 'Bisexual',
        },
    },
    {
        name: 'Gay Male',
        backgroundColor: 'darkblue',
        backgroundImage: 'GayMale.png',
        parents: {
            'a': 'Aromantic',
            'b': 'Demiboy',
        },
    },
    {
        name: 'Genderqueer',
        backgroundColor: 'green',
        backgroundImage: 'Genderqueer.png',
        parents: {
            'a': 'Bisexual',
            'b': 'Gay Male',
        },
    },
    {
        name: 'Intersex',
        backgroundColor: 'yellow',
        backgroundImage: 'Intersex.png',
        parents: {
            'a': 'Demiboy',
            'b': 'Genderqueer',
        },
    },
    {
        name: 'Lesbian',
        backgroundColor: 'orange',
        backgroundImage: 'Lesbian.png',
        parents: {
            'a': 'Asexual',
            'b': 'Intersex',
        },
    },
    {
        name: 'Nonbinary',
        backgroundColor: 'gray',
        backgroundImage: 'Nonbinary.png',
        parents: {
            'a': 'Gay Male',
            'b': 'Lesbian',
        },
    },
    {
        name: 'Polyamory',
        backgroundColor: 'black',
        backgroundImage: 'Polyamory.png',
        parents: {
            'a': 'Genderqueer',
            'b': 'Nonbinary',
        },
    },
    {
        name: 'Rainbow Flag',
        backgroundColor: 'rainbow',
        backgroundImage: 'RainbowFlag.png',
        parents: {
            'a': 'Intersex',
            'b': 'Polyamory',
        },
    },
    {
        name: 'Rainbow Flag Lavender',
        backgroundColor: 'lavender',
        backgroundImage: 'RainbowFlagLavender.png',
        parents: {
            'a': 'Nonbinary',
            'b': 'Rainbow Flag',
        },
    },
];


let currentFlagId = 0;
let flags = [];
let domFlags = [];

class Flag {
    name;
    backgroundColor; // This will be changed to image
    backgroundImage;
    parents;
    id;
    position = null;
    discovered = false;
    constructor(name, backgroundColor, parents, backgroundImage, id) {
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.parents = parents;
        this.backgroundImage = backgroundImage;
        this.id = id;
    }

    /**
     * Assigns a position to the flag (ex. 0, 1, 2, 3, etc.)
     *
     * @param {*} position
     */
    setPosition(position) {
        this.position = position;
    }

    addAndDisplayDomElement(domElement, draggedAway) {
        const domFlag = new DOMFlag(domElement, this.id, this.backgroundImage, draggedAway);
    }
}

class DOMFlag {
    domElement;
    flagInstanceId;
    backgroundImage;
    draggie;
    id;
    draggedAway;

    constructor(domElement, flagInstanceId, backgroundImage, draggedAway) {
        this.domElement = domElement;
        this.flagInstanceId = flagInstanceId;
        this.id = currentFlagId;
        this.draggedAway = draggedAway;
        currentFlagId++;

        this.addThisToDOMFlags();
        this.addDraggie();
        this.displayDiv();
    }

    addThisToDOMFlags() {
        domFlags.push(this);
    }

    addDraggie() {
        this.draggie = $(this.domElement).draggabilly({
            containment: true,
        }).on('dragStart', (event, pointer) => {
            this.dragStartHandler(event, pointer, this);
        }).on('dragEnd', (event, pointer) => {
            this.dragEndHandler(event, pointer);
        });

        // set the position to absolute again because draggabilly changes it to relative
        this.domElement.style.position = 'absolute';
    }

    getFlagInstance() {
        return flags.filter(flag => flag.id === this.flagInstanceId)[0];
    }

    dragStartHandler(event, pointer, DOMFlagInstance) {
        DOMFlagInstance.setDraggedAway(true);
        const flagInstance = this.getFlagInstance();
        createAndAppendDraggable(flagInstance, null);
    }

    dragEndHandler(event, pointer) {
        const draggedDomFlagInstance = this;
        const draggedFlagInstance = draggedDomFlagInstance.getFlagInstance();

        const draggedAwayFlags = domFlags.filter(domFlagInstance => domFlagInstance.draggedAway === true && domFlagInstance.id !== draggedDomFlagInstance.id);
        draggedAwayFlags.forEach(stillDomFlagInstance => {
            const stillFlagInstance = stillDomFlagInstance.getFlagInstance();

            // if (stillDomFlagInstance.id === draggedDomFlagInstance.id) {
            //     console.log('Same flag');
            //     return;
            // }

            console.log(stillDomFlagInstance.draggie.data('draggabilly').position);
            const stillDomFlagPosition = stillDomFlagInstance.draggie.data('draggabilly').position;

            const adjustedPositionX = gameboard.offsetLeft + stillDomFlagPosition.x;
            const adjustedPositionY = gameboard.offsetTop + stillDomFlagPosition.y;

            if (adjustedPositionX <= pointer.pageX && pointer.pageX <= adjustedPositionX + 100 &&
                adjustedPositionY <= pointer.pageY && pointer.pageY <= adjustedPositionY + 100) {

                const draggedFlagName = draggedFlagInstance.name;
                const stillFlagName = stillFlagInstance.name;

                flags.forEach((flag, i) => {
                    if (flag.parents === null) {
                        return;
                    }

                    if (flag.parents.a === draggedFlagName && flag.parents.b === stillFlagName ||
                        flag.parents.a === stillFlagName && flag.parents.b === draggedFlagName) {

                        const flagToActivate = flags[i];

                        if (!flagToActivate.discovered) {
                            const discoveredFlagsCount = flags.filter(flag => flag.discovered === true).length;

                            flagToActivate.discovered = true;
                            flagToActivate.setPosition(discoveredFlagsCount);

                            createAndAppendDraggable(flagToActivate);
                        }

                        createAndAppendDraggable(flagToActivate, stillDomFlagPosition);


                        // remove the merged flags from the dom
                        draggedDomFlagInstance.domElement.remove();
                        stillDomFlagInstance.domElement.remove();

                        // remove the merged flags from the domFlags array
                        domFlags = domFlags.filter(domFlag => domFlag !== draggedDomFlagInstance && domFlag !== stillDomFlagInstance);

                    }
                });
            }
        });
    }

    displayDiv() {
        gameboard.appendChild(this.domElement);
    }

    setDraggedAway(draggedAway) {
        this.draggedAway = draggedAway;
    }
}


/**
 * Creates and appends a draggable div flag to the gameboard.
 * Creates and appends a draggable div flag to the gameboard.
 *
 * @param {Object} flag - The flag object containing the properties of the draggable div.
 * @param {Object} flag - The flag object containing the properties of the draggable div.
 * @param {number} i - The index of the draggable div.
 */
function createAndAppendDraggable(flag, position) {
    let draggedAway = false;
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add('draggable');
    draggableDiv.style.backgroundImage = `url(src/img/flags/${flag.backgroundImage})`;
    draggableDiv.style.backgroundSize = 'contain';
    draggableDiv.style.backgroundRepeat = 'no-repeat';
    draggableDiv.style.backgroundPosition = 'center';
    draggableDiv.style.height = '60px';
    draggableDiv.style.left = '10px';
    draggableDiv.textContent = flag.name;

    if (position) {
        draggableDiv.style.left = position.x + 'px';
        draggableDiv.style.top = position.y + 'px';
        draggedAway = true;
    } else {
        draggableDiv.style.top = `${10 + flag.position * 60 + flag.position * 10}px`;
    }

    flag.addAndDisplayDomElement(draggableDiv, draggedAway);
}

$(document).ready(function () {

    // load the flags array with the flag objects
    for (const [i, flag] of flagData.entries()) {
        flags[i] = new Flag(flag.name, flag.backgroundColor, flag.parents, flag.backgroundImage, i);
    }

    // add the first two flags to the discovered flags array and assign them a position
    discoveredFlags = flags.filter(flag => flag.name === "Asexual" || flag.name === "Transgender");
    discoveredFlags.forEach((flag, i) => {
        flag.discovered = true;
        flag.setPosition(i);
    });
    discoveredFlags.forEach(flag => createAndAppendDraggable(flag, null));
});