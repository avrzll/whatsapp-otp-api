import { generateWAMessageFromContent, WAProto as proto } from "baileys-pro";

export const sendCopyButtonMessage = async (sock, jid, otp) => {
  let msg = generateWAMessageFromContent(
    jid,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `
It will expire in 5 minutes.
Please do not share this OTP with anyone. 
If you did not request this, please ignore this message.
You can click the button below to copy your OTP.
              `,
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "> Powered by @avrzll_",
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: `Your OTP is: ${otp}.`,
              subtitle: "Valid for 5 minutes",
              hasMediaAttachment: false,
            }),
            nativeFlowMessage:
              proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                      display_text: "Copy OTP",
                      id: "otp_" + Date.now(),
                      copy_code: otp,
                    }),
                  },
                ],
              }),
          }),
        },
      },
    },
    {
      quoted: {
        key: {
          participant: "0@s.whatsapp.net",
          remoteJid: "0@s.whatsapp.net",
        },
        message: {
          groupInviteMessage: {
            caption: "OTP Verification",
          },
        },
      },
    }
  );

  return sock.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
  });
};
