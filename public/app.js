const puts = console.log.bind(console);

class Comet {
  constructor(){
    this.timer = null;
  }

  _open(sessionId){
    $.post("/comet/open", {
      sessionid: sessionId
    })
      .then((data)=>{
        puts("_open>then", data);
        this.onmessage(data);
        this.open(sessionId);
      })
      .catch((data)=>{
        puts("_open>catch", data);
      });
  }

  open(sessionId){
    puts("-->> Comet#open");

    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      this._open(sessionId);
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
    puts("-->> start");

    this.SESSION_ID = this.generateSessionId();

    this.render();

    // Events

    $("#btn_post").on("click", ()=>{
      $.post("/messages", {
        sessionid: this.SESSION_ID,
        body: $("#input").val()
      })
        .then((data)=>{
          puts("post>then", data);
          $("#input").val("");
        })
        .catch((data)=>{ puts("post>catch", data); });
    });

    // Comet

    this.comet.onmessage = (msg)=>{
      puts("-->> onmessage", msg);
      this.state.messages.push(msg);
      this.render();
    };

    // 最初の接続
    this.comet.open(this.SESSION_ID);
  }

  render(){
    $("#session_id").text(this.SESSION_ID);

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
  const app = new App();
  app.start();
});
