"use strict";
const nodemailer = require("nodemailer");

module.exports = {
  templateMail: function(interessado_email,interessado_tratamento, interessado_name, processo_id, processo_name, historico_texto) {
    return montaBody(interessado_email,interessado_tratamento, interessado_name, processo_id, processo_name, historico_texto)
  
  }
};

function montaBody(interessado_email,interessado_tratamento, interessado_name, processo_id, processo_name, historico_texto)
{
  const htmlCompleto = `
  <!doctype html>
<html>

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>ARMBH - Sistema de Fiscalização de Parcelamento do SOLO</title>
  <style>
    /* -------------------------------------
        INLINED WITH htmlemail.io/inline
    ------------------------------------- */
    /* -------------------------------------
        RESPONSIVE AND MOBILE FRIENDLY STYLES
    ------------------------------------- */
    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table[class=body] p,
      table[class=body] ul,
      table[class=body] ol,
      table[class=body] td,
      table[class=body] span,
      table[class=body] a {
        font-size: 16px !important;
      }

      table[class=body] .wrapper,
      table[class=body] .article {
        padding: 10px !important;
      }

      table[class=body] .content {
        padding: 0 !important;
      }

      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table[class=body] .btn table {
        width: 100% !important;
      }

      table[class=body] .btn a {
        width: 100% !important;
      }

      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    /* -------------------------------------
        PRESERVE THESE STYLES IN THE HEAD
    ------------------------------------- */
    @media all {
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      .btn-primary table td:hover {
        background-color: #34495e !important;
      }

      .btn-primary a:hover {
        background-color: #34495e !important;
        border-color: #34495e !important;
      }
    }
  </style>
</head>

<body class=""
  style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" class="body"
    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
    <tr>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
      <td class="container"
        style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
        <div class="content"
          style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

          <!-- START CENTERED WHITE CONTAINER -->
          <span class="preheader"
            style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This
            is preheader text. Some clients will show this text as a preview.</span>
          <table class="main"
            style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper"
                style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                <table border="0" cellpadding="0" cellspacing="0"
                  style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                  <tr>
                      <td align="center" style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                          <p
                            style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><img src="data:image/png;base64,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" alt="Sistema de Fiscalização ARMBH" ></p></td>
                  </tr>
                  <tr>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                      <p
                        style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                        Prezado(a) ${interessado_tratamento} ${interessado_name},</p>
                      <p
                        style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                        O Processo <strong>${processo_id} - ${processo_name}</strong> foi alterado:</p>
                        <p
                        style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                        ${historico_texto}</p>
                        <!--
                          <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"
                          style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                          <tbody>
                            <tr>
                              <td align="left"
                              style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                              <table border="0" cellpadding="0" cellspacing="0"
                              style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                              <tbody>
                                <tr>
                                    <td
                                    style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;">
                                    <a href="http://htmlemail.io" target="_blank"
                                    style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Call
                                    To Action</a> </td>
                                  </tr>
                                </tbody>
                              </table>
                            -->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p
                        style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                        Este é um e-mail automático. Favor não responder.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- END MAIN CONTENT AREA -->
          </table>

          <!-- START FOOTER -->
          <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
            <table border="0" cellpadding="0" cellspacing="0"
              style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
              <tr>
                <td class="content-block"
                  style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                  <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Agência de Desenvolvimento da Região Metropolitana de Belo Horizonte</span>
                  <br> Visite-nos <a href="http://www.agenciarmbh.mg.gov.br"
                    style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">ARMBH</a>.
                </td>
              </tr>
            </table>
          </div>
          <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
        </div>
      </td>
      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
    </tr>
  </table>
</body>

</html>
  `;
  return 'HTML COMPLETO'+htmlCompleto;
}