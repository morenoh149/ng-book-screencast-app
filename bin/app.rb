#!/usr/bin/env ruby
require 'sinatra'
require 'json'

puts(File.dirname(__FILE__))
set :root, File.join(File.dirname(__FILE__), "..")
set :public_dir, settings.root

get '/' do
  File.read(File.expand_path("index.html", settings.root))
end

get '/api/:parameter' do
  File.read(File.expand_path('data/' + params['parameter'] + '.json', File.dirname(__FILE__)))
end
