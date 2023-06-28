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
      if (power < 0) {
        LED.pwmWrite(0);
      } else if (power > 255) {
        LED.pwmWrite(255);
      } else {
        LED.pwmWrite(power);
      }

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

export const pulseWhite = (
  DURATION: number,
  STEP_VALUE: number,
  STEP_FREQUENCY: number,
  RED_LED: Gpio,
  GREEN_LED: Gpio,
  BLUE_LED: Gpio,
): Promise<void> => {
  return new Promise((resolve) => {
    let power = 0;
    let direction = 1;

    const interval = setInterval(() => {
      if (power < 0) {
        RED_LED.pwmWrite(0);
        GREEN_LED.pwmWrite(0);
        BLUE_LED.pwmWrite(0);
      } else if (power > 255) {
        RED_LED.pwmWrite(255);
        GREEN_LED.pwmWrite(255);
        BLUE_LED.pwmWrite(255);
      } else {
        RED_LED.pwmWrite(power);
        GREEN_LED.pwmWrite(power);
        BLUE_LED.pwmWrite(power);
      }

      power += STEP_VALUE * direction;

      if (power > 255 || power < 0) {
        direction = direction * -1;
      }
    }, STEP_FREQUENCY);

    setTimeout(() => {
      clearInterval(interval);
      RED_LED.pwmWrite(0);
      GREEN_LED.pwmWrite(0);
      BLUE_LED.pwmWrite(0);
      resolve();
    }, DURATION);
  });
};
