
var body = document.body;

function checkWindow() {
    if (window.innerWidth < 992 && !body.classList.contains('mini-sidebar')) {
        body.classList.add('drawer-sidebar');
    }
}

function backdrop(el) {
    el.classList.toggle('shined');
    body.classList.toggle('has-backdrop');
    return el;
}

function toggleAside() {
	if( body.classList.contains('drawer-sidebar') ) {
        backdrop(document.getElementById('sidebar'));
    } else {
        body.classList.toggle('mini-sidebar');
    }
}

function closeShined() {
    body.classList.remove('has-backdrop');
    document.querySelector('.shined').classList.remove('shined');
}

function init() {
    checkWindow();
    document.querySelector('.backdrop').addEventListener('click', closeShined);
}
