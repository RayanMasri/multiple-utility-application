let main = document.querySelector('#main');
let app = document.querySelector('#app');

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let overlay = document.querySelector('#overlay');
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
let fieldNames = ['W', 'H'];

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
                crop.width = number;
                break;
            case 1:
                crop.height = number;
                break;
        }
        updateCrop();
    });
}

const updateCrop = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    let x = canvas.width / 2 - crop.width / 2;
    let y = canvas.height / 2 - crop.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fileData.image, x, y, crop.width, crop.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let width = crop.width;
    let height = crop.height;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x, y, width, height);

    let color = '#3399FF';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.strokeRect(x + 1 / 2, y + 1 / 2, width - 1, height - 1);
};

const onFileDrop = (file) => {
    canvas.width = window.innerWidth - 260;
    canvas.height = window.innerHeight;

    app.remove();
    main.style = 'display: flex';

    const callback = (img) => {
        fileData = {
            name: file.name,
            type: file.type,
            width: img.width,
            height: img.height,
            image: img,
        };
    };

    toBase64(file)
        .then((result) => {
            let img = new Image();
            img.onload = function () {
                callback(img);

                origin = {
                    x: canvas.width / 2 - this.width / 2,
                    y: canvas.height / 2 - this.height / 2,
                };

                crop = {
                    height: this.height,
                    width: this.width,
                };

                fields[0].value = this.height;
                fields[1].value = this.width;
                updateCrop();
            };
            img.src = result;
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
