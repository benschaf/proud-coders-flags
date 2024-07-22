$(document).ready(function () {

    // Get the avatar from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const avatar = urlParams.get('avatar');

    // Set the avatar image
    const avatarDisplay = $('#avatar-display')[0];
    avatarDisplay.innerHTML = `<img src="assets/img/avatar/${avatar}.webp" alt="${avatar} Avatar">`;

    const avatarName = $('#avatar-name')[0];
    switch (avatar) {
        case 'alan-turing':
            avatarName.textContent = 'Alan Turing';
            break;
        case 'frida-kahlo':
            avatarName.textContent = 'Frida Kahlo';
            break;
        case 'freddie-mercury':
            avatarName.textContent = 'Freddie Mercury';
            break;
        case 'martha-p-johnson':
            avatarName.textContent = 'Martha P. Johnson';
            break;
    }
});