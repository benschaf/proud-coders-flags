$(document).ready(function () {
  // https://blog.webdevsimplified.com/2023-04/html-dialog/
  const flagInfo = document.querySelector('#flag-info');
  const instructionsModal = document.querySelector('#instructions');
  $('#show-instructions').on("click", function () {
    instructionsModal.showModal();
  });

  $('#close-instructions').on("click", function () {
    instructionsModal.close();
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