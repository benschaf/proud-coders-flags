const gameboard = document.getElementById('gameboard');

let currentFlagId = 0;
let flags = [];
let domFlags = [];

class Flag {
    name;
    backgroundColor; // Maybe needed for when the flag is loading?
    backgroundImage;
    description;
    parents;
    id;
    position = null;
    discovered = false;
    constructor(name, backgroundColor, parents, backgroundImage, description, id) {
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.parents = parents;
        this.backgroundImage = backgroundImage;
        this.description = description;
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
        new DOMFlag(domElement, this.id, this.backgroundImage, draggedAway);
    }
}

class DOMFlag {
    domElement;
    flagInstanceId;
    backgroundImage;
    backgroundImage;
    draggie;
    id;
    draggedAway;

    constructor(domElement, flagInstanceId, backgroundImage, draggedAway) {
        this.domElement = domElement;
        this.flagInstanceId = flagInstanceId;
        this.backgroundImage = backgroundImage;
        this.backgroundImage = backgroundImage;
        this.draggedAway = draggedAway;
        this.id = currentFlagId;
        this.id = currentFlagId;
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
        }).on('staticClick', (event, pointer) => {
            const flagInstance = this.getFlagInstance();

            document.getElementById('flag-info-title').textContent = flagInstance.name;
            document.getElementById('flag-info-description').textContent = flagInstance.description;
            document.getElementById('flag-info-image').src = `assets/img/flags/${this.backgroundImage}`;
            document.getElementById('flag-info-image').alt = flagInstance.name;

            // Show the modal
            const modal = document.getElementById('flag-info');
            modal.showModal();
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

                            document.getElementById('flag-info-title').textContent = `You discovered: ${flagToActivate.name}`;
                            document.getElementById('flag-info-description').textContent = flagToActivate.description;
                            document.getElementById('flag-info-image').src = ""; // Maybe replace with loading image
                            document.getElementById('flag-info-image').src = `assets/img/flags/${flagToActivate.backgroundImage}`;
                            document.getElementById('flag-info-image').alt = flagToActivate.name;

                            const modal = document.getElementById('flag-info');
                            modal.showModal();
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

function createAndAppendDraggable(flag, position) {
    let draggedAway = false;
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add('draggable');
    draggableDiv.style.backgroundImage = `url(assets/img/flags/${flag.backgroundImage})`;
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
        if (parseInt(draggableDiv.style.top) >= 500) {
            draggableDiv.style.left = '120px';
            draggableDiv.style.top = `${10 + (flag.position - 7) * 60 + (flag.position - 7) * 10}px`;
        }
        if (parseInt(draggableDiv.style.top) >= 500) {
            draggableDiv.style.left = '120px';
            draggableDiv.style.top = `${10 + (flag.position - 7) * 60 + (flag.position - 7) * 10}px`;
        }
    }

    flag.addAndDisplayDomElement(draggableDiv, draggedAway);
}

$(document).ready(function () {
    fetch('assets/data/flags.json')
        .then(response => response.json())
        .then(data => {
            const flagData = data;

            // load the flags array with the flag objects
            for (const [i, flag] of flagData.entries()) {
                flags[i] = new Flag(flag.name, flag.backgroundColor, flag.parents, flag.backgroundImage, flag.description, i);
            }

            // add the first two flags to the discovered flags array and assign them a position
            const discoveredFlags = flags.filter(flag => flag.name === "Asexual" || flag.name === "Transgender");

            discoveredFlags.forEach((flag, i) => {
                flag.discovered = true;
                flag.setPosition(i);
                createAndAppendDraggable(flag, null)
            });
        });

    $('#clear-flags').on('click', () => {
        draggedAwayFlags = domFlags.filter(flag => flag.draggedAway === true);

        draggedAwayFlags.forEach(flag => {
            flag.domElement.remove();
            domFlags = domFlags.filter(domFlag => domFlag.id !== flag.id);
        });
    });
});
