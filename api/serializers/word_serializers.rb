require 'active_model_serializers'

class WordsSerializer < ActiveModel::Serializer
  attributes :id, :native, :foreign
end