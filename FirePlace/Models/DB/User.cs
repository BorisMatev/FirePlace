using System.ComponentModel.DataAnnotations;

namespace FirePlace.Models.DB
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string Info { get; set; }
        [Required]
        public string Role { get; set; }
        [Required]
        public string ProfilePhoto { get; set; }

        //one to many
        public ICollection<Photo> Photos { get; set; }
        public ICollection<User> Followers { get; set; }
        public ICollection<User> Follow { get; set; }
    }
}
