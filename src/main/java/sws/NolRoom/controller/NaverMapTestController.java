package sws.NolRoom.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import lombok.extern.slf4j.Slf4j;
import sws.NolRoom.dto.JsonDto;
import sws.NolRoom.dto.MapSearch;

@Controller
@Slf4j
@PropertySources({
	@PropertySource("classpath:/application.properties") // env.properties 파일 소스 등록
})
public class NaverMapTestController {

	@Value("${clientId}")
	String clientId;

	@Value("${serviceKey}")
	String serviceKey;

	@GetMapping("/")
	public String naverMap(Model model){
		model.addAttribute("clientId", clientId);
		return "map/naverMap";
	}
	@ResponseBody
	@PostMapping("/juso")
	public String search(@RequestBody MapSearch ms) throws IOException {
		log.info(ms.getDate().substring(0,4)+ms.getDate().substring(5) + " " + ms.getSidoCode().substring(0,5));
		ObjectMapper mapper = new ObjectMapper();
		return aptData(serviceKey, ms);
	}

	private String aptData(String serviceKey, MapSearch mapSearch) throws IOException {
		StringBuilder urlBuilder = new StringBuilder("http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev"); /*URL*/
		urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=" + serviceKey); /*Service Key*/
		urlBuilder.append("&" + URLEncoder.encode("pageNo","UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지번호*/
		urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("300", "UTF-8")); /*한 페이지 결과 수*/
		urlBuilder.append("&" + URLEncoder.encode("LAWD_CD","UTF-8") + "=" + URLEncoder.encode(mapSearch.getSidoCode().substring(0,5), "UTF-8")); /*지역코드*/
		urlBuilder.append("&" + URLEncoder.encode("DEAL_YMD","UTF-8") + "=" + URLEncoder.encode(mapSearch.getDate().substring(0,4)+mapSearch.getDate().substring(5), "UTF-8")); /*계약월*/
		URL url = new URL(urlBuilder.toString());
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Content-type", "application/json");
		System.out.println("Response code: " + conn.getResponseCode());
		BufferedReader rd;
		if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
			rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		} else {
			rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
		}
		StringBuilder sb = new StringBuilder();
		String line;
		while ((line = rd.readLine()) != null) {
			sb.append(line);
		}
		rd.close();
		conn.disconnect();
		return xmlToJson(sb.toString());
	}

	private String xmlToJson(String xml) throws JsonProcessingException {
		JSONObject jObject = XML.toJSONObject(xml);
		ObjectMapper mapper = new ObjectMapper();
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		Object json = mapper.readValue(jObject.toString(), Object.class);
		String output = mapper.writeValueAsString(json);
		System.out.println("output = " + output);
		return output;
		// mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		//
		// JsonDto jsonDto = mapper.readValue(output, JsonDto.class);
		// System.out.println("jsonDto = " + jsonDto);
		// // System.out.println("jsonDto.getBody().getItems().getItem() = " + jsonDto.getResponse().getBody().getItems().getItem());
		// System.out.println("jsonDto.getBody().getItems().getItem() = " + jsonDto.getResponse().getBody().getTotalCount());
		// System.out.println("jsonDto.getHeader().getResultMsg() = " + jsonDto.getResponse().getHeader().getResultMsg());
		// return mapper.writeValueAsString(jsonDto.getResponse().getBody().getItems());
	}

}
