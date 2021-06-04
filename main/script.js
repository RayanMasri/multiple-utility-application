Array.from(document.querySelectorAll('.link')).map((e) => {
    let alt = e.getAttribute('alt');
    let href = e.getAttribute('href');
    if (alt != null) {
        e.addEventListener('click', () => {
            window.location.href = window.location.origin + alt;
        });
    } else {
        if (href != null) {
            e.addEventListener('click', () => {
                // window.location.replace(href);
                window.location.href = href;
            });
        }
    }
});
