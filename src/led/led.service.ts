import { Gpio } from 'pigpio';
import { Injectable, Logger } from '@nestjs/common';
import { blink, blinkWhite } from './modes/blink';
import { pulse, pulseWhite } from './modes/pulse';
import { pulseRgb } from './modes/pulse-rgb';

enum Modes {
  BLINK_RED = 'BLINK_RED',
  BLINK_GREEN = 'BLINK_GREEN',
  BLINK_BLUE = 'BLINK_BLUE',
  BLINK_WHITE = 'BLINK_WHITE',
  PULSE_RED = 'PULSE_RED',
  PULSE_GREEN = 'PULSE_GREEN',
  PULSE_BLUE = 'PULSE_BLUE',
  PULSE_WHITE = 'PULSE_WHITE',
  PULSE_RGB = 'PULSE_RGB',
}

@Injectable()
export class LedService {
  private logger = new Logger(LedService.name);

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
      this.logger.log('SIGTERM received');
      this.cleanUp([RED_LED, GREEN_LED, BLUE_LED]);
    });

    process.on('SIGINT', () => {
      this.logger.log('SIGTERM received');
      this.cleanUp([RED_LED, GREEN_LED, BLUE_LED]);
    });

    // define modes
    const modes = [
      Modes.BLINK_RED,
      Modes.BLINK_GREEN,
      Modes.BLINK_BLUE,
      Modes.BLINK_WHITE,
      Modes.PULSE_RED,
      Modes.PULSE_GREEN,
      Modes.PULSE_BLUE,
      Modes.PULSE_WHITE,
      Modes.PULSE_RGB,
      Modes.PULSE_RGB,
      Modes.PULSE_RGB,
      Modes.PULSE_RGB,
    ];

    const intervals = [100, 250, 500, 750, 1000];
    const stepValues = [1, 5, 10];
    const stepFrequencies = [5, 10, 25, 50, 75, 100, 150, 200, 250, 500];

    while (true) {
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      const randomDuration =
        (Math.floor(Math.random() * MAX_SECONDS_PER_MODE) + 30) * 1000; // min duration is 30s
      const randomInterval =
        intervals[Math.floor(Math.random() * intervals.length)];
      const randomStepValue =
        stepValues[Math.floor(Math.random() * stepValues.length)];
      const randomStepFrequency =
        stepFrequencies[Math.floor(Math.random() * stepFrequencies.length)];

      const modeDetails = {
        mode: randomMode.toString(),
        duration: `${randomDuration / 1000}s`,
        interval: randomInterval,
        step: randomStepValue,
        frequency: randomStepFrequency,
      };

      this.logger.log(JSON.stringify(modeDetails, null, 4));

      switch (randomMode) {
        case Modes.BLINK_RED:
          await blink(randomDuration, randomInterval, RED_LED);
          break;
        case Modes.BLINK_GREEN:
          await blink(randomDuration, randomInterval, GREEN_LED);
          break;
        case Modes.BLINK_BLUE:
          await blink(randomDuration, randomInterval, BLUE_LED);
          break;
        case Modes.BLINK_WHITE:
          await blinkWhite(
            randomDuration,
            randomInterval,
            RED_LED,
            GREEN_LED,
            BLUE_LED,
          );
          break;
        case Modes.PULSE_RED:
          await pulse(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            RED_LED,
          );
          break;
        case Modes.PULSE_GREEN:
          await pulse(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            GREEN_LED,
          );
          break;
        case Modes.PULSE_BLUE:
          await pulse(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            BLUE_LED,
          );
          break;
        case Modes.PULSE_WHITE:
          await pulseWhite(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            RED_LED,
            GREEN_LED,
            BLUE_LED,
          );
          break;
        case Modes.PULSE_RGB:
          await pulseRgb(
            randomDuration,
            randomStepValue,
            randomStepFrequency,
            RED_LED,
            GREEN_LED,
            BLUE_LED,
          );
          break;
      }
    }
  }
}
