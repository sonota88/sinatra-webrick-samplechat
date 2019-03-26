require 'sinatra'
require 'sinatra/reloader'

class ConnectionManager
  def initialize
    @map = {}
  end

  def prepare_queue(session_id)
    unless @map.key?(session_id)
      @map[session_id] = Thread::Queue.new
    end
  end

  def broadcast(msg)
    @map.each do |_, queue|
      queue.enq(msg)
    end
  end

  def deq(session_id)
    prepare_queue(session_id)
    @map[session_id].deq
  end
end

$conn_manager = ConnectionManager.new

get "/" do
  send_file "index.html"
end

post "/comet/open" do
  msg = $conn_manager.deq(params[:sessionid])
  msg
end

post "/messages" do
  $conn_manager.broadcast(
    params[:msg]
  )

  "ok"
end
