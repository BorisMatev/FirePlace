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
        [HttpPost]
        public ActionResult Register(UserRegister request)
        {
            bool isNotUniqueUsername = _dbContext.Users
                .Select(x => x.Username)
                .Contains(request.Username);
            if (isNotUniqueUsername)
            {
                return BadRequest("This username is already taken!");
            }
            if (request.Username.Length < 3 && request.Username.Length > 30)
            {
                return BadRequest();
            }
            if (request.Password.Length > 30 || request.Password.Length < 8)
            {
                return BadRequest();
            }


            User user = new User();
            user.Username = request.Username;
            user.Email = request.Email;
            user.Password = request.Password;
            user.Info = "";
            user.Role = "Admin";
            user.ProfilePhoto = request.ProfilePhoto;

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            return Ok();
        }

        /*[HttpGet]
        public ActionResult<List<UserRegister>> GetUsers() 
        {
            return _dbContext.Users.Select(x => 
            new UserRegister { Email = x.Email,
                               Username = x.Username,
                               Password = x.Password,
                               ProfilePhoto = x.ProfilePhoto})
                .ToList();
        }*/
        [HttpPost]
        public ActionResult Login(UserLogin request)
        {
            var user = _dbContext.Users
                .Where(x => x.Username == request.Username && x.Password == request.Password)
                .FirstOrDefault();

            if (user==null)
            {
                return NotFound();
            }
            return Ok();
        }
    }
}
