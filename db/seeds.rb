# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

f = File.open("public/data/stream.xml")
doc = Nokogiri::XML(f)
f.close

data = Hash.from_xml(doc.to_s)

Disruption.delete_all
data['Root']['Disruptions']['Disruption'].each do |disruption|
	lonlat = disruption["CauseArea"]["DisplayPoint"]["Point"]["coordinatesLL"].split(',')
	doc = Disruption.new(lon: lonlat[0], lat: lonlat[1],
					  startTime: disruption['startTime'],
					  endTime: disruption['endTime'],
					  lastModTime: disruption['lastModTime'],
					  comments: disruption['comments'],
					  category: disruption['category'],
					  subCategory: disruption['subCategory'],
					  status: disruption['status'],
					  tfl_id: disruption['id'])

	doc.save
end	