import { Gpio } from 'pigpio';

export const blink = (
  DURATION: number,
  STEP_FREQUENCY: number,
  LED: Gpio,
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (LED.digitalRead() === 0) {
        LED.digitalWrite(1);
      } else {
        LED.digitalWrite(0);
      }
    }, STEP_FREQUENCY);

    setTimeout(() => {
      clearInterval(interval);
      LED.digitalWrite(0);
      resolve();
    }, DURATION);
  });
};

export const blinkWhite = (
  DURATION: number,
  STEP_FREQUENCY: number,
  RED_LED: Gpio,
  GREEN_LED: Gpio,
  BLUE_LED: Gpio,
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (RED_LED.digitalRead() === 0) {
        RED_LED.digitalWrite(1);
        GREEN_LED.digitalWrite(1);
        BLUE_LED.digitalWrite(1);
      } else {
        RED_LED.digitalWrite(0);
        GREEN_LED.digitalWrite(0);
        BLUE_LED.digitalWrite(0);
      }
    }, STEP_FREQUENCY);

    setTimeout(() => {
      clearInterval(interval);
      RED_LED.digitalWrite(0);
      GREEN_LED.digitalWrite(0);
      BLUE_LED.digitalWrite(0);
      resolve();
    }, DURATION);
  });
};
