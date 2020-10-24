import { MailConfigEnum } from "./email-enums";

export const mailerConfig = {
  transport: {
    host: MailConfigEnum.host,
    port: MailConfigEnum.port,
    secure: false,
    auth: {
      user: MailConfigEnum.authUserMail,
      pass: MailConfigEnum.authPass,
    },
  },
  defaults: {
    forceEmbeddedImages: true,
    from: MailConfigEnum.defaultsFromEmail,
  },
  templateDir: "./common/email-templates/email-template.html",
};
