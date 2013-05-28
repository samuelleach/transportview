class Disruption
  include Mongoid::Document
  field :lon, type: Float
  field :lat, type: Float
  field :startTime, type: String
  field :endTime, type: String
  field :lastModTime, type: String
  field :comments, type: String
  field :category, type: String
  field :status, type: String
end
