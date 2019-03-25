const puts = console.log.bind(console);
const debug = console.debug.bind(console);

class Comet {

}

class Page {
  constructor(){
    this.comet = new Comet();
  }

  start(){
    debug("-->> start");
  }
}

$(()=>{
  window.__p = new Page();
  __p.start();
});
