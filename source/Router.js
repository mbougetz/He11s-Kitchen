export class Router {
  static routes = {};

  constructor(func) {
    this['home'] = func;
  }

  setExpand(page, pageFunc) {
    console.log(this);
    this[page] = pageFunc;
  }

  navigate(page, statePopped) {
    console.log(this);
    console.log(page);
    console.log(this[page]);
    if (!this[page]) {
      window.alert('page does not exist');
      return;
    }
    else {
      var hash = '';
      if (page != 'home') {
        hash = '#' + page;
      }
    }
    if (statePopped == false && window.location.hash != hash) {
      history.pushState({page: page}, '', window.location.origin + window.location.pathname + hash);
      console.log(window.location);
    }

    //console.log(this[page]);
    this[page]();
  }
  
  onPopstate() {
    window.addEventListener('popstate', (e) => {
      this.navigate(e.state.page, true)
    })
  }
}
