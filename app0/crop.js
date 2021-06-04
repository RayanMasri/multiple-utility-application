const save = () => {
    let url = canvas.toDataURL(fileData.type);

    let a = document.createElement('a');
    a.href = url;
    a.download = fileData.name;
    a.click();
    a.remove();

    window.location.replace(window.location.origin);
};

document.querySelector('.tool-bar-crop').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = crop.width;
    canvas.height = crop.height;
    roundRect(
        ctx,
        0,
        0,
        crop.width,
        crop.height,
        {
            tl: crop.tl,
            tr: crop.tr,
            bl: crop.bl,
            br: crop.br,
        },
        false,
        false
    );
    ctx.clip();
    ctx.drawImage(
        background,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );
    background.remove();
    document.querySelector('#tool-bar').remove();
    crop = undefined;

    save();
});
