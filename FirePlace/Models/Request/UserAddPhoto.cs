using FirePlace.Models.DB;

namespace FirePlace.Models.Request
{
    public class UserAddPhotoRequest
    {
        public string Base64String { get; set; }
        public double? Lat { get; set; }
        public double? Lng { get; set; }
        public ICollection<string> Categories { get; set; }
    }
}
