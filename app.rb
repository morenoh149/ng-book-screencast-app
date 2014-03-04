#!/usr/bin/env ruby
require 'sinatra'

set :public_folder, '.'

get '/' do
  File.read "index.html"
end
