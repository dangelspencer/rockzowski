import { Gpio } from 'pigpio';
import { Injectable } from '@nestjs/common';
import { blink } from './modes/blink';
import { pulse } from './modes/pulse';
import { pulseRgb } from './modes/pulse-rgb';

enum Modes {
  BLINK_RED,
  BLINK_GREEN,
  BLINK_BLUE,
  PULSE_RED,
  PULSE_GREEN,
  PULSE_BLUE,
  PULSE_RGB,
}

@Injectable()
export class LedService {
  private connectLed(pinNumber: number) {
    return new Gpio(pinNumber, { mode: Gpio.OUTPUT });
  }

  private cleanUp(gpioPins: Gpio[]) {
    for (const pin of gpioPins) {
      pin.digitalWrite(0);
    }
  }

  async run() {
    // set up LEDs
    const RED_LED = this.connectLed(22);
    const GREEN_LED = this.connectLed(23);
    const BLUE_LED = this.connectLed(24);

    // settings
    const MAX_SECONDS_PER_MODE = 90; // min is going to be 30s so max is 120s

    // clean up GPIO pins when script is exited with CTRL+C
    process.on('SIGTERM', () => {
      this.cleanUp([RED_LED, GREEN_LED, BLUE_LED]);
    });

    process.on('SIGINT', () => {
      this.cleanUp([RED_LED, GREEN_LED, BLUE_LED]);
    });

    // define modes
    const modes = [
      Modes.BLINK_RED,
      Modes.BLINK_GREEN,
      Modes.BLINK_BLUE,
      Modes.PULSE_RED,
      Modes.PULSE_GREEN,
      Modes.PULSE_BLUE,
      Modes.PULSE_RGB,
    ];

    const stepValues = [5, 10, 15, 20, 25];
    const stepFrequencies = [50, 100, 150, 200, 250, 500, 1000];

    while (true) {
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      const randomDuration =
        Math.floor(Math.random() * MAX_SECONDS_PER_MODE) + 30; // min duration is 30s
      const randomStepValue =
        stepValues[Math.floor(Math.random() * stepValues.length)];
      const randomStepFrequency =
        stepFrequencies[Math.floor(Math.random() * stepFrequencies.length)];

      console.log(
        `Mode: ${randomMode}, Duration: ${randomDuration}, Step: ${randomStepValue}, Frequency: ${randomStepFrequency}`,
      );

      switch (randomMode) {
        case Modes.BLINK_RED:
          await blink(randomDuration, randomStepFrequency, RED_LED);
        case Modes.BLINK_GREEN:
          await blink(randomDuration, randomStepFrequency, GREEN_LED);
        case Modes.BLINK_BLUE:
          await blink(randomDuration, randomStepFrequency, BLUE_LED);
        case Modes.PULSE_RED:
          await pulse(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            BLUE_LED,
          );
        case Modes.PULSE_GREEN:
          await pulse(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            RED_LED,
          );
        case Modes.PULSE_BLUE:
          await pulse(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            GREEN_LED,
          );
        case Modes.PULSE_RGB:
          await pulseRgb(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            RED_LED,
            GREEN_LED,
            BLUE_LED,
          );
      }
    }
  }
}
