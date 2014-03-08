#!/usr/bin/env ruby
require 'sinatra'
require 'json'

set :root, File.join(File.dirname(__FILE__), "..")
set :public_dir, settings.root

get '/' do
  File.read(File.expand_path("index.html", settings.root))
end

post '/api/send' do
  sleep 3
  {result: 'true'}.to_json
end

get '/api/:parameter' do
  File.read(File.expand_path('data/' + params['parameter'] + '.json', File.dirname(__FILE__)))
end
