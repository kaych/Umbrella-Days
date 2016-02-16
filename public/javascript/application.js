$(function() {
  // var myFunction = function(arg) {
  //   console.log(arg);
  // }

  // var mainCity;

  $('#btn-start').on('click', function() {
    $('#city-form').slideDown();
  });

  $('#btn-geo-location').on('click', function() {
    var geoURL = "http://api.wunderground.com/api/8b059408a6bc8652/forecast/q/autoip.json";
    $.ajax({
      url: geoURL,
      dataType: 'jsonp',
      success: function(city) {
        if(city.response.error) {
          swal('Sorry. Could not find this data.');
          return;
        }
        var forecastToday = city.forecast.txt_forecast.forecastday[0];
        var forecastOther = city.forecast.txt_forecast.forecastday;
        swal({
          title: "Local forecast (@ " + city.forecast.txt_forecast.date + ")",
          imageUrl: forecastToday.icon_url,
          width: 600,
          html: "<em>" + forecastToday.fcttext_metric + "</em><br><br>" + "<table><tr><th>" + forecastOther[1].title + ": </th> <td>" + forecastOther[1].fcttext_metric + "</td></tr>" + "<tr><th>" + forecastOther[2].title + ": </th><td>" + forecastOther[2].fcttext_metric + "</td></tr>" + "<tr><th>" + forecastOther[4].title + ": </th><td>" + forecastOther[4].fcttext_metric + "</td> <tr><th>" + forecastOther[6].title + ": </th><td>" + forecastOther[6].fcttext_metric + "</td></tr></table>"
        });
      }
    });
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
            html: "<b>Current Forecast: </b>" + forecastToday.fcttext_metric + "<br> <b> Tomorrow: </b>" + forecastTmr.fcttext_metric
          });
        }
      });

    });

  });
});
