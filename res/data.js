let config;

if (import.meta.env.DEV) {
  config = {
    PROTOCOL: "http",
    HOST: "localhost",
    PORT: 8687,
  };
} else if (import.meta.env.PROD) {
  config = {
    PROTOCOL: "https",
    HOST: "hiscore.eggy.moe",
    PORT: 443,
  };
}
export default config;
