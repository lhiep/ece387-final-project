#define SWITCH 2
#define TRANSMITTER 3

#include <RCSwitch.h>

RCSwitch tx = RCSwitch();

int previous = HIGH;

void setup() {

  pinMode(13, OUTPUT);

  // setup tilt switch
  pinMode(SWITCH, INPUT);
  digitalWrite(SWITCH, HIGH);

  // setup transmitter
  tx.enableTransmit(TRANSMITTER);

  // setup serial
  Serial.begin(9600);
  
}

void loop() {

  if(digitalRead(SWITCH)==LOW) {
    if(previous==HIGH) {
      previous = LOW;
      digitalWrite(13, HIGH);
      tx.send("JUMP", 24);
      delay(1000);
    }
  } else {
    previous = HIGH;
    digitalWrite(13, LOW);
  }
  
}
