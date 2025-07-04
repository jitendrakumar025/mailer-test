import fs from "fs";
import mjml from "mjml";
import Mustache from "mustache";

export default function renderEmailTemplate(data) {
  const template = fs.readFileSync("templates/email-templates.mjml", "utf8");
  const compiled = Mustache.render(template, data);
  const { html, errors } = mjml(compiled);
  if (errors.length > 0) console.error("MJML Errors:", errors);
  return html;
}

// Example usage:
const html = renderEmailTemplate({
  name: "Ashutosh",
  product: "SuperMailer 1.0",
  ctaUrl: "https://yourproduct.com",
});

console.log(html); // This will be sent via SES
