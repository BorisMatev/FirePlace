using FirePlace.Models.DB;

namespace FirePlace.Models.Response.User
{
    public class UserInfoResponse
    {
        public string Username { get; set; }
        public string Info { get; set; }
        public string ProfilePhoto { get; set; }

        public List<Image> Photos { get; set; }
        public int PhotosCount { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
    }

    public class Image
    {
        public int Id { get; set; }
        public string Photo { get; set; }
    }
}
