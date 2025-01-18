const MODAL = {
    show: (selector) => {
        if (selector) {
            $('#modal-backdrop').addClass('show');
            $('#modal-container').addClass('show');
            $(selector).addClass('show');
        }
    },
    hide: (selector) => {
        if (selector) {
            $('#modal-backdrop').removeClass('show');
            $('#modal-container').removeClass('show');
            $(selector).removeClass('show');
        }
    },
    toggle: (selector) => {
        if ($(selector).hasClass('show')) {
            MODAL.hide(selector)
        } else {
            MODAL.show(selector);
        }
    }
}

$(document).ready(() => {

    $('[custom-action="modal"]').click((e) => {
        const selector = $(e.target).attr('modal-trigger');
        MODAL.show(selector);
    })

    let modals = $('.modal');
    for (let i = 0; i < modals.length; i++) {
        const modal = modals[i];
        const id = '#' + modal.id;
        $(id + ' .modal-close').click(e => {
            MODAL.hide(id)
        })      
    }
})
