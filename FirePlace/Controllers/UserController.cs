using FirePlace.Models.Request;
using Microsoft.AspNetCore.Mvc;
using FirePlace.Models.DB;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using FirePlace.Models.Response;

namespace FirePlace.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserController : ControllerBase
    {
        private readonly FirePlaceDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public UserController(FirePlaceDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<UserInfoResponse> GetUser()
        {
            UserInfoResponse response;
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();
            if(user == null){
                return  BadRequest();
            }
            if (user.Photos != null)
            {
                response = new UserInfoResponse
                {
                    Info = user.Info,
                    Username = user.Username,
                    ProfilePhoto = user.ProfilePhoto,
                    Photos = user.Photos.Select(x => x.Base64String).ToList()
            };
            }
            else
            {
                response = new UserInfoResponse
                {
                    Info = user.Info,
                    Username = user.Username,
                    ProfilePhoto = user.ProfilePhoto,
                    Photos = new List<string> {""}
            };
            }
            return Ok(response);
        }
        [HttpGet]
        public string GetInfo()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        [HttpPost]
        public ActionResult Register(UserRegister request)
        {
            if (_dbContext.Users.Any(x => x.Username == request.Username))
            {
                return BadRequest("This username is already taken!");
            }
            if (_dbContext.Users.Any(x => x.Email == request.Email))
            {
                return BadRequest("This Email is already taken!");
            }
            if (request.Username.Length < 3 && request.Username.Length > 20)
            {
                return BadRequest();
            }
            if (request.Password.Length > 30 || request.Password.Length < 8)
            {
                return BadRequest();
            }
            if (request.ProfilePhoto == null)
            {
                return BadRequest();
            }


            User user = new User();
            user.Username = request.Username;
            user.Email = request.Email;
            user.Password = request.Password;
            user.Info = request.Info;
            user.Role = "User";
            user.ProfilePhoto = request.ProfilePhoto;

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            
            string token = GenerateJwtToken("User", user.Id);
            return Ok(token);
        }

        [HttpPost]
        public ActionResult<string> Login(UserLogin request)
        {
            var user = _dbContext.Users
                .Where(x => x.Username == request.Username && x.Password == request.Password)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }
            else if (user.Role == "Admin")
            {
                string token = GenerateJwtToken("Admin",user.Id);
                return Ok(token);
            }
            else
            {
                string token = GenerateJwtToken("User", user.Id);
                return Ok(token);
            }
        }

        //generate Token
        private string GenerateJwtToken(string role,int id)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] { 
                    new Claim(ClaimTypes.Role, role),
                    new Claim(ClaimTypes.NameIdentifier, id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
