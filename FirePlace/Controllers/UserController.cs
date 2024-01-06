using FirePlace.Models.Request;
using Microsoft.AspNetCore.Mvc;
using FirePlace.Models.DB;

namespace FirePlace.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserController : ControllerBase
    {
        private readonly FirePlaceDbContext _dbContext;
        //private readonly IConfiguration _configuration;

        public UserController(FirePlaceDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        /*[HttpPost]
        public ActionResult Login(UserLogin user) 
        {
            
        }*/
    }
}
