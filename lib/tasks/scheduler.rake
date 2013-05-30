desc "This task is called by the Heroku scheduler add-on"
task :update_disruptions => :environment do
  	puts "Updating disruptions database."

  	puts 'Getting data from tfl'
  	response = HTTParty.get(ENV['TFL_MIMS'])
  	puts "Response code #{response.code}"

  	if response.code == 200
	  	puts 'Converting data to string'
	  	data_string = response.body.to_s
	  	if data_string != ''
		  	puts 'Converting string to hash'
		  	data = Hash.from_xml(data_string)

		  	#Code duplication with seed.rb
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
			puts "done."
		end
  	end
end