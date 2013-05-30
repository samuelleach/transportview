class DisruptionsController < ApplicationController
  # GET /disruptions
  # GET /disruptions.json
  def index
    @disruptions = Disruption.all

    respond_to do |format|
      format.html # index.html.erb
      # format.json { render json: @disruptions }
      format.json # index.json.rabl
    end
  end

  # GET /disruptions/1
  # GET /disruptions/1.json
  def show
    @disruption = Disruption.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @disruption }
    end
  end

  # GET /disruptions/new
  # GET /disruptions/new.json
  def new
    @disruption = Disruption.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @disruption }
    end
  end

  # GET /disruptions/1/edit
  def edit
    @disruption = Disruption.find(params[:id])
  end

  # POST /disruptions
  # POST /disruptions.json
  def create
    @disruption = Disruption.new(params[:disruption])

    respond_to do |format|
      if @disruption.save
        format.html { redirect_to @disruption, notice: 'Disruption was successfully created.' }
        format.json { render json: @disruption, status: :created, location: @disruption }
      else
        format.html { render action: "new" }
        format.json { render json: @disruption.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /disruptions/1
  # PUT /disruptions/1.json
  def update
    @disruption = Disruption.find(params[:id])

    respond_to do |format|
      if @disruption.update_attributes(params[:disruption])
        format.html { redirect_to @disruption, notice: 'Disruption was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @disruption.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /disruptions/1
  # DELETE /disruptions/1.json
  def destroy
    @disruption = Disruption.find(params[:id])
    @disruption.destroy

    respond_to do |format|
      format.html { redirect_to disruptions_url }
      format.json { head :no_content }
    end
  end
end
