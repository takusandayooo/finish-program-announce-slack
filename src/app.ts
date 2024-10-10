import { z } from "zod"
import { GasSlackClient as SlackClient } from "@hi-se/gas-slack";

import { getConfig } from "./config";



const APIschema = z.object({
  slackId: z.string(),
  PCId: z.number(),
  flag: z.union([z.literal("OK"), z.literal("NG")]),
  message: z.string().optional(),
})
type APIschema = z.infer<typeof APIschema>

export function doPost(e: GoogleAppsScript.Events.DoPost) {
  // PostData受け取り
  const data = APIschema.parse(JSON.parse(e.postData.contents));

  const slackMessage = createSlackMessage(data);
  const slackClient = getSlackClient();
  const { SLACK_CHANNEL_TO_POST } = getConfig();

  postMessageToSlackChannel(slackClient, SLACK_CHANNEL_TO_POST, slackMessage);

  const result = data.flag === "OK" ? { message: "OK" } : { message: "NG" };

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(result));
  return output
}

const postMessageToSlackChannel = (client: SlackClient, slackChannelId: string, messageToNotify: string) => {
  console.log(client.chat.postMessage({
    channel: slackChannelId,
    text: messageToNotify,
  }));
};

const slackIdToMention = (slackId: string) => `<@${slackId}>`;

const createSlackMessage = (apiContent: APIschema): string => {
  const { slackId, PCId, flag, message } = apiContent;
  if (flag === "OK") {
    return `${slackIdToMention(slackId)}  \n${PCId}のパソコンでのプログラムが終了しました。\n${message}`
  }
  else {
    return `${slackIdToMention(slackId)}  \n${PCId}のパソコンでのプログラムでエラーが発生しました。\n${message}`
  }
}

function getSlackClient() {
  const { SLACK_ACCESS_TOKEN } = getConfig();
  return new SlackClient(SLACK_ACCESS_TOKEN);
}