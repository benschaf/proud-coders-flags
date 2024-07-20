$(document).ready(function () {
    // https://blog.webdevsimplified.com/2023-04/html-dialog/
    const dialog = document.querySelector("dialog")
    $('#show-instructions').click(function () {
        dialog.showModal()
    });

    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close()
        }
    });

    $('.dialog-close-button').click(function () {
        dialog.close()
    });
});