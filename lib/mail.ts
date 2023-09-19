
import sgMail, { MailDataRequired } from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)


export async function sendMail(to: string, subject: string, data: object){

   const msg: MailDataRequired = {
      to,
      from: process.env.SENDGRID_FROM_MAIL as string,
      subject,
      dynamicTemplateData: data,
      templateId: "d-a70bfad330a94967b5e6e9a6f72c7e51",
    }

    const res = await sgMail.send(msg)
    return res[0];
}
