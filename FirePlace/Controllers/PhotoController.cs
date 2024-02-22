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
        public ActionResult<List<Photo>> GetAllPhotosOfUser() 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest();
            }

            var user = _dbContext.Users
                .FirstOrDefault(x => x.Id == int.Parse(userId));

            var photos = _dbContext.Photos.Where(x => x.UserId == int.Parse(userId)).ToList();

            return _dbContext.Photos.Where(x => x.UserId == 3002).ToList();
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
                .FirstOrDefault(x => x.Id == int.Parse(userId));
            if (user == null)
            {
                return BadRequest();
            }

            List<Category> cat = new List<Category>() { };
            cat = request.Categories.Select(x => new Category() { Name = x}).ToList();

            Photo photo = new Photo() { };
            
            photo = new Photo
            {
                Base64String = request.Base64String,
                Lat = (double)request.Lat!,
                Lng = (double)request.Lng!,
                Likes = 0,
                Categories = cat
            };

            if (user.Photos == null)
            {
                user.Photos = new List<Photo>() { };
            }

            user.Photos!.Add(photo);
            _dbContext.SaveChanges();
            return Ok();

        }
    }
}
