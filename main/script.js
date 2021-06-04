Array.from(document.querySelectorAll('.link')).map((e) => {
    console.log();
    let alt = e.getAttribute('alt');
    let href = e.getAttribute('href');
    if (alt != null) {
        e.addEventListener('click', () => {
            window.location.replace(window.location.origin + alt);
        });
    } else {
        if (href != null) {
            window.location.replace(href);
        }
    }
});
