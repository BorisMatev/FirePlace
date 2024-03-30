using FirePlace.Models.DB;
using FirePlace.Models.Request;
using FirePlace.Models.Response.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirePlace.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [Authorize(Policy = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly FirePlaceDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public AdminController(FirePlaceDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }


        [HttpGet]
        public ActionResult<List<GetUser>> GetAll()
        {
            var users = _dbContext.Users.Select(x => new GetUser()
            {
                Id = x.Id,
                Username = x.Username,
                Email = x.Email,
                Role = x.Role
            }).ToList();

            if (users == null)
            {
                return NotFound("Няма потребители!");
            }

            return users;
        }

        [HttpPost]
        public ActionResult AddCategory(AdminAddCategoryRequest request) 
        {
            if (request == null || request.Name.Length > 20 || request.Name.Length < 2)
            {
                return BadRequest();
            }

            Category category = new Category()
            {
                Name = request.Name,

            };

            _dbContext.Categories.Add(category);
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpPut]
        public ActionResult ChangeRole(AdminUserId request)
        {
            if (request == null)
            {
                return BadRequest("Грешка при подаването на потребител!");
            }

            var user = _dbContext.Users.FirstOrDefault(x => x.Id == request.Id);

            if (user == null)
            {
                return BadRequest("Грешка при подаването на потребител!");
            }

            if (user.Role == "User")
            {
                user.Role = "Admin";
            }
            else
            {
                user.Role = "User";
            }

            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpDelete]
        public ActionResult Delete(AdminUserId request)
        {
            if (request == null)
            {
                return BadRequest("Грешка при подаването на потребител!");
            }

            var user = _dbContext.Users
                .Where(x => x.Id == request.Id)
                .Include(x => x.Following)
                .Include(x => x.Followers)
                .Include(x => x.Photos)
                .FirstOrDefault();

            if (user == null)
            {
                return BadRequest("Няма намерен потребител!");
            }

            _dbContext.Users.Remove(user);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
