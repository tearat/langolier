require 'roda'
require 'json'

load './app/database.rb'
load './models/word.rb'
load './serializers/word_serializers.rb'

class App < Roda
  plugin :json
  plugin :all_verbs
  # plugin :json_parser

  route do |r|
    response['Access-Control-Allow-Origin'] = '*'
    r.root do
      'Api works!'
    end

    # DEBUG
    r.on 'test' do
      r.options do
        puts "OPTIONS!"
        response['Access-Control-Allow-Origin'] = '*'
        response['Content-Type'] = 'application/json'
        "options!"
      end
      
      r.post do
        puts "POST!"
        p r
        # params = JSON.parse(r.body.read)
        # p params
        "test"
      end
    end

    r.on 'words' do
      r.get do
        r.is Integer do |id|
          "id is: #{id}"
        end

        @data = Word.all
        @data.map { |item| WordsSerializer.new(item) }.to_json
      end

      r.post do
        params = JSON.parse(r.body.read)
        
        # Update
        r.is Integer do |id|
          word = Word.find(params['id'])
          word.native = params['native']
          word_saved = word.save!
          if word_saved
            'Success'
          else
            'Fail'
          end
        end
        
        # Create
        word_created = Word.create({ native: params['native'], foreign: params['foreign'] })
        if word_created
          'Success'
        else
          'Fail'
        end
      end
    end

  end
end

run App.freeze.app
