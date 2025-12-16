using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace loadgistix.api.Controllers
{
    public class Email : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        private string SendEmailTemplate(string subject, string email, string id, string template)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();
                mail.From = new MailAddress("info@madservices.co.za", "Vibe Viewer");
                mail.To.Add(email);
                mail.Bcc.Add("anton@madproducts.co.za");
                mail.Subject = subject;
                mail.IsBodyHtml = true;
                mail.AlternateViews.Add(Mail_Body(id, email, template));
                smtpClient.Port = 587;
                smtpClient.Host = "mail.madservices.co.za";
                //smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("info@madservices.co.za", "P@szw0rd");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Send(mail);

                return "OK";
            }
            catch (Exception ex)
            {
                return "ERROR: " + ex.Message;
            }
        }
        private AlternateView Mail_Body(string id, string email, string template)
        {
            var path = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "EmailTemplates");
            var file = Path.Combine(path, template + ".html");

            var imagePath = Path.Combine(path, "images");
            var image = Path.Combine(imagePath, "loadgistix.png");

            string html = System.IO.File.ReadAllText(file).Replace("__id__", id).Replace("__email__", email);

            LinkedResource Img = new LinkedResource(image, System.Net.Mime.MediaTypeNames.Image.Jpeg);
            Img.ContentId = "MyImage";
            AlternateView AV = AlternateView.CreateAlternateViewFromString(html, null, System.Net.Mime.MediaTypeNames.Text.Html);
            AV.LinkedResources.Add(Img);

            if (template == "info")
            {
                var imageApp = Path.Combine(imagePath, "app.jpeg");
                LinkedResource ImgApp = new LinkedResource(imageApp, System.Net.Mime.MediaTypeNames.Image.Jpeg);
                ImgApp.ContentId = "ImageApp";
                AV.LinkedResources.Add(ImgApp);

                //var filenameReferral = id + ".jpeg";
                //var folderNameReferral = Path.Combine("Images", "Links");
                //var pathReferral = Path.Combine(System.IO.Directory.GetCurrentDirectory(), folderNameReferral);
                //var imageReferral = Path.Combine(pathReferral, filenameReferral);
                //LinkedResource ImgReferral = new LinkedResource(imageReferral, System.Net.Mime.MediaTypeNames.Image.Jpeg);
                //ImgReferral.ContentId = "ImageReferral";
                //AV.LinkedResources.Add(ImgReferral);
            }
            return AV;
        }
    }
}
