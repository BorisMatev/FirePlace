using System.ComponentModel.DataAnnotations;

namespace FirePlace.Models.DB
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
