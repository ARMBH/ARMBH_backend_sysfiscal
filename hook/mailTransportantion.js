"use strict";
const nodemailer = require("nodemailer");

module.exports = {
  enviaEmail: function(para, message, assunto) {
    main(para, message, assunto).catch(console.error);
  }
};

async function main(para, message, assunto) {
  console.log(para);
  console.log(assunto);
  console.log(message);
  let usuario = process.env.SMTP_FROM;
  let senha = process.env.SMTP_PASSWORD;
  let servidor = process.env.SMTP_ADDRESS;
  let porta = process.env.SMTP_PORT;
  //console.log(process.env);
  console.log(
    "Enviando email por: " +
      servidor +
      ":" +
      porta +
      "@" +
      usuario +
      "/"
      //+ senha
  );

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: servidor,
    port: porta,
    secure: false, // true for 465, false for other ports
    auth: {
      user: usuario, // generated ethereal user
      pass: senha // generated ethereal password
    }
  });

  // verify connection configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
      exit();
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ARMBH - Sistema de Fiscalização" <regulacao.rmbh@gmail.com>', // sender address
    to: para, // list of receivers
    subject: assunto, // Subject line
    //text: "Hello world?", // plain text body
    html: message // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
