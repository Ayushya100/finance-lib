'use strict';

import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { logger } from './index.js';

const log = logger('send-mail');

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class Mail {
  constructor(templateName, functionality, options) {
    this.templateName = templateName;
    this.functionality = functionality;
    this.options = options;

    log.info('Mail Processing initiated');
  }
}

Mail.prototype.loadRequestedTemplate = async function () {
  const serviceRoot = process.cwd();
  const templatePath = path.join(
    serviceRoot,
    './src/assets/template/email-template.json'
  );
  const productInfoPath = path.join(
    serviceRoot,
    './src/assets/template/product-info.json'
  );

  const productTemplate = fs.readFileSync(productInfoPath, 'utf-8');
  const parsedProductTemplate = JSON.parse(productTemplate);

  const template = fs.readFileSync(templatePath, 'utf-8');
  const parsedTemplate = JSON.parse(template);
  const requestedTemplateContent = parsedTemplate[this.templateName];

  if (!requestedTemplateContent) {
    log.error('Provided template not found - cannot proceed further!');
    return {
      emailStatus: false,
      msg: 'Invalid template name provided.',
    };
  }

  this.emailOptions = {
    ...this.options,
    ...requestedTemplateContent,
    ...parsedProductTemplate,
  };

  log.info('Mail template retrieved successfully');
  return {
    emailStatus: true,
    msg: 'Template retrieved successfully',
  };
};

Mail.prototype.buildEmailBody = function () {
  const HOST = process.env.HOST;
  const PORT = process.env.PORT;
  const PROTOCOL = process.env.PROTOCOL;

  this.body = {
    body: {
      name: this.emailOptions.name,
      intro: this.emailOptions.intro,
      action: {
        instructions: this.emailOptions.instructions,
        button: {
          color: this.emailOptions.btnColor || '#22BC66',
          text: this.emailOptions.btnText,
          link: `${PROTOCOL}://${HOST}:${PORT}/${this.emailOptions.link}`,
        },
      },
      outro: this.emailOptions.outro,
    },
  };

  log.info('Mail Body transformation completed');
};

Mail.prototype.sendMail = async function () {
  log.info('Send mail operation initiated');
  const mailGenerator = new Mailgen({
    theme: this.emailOptions.theme || 'default',
    product: {
      name: this.emailOptions.productName || '',
      link: this.emailOptions.productLink || '',
    },
  });

  let emailText = mailGenerator.generatePlaintext(this.body);
  let emailHTML = mailGenerator.generate(this.body);

  const mailContent = {
    from: this.emailOptions.from,
    to: this.emailOptions.userEmail,
    subject: this.emailOptions.subject,
    text: emailText,
    html: emailHTML,
  };

  try {
    log.info('Sending mail to the user...');
    const emailResponse = await transport.sendMail(mailContent);

    log.success(
      'Email has been sent to user successfully on the provided email id.'
    );
    return {
      emailStatus: true,
      data: emailResponse.envelope,
    };
  } catch (err) {
    log.error(`Failed to send email to the user: ${err}`);
    return {
      emailStatus: false,
      msg: 'Failed to send email to the user',
    };
  }
};

const sendMail = async (templateName, functionality = 'PLAIN', options) => {
  const mail = new Mail(templateName, functionality, options);
  const isTemplateLoaded = await mail.loadRequestedTemplate();
  if (!isTemplateLoaded.emailStatus) {
    return 'Invalid template name provided.';
  }

  mail.buildEmailBody();
  const mailResponse = await mail.sendMail();
  log.info('Send mail operation completed.');
  return mailResponse;
};

export default sendMail;
