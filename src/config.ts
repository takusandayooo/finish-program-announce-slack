import { z } from "zod";

const ConfigSchema = z.object({
  SLACK_ACCESS_TOKEN: z.string(),
  SLACK_CHANNEL_TO_POST: z.string(),
});

export type Config = z.infer<typeof ConfigSchema>;

let config: Config;

export const getConfig = () => {
  if (!config) {
    const props = PropertiesService.getScriptProperties().getProperties();
    config = ConfigSchema.parse(props);
  }
  return config;
};