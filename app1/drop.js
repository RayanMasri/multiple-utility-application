let drop = document.querySelector('#drop');
let dropOverlay = document.querySelector('#drop-overlay');

const tryUploadFile = (file) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg') {
        onFileDrop(file);
    } else {
        console.error(`Unexpected file format ${file.type}`);
    }
};

drop.addEventListener('change', function (e) {
    let file = this.files[0];
    tryUploadFile(file);
    dropOverlay.style = 'display: none;';
});
drop.addEventListener('drop', function (e) {
    let file = e.dataTransfer.files[0];
    tryUploadFile(file);
    dropOverlay.style = 'display: none;';
});

drop.addEventListener('dragover', function (e) {
    var dt = e.dataTransfer;
    if (
        dt.types != null &&
        ((dt.types.length && dt.types[0] === 'Files') ||
            dt.types.contains('application/x-moz-file'))
    ) {
        dropOverlay.style = 'display: flex;';
    }
});
drop.addEventListener('dragleave', function (e) {
    dropOverlay.style = 'display: none;';
});
