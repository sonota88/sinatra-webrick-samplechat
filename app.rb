require 'sinatra'
require 'sinatra/reloader'

class ConnectionManager
  def initialize
    @map = {} # session id => queue
  end

  def broadcast(msg)
    @map.each { |_, queue| queue.enq(msg) }
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
    params[:sessionid] + ": " + params[:body]
  )
  "ok"
end
