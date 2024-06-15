package sws.NolRoom.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class JsonDto {

	private InnerResponse response;

	@Getter
	@Setter
	@NoArgsConstructor
	public static class InnerResponse {

		private InnerHeader header;
		private InnerBody body;

		@Getter
		@Setter
		@NoArgsConstructor
		public static  class InnerHeader {

			private String resultCode;
			private String resultMsg;
		}

		@Getter
		@Setter
		@NoArgsConstructor
		public static  class InnerBody {

			private String totalCount;
			private InnerItems items;

			@Getter
			@Setter
			@NoArgsConstructor
			public static  class InnerItems {
				private List<InnerItem> item;

				@Getter
				@Setter
				@NoArgsConstructor
				public static  class InnerItem {

					private String 건축년도;
					private String 전용면적;
					private String 법정동;
					private String 지번;
					private String 아파트;
					private String 층;
					private String 거래금액;

					private String 매수자;
					private String 매도자;
					private String 거래유형;

				}
			}
		}
	}
}
