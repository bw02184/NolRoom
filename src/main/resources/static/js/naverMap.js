// 우편번호 찾기 화면을 넣을 element
var element_layer = document.getElementById('layer');

function closeDaumPostcode() {
  // iframe을 넣은 element를 안보이게 한다.
  element_layer.style.display = 'none';
}

function sample2_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ''; // 주소 변수
      var extraAddr = ''; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === 'R') {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr +=
            extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        //        document.getElementById("sample2_extraAddress").value = extraAddr;

        //    } else {
        //        document.getElementById("sample2_extraAddress").value = '';
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      //document.getElementById('sample2_postcode').value = data.zonecode;
      document.getElementById('input_search').value = addr + extraAddr;
      document.getElementById('input_search_sidoCode').value = data.bcode;
      // 커서를 상세주소 필드로 이동한다.
      //document.getElementById("sample2_detailAddress").focus();

      // iframe을 넣은 element를 안보이게 한다.
      // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
      element_layer.style.display = 'none';
    },
    width: '100%',
    height: '100%',
    maxSuggestItems: 5,
  }).embed(element_layer);

  // iframe을 넣은 element를 보이게 한다.
  element_layer.style.display = 'block';

  // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
  initLayerPosition();
}

// 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
// resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
// 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
function initLayerPosition() {
  var width = 300; //우편번호서비스가 들어갈 element의 width
  var height = 400; //우편번호서비스가 들어갈 element의 height
  var borderWidth = 5; //샘플에서 사용하는 border의 두께

  // 위에서 선언한 값들을 실제 element에 넣는다.
  element_layer.style.width = width + 'px';
  element_layer.style.height = height + 'px';
  element_layer.style.border = borderWidth + 'px solid';
  // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
  element_layer.style.left =
    ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 -
    borderWidth +
    'px';
  element_layer.style.top =
    ((window.innerHeight || document.documentElement.clientHeight) - height) /
      2 -
    borderWidth +
    'px';
}

function panelMoved() {
  const panel = document.getElementById('transform_panel');
  const pMove = document.getElementById('panel_move');

  if (panel.style.transform == 'translateX(0%)') {
    panel.style.transform = 'translateX(-100%)';
    pMove.style.backgroundPosition = '-69px -261px';
    pMove.ariaExpanded = false;
  } else {
    panel.style.transform = 'translateX(0%)';
    pMove.style.backgroundPosition = '-23px -261px';
    pMove.ariaExpanded = true;
  }
}
function panelChange() {
  const pMove = document.getElementById('panel_move');
  if (pMove.ariaExpanded === 'true') {
    pMove.style.backgroundPosition = '0px -261px';
  } else {
    pMove.style.backgroundPosition = '-46px -261px';
  }
}
function panelChangeEnd() {
  const pMove = document.getElementById('panel_move');
  if (pMove.ariaExpanded === 'true') {
    pMove.style.backgroundPosition = '-23px -261px';
  } else {
    pMove.style.backgroundPosition = '-69px -261px';
  }
}

document.getElementById('input_search_date').value = new Date()
  .toISOString()
  .slice(0, 7);

var map = new naver.maps.Map('map', {
  center: new naver.maps.LatLng(37.5666805, 126.9784147),
  zoom: 15,
  mapTypeId: naver.maps.MapTypeId.NORMAL,
});

var infoWindow = new naver.maps.InfoWindow({
  anchorSkew: true,
});

var markers = [];
function onSuccessGeolocation(position) {
  var location = new naver.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );

  map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
  map.setZoom(15); // 지도의 줌 레벨을 변경합니다.

  //infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');

  //infowindow.open(map, location);
  console.log('Coordinates: ' + location.toString());
}

function onErrorGeolocation() {
  var center = map.getCenter();

  infowindow.setContent(
    '<div style="padding:20px;">' +
      '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>' +
      'latitude: ' +
      center.lat() +
      '<br />longitude: ' +
      center.lng() +
      '</div>'
  );

  infowindow.open(map, center);
}

$(window).on('load', function () {
  if (navigator.geolocation) {
    /**
     * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
     * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
     * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
     */
    navigator.geolocation.getCurrentPosition(
      onSuccessGeolocation,
      onErrorGeolocation
    );
  } else {
    var center = map.getCenter();
    infowindow.setContent(
      '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>'
    );
    infowindow.open(map, center);
  }
});

map.setCursor('pointer');
function searchAddressToCoordinate(address, flag) {
  naver.maps.Service.geocode(
    {
      query: address,
    },
    function (status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
        return alert('Something Wrong!');
      }

      if (response.v2.meta.totalCount === 0) {
        return alert('totalCount' + response.v2.meta.totalCount);
      }

      var htmlAddresses = [];
      var item = response.v2.addresses[0];
      point = new naver.maps.Point(item.x, item.y);

      if (item.roadAddress) {
        htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
      }

      if (item.jibunAddress) {
        htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
      }

      if (item.englishAddress) {
        htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
      }

      //infoWindow.setContent([
      //   '<div style="padding:10px;min-width:200px;line-height:150%;">',
      //   '<h4 style="margin-top:5px;">검색 주소 : '+ address +'</h4><br />',
      //   htmlAddresses.join('<br />'),
      //   '</div>'
      //].join('\n'));
      if (flag) {
        markers.forEach((e) => {
          e.setMap(null);
        });
      }

      var marker = new naver.maps.Marker({
        position: point,
        map: map,
      });
      markers.push(marker);

      if (flag) {
        map.setCenter(point);
      }
      //infoWindow.open(map, point);
    }
  );
}

var search_content;
function initGeocoder() {
  $('#submit').on('click', function (e) {
    e.preventDefault();
    searchAddressToCoordinate($('#input_search').val(), true);

    const params = {
      roadAddress: $('#input_search').val(),
      sidoCode: $('#input_search_sidoCode').val(),
      date: $('#input_search_date').val(),
    };
    document.getElementById('contentAddress').innerText = params.roadAddress;

    $.ajax({
      type: 'post',
      url: '/juso',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(params),
      async: false,
      success: function (response) {
        alert('성공');
        console.log(response);
        search_content = response;
        const $panel = document.getElementById('panel-content-section');
        const $refreshButton = document.getElementById('refreshButton');
        while ($panel.firstChild) {
          $panel.removeChild($panel.firstChild);
        }
        const totalCount = response.response.body.totalCount;
        if (totalCount > 1) {
          response.response.body.items.item.forEach((e, index) => {
            searchAddressToCoordinate(e['법정동'] + e['지번'], false);
            makePanelContent($panel, e, index);
          });
          refreshButton.style.display = 'block';
        } else if (totalCount == 1) {
          makePanelContent($panel, response.response.body.items.item, 0);
          refreshButton.style.display = 'none';
        } else {
          $panel.insertAdjacentHTML(
            'beforeend',
            '<div class="palce_section_content"><p align="center"><img src="/assets/sprites/noData.gif"></p></div>'
          );
          refreshButton.style.display = 'none';
        }
      },
      error: function (request, status, error) {
        console.log(error);
      },
    }); // end ajax
  });

  function makePanelContent(panel, e, index) {
    panel.insertAdjacentHTML(
      'beforeend',
      `<div class="place_section_content">
        <ul class="RzZV_">
            <span>` + (index+1) + `</span>
            <div>
                <li class="_gCjX">
                    <strong class="ipNiD">준공</strong>
                    <div class="_TXmH">
                        <div class="dEPd2">`+e['건축년도']+'년'+`</div>
                    </div>
                </li>
            </div>
            <div>
                <li class="_gCjX">
                    <strong class="ipNiD">면적</strong>
                    <div class="_TXmH">
                        <div class="dEPd2">`+e['전용면적']+ '㎡' + `</div>
                    </div>
                </li>
            </div>
            <div>
                <li class="_gCjX">
                    <strong class="ipNiD">주소</strong>
                    <div class="_TXmH">
                        <div class="dEPd2">`+e['법정동'] + ' ' + e['지번'] +`</div>
                    </div>
                </li>
            </div>
            <div>
                <li class="_gCjX">
                    <strong class="ipNiD">주택</strong>
                    <div class="_TXmH">
                        <div class="dEPd2">`+ e['아파트'] + ' ' + e['층'] + '층'+`</div>
                    </div>
                </li>
            </div>
            <div>
                <li class="_gCjX">
                    <strong class="ipNiD">금액</strong>
                    <div class="_TXmH">
                        <div class="dEPd2">`+ e['거래금액'] + '만원' +`</div>
                    </div>
                </li>
            </div>
        </ul>
    </div>`);
  }
  const button = document.getElementById('refreshButton');
  button.onclick = function () {
    window.alert(search_content.response.body.totalCount);
  };
}
naver.maps.onJSContentLoaded = initGeocoder;
