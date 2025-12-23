using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        public FilesController()
        {
        }

        [HttpPost("uploadImage/{path}/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(string path, string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", path);
                var pathToSave = Path.Combine(System.IO.Directory.GetCurrentDirectory(), folderName);
                
                // Ensure directory exists
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                
                if (file.Length > 0)
                {
                    var fullPath = Path.Combine(pathToSave, filename);
                    var dbPath = Path.Combine(folderName, filename);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Flush();
                        stream.Close();
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
