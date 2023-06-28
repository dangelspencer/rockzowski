import { Gpio } from 'pigpio';

export const pulseRgb = (
  DURATION: number,
  STEP_VALUE: number,
  STEP_FREQUENCY: number,
  RED_LED: Gpio,
  GREEN_LED: Gpio,
  BLUE_LED: Gpio,
): Promise<void> => {
  // turn the RED LED on to match the expected start value
  for (let i = 0; i <= 255; i += STEP_VALUE) {
    RED_LED.pwmWrite(i);
  }

  return new Promise((resolve) => {
    // red, green, blue
    const LEDs = [
      { level: 255, direction: 1, gpio: RED_LED },
      { level: -20, direction: 1, gpio: GREEN_LED },
      { level: -40, direction: -1, gpio: BLUE_LED },
    ];

    const UPPER_BOUND = 255;
    const LOWER_BOUND = -170;

    const interval = setInterval(() => {
      for (const LED of LEDs) {
        // change direction if needed
        if (LED.level >= UPPER_BOUND || LED.level <= LOWER_BOUND) {
          LED.direction = LED.direction * -1;
        }

        // determine new value for LED
        LED.level += STEP_VALUE * LED.direction;

        // update LED
        if (LED.level < 0) {
          LED.gpio.pwmWrite(0);
        } else if (LED.level > 255) {
          LED.gpio.pwmWrite(255);
        } else {
          LED.gpio.pwmWrite(LED.level);
        }
      }
    }, STEP_FREQUENCY);

    setTimeout(() => {
      clearInterval(interval);

      // TODO: instead of digitalWrite(0), take the current pwm level and work it back to 0 using STEP_VALUE
      RED_LED.digitalWrite(0);
      GREEN_LED.digitalWrite(0);
      BLUE_LED.digitalWrite(0);

      resolve();
    }, DURATION);
  });
};
