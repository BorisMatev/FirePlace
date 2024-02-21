using FirePlace.Models.DB;
using FirePlace.Models.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FirePlace.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [Authorize]
    public class PhotoController : ControllerBase
    {
        private readonly FirePlaceDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public PhotoController(FirePlaceDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult<List<string>> GetPhotosByUserId(int id)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            List<string> photos = user.Photos!.Select(x => x.Base64String).ToList();
            return photos;
        }

        [HttpPost]
        public ActionResult AddPhoto(UserAddPhotoRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return BadRequest();
            }

            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();
            if (user == null)
            {
                return BadRequest();
            }
            List<Category> cat = new List<Category>() { };
            cat = request.Categories.ToList();
            var photo = new Photo
            {
                Base64String = request.Base64String,
                Lat = request.Lat,
                Lng = request.Lng,
                Likes = 0,
                Categories = cat
            };

            user.Photos!.Add(photo);
            _dbContext.SaveChanges();
            return Ok();

        }
    }
}
