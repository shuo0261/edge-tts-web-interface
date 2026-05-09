(function () {
    function getTarget(trigger) {
        const selector = trigger.getAttribute('data-bs-target') || trigger.getAttribute('href');
        if (!selector || selector === '#') return null;
        return document.querySelector(selector);
    }

    class Collapse {
        constructor(element) {
            this.element = element;
        }

        show() {
            this.element.classList.add('show');
        }

        hide() {
            this.element.classList.remove('show');
        }

        toggle() {
            this.element.classList.toggle('show');
        }
    }

    function activateTab(trigger) {
        const target = getTarget(trigger);
        if (!target) return;

        const tabList = trigger.closest('[role="tablist"]');
        if (tabList) {
            tabList.querySelectorAll('[data-bs-toggle="pill"]').forEach((item) => {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            });
        }

        const content = target.parentElement;
        if (content) {
            content.querySelectorAll('.tab-pane').forEach((pane) => {
                pane.classList.remove('active', 'show');
            });
        }

        trigger.classList.add('active');
        trigger.setAttribute('aria-selected', 'true');
        target.classList.add('active', 'show');
    }

    function toggleCollapse(trigger) {
        const target = getTarget(trigger);
        if (!target) return;

        const instance = new Collapse(target);
        instance.toggle();
        trigger.classList.toggle('collapsed', !target.classList.contains('show'));
        trigger.setAttribute('aria-expanded', target.classList.contains('show') ? 'true' : 'false');
    }

    document.addEventListener('click', function (event) {
        const tabTrigger = event.target.closest('[data-bs-toggle="pill"]');
        if (tabTrigger) {
            event.preventDefault();
            activateTab(tabTrigger);
            return;
        }

        const collapseTrigger = event.target.closest('[data-bs-toggle="collapse"]');
        if (collapseTrigger) {
            event.preventDefault();
            toggleCollapse(collapseTrigger);
        }
    });

    window.bootstrap = {
        Collapse: Collapse
    };
})();
