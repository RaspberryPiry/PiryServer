#include<stdio.h>
#include<stdlib.h>
#include<wiringPi.h>

#define BTN_PIN 3
#define BUZ_PIN 4

/* 외부 코드의 파이 카메라 캡쳐 요청 함수. */
extern int capture_and_save_bmp(void);

void callBuzzer(void) {
	digitalWrite(BUZ_PIN, HIGH);
	delay(600);
	digitalWrite(BUZ_PIN, LOW);
	delay(600);
}

// 버튼 눌림 인터럽트 발생시 호출되는 함수.
void buttonPressed(void) {
	printf("촬영을 시작합니다...\n");
	callBuzzer();
	if(capture_and_save_bmp() < 0) {
		printf("촬영 실패\n");
	}
	else {
		printf("촬영 성공\n");
		system("sh runNode.sh ");
	}
}

int main(void) {
	wiringPiSetup();
	pinMode(BTN_PIN, INPUT);
	pinMode(BUZ_PIN, OUTPUT);

	wiringPiISR(BTN_PIN, INT_EDGE_RISING, buttonPressed);
	callBuzzer();
	while(1) {
		delay(200);
	}

	return 0;
}
