using FirePlace.Models.DB;
using FirePlace.Models.Request;
using FirePlace.Models.Response.Photo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public ActionResult<List<PhotoListResponse>> GetAllPhotosOfUser() 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Няма намерен потребител!");
            }

            var photos = _dbContext.Photos.Where(x => x.UserId == int.Parse(userId)).ToList();

            List<PhotoListResponse> photosList = photos.Select(x => new PhotoListResponse()
            {
                Id = x.Id,
                UserId = x.UserId,
                Base64String = x.Base64String
            }).ToList();

            return Ok(photosList);
        }

        [HttpGet]
        public ActionResult<PhotoResponse> GetPhotoById(int id)
        {
            var photo = _dbContext.Photos
                .Where(x => x.Id == id)
                .Include(x => x.Categories)
                .FirstOrDefault();

            if (photo == null)
            {
                return NotFound("Не е намерен потребител");
            }

            var user = _dbContext.Users.FirstOrDefault(x => x.Id == photo.UserId);

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            PhotoResponse resp = new PhotoResponse()
            {
                ProfilePhoto = user.ProfilePhoto,
                Username = user.Username,
                Id = photo.Id,
                Base64String = photo.Base64String,
                Info = photo.Info,
                Lat = photo.Lat,
                Lng = photo.Lng,
                Likes = photo.Likes,
                Categories = photo.Categories.ToList()
            };

            return Ok(resp);
        }

        [HttpGet]
        public ActionResult<List<PhotoListResponse>> GetPhotosByUserId(int id)
        {
            var photos = _dbContext.Photos.Where(x => x.UserId == id);

            if (photos == null)
            {
                return NotFound("Потребителят няма снимки!");
            }

            List<PhotoListResponse> photosList = photos.Select(x => new PhotoListResponse()
            {
                Id = x.Id,
                UserId = x.UserId,
                Base64String = x.Base64String
            }).ToList();

            return photosList;
        }

        [HttpGet]
        public ActionResult<List<PhotoByCategoryResponse>> GetPhotosByCategory(string category)
        {
            var photos = _dbContext.Photos
                .Include(x => x.Categories)
                .Where(x => x.Categories.Any(c => c.Name == category))
                .ToList();

            if (photos == null)
            {
                return BadRequest("Няма снимки в тази категория!");
            }


            List<PhotoByCategoryResponse> resp = photos.Select(x => new PhotoByCategoryResponse()
            {
                Base64String = x.Base64String,
                Likes = x.Likes,
                Id = x.Id
            }).ToList();

            return resp;
        }

        [HttpGet]
        public ActionResult<List<Category>> SearchCategory(string name)
        {
            List<Category> cat = _dbContext.Categories
                .Where(x => x.Name.Contains(name) || name.Contains(x.Name))
                .ToList();
            if (cat.Count < 1)
            {
                return BadRequest("Няма категорий с това име!");
            }
            return cat;
        }

        [HttpGet]
        public ActionResult<List<Category>> GetAllCategory()
        {
            return _dbContext.Categories.ToList();
        }

        [HttpPost]
        public ActionResult AddPhoto(UserAddPhotoRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return NotFound("Не е намерен потребител");
            }

            var user = _dbContext.Users
                .FirstOrDefault(x => x.Id == int.Parse(userId));
            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            List<Category> cat = _dbContext.Categories
                .Where(x => request.Categories.Contains(x.Name))
                .ToList();

            
            Photo photo = new Photo
            {
                Base64String = request.Base64String,
                Info = request.Info,
                Lat = (double)request.Lat,
                Lng = (double)request.Lng,
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

        [HttpPost]
        public ActionResult Like(PhotoId id)
        {
            var photo = _dbContext.Photos.FirstOrDefault(x => x.Id == id.photoId);

            if (photo == null)
            {
                return BadRequest("Не е намерена снимка!");
            }

            photo.Likes++;
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpPost]
        public ActionResult Dislike(PhotoId id)
        {
            var photo = _dbContext.Photos.FirstOrDefault(x => x.Id == id.photoId);

            if (photo == null)
            {
                return BadRequest("Не е намерена снимка!");
            }

            photo.Likes--;
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
