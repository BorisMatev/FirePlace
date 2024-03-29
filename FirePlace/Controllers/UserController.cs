using FirePlace.Models.Request;
using Microsoft.AspNetCore.Mvc;
using FirePlace.Models.DB;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FirePlace.Models.Response.User;

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
        public ActionResult<string> GetUsername()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Не е намерен потребител");
            }

            var user = _dbContext.Users.FirstOrDefault(x => x.Id == int.Parse(userId));

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            return user.Username;
        }

        [HttpGet]
        public ActionResult<List<UsersListResponse>> GetUsersBySearchedName(string username)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Не е намерен потребител");
            }

            var user = _dbContext.Users.FirstOrDefault(x => x.Id == int.Parse(userId));

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            var users = _dbContext.Users
                .Where(x =>
                    x.Username.Contains(username) &&
                    x.Username != user.Username
                ).ToList();

            if (users == null)
            {
                return BadRequest("Няма потребители с това име!");
            }
            return users.Select(x =>
                new UsersListResponse
                {
                    Id = x.Id,
                    Name = x.Username,
                    Photo = x.ProfilePhoto
                }).ToList();
        }

        [HttpGet]
        public ActionResult<UserInfoResponse> GetUserByUsername(string name)
        {
            var user = _dbContext.Users
                .Where(x => x.Username == name)
                .Include(x => x.Photos)
                .Include(x => x.Following)
                .Include(x => x.Followers)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var me = _dbContext.Users
                .FirstOrDefault(x => x.Id == int.Parse(userId!));

            bool follow = false;

            if (user.Followers.Contains(me!))
            {
                follow = true; 
            }

            var userResp = new UserInfoResponse
            {
                Username = user.Username,
                ProfilePhoto = user.ProfilePhoto,
                Photos = user.Photos
                    .Select(x => new Image()
                    {
                        Id = x.Id,
                        Photo = x.Base64String
                    })
                    .ToList(),
                Follow = follow,
                FollowersCount = user.Followers.Count,
                FollowingCount = user.Following.Count,
                PhotosCount = user.Photos.Count
            };


            return Ok(userResp);
        }

        [HttpGet]
        public ActionResult<UserInfoResponse> GetUserByJwt()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Не е намерен потребител");
            }

            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .Include(x => x.Photos)
                .Include(x => x.Following)
                .Include(x => x.Followers)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }
            var userResp = new UserInfoResponse
            {
                Username = user.Username,
                ProfilePhoto = user.ProfilePhoto,
                Photos = user.Photos
                    .Select(x => new Image()
                    {
                        Id = x.Id,
                        Photo = x.Base64String
                    })
                    .ToList(),
                FollowersCount = user.Followers.Count,
                FollowingCount = user.Following.Count,
                PhotosCount = user.Photos.Count
            };


            return Ok(userResp);
        }

        [HttpGet]
        public ActionResult<SettingsResponse> GetUserSettings()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Не е намерен потребител");
            }

            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            var userResp = new SettingsResponse
            {
                Username = user.Username,
                Photo = user.ProfilePhoto
            };

            return Ok(userResp);
        }

        [HttpGet]
        public ActionResult<List<UserFollowersResponse>> GetFollowers(string username)
        {
            var user = _dbContext.Users
                .Where(x => x.Username == username)
                .Include(x => x.Followers)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            return user.Followers.Select(x => new UserFollowersResponse()
            {
                ProfilePhoto = x.ProfilePhoto,
                Username = x.Username
            }).ToList();
        }

        [HttpGet]
        public ActionResult<List<UserFollowersResponse>> GetFollowing(string username)
        {
            var user = _dbContext.Users
                .Where(x => x.Username == username)
                .Include(x => x.Following)
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound("Не е намерен потребител");
            }

            return user.Following.Select(x => new UserFollowersResponse()
            {
                ProfilePhoto = x.ProfilePhoto,
                Username = x.Username
            }).ToList();
        }




        [HttpPost]
        [AllowAnonymous]
        public ActionResult<string> Register(UserRegister request)
        {
            if (_dbContext.Users.Any(x => x.Username == request.Username))
            {
                return BadRequest("Потребителското име е заето!");
            }
            if (_dbContext.Users.Any(x => x.Email == request.Email))
            {
                return BadRequest("Съществува потребител с този имейл!");
            }
            if (request.Username.Length < 3 && request.Username.Length > 20)
            {
                return BadRequest("Потребителското име не отговаря на изискванията!");
            }
            if (request.Password.Length > 30 || request.Password.Length < 8)
            {
                return BadRequest("Паролата не отговаря на изискванията!");
            }
            if (request.ProfilePhoto == null)
            {
                return BadRequest("Не е намерена снимка!");
            }


            User user = new User();
            user.Username = request.Username;
            user.Email = request.Email;
            user.Password = request.Password;
            user.Role = "User";
            user.ProfilePhoto = request.ProfilePhoto;

            user.Followers = new List<User>() { };
            user.Following = new List<User>() { };
            user.Photos = new List<Photo>() { };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            string token = GenerateJwtToken("User", user.Id);
            return Ok(token);
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
                return BadRequest("Неправилни входни данни!");
            }
            else if (user.Role == "Admin")
            {
                string token = GenerateJwtToken("Admin", user.Id);
                return Ok(token);
            }
            else
            {
                string token = GenerateJwtToken("User", user.Id);
                return Ok(token);
            }
        }

        [HttpPost]
        public ActionResult FollowAndUnfollow(UsernameRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Не е намерен потребител");
            }

            // the user to follow
            var userForFollow = _dbContext.Users
                .Where(x => x.Username == request.Username)
                .Include(x => x.Followers)
                .FirstOrDefault();

            // me
            var followingUser = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .Include(x => x.Following)
                .FirstOrDefault();

            if (followingUser == null || userForFollow == null)
            {
                return NotFound("Не е намерен потребител");
            }

            if (followingUser.Following.Contains(userForFollow))
            {
                followingUser.Following = followingUser.Following
                    .Where(x => x.Username != userForFollow.Username)
                    .ToList();

                userForFollow.Followers = userForFollow.Followers
                    .Where(x => x.Username != followingUser.Username)
                    .ToList();
            }
            else
            {
                userForFollow.Followers.Add(followingUser);
                followingUser.Following.Add(userForFollow);
            }

            _dbContext.SaveChanges();

            return Ok();

        }



        [HttpPut]
        public ActionResult ChangeUsername(UserUpdateRequest request)
        {
            var user = GetUser();

            if (string.IsNullOrEmpty(request.Value))
            {
                return NotFound("Не е намерен потребител");
            }

            if (_dbContext.Users.Any(x => x.Username == request.Value))
            {
                return BadRequest("Потребителското име е заето!");
            }

            user.Username = request.Value;
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpPut]
        public ActionResult ChangePhoto(UserUpdateRequest request)
        {
            var user = GetUser();

            if (string.IsNullOrEmpty(request.Value))
            {
                return BadRequest("Не е намерена снимка");
            }

            user.ProfilePhoto = request.Value;
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpPut]
        public ActionResult ChangePassword(UpdatePassword request)
        {
            var user = GetUser();

            if (string.IsNullOrEmpty(request.newPassword) ||
                string.IsNullOrEmpty(request.oldPassword))
            {
                return BadRequest("Грешни входни данни");
            }

            if (user.Password != request.oldPassword) 
            {
                return BadRequest("Грешни входни данни");
            }

            user.Password = request.newPassword;
            _dbContext.SaveChanges();

            return Ok();
        }
        [HttpDelete]
        public ActionResult Delete(UserUpdateRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("Няма намерен потребител");
            }

            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .Include(x => x.Following)
                .Include(x => x.Followers)
                .Include(x => x.Photos)
                .FirstOrDefault();

            if (user == null)
            {
                return BadRequest("Няма намерен потребител");
            }

            if (user.Password != request.Value)
            {
                return BadRequest("Грешна парола");
            }

            _dbContext.Users.Remove(user);
            _dbContext.SaveChanges();

            return Ok();
        }
        private User GetUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception();
            }

            var user = _dbContext.Users
                .Where(x => x.Id == int.Parse(userId))
                .FirstOrDefault();

            if (user == null)
            {
                throw new Exception();
            }

            return user;
        }


        //generate Token
        private string GenerateJwtToken(string role, int id)
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