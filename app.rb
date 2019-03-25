require 'sinatra'
require 'sinatra/reloader'

$q = Thread::Queue.new

# dummy enqueue
Thread.new do
  loop do
    sleep 5
    $q.enq Time.now.to_s
  end
end

get "/" do
  send_file "index.html"
end

post "/comet/open" do
  msg = $q.deq
  msg
end
