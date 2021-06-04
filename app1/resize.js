const save = () => {
    let url = canvas.toDataURL(fileData.type);

    let a = document.createElement('a');
    a.href = url;
    a.download = fileData.name;
    a.click();
    a.remove();

    window.location.href = window.location.origin;
};

document.querySelector('.tool-bar-crop').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fileData.image, 0, 0, crop.width, crop.height);

    document.querySelector('#tool-bar').remove();
    crop = undefined;

    save();
});
