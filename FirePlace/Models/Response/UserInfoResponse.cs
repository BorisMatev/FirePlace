using FirePlace.Models.DB;

namespace FirePlace.Models.Response
{
    public class UserInfoResponse
    {
        public string Username { get; set; }
        public string Info { get; set; }
        public string ProfilePhoto { get; set; }
        public List<string> Photos { get; set; }
    }
}
