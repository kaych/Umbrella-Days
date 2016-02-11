$(function() {
  var myFunction = function(arg) {
    console.log(arg);
  }

  var mainCity;

  $('#btn-start').on('click', function() {
    $('#city-form').slideDown();
  });

  $('#searchCity').on('submit', function(e) {
    e.preventDefault();
    $('#city-results fieldset').empty();
    var cityQuery = $('#city').val();
    var autoURL = 'http://autocomplete.wunderground.com/aq?query=' + cityQuery; 

    $.ajax({
      url: autoURL,
      dataType: 'jsonp',
      jsonp: 'cb',
      success: function(cities) {
        var resultList = $('<div>').addClass('list-group').appendTo($('#city-results fieldset'));
        cities.RESULTS.forEach(function(city) {
          console.log(city);
          console.log(city.zmw);
          $('<button>').addClass('list-group-item').text(city.name).attr('data-zmw', city.zmw).appendTo(resultList);
          $('#city-results').fadeIn('slow');
        });
      }
    });

    $('#city-results').on('click', 'button', function(e) {
      var cityID = $(this).data('zmw');
      var cityName = $(this).text();
      var showURL = "http://api.wunderground.com/api/8b059408a6bc8652/forecast/q/zmw:" + cityID + ".json";
      $.ajax({
        url: showURL,
        dataType: 'jsonp',
        success: function(city) {
          if(city.response.error) {
            swal('Sorry. Could not find this data.');
            return;
          }
          var forecastToday = city.forecast.txt_forecast.forecastday[0];
          var forecastTmr = city.forecast.txt_forecast.forecastday[1];
          swal({
            title: "Current condition of " + cityName + " @ " + city.forecast.txt_forecast.date,
            imageUrl: forecastToday.icon_url,
            text: "Forecast: " + forecastToday.fcttext_metric + "; Tomorrow: " + forecastTmr.fcttext_metric
          });
        }
      });

    });

  });
});
