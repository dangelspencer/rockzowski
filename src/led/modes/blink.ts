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
