require 'sinatra'
require 'sinatra/reloader'

get "/" do
  send_file "index.html"
end

post "/comet/open" do
  sleep 1
  "TODO #{Time.now}"
end
