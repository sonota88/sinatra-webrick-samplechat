const puts = console.log.bind(console);
const debug = console.debug.bind(console);

class Comet {
  constructor(){
    this.timer = null;
  }

  _open(){
    $.post("/comet/open")
      .then((x)=>{
        debug("then", x);
        this.onmessage(x);
        this.open();
      })
      .catch((x)=>{
        debug("catch", x);
      });
  }

  open(){
    debug("-->> Comet#open");

    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      this._open();
    }, 0);
  }
}

class App {
  constructor(){
    this.comet = new Comet();
    this.state = {
      messages: []
    };
  }

  start(){
    debug("-->> start");

    // Events

    $("#btn_post").on("click", ()=>{
      const text = $("#input").val();
      puts(text);

      $.post("/messages", {
        msg: text
      })
        .then((x)=>{
          debug("post>then", x);
          $("#input").val("");
        })
        .catch((x)=>{ puts("post>catch", x); });
    });

    // Comet

    this.comet.onmessage = (msg)=>{
      debug("-->> onmessage", msg);
      this.state.messages.push(msg);
      this.render();
    };

    // 最初の接続
    this.comet.open();
  }

  render(){
    const messageContainer = $("#messages_container");
    messageContainer.empty();
    this.state.messages.reverse().forEach((msg)=>{
      messageContainer.append($('<p></p>').text(msg))
    });
  }
}

$(()=>{
  window.app = new App();
  app.start();
});
