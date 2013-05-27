require 'test_helper'

class DisruptionsControllerTest < ActionController::TestCase
  setup do
    @disruption = disruptions(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:disruptions)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create disruption" do
    assert_difference('Disruption.count') do
      post :create, disruption: { comments: @disruption.comments, lastModTime: @disruption.lastModTime, lat: @disruption.lat, lon: @disruption.lon, startTime: @disruption.startTime }
    end

    assert_redirected_to disruption_path(assigns(:disruption))
  end

  test "should show disruption" do
    get :show, id: @disruption
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @disruption
    assert_response :success
  end

  test "should update disruption" do
    put :update, id: @disruption, disruption: { comments: @disruption.comments, lastModTime: @disruption.lastModTime, lat: @disruption.lat, lon: @disruption.lon, startTime: @disruption.startTime }
    assert_redirected_to disruption_path(assigns(:disruption))
  end

  test "should destroy disruption" do
    assert_difference('Disruption.count', -1) do
      delete :destroy, id: @disruption
    end

    assert_redirected_to disruptions_path
  end
end
