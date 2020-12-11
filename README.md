# PiryServer
Piry가 쓰는 서버. 다음과 같은 함수를 제공합니다.

basic_url : server 관련 담당자에게 문의하십시오.

## list
사진의 list 관련된 정보를 제공합니다.

### GET basic_url/list/all
기본 이미지 데이터와 복합 이미지 데이터를 모두 list로 보내줍니다.
해당 결과는 다음과 같습니다.
<pre><code> {
    "result": [
        "sunny.json",
        "cloud.json",
        "hello.json",
        "world.json"
    ]
}
</code></pre>

### GET basic_url/list/basic
기본적으로 존재하는 날씨 같은 이미지 데이터를 의미합니다.
해당 결과는 다음과 같습니다.
<pre><code> {
    "result": [
        "sunny.json",
        "cloud.json"
    ]
}
</code></pre>

### GET basic_url/list/composite
다른 사용자가 보낸 복합적인 이미지 데이터를 의미합니다.
해당 결과는 다음과 같습니다.
<pre><code> {
    "result": [
        "hello.json",
        "world.json"
    ]
}
</code></pre>

### Get basic_url/lost/weather
날씨 데이터를 보내줍니다.
<pre><code> 
{
    "main": "Clear",
    "description": "clear sky",
    "temp": 2.13,
    "feels_like": -1.62,
    "humidity": 55,
    "windSpeed": 1.5,
    "windDeg": 310,
    "cloud": 1
}
</code></pre>

## load
사진을 올리거나 내려받는 함수를 제공합니다.

### GET basic_url/load/download/:uuid
uuid 이름의 사진을 내려받습니다. uuid 에는 json 확장자가 포함되어 있어야 합니다.
현재 마지막으로 수정된 시간, 같이 제공된 text, 각 사진들이 표시될 시간, 사진의 내용이 포함됩니다.
또한 melody가 있는 경우, hasMelody 를 1로 Setting하고 note 와 frequency, duration도 동시에 보내야합니다.
hasMelody 가 0인경우, note, frequency, duration 은 보내지 않아도 됩니다.
<pre><code> {
    saveTime: "201014 180503",
    text: '안녕?',
    delayTime : [
        1000,
        1000,
        1000
    ],
    hasMelody : 1,
    note : 3,
    frequency : [1000, 2000, 3000],
    duration : [20, 30, 40],
    picture: [ 
      '101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n',
      '101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n',
      '101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n',
   ]
}
</code></pre>


### POST basic_url/load/upload
사진을 text와 함께 전송합니다. 요청 인자는 다음과 같습니다.
content 나 text 모두 string으로 전달되는 것임에 주의해야 합니다.
hasMelody 가 0인경우, note, frequency, duration 은 보내지 않아도 됩니다.
-> 변경되었습니다.
haMelody 는 1, 0 의 값, 1일때에는 type (0 ~ 2) 의 값을 보내줘야합니다.
각 type은 0 : 신나는, 1 : 급한, 2 : 잔잔한 의 값.

<pre><code> {
    'text': '안녕?',
    delayTime : [
        1000,
        1000,
        1000
    ],
    hasMelody : 1,
    note : 3,
    frequency : [1000, 2000, 3000],
    duration : [20, 30, 40],
    'content': [ 
        '101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n',
        '101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n',
        '101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n101008 14120a b99f90 b99975\n',
    ]
}
</code></pre>


수행 결과는 다음과 같습니다. saved 가 true여야 잘 진행된 것 입니다.
<pre><code> { 
    "saved" : true, 
    "fileName" : 'd37c-c944-14cb-30bb-736e.json' 
}
</code></pre>
fileName 은 d37c-c944-14cb-30bb-736e.json 형태의 uuid 입니다.