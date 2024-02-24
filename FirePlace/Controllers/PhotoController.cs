﻿using FirePlace.Models.DB;
using FirePlace.Models.Request;
using FirePlace.Models.Response;
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
        public ActionResult<List<PhotoListResponse>> GetAllPhotosOfUser() 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest();
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
        public ActionResult<List<PhotoListResponse>> GetPhotosByUserId(int id)
        {
            var photos = _dbContext.Photos.Where(x => x.UserId == id);

            if (photos == null)
            {
                return NotFound();
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
        public ActionResult<List<Category>> SearchCategory(string name)
        {
            List<Category> cat = _dbContext.Categories
                .Where(x => x.Name.Contains(name) || name.Contains(x.Name))
                .ToList();
            if (cat.Count < 1)
            {
                return BadRequest("No categories with this name!");
            }
            return cat;
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
