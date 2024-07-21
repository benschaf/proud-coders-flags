$(document).ready(function () {
  // https://blog.webdevsimplified.com/2023-04/html-dialog/
  const flagInfo = document.querySelector('#flag-info');
  const instructionsModal = document.querySelector('#instructions');
  const hintsModal = document.querySelector('#hints-dialog');

  $('#show-instructions').on("click", function () {
    instructionsModal.showModal();
  });

  $('#close-instructions').on("click", function () {
    instructionsModal.close();
  });

  $('#show-hints').on("click", function () {
    hintsModal.showModal();
  });
  $('#close-hints').on("click", function () {
    hintsModal.close();
  });

  instructionsModal.addEventListener("click", e => {
    const dialogDimensions = instructionsModal.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      instructionsModal.close()
    }
  });

  hintsModal.addEventListener("click", e => {
    const dialogDimensions = hintsModal.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      hintsModal.close()
    }
  });


  flagInfo.addEventListener("click", e => {
    const dialogDimensions = flagInfo.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      flagInfo.close()
    }
  });

  $('.dialog-close-button').click(function () {
    flagInfo.close()
  });
});