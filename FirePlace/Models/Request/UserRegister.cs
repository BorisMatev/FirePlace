using FirePlace.Models.DB;

namespace FirePlace.Models.Request
{
    public class UserRegister
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Info { get; set; }
        public string ProfilePhoto { get; set; }

    }
}
