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
    [Authorize]
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
        public ActionResult<List<UsersListResponse>> GetUsersBySearchedName(string username)
        {
            var users = _dbContext.Users.Where(x => x.Username.Contains(username)).ToList();
            if (users == null)
            {
                return BadRequest("No users with this username!");
            }
            return users.Select(x => 
                new UsersListResponse { 
                    Id = x.Id,
                    Name = x.Username,
                    Photo = x.ProfilePhoto
                }).ToList();
        }

        [HttpGet]
        public ActionResult<UserInfoResponse> GetUserByJwt()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();
            if(user == null){
                return  BadRequest();
            }
            if (user.Photos != null)
            {
                return new UserInfoResponse
                {
                    Info = user.Info,
                    Username = user.Username,
                    ProfilePhoto = user.ProfilePhoto,
                    FollowersCount = user.Followers.Count,
                    FollowingCount = user.Follow.Count,
                    PhotosCount = user.Photos.Count,
                    Photos = user.Photos.Select(x => x.Base64String).ToList()
                };
            }
            return  new UserInfoResponse
            {
                Info = user.Info,
                Username = user.Username,
                PhotosCount = 0,
                ProfilePhoto = user.ProfilePhoto,
                FollowingCount = user.Follow?.Count,
                FollowersCount = user.Followers?.Count,
                Photos = null
            };
        }

        [HttpGet]
        public ActionResult<List<UserFollowersResponse>> GetUserFollowers()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();
            if (user == null)
            {
                return BadRequest();
            }
            if (user.Followers == null)
            {
                return BadRequest();
            }
            return user.Followers.Select(x => new UserFollowersResponse()
            {
                ProfilePhoto = x.ProfilePhoto,
                Username = x.Username
            }).ToList();
        }

        [HttpGet]
        public ActionResult<List<UserFollowersResponse>> GetFollowingUsers()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();
            if (user == null)
            {
                return BadRequest();
            }
            return user.Follow.Select(x => new UserFollowersResponse()
            {
                ProfilePhoto = x.ProfilePhoto,
                Username = x.Username
            }).ToList();
        }

        [HttpPost]
        [AllowAnonymous]
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
            var photo = new Photo
            {
                Base64String = request.Base64String,
                Lat = request.Lat,
                Lng = request.Lng,
                Likes = 0,
                Categories = request.Categories
            };

            user.Photos.Add(photo);
            _dbContext.SaveChanges();
            return Ok();

        }

        [HttpPost]
        [AllowAnonymous]
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

        [HttpPost]
        public ActionResult FollowUser(string userName)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var userForFollow = _dbContext.Users
                .Where(x => x.Username == userName)
                .FirstOrDefault();

            var followingUser = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();


            if (followingUser == null || userForFollow == null)
            {
                return NotFound();
            }

            userForFollow.Followers.Add(followingUser);
            followingUser.Follow.Add(userForFollow);

            _dbContext.SaveChanges();

            return Ok();
            
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
