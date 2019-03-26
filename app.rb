require 'sinatra'
require 'sinatra/reloader'

class ConnectionManager
  def initialize
    # session id => queue
    @map = {}
  end

  def broadcast(msg)
    @map.each do |_, queue|
      queue.enq(msg)
    end
  end

  def deq(session_id)
    unless @map.key?(session_id)
      @map[session_id] = Thread::Queue.new
    end

    @map[session_id].deq
  end
end

$conn_manager = ConnectionManager.new

get "/" do
  send_file "index.html"
end

post "/comet/open" do
  $conn_manager.deq(params[:sessionid])
end

post "/messages" do
  $conn_manager.broadcast(
    params[:body]
  )

  "ok"
end
