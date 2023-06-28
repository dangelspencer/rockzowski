import { Gpio } from 'pigpio';

export const pulse = (
  DURATION: number,
  STEP_VALUE: number,
  STEP_FREQUENCY: number,
  LED: Gpio,
): Promise<void> => {
  return new Promise((resolve) => {
    let power = 0;
    let direction = 1;

    const interval = setInterval(() => {
      LED.pwmWrite(power);

      power += STEP_VALUE * direction;

      if (power > 255 || power < 0) {
        direction = direction * -1;
      }
    }, STEP_FREQUENCY);

    setTimeout(() => {
      clearInterval(interval);
      LED.digitalWrite(0);
      resolve();
    }, DURATION);
  });
};
