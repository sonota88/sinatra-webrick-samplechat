require 'sinatra'
require 'sinatra/reloader'

$q = Thread::Queue.new

get "/" do
  send_file "index.html"
end

post "/comet/open" do
  msg = $q.deq
  msg
end

post "/messages" do
  $q.enq params[:msg]
end
