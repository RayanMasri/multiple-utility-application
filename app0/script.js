let main = document.querySelector('#main');
let app = document.querySelector('#app');

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let overlay = document.querySelector('#overlay');
let background = document.querySelector('#canvas-background');
let toolbar = document.querySelector('#tool-bar');

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

let crop = {};
let origin = {};
let fileData = {};
let points = [];
let fields = [];
let fieldNames = ['X', 'Y', 'H', 'W', 'TL', 'TR', 'BL', 'BR'];

for (let i = 0; i < fieldNames.length; i++) {
    fields.push(document.querySelector(`input[alt='${fieldNames[i]}']`));
    fields[i].value = 0;
}

for (let i = 0; i < fields.length; i++) {
    fields[i].addEventListener('change', function (event) {
        let number = eval(event.target.value);
        event.target.value = number;
        number = parseInt(number);

        switch (i) {
            case 0:
                crop.x = number;
                break;
            case 1:
                crop.y = number;
                break;
            case 2:
                crop.height = number;
                break;
            case 3:
                crop.width = number;
                break;
            case 4:
                crop.tl = number;
                break;
            case 5:
                crop.tr = number;
                break;
            case 6:
                crop.bl = number;
                break;
            case 7:
                crop.br = number;
                break;
        }
        updateCrop();
    });
}

const getPoints = (size) => {
    let points = [];

    let x = crop.x + origin.x;
    let y = crop.y + origin.y;

    points.push({
        x: x,
        y: y,
        width: size,
        height: size,
    });
    points.push({
        x: x,
        y: y + (crop.height - size) / 2,
        width: size,
        height: size,
    });
    points.push({
        x: x,
        y: y + (crop.height - size),
        width: size,
        height: size,
    });

    points.push({
        x: x + (crop.width - size),
        y: y,
        width: size,
        height: size,
    });
    points.push({
        x: x + (crop.width - size),
        y: y + (crop.height - size) / 2,
        width: size,
        height: size,
    });
    points.push({
        x: x + (crop.width - size),
        y: y + (crop.height - size),
        width: size,
        height: size,
    });

    points.push({
        x: x + (crop.width - size) / 2,
        y: y,
        width: size,
        height: size,
    });
    points.push({
        x: x + (crop.width - size) / 2,
        y: y + (crop.height - size),
        width: size,
        height: size,
    });
    return points;
};

const updateCrop = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ['X', 'Y', 'H', 'W', 'TL', 'TR', 'BL', 'BR'];

    let x = crop.x + origin.x;
    let y = crop.y + origin.y;
    let width = crop.width;
    let height = crop.height;

    ctx.strokeStyle = '#CCCCCC';
    ctx.setLineDash([4, 2]);

    ctx.beginPath();
    ctx.moveTo(x + crop.width / 3, y);
    ctx.lineTo(x + crop.width / 3, y + crop.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + (crop.width / 3) * 2, y);
    ctx.lineTo(x + (crop.width / 3) * 2, y + crop.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + crop.height / 3);
    ctx.lineTo(x + crop.width, y + crop.height / 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + (crop.height / 3) * 2);
    ctx.lineTo(x + crop.width, y + (crop.height / 3) * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    roundRect(
        ctx,
        x,
        y,
        width,
        height,
        {
            tl: crop.tl,
            tr: crop.tr,
            bl: crop.bl,
            br: crop.br,
        },
        true,
        false
    );

    let color = '#3399FF';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    let lineWidth = 1;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(
        x + lineWidth / 2,
        y + lineWidth / 2,
        width - lineWidth,
        height - lineWidth
    );

    let size = 4;
    points = getPoints(size);
    for (let i = 0; i < points.length; i++) {
        ctx.fillRect(
            points[i].x,
            points[i].y,
            points[i].width,
            points[i].height
        );
    }
};

const onFileDrop = (file) => {
    canvas.width = window.innerWidth - 260;
    canvas.height = window.innerHeight;

    fileData = {
        name: file.name,
        type: file.type,
    };
    app.remove();
    main.style = 'display: flex';

    toBase64(file)
        .then((result) => {
            background.onload = function () {
                origin = {
                    x: canvas.width / 2 - this.width / 2,
                    y: canvas.height / 2 - this.height / 2,
                };
                // canvas.width = this.width;
                // canvas.height = this.height;

                crop = {
                    x: 0,
                    y: 0,
                    height: this.height,
                    width: this.width,
                    tl: 0,
                    tr: 0,
                    bl: 0,
                    br: 0,
                };

                fields[2].value = this.height;
                fields[3].value = this.width;
                updateCrop();
            };
            background.src = result;
        })
        .catch(console.error);
};
const see = (event) => {
    let rect = canvas.getBoundingClientRect();
    let position = {
        x: clamp(event.clientX - rect.left, 0, canvas.width),
        y: clamp(event.clientY - rect.top, 0, canvas.height),
    };

    return position;
};
const clamp = (num, min, max) => {
    return num <= min ? min : num >= max ? max : num;
};

let holdIndex = -1;
let holdPosition = null;
window.addEventListener('mousedown', (event) => {
    if (crop == undefined) return;
    let position = see(event);
    for (let i = 0; i < points.length; i++) {
        let inside = pointInRect(position, points[i]);
        if (inside) {
            holdPosition = position;
            holdIndex = i;
            break;
        }
    }
});

window.addEventListener('mouseup', (event) => {
    if (crop == undefined) return;

    let position = see(event);

    let delta = {
        x: holdPosition.x - position.x,
        y: holdPosition.y - position.y,
    };

    switch (holdIndex) {
        case 0:
            crop.x += -delta.x;
            crop.y += -delta.y;
            crop.width += delta.x;
            crop.height += delta.y;
            break;
        case 2:
            crop.x += -delta.x;
            crop.width += delta.x;
            crop.height += -delta.y;
            break;
        case 3:
            crop.y += -delta.y;
            crop.width += -delta.x;
            crop.height += delta.y;
            break;
        case 5:
            crop.width += -delta.x;
            crop.height += -delta.y;
            break;
        case 1:
            crop.x += -delta.x;
            crop.width += delta.x;
            break;
        case 6:
            crop.y += -delta.y;
            crop.height += delta.y;
            break;
        case 7:
            crop.height += -delta.y;
            break;
        case 4:
            crop.width += -delta.x;
            break;
    }

    // crop.x = clamp(crop.x, 0, canvas.width);
    // crop.y = clamp(crop.y, 0, canvas.height);
    // crop.width = clamp(crop.width, 0, canvas.width);
    // crop.height = clamp(crop.height, 0, canvas.height);

    fields[0].value = crop.x;
    fields[1].value = crop.y;
    fields[2].value = crop.height;
    fields[3].value = crop.width;

    updateCrop();
    holdIndex = -1;
});
