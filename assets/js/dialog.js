$(document).ready(function () {
    // https://blog.webdevsimplified.com/2023-04/html-dialog/
    const dialog = document.querySelector('dialog');
    const instructionsModal = document.querySelector('#instructions');
    $('#show-instructions').on("click", function () {
        instructionsModal.showModal();
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