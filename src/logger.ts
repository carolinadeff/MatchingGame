export const logger = {
  info: (msg: string) => console.log(`[INFO]: ${msg}`),
  error: (error: any, msg: string) => console.error(`[ERROR]: ${msg}`, String(error)),
};
