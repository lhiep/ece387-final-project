#define RX_INTERRUPT 0 // Interrupt 0 => pin #2

#include <RCSwitch.h>

RCSwitch rx = RCSwitch();

void setup() {

  // setup receiver
  rx.enableReceive(RX_INTERRUPT);

  // setup serial
  Serial.begin(9600);

}

void loop() {
  if (rx.available()) {
    
    int value = rx.getReceivedValue();
    
    if (value == 0) {
      Serial.print("Unknown encoding");
    } else if (value == 282) {
      Serial.println("JUMP");
      delay(200);
    } else {
      Serial.print("Received ");
      Serial.print( rx.getReceivedValue() );
      Serial.print(" / ");
      Serial.print( rx.getReceivedBitlength() );
      Serial.print("bit ");
      Serial.print("Protocol: ");
      Serial.println( rx.getReceivedProtocol() );
      delay(200);
    }

    rx.resetAvailable();
  }
}
