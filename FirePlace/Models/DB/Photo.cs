using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FirePlace.Models.DB
{
    public class Photo
    {
        public int Id { get; set; }
        [Required]
        public string Base64String { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }

        public int Likes { get; set; }


        //many to many
        public ICollection<Category> Categories { get; set; }



        [ForeignKey(nameof(User))] //attribute  
        public int UserId { get; set; } //FK
        [NotMapped]
        public User User { get; set; } //navigational property
    }
}
