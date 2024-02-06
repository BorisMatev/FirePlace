using FirePlace.Models.DB;
using FirePlace.Models.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<List<User>> GetAll()
        {
            return _dbContext.Users
            .ToList();
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

    }
}
