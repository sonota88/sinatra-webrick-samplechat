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

    this.SESSION_ID = this.generateSessionId();

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

  generateSessionId(){
    const randInt = (n)=>{
      return Math.floor(Math.random() * n);
    };

    const names1 = [
      "Warty", "Hoary", "Breezy", "Dapper", "Edgy",
      "Feisty", "Gutsy", "Hardy", "Intrepid", "Jaunty"
    ];
    const names2 = [
      "Warthog", "Hedgehog", "Badger", "Drake", "Eft",
      "Fawn", "Gibbon", "Heron", "Ibex", "Jackalope"
    ];

    return [
      names1[randInt(names1.length)],
      names2[randInt(names2.length)],
      randInt(10000)
    ].join("_");
  }
}

$(()=>{
  window.app = new App();
  app.start();
});
