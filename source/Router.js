export class Router {
    static routes = {};

    constrcutor(func) {
        this['home'] = func;
    }

    setExpand(page, pageFunc) {
        this[`${page}`] = pageFunc;
    }

    navigate(page) {
        if (!this[page]) {
            window.alert('page does not exist');
            return;
        }
        this[page]();
    }
}
